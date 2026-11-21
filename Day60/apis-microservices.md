# An additive response field is compatible only if consumers tolerate unknown fields

APIs & Microservices · Day60 · 15 minutes

Evolve JSON APIs by testing consumer behavior, not by assuming every schema addition is safe.

## Recall (2 minutes)

<p><a href="../Day39/apis-microservices.html">Day39: Binary Protobuf preserves unknown fields; a JSON hop can erase them</a></p><p>An old proto3 binary parser receives unknown field 7 and reserializes binary. Expected result?</p><details><summary>Recall first, then reveal the refresher</summary><p>Field 7 is preserved. Unknown binary fields survive parse/reserialize.</p></details><p><a href="../Day11/apis-microservices.html">Day11: Write the order form down: an OpenAPI request contract</a></p><p>A body contains only sku: MUG. Both required settings are present. What fails?</p><details><summary>Recall first, then reveal the refresher</summary><p>The required quantity field check. The body exists, so its presence check passes. The object lacks quantity. A properties declaration neither requires a field nor inserts a default.</p></details>

## Understand (4 minutes)

A restaurant can add a new side dish to the menu. A customer who ignores unfamiliar items is fine; a robot that rejects any unknown line stops ordering.

JSON Schema allows properties not named in properties by default. A consumer that sets additionalProperties: false chooses a closed response shape. Adding riskBand to a server response is additive for a tolerant reader but breaking for that closed validator.



Version 1 returns {id,total}. Version 1.1 adds riskBand. The tolerant mobile client reads id and total and ignores the new field. The closed generated validator rejects the same response until regenerated or its compatibility policy changes.



## Read the visual

One v1.1 response forks into tolerant and closed v1 consumer gates, producing opposite validation results.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use consumer-aware compatibility checks before adding response fields, enum values, or polymorphic variants.

**Practical example.** An order API adds a fraud risk band used by new clients while old clients remain deployed for months.

**How to decide.** Prefer tolerant response readers and explicit contract tests. If important consumers are closed, coordinate regeneration, negotiate a version, or use a new media type/endpoint instead of declaring the change harmless.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
old_known={'id','total'}; response={'id':60,'total':125,'riskBand':'low'}
unknown=set(response)-old_known
tolerant_valid=True; closed_valid=(len(unknown)==0)
result={'unknown':sorted(unknown),'tolerant_valid':tolerant_valid,'closed_valid':closed_valid}
```

1. Create an old consumer shape and an additive server response.

   Changed values: `{"response": {"id": 60, "total": 125, "riskBand": "low"}}`

2. Identify the new field from the old consumer's view.

   Changed values: `{}`

3. Apply tolerant and closed-reader policies.

   Changed values: `{"tolerant_valid": true, "closed_valid": false}`

4. Show that the same wire response has consumer-specific compatibility.

   Changed values: `{"result": {"unknown": ["riskBand"], "tolerant_valid": true, "closed_valid": false}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The toy checks one unknown field. It omits request compatibility, enums, code generation, oneOf discriminators, media types, semantic changes, caches, rollout telemetry, and actual OpenAPI tooling.

## Explore (remaining exploration time)

Toggle the client between tolerant and closed. Predict whether the same additive response validates.

Open apis-microservices.html for the executable model.

Model limits: The toy checks one unknown field. It omits request compatibility, enums, code generation, oneOf discriminators, media types, semantic changes, caches, rollout telemetry, and actual OpenAPI tooling.

## Quiz (4 minutes)

1. Why can an additive field break a client?
   - The client may reject unknown properties
   - JSON forbids new keys
   - HTTP deletes old fields

2. What is JSON Schema's default for additional object properties?
   - They are allowed unless constrained
   - They are always deleted
   - They are always errors

3. What evidence should gate the change?
   - Contract tests against important deployed consumer behaviors
   - Only the producer's unit test
   - A version number with no rollout plan

4. Which deployed clients reject unknown response fields?
5. What contract test will prove this change safe before rollout?

<details><summary>Answer key — attempt first</summary>

1. The client may reject unknown properties. Compatibility is a relationship between producer and consumer behavior.

2. They are allowed unless constrained. additionalProperties defaults to an accepting schema.

3. Contract tests against important deployed consumer behaviors. Test the actual compatibility surface.

</details>

## Sources

- [JSON Schema: object and additionalProperties](https://json-schema.org/understanding-json-schema/reference/object) — Official JSON Schema documentation; checked November 20, 2026; checked 2026-11-20.
- [OpenAPI Specification v3.2.1](https://spec.openapis.org/oas/v3.2.1.html) — Official OpenAPI Initiative specification; checked November 20, 2026; checked 2026-11-20.
