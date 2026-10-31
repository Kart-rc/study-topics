# Missing and null are different—and OpenAPI 3.1 spells null differently

APIs & Microservices · Day41 · 15 minutes

Model field presence separately from nullability and migrate schemas without silently rejecting or accepting the wrong payloads.

## Recall (2 minutes)

<p><a href="../Day24/apis-microservices.html">Day24: One trace ID joins the call path; it does not authenticate it</a></p><p>What stays the same across spans in one distributed trace?</p><details><summary>Recall first, then reveal the refresher</summary><p>trace ID. The shared trace ID correlates the path; each span has its own ID.</p></details><p><a href="../Day28/apis-microservices.html">Day28: OpenAPI oneOf means exactly one schema</a></p><p>A payload matches both branches. Does oneOf accept it?</p><details><summary>Recall first, then reveal the refresher</summary><p>No. oneOf requires exactly one valid branch.</p></details>

## Understand (4 minutes)

An empty delivery box is different from no box arriving. JSON null is a present field with no value; a missing property is absent.

In OpenAPI 3.0, a string that also accepts null uses type: string plus nullable: true. OpenAPI 3.1 aligns with JSON Schema and can use type: [string, 'null']. Separately, listing the property in the parent's required array controls whether it must be present.



middle_name may be absent when not collected, null when explicitly unknown, or a string when known. If it is required and nullable, absence fails but null passes. If optional and non-null, absence passes but null fails.



## Read the visual

Two independent switches—presence and allowed value types—feed the payload state. The result makes missing-versus-null impossible to collapse accidentally.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Make the distinction explicit during API schema design, SDK generation, database mapping, PATCH semantics, and OpenAPI 3.0-to-3.1 migration.

**Practical example.** A customer profile distinguishes “producer did not send tax residency” from “customer explicitly has no secondary residency.”

**How to decide.** Allow null only when it has domain meaning. Prefer optional absence for fields not collected. Test generators and validators during version migration; do not mechanically leave 3.0-only nullable keywords in a 3.1 contract.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
cases=[{'required':True,'nullable':True,'state':'null'},{'required':False,'nullable':False,'state':'missing'},{'required':True,'nullable':False,'state':'null'}]
def valid(c): return (c['state']!='missing' or not c['required']) and (c['state']!='null' or c['nullable'])
results=[valid(c) for c in cases]
oas30={'type':'string','nullable':True}; oas31={'type':['string','null']}
```

1. Define three presence/value combinations.

   Changed values: `{"cases": [{"required": true, "nullable": true, "state": "null"}, {"required": false, "nullable": false, "state": "missing"}, {"required": true, "nullable": false, "state": "null"}]}`

2. Evaluate presence and null permission independently.

   Changed values: `{}`

3. Required-nullable passes; optional-missing passes; required-non-null null fails.

   Changed values: `{"results": [true, true, false]}`

4. Show equivalent nullable intent in the two specification generations.

   Changed values: `{"oas30": {"type": "string", "nullable": true}, "oas31": {"type": ["string", "null"]}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The validator models one property only. It does not execute an OpenAPI validator or generator, model PATCH merge semantics, defaults, oneOf, read/write direction, serialization, language option types, or every JSON Schema dialect.

## Explore (remaining exploration time)

Toggle required, nullable, and payload state. Predict validation before the result appears, then switch the displayed 3.0/3.1 schema form.

Open apis-microservices.html for the executable model.

Model limits: The validator models one property only. It does not execute an OpenAPI validator or generator, model PATCH merge semantics, defaults, oneOf, read/write direction, serialization, language option types, or every JSON Schema dialect.

## Quiz (4 minutes)

1. Field is required and nullable; payload contains null. Result?
   - Valid
   - Invalid because required forbids null
   - Field becomes missing

2. Field is optional and non-null; payload omits it. Result?
   - Valid
   - Invalid because every field needs a value
   - It becomes null

3. How does OAS 3.1 normally express a nullable string?
   - type: [string, null]
   - nullable: true without a type
   - required: null

4. Which API fields currently use null to mean something different from absent?
5. Which generators and validators must be compatibility-tested before adopting OpenAPI 3.1?

<details><summary>Answer key — attempt first</summary>

1. Valid. Required controls presence; nullable permits the present null value.

2. Valid. Optional absence is not the same as a null value.

3. type: [string, null]. 3.1 uses JSON Schema type unions.

</details>

## Sources

- [OpenAPI Specification 3.0.3 — Schema Object nullable](https://spec.openapis.org/oas/v3.0.3#schema-object) — Official specification; checked October 31, 2026; checked 2026-10-31.
- [OpenAPI Specification 3.1.0 — Schema Object and JSON Schema dialect](https://spec.openapis.org/oas/v3.1.0#schema-object) — Official specification; checked October 31, 2026; checked 2026-10-31.
- [JSON Schema 2020-12 validation](https://json-schema.org/draft/2020-12/json-schema-validation) — Official specification; checked October 31, 2026; checked 2026-10-31.
