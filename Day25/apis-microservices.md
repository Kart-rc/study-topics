# A field mask says exactly what PATCH may change

APIs & Microservices · Day25 · 15 minutes

Use FieldMask to distinguish an omitted field from an intentional clear or default value.

## Recall (2 minutes)

<p><a href="../Day21/apis-microservices.html">Day21: Retry-After is a floor, not a synchronized alarm clock</a></p><p>Retry-After: 3. Is a retry at second 1 compliant with the advice?</p><details><summary>Recall first, then reveal the refresher</summary><p>No. The field asks the client to wait.</p></details><p><a href="../Day16/apis-microservices.html">Day16: One error shape, stable meaning: RFC 9457 Problem Details</a></p><p>Which field should machine logic use as the primary problem identifier?</p><details><summary>Recall first, then reveal the refresher</summary><p>The type URI. RFC 9457 defines type as the primary problem identifier; detail is human-readable.</p></details>

## Understand (4 minutes)

A repair form has two parts: the new value and a checklist of which rooms workers may enter. Sending display_name: "" without the checklist is ambiguous—is it an intentional clear or a serialization default?

A field mask is that checklist. The server changes only listed paths. Values outside the mask are ignored or rejected by contract, so adding future fields does not accidentally erase them.



Current user: {name: "Kai", timezone: "UTC", alerts: true}. Request body sends {timezone: "America/New_York", alerts: false} with mask timezone. Only timezone changes; alerts stays true.



## Read the visual

The table holds before, payload and after side by side. Green rows are named by the mask; unhighlighted payload values do not cross into stored state.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use field masks for partial updates when resources have optional/default values, nested fields, or will evolve with new fields.

**Practical example.** A profile client changes timezone without overwriting alert settings added by a newer server.

**How to decide.** Use PATCH plus an explicit update mask for selective change. Use full replacement only when clients intentionally own every field and concurrency control protects lost updates.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
resource={'display_name':'Kai','timezone':'UTC','alerts':True}
payload={'timezone':'America/New_York','alerts':False}
mask=['timezone']
for field in mask: resource[field]=payload[field]
alerts_preserved=(resource['alerts'] is True)
```

1. Start with the stored resource.

   Changed values: `{"resource": {"display_name": "Kai", "timezone": "UTC", "alerts": true}}`

2. The payload carries two values, but the mask authorizes one path.

   Changed values: `{"payload": {"timezone": "America/New_York", "alerts": false}, "mask": ["timezone"]}`

3. Apply only masked fields.

   Changed values: `{"resource": {"display_name": "Kai", "timezone": "America/New_York", "alerts": true}, "field": "timezone"}`

4. The unmasked alerts value remains unchanged.

   Changed values: `{"alerts_preserved": true}`

[Full runnable example](examples/apis-microservices.py).

Limits: This local model supports flat fields only. Real protobuf FieldMask paths can be nested and have rules for repeated/map fields, immutable fields, wildcards, unknown paths, validation, etags and authorization.

## Explore (remaining exploration time)

Select a mask and payload. Predict the resource after the patch, including an intentional clear.

Open apis-microservices.html for the executable model.

Model limits: This local model supports flat fields only. Real protobuf FieldMask paths can be nested and have rules for repeated/map fields, immutable fields, wildcards, unknown paths, validation, etags and authorization.

## Quiz (4 minutes)

1. Payload contains alerts=false, but update_mask is timezone. What happens to alerts?
   - It becomes false
   - It stays unchanged
   - The field is deleted

2. How do you intentionally clear display_name?
   - Omit it
   - Include display_name in the mask and send its clear/default value
   - Use GET

3. Why is full replacement risky as schemas evolve?
   - Older clients may overwrite fields they do not know
   - PATCH cannot be authorized
   - Field masks copy databases

4. How should authorization interact with a mask that names a restricted field?
5. What concurrency check would you pair with a partial update to avoid lost updates?

<details><summary>Answer key — attempt first</summary>

1. It stays unchanged. Only paths named in the mask participate in the update.

2. Include display_name in the mask and send its clear/default value. Mask membership carries intent; the value carries the new state.

3. Older clients may overwrite fields they do not know. An older client cannot preserve unknown fields if it replaces the whole resource.

</details>

## Sources

- [Google AIP-134: Standard methods Update](https://google.aip.dev/134) — Changelog updated October 3, 2025; checked 2026-10-15.
- [Google AIP-161: Field masks](https://google.aip.dev/161) — Foundation; checked 2026-10-15.
- [Protocol Buffers FieldMask reference](https://protobuf.dev/reference/protobuf/google.protobuf/#field-mask) — Living reference; checked 2026-10-15.
