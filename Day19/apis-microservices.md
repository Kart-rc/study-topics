# Verify the exact webhook bytes before parsing

APIs & Microservices · Day19 · 15 minutes

Reject payload tampering before business logic sees the event.

## Recall (2 minutes)

<p><a href="../Day17/apis-microservices.html">Day17: Keyset pagination: continue after a row, not a position</a></p><p>After page A,B and insertion of X before A, what does OFFSET 2 return?</p><details><summary>Recall first, then reveal the refresher</summary><p>B,C. Positions shift. B becomes third and is returned again.</p></details><p><a href="../Day12/apis-microservices.html">Day12: Do not erase a newer edit: ETag and If-Match</a></p><p>Alice has advanced the resource to v2. Bob sends If-Match v1. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Server does not perform the update and may return 412. The condition is false. RFC 9110 says the origin server must not perform the requested method; 412 can report the failed precondition.</p></details>

## Understand (4 minutes)

A tamper-evident envelope is checked before you open and repackage the letter. Webhook receivers should likewise verify the signature over the exact request bytes before parsing or transforming the JSON.

With GitHub webhooks, the sender computes an HMAC-SHA256 using a shared secret and sends it in X-Hub-Signature-256. The receiver recomputes the HMAC over the raw payload and uses a timing-safe comparison.



The original body is {"amount":50}. Its header matches. A proxy or attacker changes the body to {"amount":500} but cannot recompute the header without the secret, so verification fails. Parsing and reserializing first can also change whitespace or key order and break a legitimate signature.

expected = "sha256=" + hmac_sha256(secret, raw_body)
if not constant_time_equal(expected, header): reject()
event = json_parse(raw_body)

The Python replay computes real HMAC values with a synthetic secret. Never put a production secret in this page or repository.



## Read the visual

The pipeline places signature comparison before parsing and side effects. Tampering turns the first gate red; unsafe ordering shows why eventual rejection can be too late.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this for webhook endpoints that trigger builds, payments, data loads or other side effects.

**Practical example.** A GitHub push webhook starts a deployment only after its raw UTF-8 body passes signature verification.

**How to decide.** Signature validation authenticates the shared secret holder and detects body changes. Add delivery-ID deduplication and freshness/replay policy separately; HMAC alone does not stop a captured valid delivery from being replayed.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
import hmac, hashlib
secret = b"study-secret"
original = b'{"amount":50}'
header = "sha256=" + hmac.new(secret, original, hashlib.sha256).hexdigest()
tampered = b'{"amount":500}'
expected = "sha256=" + hmac.new(secret, tampered, hashlib.sha256).hexdigest()
valid_original = hmac.compare_digest(header, "sha256=" + hmac.new(secret, original, hashlib.sha256).hexdigest())
valid_tampered = hmac.compare_digest(header, expected)
```

1. Create a synthetic valid signature over the original bytes.

   Changed values: `{"header": "sha256=fb1500834ad8d3ca43c29dbd670cf700244c0901aad8bdc1aa91120db18119ad"}`

2. Recompute what the changed body would require.

   Changed values: `{"expected": "sha256=780606e258944d06c87049f2cbb881c447c7d8d9fe245e0182c4dd65d97ec6fc"}`

3. The original passes; the changed body fails against the unchanged header.

   Changed values: `{"valid_original": true, "valid_tampered": false}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executed Python HMAC-SHA256 with a public synthetic secret. No HTTP request or timing experiment runs.

## Explore (remaining exploration time)

Toggle body tampering and verification order. Predict whether the request reaches JSON parsing and business processing.

Open apis-microservices.html for the executable model.

Model limits: The browser uses precomputed teaching labels, not Web Crypto. The Python replay uses a synthetic secret but omits HTTP headers, timing measurement, secret rotation, replay storage and delivery retries.

## Quiz (4 minutes)

1. Body changes from amount 50 to 500 but header stays the same. What happens?
   - HMAC mismatch
   - HMAC automatically updates
   - Verification proves 500 is valid

2. Why verify before JSON parsing?
   - JSON cannot be parsed
   - The signature covers exact raw bytes and untrusted events should not trigger logic first
   - It makes HMAC public

3. What threat remains after a valid signature?
   - Payload tampering without the secret
   - Replay of a captured valid delivery unless separately controlled
   - All network failures disappear

4. How will you rotate webhook secrets without dropping deliveries?
5. Design delivery-ID deduplication for a redelivered valid event.

<details><summary>Answer key — attempt first</summary>

1. HMAC mismatch. The secret-backed digest covers the payload bytes; changing them invalidates the old header.

2. The signature covers exact raw bytes and untrusted events should not trigger logic first. Transformation can change bytes, and business logic should not process unauthenticated input.

3. Replay of a captured valid delivery unless separately controlled. HMAC integrity does not provide uniqueness or freshness. Track delivery IDs and define a replay window or idempotent handling.

</details>

## Sources

- [GitHub Docs: validating webhook deliveries](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries) — Living docs; checked 2026-10-09; checked 2026-10-09.
- [GitHub Docs: webhook best practices](https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks) — Living docs; checked 2026-10-09; checked 2026-10-09.
