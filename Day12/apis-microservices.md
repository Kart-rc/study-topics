# Do not erase a newer edit: ETag and If-Match

APIs & Microservices · Day12 · 15 minutes

Make an update conditional on the version a client actually read so stale writes fail instead of silently winning.

## Recall (2 minutes)

<p><a href="../Day11/apis-microservices.html">Day11: Write the order form down: an OpenAPI request contract</a></p><p>A body contains only sku: MUG. Both required settings are present. What fails?</p><details><summary>Recall first, then reveal the refresher</summary><p>The required quantity field check. The body exists, so its presence check passes. The object lacks quantity. A properties declaration neither requires a field nor inserts a default.</p></details>

## Understand (4 minutes)

Alice and Bob open the same order note. Both see “address: A” and version "v1". Alice changes the address to B. Bob, still looking at the old copy, changes the delivery window. If Bob sends the whole old document, he may erase Alice’s address.

An ETag is a server-provided identifier for a selected representation. The client sends its identifier back in If-Match: “apply my change only if the current version still matches what I read.”

The rejection prevents a lost update: one client accidentally overwriting another client’s parallel work.



Alice sends:

PUT /orders/42
If-Match: "v1"

{"address":"B","window":"morning"}

The server compares "v1" with its current ETag. They match, so it stores Alice’s representation and returns "v2". Bob later sends If-Match: "v1". It no longer matches, so the server does not perform the update and can return 412 Precondition Failed. Bob must GET v2, merge intentionally, and retry with the new ETag.

Use a strong validator for If-Match comparison. Define whether your ETag represents the full resource or a specific representation variant.



## Read the visual

Does Bob’s read version still match the server? Bob holds the earlier snapshot on the left. The server’s current version is compared with Bob’s If-Match value before applying his whole-resource replacement. Disabling the gate allows Alice’s newer address to be erased.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
resource = {"address": "A", "window": "morning"}
etag = "v1"
bob_copy = resource.copy()
bob_tag = etag
resource = {"address": "B", "window": "morning"}
etag = "v2"
condition_matches = bob_tag == etag
status = 200 if condition_matches else 412
if condition_matches:
    resource = {**bob_copy, "window": "evening"}
```

1. Both clients start from the same v1 representation.

   Changed values: `{"resource": {"address": "A", "window": "morning"}, "etag": "v1", "bob_copy": {"address": "A", "window": "morning"}, "bob_tag": "v1"}`

2. Alice updates the address and the server advances the validator.

   Changed values: `{"resource": {"address": "B", "window": "morning"}, "etag": "v2"}`

3. Bob's v1 tag does not match the current v2 tag.

   Changed values: `{"condition_matches": false}`

4. The server returns 412 and leaves Alice's address intact.

   Changed values: `{"status": 412}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executes an in-memory comparison. It does not implement an HTTP server or a database transaction.

## Explore (remaining exploration time)

Run Alice's update, then Bob's stale update. Turn off the condition to see how the newer address is silently overwritten.

Open apis-microservices.html for the executable model.

Model limits: A single-process whole-resource update model. It omits authentication, authorization, weak validators, content negotiation, PATCH merge rules, databases, replicas, retries, idempotency keys, and the RFC's already-applied success exception. Production servers need an atomic compare-and-update.

## Quiz (4 minutes)

1. Alice has advanced the resource to v2. Bob sends If-Match v1. What happens?
   - Server applies Bob's stale copy
   - Server does not perform the update and may return 412
   - Server deletes the ETag

2. What problem does If-Match address here?
   - Lost updates between parallel editors
   - Slow DNS
   - Missing authentication

3. Why must compare and write be atomic at the server?
   - To avoid another write slipping between the check and update
   - To make ETags human-readable
   - To cache every response forever

4. Explain Bob's safe recovery after receiving 412.
5. How would partial PATCH semantics change the merge decision but not remove the need for concurrency control?

<details><summary>Answer key — attempt first</summary>

1. Server does not perform the update and may return 412. The condition is false. RFC 9110 says the origin server must not perform the requested method; 412 can report the failed precondition.

2. Lost updates between parallel editors. It stops a stale representation from silently overwriting a newer change. Authentication is a separate concern.

3. To avoid another write slipping between the check and update. A separate check followed later by a write recreates the race. The selected version must be compared as part of the update decision.

</details>

## Sources

- [RFC 9110: HTTP Semantics — ETag and If-Match](https://www.rfc-editor.org/rfc/rfc9110.html) — IETF Standards Track; published 2022-06; checked 2026-10-02.
