# A null child can erase its non-null parent

APIs & Microservices · Day31 · 15 minutes

Design GraphQL nullability with failure propagation in mind.

## Recall (2 minutes)

<p><a href="../Day19/apis-microservices.html">Day19: Verify the exact webhook bytes before parsing</a></p><p>Body changes from amount 50 to 500 but header stays the same. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>HMAC mismatch. The secret-backed digest covers the payload bytes; changing them invalidates the old header.</p></details><p><a href="../Day23/apis-microservices.html">Day23: Deprecated is a warning; Sunset is the shutdown date</a></p><p>What does Deprecation communicate?</p><details><summary>Recall first, then reveal the refresher</summary><p>The resource is discouraged now or from a stated time. Deprecation and shutdown time are separate signals.</p></details>

## Understand (4 minutes)

Imagine a shipping form where apartment number is optional, but the entire address is declared mandatory. If a mandatory child cannot be produced, GraphQL does not quietly put null there. The field error bubbles to the nearest nullable parent.

Non-null is therefore more than documentation. It defines a failure boundary. A deeply nested chain of non-null fields can turn one resolver failure into a much larger missing subtree—or even data: null.



Schema: Query.order: Order, Order.customer: Customer!, Customer.name: String!. If name resolves null, GraphQL cannot return customer.name: null. It nulls customer; because customer is non-null, the error continues to order. Since order is nullable, the response can return order: null plus an error.



## Read the visual

The response tree disappears from the failed leaf upward. Changing one nullable boundary visibly changes how much useful data survives.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use non-null when the field is truly guaranteed for every authorized object and clients should treat its absence as an error.

**Practical example.** An order query exposes optional delivery instructions but requires an order ID and customer relationship.

**How to decide.** Draw the propagation path before adding <code>!</code>. Keep nullable boundaries where partial data is valuable. Do not use non-null to hide unreliable upstream dependencies or force client convenience.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
path = [('order', False), ('customer', True), ('name', True)]
failed_index = 2
nearest_nullable = next(name for name, non_null in reversed(path[:failed_index + 1]) if not non_null)
result = {nearest_nullable: None, 'errors': ['name resolved null']}
```

1. Represent nullable order and non-null descendants.

   Changed values: `{"path": [["order", false], ["customer", true], ["name", true]]}`

2. The name resolver violates its non-null contract.

   Changed values: `{"failed_index": 2}`

3. Walk upward until propagation reaches a nullable boundary.

   Changed values: `{"nearest_nullable": "order"}`

4. Return a null order plus an error instead of an invalid non-null leaf.

   Changed values: `{"result": {"order": null, "errors": ["name resolved null"]}}`

[Full runnable example](examples/apis-microservices.py).

Limits: This local model covers one object path and one field error. It does not execute a GraphQL server, model lists, multiple errors, authorization, deferred/streamed delivery, federation, custom error masking, or client cache behavior.

## Explore (remaining exploration time)

Toggle nullability along the response path. Watch the exact subtree that collapses when the leaf resolver returns null.

Open apis-microservices.html for the executable model.

Model limits: This local model covers one object path and one field error. It does not execute a GraphQL server, model lists, multiple errors, authorization, deferred/streamed delivery, federation, custom error masking, or client cache behavior.

## Quiz (4 minutes)

1. A non-null leaf resolves to null. What happens first?
   - A field error propagates to the nearest nullable parent
   - GraphQL silently returns the null leaf
   - The schema changes automatically

2. Why keep a parent nullable?
   - It can bound failure and preserve unrelated partial data
   - It prevents all resolver errors
   - It makes every child non-null

3. What should guide adding ! to a field?
   - A real server guarantee and desired failure boundary
   - Client preference alone
   - The field name length

4. Which field in one of your GraphQL schemas has a stronger non-null promise than its backing service can meet?
5. How would list item nullability change the blast radius for one failing element?

<details><summary>Answer key — attempt first</summary>

1. A field error propagates to the nearest nullable parent. The non-null contract forces error propagation.

2. It can bound failure and preserve unrelated partial data. A nullable ancestor is where bubbling can stop.

3. A real server guarantee and desired failure boundary. Nullability must match runtime guarantees and failure semantics.

</details>

## Sources

- [GraphQL Specification October 2021](https://spec.graphql.org/October2021/#sec-Handling-Field-Errors) — Published October 2021; checked 2026-10-21.
- [GraphQL Specification: Non-Null](https://spec.graphql.org/October2021/#sec-Non-Null) — Published October 2021; checked 2026-10-21.
