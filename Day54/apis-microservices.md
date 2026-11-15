# properties names the known fields; additionalProperties: false closes the object

APIs & Microservices · Day54 · 15 minutes

Reject misspelled or unexpected request fields when silently ignoring them would change the client's intent.

## Recall (2 minutes)

<p><a href="../Day36/apis-microservices.html">Day36: OpenAPI readOnly and writeOnly describe direction; they do not authorize</a></p><p>password is writeOnly in the schema. What guarantees it is absent from responses?</p><details><summary>Recall first, then reveal the refresher</summary><p>Server-side serialization and tests, not the annotation alone. The specification treats it as an annotation.</p></details><p><a href="../Day24/apis-microservices.html">Day24: One trace ID joins the call path; it does not authenticate it</a></p><p>What stays the same across spans in one distributed trace?</p><details><summary>Recall first, then reveal the refresher</summary><p>trace ID. The shared trace ID correlates the path; each span has its own ID.</p></details>

## Understand (4 minutes)

A paper form lists “amount.” Writing “amuont” in the margin does not fill that box.

In JSON Schema—and therefore OpenAPI 3.1 Schema Objects—listing entries under properties does not reject other names by default. Extra properties are allowed unless a schema constrains them. Set additionalProperties: false for a deliberately closed object, or provide a schema when dynamic keys are part of the contract.



The transfer API expects {"amount":10}. A client sends {"amount":10,"amuont":1000}. An open schema accepts the typo as an extra field; application code may ignore it and transfer 10. A closed schema rejects the request and points to amuont, giving the client a repair path.



## Read the visual

One request moves through open and closed schema gates, showing exactly when the typo is ignored versus returned for repair.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Close request objects when unknown fields likely indicate typos, stale clients, or unsafe assumptions.

**Practical example.** A financial command API has a small stable request shape and must not silently ignore a misspelled limit or currency field.

**How to decide.** Use additionalProperties:false in the correct schema scope and test composition. Keep objects open or type additional properties when extensibility or maps are intentional. For composed schemas, examine unevaluatedProperties because additionalProperties only sees properties declared in its own subschema.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
schema={'properties':{'amount':{'type':'number'}},'additionalProperties':False}
request={'amount':10,'amuont':1000}
known=set(schema['properties']); extras=set(request)-known
result={'valid':not extras or schema['additionalProperties'] is not False,'extras':sorted(extras),'applied':None if extras else request['amount']}
```

1. Declare a closed command object.

   Changed values: `{"schema": {"properties": {"amount": {"type": "number"}}, "additionalProperties": false}}`

2. Add a misspelled extra field.

   Changed values: `{"request": {"amount": 10, "amuont": 1000}}`

3. Find keys not declared in this toy schema scope.

   Changed values: `{}`

4. Reject before application code silently uses only amount.

   Changed values: `{"result": {"valid": false, "extras": ["amuont"], "applied": null}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model checks one extra key. It is not a full JSON Schema or OpenAPI validator and does not model allOf, unevaluatedProperties, patternProperties, discriminator behavior, coercion, framework deserialization, version negotiation, authorization, or business validation.

## Explore (remaining exploration time)

Toggle open versus closed schema and include the misspelled field. Predict accepted input and applied amount.

Open apis-microservices.html for the executable model.

Model limits: The model checks one extra key. It is not a full JSON Schema or OpenAPI validator and does not model allOf, unevaluatedProperties, patternProperties, discriminator behavior, coercion, framework deserialization, version negotiation, authorization, or business validation.

## Quiz (4 minutes)

1. A schema lists amount but omits additionalProperties. Is amuont allowed?
   - Yes, extra properties are allowed by default
   - No, properties is automatically a closed list
   - Only over HTTP/2

2. Why close a financial command object?
   - A typo becomes a repairable validation error instead of silently ignored intent
   - It authorizes the caller
   - It guarantees business correctness

3. When should additional properties remain allowed or typed?
   - When the object intentionally represents extensible metadata or a map
   - Whenever clients make typos
   - Whenever the server ignores every extra field

4. Which request object currently ignores unknown fields that could change money, scope, or authorization intent?
5. Where would schema composition require unevaluatedProperties rather than a local additionalProperties rule?

<details><summary>Answer key — attempt first</summary>

1. Yes, extra properties are allowed by default. The properties keyword constrains named fields; it does not close the object by itself.

2. A typo becomes a repairable validation error instead of silently ignored intent. Closure improves contract strictness, while authorization and semantic validation remain separate.

3. When the object intentionally represents extensible metadata or a map. Dynamic keys are a legitimate contract when their values are explicitly constrained and understood.

</details>

## Sources

- [OpenAPI Specification v3.1.2](https://spec.openapis.org/oas/v3.1.2.html) — OpenAPI Initiative specification; checked November 14, 2026; checked 2026-11-14.
- [JSON Schema 2020-12: object properties](https://json-schema.org/understanding-json-schema/reference/object) — JSON Schema documentation; checked November 14, 2026; checked 2026-11-14.
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/) — JSON Schema specification index; published June 16, 2022; checked November 14, 2026; checked 2026-11-14.
