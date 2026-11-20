# maximum: 100 without type: number still allows the string ‘huge’

APIs & Microservices · Day59 · 15 minutes

Write OpenAPI 3.2 schemas whose constraints apply to the instance types you actually intend to accept.

## Recall (2 minutes)

<p><a href="../Day33/apis-microservices.html">Day33: The second DELETE may say 404 and still be idempotent</a></p><p>The first DELETE removed job 42, but its 204 response was lost. What can a retry return while remaining idempotent?</p><details><summary>Recall first, then reveal the refresher</summary><p>404 with job 42 still absent. Idempotence concerns intended effect, not identical response messages.</p></details><p><a href="../Day37/apis-microservices.html">Day37: 202 Accepted means queued, not completed</a></p><p>Server returns 202 for exp-42. What can the client claim?</p><details><summary>Recall first, then reveal the refresher</summary><p>The request was accepted for processing, not that the export succeeded. 202 is intentionally noncommittal.</p></details>

## Understand (4 minutes)

A sign saying “maximum 100 kilograms” constrains weight. It says nothing about a box labeled with the word “huge.”

OpenAPI 3.2 Schema Objects use JSON Schema semantics. If a schema omits type, it allows all JSON types. A numeric keyword such as maximum applies to numbers but does not itself require the instance to be numeric. Add type: number when that is the contract.



The request field batchSize has only maximum: 100. Number 120 fails, number 80 passes, and string "huge" is not rejected by that numeric constraint. Adding type: integer rejects the string.



## Read the visual

The same three values pass through two schema gates; only the typed gate rejects the string before the maximum check.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit types whenever an API contract relies on type-specific JSON Schema keywords.

**Practical example.** An ingestion API limits batchSize to 100 but must reject strings before they reach scheduler code.

**How to decide.** Declare type, bounds, required properties, and object closure deliberately. Test the validator used at the gateway and server; documentation alone is not runtime enforcement.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
values=[80,120,'huge']; maximum=100
loose=[not isinstance(v,(int,float)) or v<=maximum for v in values]
typed=[isinstance(v,int) and v<=maximum for v in values]
result={'values':values,'maximum_only':loose,'typed_integer':typed}
```

1. Choose two numbers and one string.

   Changed values: `{"values": [80, 120, "huge"], "maximum": 100}`

2. Apply maximum only where it is applicable.

   Changed values: `{"loose": [true, false, true]}`

3. Add the intended integer type constraint.

   Changed values: `{"typed": [true, false, false]}`

4. Compare the loose and explicit contracts.

   Changed values: `{"result": {"values": [80, 120, "huge"], "maximum_only": [true, false, true], "typed_integer": [true, false, false]}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model implements only a tiny subset of JSON Schema. It omits dialect negotiation, integer versus number details, composition, null, coercion, formats, unevaluated properties, and validator differences.

## Explore (remaining exploration time)

Toggle the explicit type and validate 80, 120, and the string huge.

Open apis-microservices.html for the executable model.

Model limits: The model implements only a tiny subset of JSON Schema. It omits dialect negotiation, integer versus number details, composition, null, coercion, formats, unevaluated properties, and validator differences.

## Quiz (4 minutes)

1. Schema has maximum:100 but no type. What happens to string 'huge'?
   - The numeric keyword does not reject it
   - It becomes number 100
   - OpenAPI deletes it

2. What closes the gap?
   - Declare type: integer or number
   - Add a longer description
   - Rename the field

3. What does the OpenAPI document not guarantee by itself?
   - That every runtime request is validated and not coerced
   - That humans can read the contract
   - That schemas can declare maximum

4. Which current schemas use type-specific keywords without type?
5. Where is the contract actually enforced in your request path?

<details><summary>Answer key — attempt first</summary>

1. The numeric keyword does not reject it. The keyword applies only to numeric instances.

2. Declare type: integer or number. The type constraint makes the intended domain explicit.

3. That every runtime request is validated and not coerced. Runtime enforcement depends on actual validators and server code.

</details>

## Sources

- [OpenAPI Specification v3.2.1](https://spec.openapis.org/oas/v3.2.1.html) — Official OpenAPI Initiative specification; published September 2026; checked November 19, 2026; checked 2026-11-19.
