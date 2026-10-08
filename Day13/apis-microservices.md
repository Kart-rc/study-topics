# Add, migrate, remove: evolve an API field safely

APIs & Microservices · Day13 · 15 minutes

Rename a response field without breaking an old client by separating expansion, migration, and contraction.

## Recall (2 minutes)

<p><a href="../Day12/apis-microservices.html">Day12: Do not erase a newer edit: ETag and If-Match</a></p><p>Alice has advanced the resource to v2. Bob sends If-Match v1. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Server does not perform the update and may return 412. The condition is false. RFC 9110 says the origin server must not perform the requested method; 412 can report the failed precondition.</p></details>

## Understand (4 minutes)

A store has shipped {"name":"Mug"} for years. The team now prefers display_name. Replacing the field overnight is like changing every apartment number without forwarding mail: old clients still ask for name.

Use three stages:

Expand: add display_name, but keep populating name.Migrate: update clients and measure old-field use.Contract: remove name only behind a compatible version transition and deprecation plan.

During expansion the server returns both fields:

{
  "name": "Mug",
  "display_name": "Coffee Mug"
}

An old client reads name. A new client prefers display_name and can temporarily fall back to name. If the server simply renames the field in v1, that is remove-plus-add and breaks the old client.

Google's AIP-180 distinguishes source, wire, and semantic compatibility. Adding a component is generally compatible only when previous clients keep their old behavior. New required request fields, changed defaults, or changed meanings can still break them.



## Read the visual

Which client survives each server migration phase? A compatibility matrix evaluates both old and new clients against all server phases. The selected intersection explains the actual request. The only broken cell is an old client meeting a server that removed name.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
server_v1 = {"name": "Mug"}
server_expand = {"name": "Mug", "display_name": "Coffee Mug"}
old_client_value = server_expand["name"]
new_client_value = server_expand.get("display_name", server_expand["name"])
server_break = {"display_name": "Coffee Mug"}
old_client_error = "missing name" if "name" not in server_break else "ok"
```

1. Start with the response old clients already use.

   Changed values: `{"server_v1": {"name": "Mug"}}`

2. Add the new field and keep the old one populated; the old client still works.

   Changed values: `{"server_expand": {"name": "Mug", "display_name": "Coffee Mug"}, "old_client_value": "Mug"}`

3. The new client prefers the new field and can bridge older servers.

   Changed values: `{"new_client_value": "Coffee Mug"}`

4. Removing name inside the old contract breaks the old client.

   Changed values: `{"server_break": {"display_name": "Coffee Mug"}, "old_client_error": "missing name"}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executes Python dictionary lookups. It does not test an OpenAPI schema, generated SDK, deployed gateway, or real consumers.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>AIP-185 uses major versions for incompatible changes and requires a reasonable overlap and deprecation period. Your organization may use a different versioning scheme, but the consumer evidence and migration discipline remain necessary.</p>

</details>

## Explore (remaining exploration time)

Choose a server phase and a client generation. Predict whether the read succeeds and which field it uses.

Open apis-microservices.html for the executable model.

Model limits: A JSON response lookup. It does not cover generated client source compatibility, protobuf field numbers, unknown-enum handling, request validation, default serialization, pagination, or a real deprecation policy. Additive is not automatically safe when behavior or requirements change.

## Quiz (4 minutes)

1. Why does replacing name with display_name break an old v1 client?
   - The client still reads name, which disappeared
   - JSON forbids two fields
   - Major versions cannot exist

2. What is the safe bridge?
   - Return both fields while clients migrate
   - Change name's meaning silently
   - Add a new required request field

3. When can an apparently additive change still be risky?
   - When it changes defaults, adds a required input, or introduces a response enum clients cannot handle
   - Only when the JSON is indented
   - Never; additive always means safe

4. Write the expand, migrate, and contract plan for renaming one field used by ten client teams.
5. Which telemetry and deprecation evidence would justify removing the old field in a new major version?

<details><summary>Answer key — attempt first</summary>

1. The client still reads name, which disappeared. A rename is remove-plus-add. The old client's expected field is gone.

2. Return both fields while clients migrate. Keeping the old field populated preserves existing behavior while the new field becomes available.

3. When it changes defaults, adds a required input, or introduces a response enum clients cannot handle. Compatibility includes source, wire, and semantics. The shape alone is not the whole contract.

</details>

## Sources

- [AIP-180: Backwards compatibility](https://google.aip.dev/180) — Approved 2019-07-23; changelog updated through 2025-10-21; checked 2026-10-03.
- [AIP-185: API Versioning](https://google.aip.dev/185) — Approved 2024-10-22; checked 2026-10-03.
