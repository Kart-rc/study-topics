# OpenAPI readOnly and writeOnly describe direction; they do not authorize

APIs & Microservices · Day36 · 15 minutes

Use directional schema annotations without mistaking generated-client behavior for server-side access control.

## Recall (2 minutes)

<p><a href="../Day27/apis-microservices.html">Day27: A valid token does not make every order yours</a></p><p>Alice has a valid token. May she read Bob’s order?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only if object-level policy allows that action. Authentication does not grant access to every object.</p></details><p><a href="../Day15/apis-microservices.html">Day15: One clock across the call chain: gRPC deadlines</a></p><p>After 120 ms of a 500 ms deadline, what budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>380 ms remaining. The original end-to-end promise has 380 ms left.</p></details>

## Understand (4 minutes)

A restaurant menu marks “staff writes this field” and “customer sees this field.” The ink on the menu does not lock the kitchen door.

In OpenAPI 3.1.2, readOnly and writeOnly are annotations. Tooling may use request/response direction during validation, documentation, and code generation. Your server must still enforce authorization and response filtering.



id is readOnly; clients should not control it on create. password is writeOnly; the response should not expose it. A malicious caller can still send id, and a buggy serializer can still leak password, unless runtime code rejects or strips them.



## Read the visual

The side-by-side contract and runtime payload answer whether a directional annotation actually removed a field. Turning enforcement off creates a visible password leak.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use these annotations when one resource schema has fields that differ between request and response directions.

**Practical example.** A user-create request accepts password but a user response returns server-generated id and never returns password.

**How to decide.** Use annotations for contract/tooling clarity, then add runtime request validation, output serialization tests, field-level authorization, and secret-handling controls. Separate schemas may be clearer for materially different shapes.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
schema = {'id': 'readOnly', 'name': 'both', 'password': 'writeOnly'}
request_fields = [k for k, v in schema.items() if v != 'readOnly']
response_fields = [k for k, v in schema.items() if v != 'writeOnly']
runtime_authorization_required = True
```

1. Describe intended field directions.

   Changed values: `{"schema": {"id": "readOnly", "name": "both", "password": "writeOnly"}}`

2. Derive the teaching request shape.

   Changed values: `{"request_fields": ["name", "password"]}`

3. Derive the teaching response shape.

   Changed values: `{"response_fields": ["id", "name"]}`

4. Keep enforcement explicit and separate.

   Changed values: `{"runtime_authorization_required": true}`

[Full runnable example](examples/apis-microservices.py).

Limits: The browser models three fields and one policy. It does not run an OpenAPI validator or generator, select a JSON Schema dialect, model PUT nuances, required fields, nested schemas, references, security requirements, serialization libraries, or implementation-specific annotation behavior.

## Explore (remaining exploration time)

Choose request or response direction and toggle runtime enforcement. Watch annotations and actual payload behavior diverge.

Open apis-microservices.html for the executable model.

Model limits: The browser models three fields and one policy. It does not run an OpenAPI validator or generator, select a JSON Schema dialect, model PUT nuances, required fields, nested schemas, references, security requirements, serialization libraries, or implementation-specific annotation behavior.

## Quiz (4 minutes)

1. password is writeOnly in the schema. What guarantees it is absent from responses?
   - Server-side serialization and tests, not the annotation alone
   - The word writeOnly by itself
   - CORS

2. Why mark id readOnly?
   - To communicate that the server owns the response field direction
   - To authenticate users
   - To encrypt the value

3. When prefer separate request/response schemas?
   - When directional shapes and requirements differ enough that one annotated schema becomes ambiguous
   - Whenever an API has one field
   - To replace authorization

4. Which fields in your APIs are direction-specific but currently rely only on generated-client behavior?
5. Would one annotated schema or separate request/response schemas be clearer for your highest-risk resource? 

<details><summary>Answer key — attempt first</summary>

1. Server-side serialization and tests, not the annotation alone. The specification treats it as an annotation.

2. To communicate that the server owns the response field direction. It clarifies the interface to tools and humans.

3. When directional shapes and requirements differ enough that one annotated schema becomes ambiguous. Clarity can outweigh schema reuse.

</details>

## Sources

- [OpenAPI Specification 3.1.2: validating readOnly and writeOnly](https://spec.openapis.org/oas/v3.1#validating-read-only-and-write-only) — Official specification; checked October 26, 2026; checked 2026-10-26.
- [JSON Schema 2020-12 validation: readOnly/writeOnly](https://json-schema.org/draft/2020-12/json-schema-validation#name-a-vocabulary-for-basic-meta-d) — Official specification; checked October 26, 2026; checked 2026-10-26.
