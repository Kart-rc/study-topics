# Write the order form down: an OpenAPI request contract

APIs & Microservices · Day11 · 15 minutes

Distinguish requiring a body from requiring fields inside it, then watch validation reject bad requests.

## Recall (2 minutes)

<p>No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.</p>

## Understand (4 minutes)

Two teams agree to send orders. One sends {"sku":"MUG","quantity":2}. Another sends {"sku":"MUG"}. Should the server assume one mug, reject the request, or wait? Leaving that decision unstated creates accidental behavior.

An OpenAPI document describes an HTTP API in a machine-readable format. A schema describes the allowed shape of a value. The document is a contract; a server or test tool must actually enforce it. Writing YAML alone does not validate traffic.

Two uses of required answer different questions. requestBody.required: true means a body must be present. The schema’s required: [sku, quantity] means those fields must exist inside the object. Declaring a field under properties alone does not require it.



This lesson deliberately uses OpenAPI 3.1.1, a stable published specification, without claiming it is the newest version. The order contract requires a nonempty SKU and an integer quantity of at least one. It also rejects unknown fields. The response codes below are our API design choice, not codes that OpenAPI automatically returns.

openapi: 3.1.1
info:
  title: Order intake teaching API
  version: 1.0.0
paths:
  /orders:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [sku, quantity]
              properties:
                sku:
                  type: string
                  minLength: 1
                quantity:
                  type: integer
                  minimum: 1
              additionalProperties: false
      responses:
        '201':
          description: Order accepted
        '400':
          description: Invalid request


For MUG with quantity 2, the check passes. Missing quantity fails the required-field check. Quantity 0 is present but fails the minimum. The string "2" is not a number and fails the type check. If the server silently coerces it, server behavior and this contract disagree.

A well-shaped request still needs business checks: does the SKU exist, may this caller order it, and is stock available? The lab validates shape only. It never creates an order.

Download the complete teaching OpenAPI document.



## Read the visual

Where does this request stop before business logic? A validation funnel checks body, required fields, types, range, and unknown fields. The rejected condition is named at the exit. Passing shape only opens the next gate; it does not create an order.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
body = {"sku": "MUG"}
required = ["sku", "quantity"]
missing = [key for key in required if key not in body]
shape_ok = not missing
body["quantity"] = 2
missing = [key for key in required if key not in body]
quantity = body["quantity"]
integer_value = type(quantity) in (int, float) and quantity % 1 == 0
shape_ok = not missing and isinstance(body["sku"], str) and len(body["sku"]) >= 1 and integer_value and quantity >= 1 and set(body) <= {"sku", "quantity"}
```

1. The body exists but only contains the SKU.

   Changed values: `{"body": {"sku": "MUG"}, "required": ["sku", "quantity"]}`

2. The required-field check finds quantity. Presence of a body was not enough.

   Changed values: `{"missing": ["quantity"], "shape_ok": false}`

3. Supply the missing value; the missing-field list becomes empty.

   Changed values: `{"body": {"sku": "MUG", "quantity": 2}, "missing": []}`

4. For this finite synthetic input, shape checks now pass. Business authorization remains separate.

   Changed values: `{"shape_ok": true, "quantity": 2, "integer_value": true}`

[Full runnable example](examples/apis-microservices.py).

Limits: Python checks for the finite example only, not a general JSON Schema validator. JSON Schema integer means a numeric value without a fractional part; 2.0 qualifies, while true and the string "2" do not. No order is created.

## Explore (remaining exploration time)

Try the valid order, a missing field, zero, a string, and an unknown field. Predict the exact first reason for rejection before validating.

Open apis-microservices.html for the executable model.

Model limits: A validator for this one flat teaching contract, not a full OpenAPI or JSON Schema implementation. It checks body/object presence, required fields, string length, numeric integer value, minimum and unknown fields. It does not parse the YAML, check media types, authorize callers or validate stock. JavaScript uses finite-precision numbers; this toy is not suitable for large integer IDs.

## Quiz (4 minutes)

1. A body contains only sku: MUG. Both required settings are present. What fails?
   - The request-body presence check
   - The required quantity field check
   - Nothing; properties supplies a default

2. Why validate real traffic or contract tests in addition to writing the OpenAPI file?
   - The file automatically blocks all network traffic
   - Validation replaces authorization
   - The running server can otherwise disagree with its description

3. MUG with quantity 2 passes shape validation. What remains?
   - Caller permission, valid SKU and stock checks
   - Nothing; an order is guaranteed
   - Change quantity to a string

4. Explain why the safer choice works in this example.
5. Change one assumption. What would fail, and what evidence would reveal it?

<details><summary>Answer key — attempt first</summary>

1. The required quantity field check. The body exists, so its presence check passes. The object lacks quantity. A properties declaration neither requires a field nor inserts a default.

2. The running server can otherwise disagree with its description. A document describes behavior. An implementation or tool must enforce it. Shape checks do not decide caller permissions.

3. Caller permission, valid SKU and stock checks. The schema does not establish authorization or inventory. Passing shape checks is a boundary condition, not a business success guarantee.

</details>

## Sources

- [OpenAPI Specification 3.1.1](https://spec.openapis.org/oas/v3.1.1.html) — Published 2024-10-24; chosen teaching version, not a latest-version claim; checked 2026-10-01.
- [JSON Schema: object properties and required fields](https://json-schema.org/understanding-json-schema/reference/object) — Living official guide; publication date not shown; checked 2026-10-01.
