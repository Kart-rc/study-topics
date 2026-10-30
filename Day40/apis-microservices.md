# A gRPC status code says the class; typed details say what the client may do

APIs & Microservices · Day40 · 15 minutes

Return machine-readable error details without turning human message text into retry or remediation logic.

## Recall (2 minutes)

<p><a href="../Day29/apis-microservices.html">Day29: gRPC retries stop when response headers commit the RPC</a></p><p>When does gRPC consider the RPC committed for retry purposes?</p><details><summary>Recall first, then reveal the refresher</summary><p>When response headers are received. After response headers, no further automatic retries are attempted.</p></details><p><a href="../Day17/apis-microservices.html">Day17: Keyset pagination: continue after a row, not a position</a></p><p>After page A,B and insertion of X before A, what does OFFSET 2 return?</p><details><summary>Recall first, then reveal the refresher</summary><p>B,C. Positions shift. B becomes third and is returned again.</p></details>

## Understand (4 minutes)

A road sign says “closed.” A second sign says “reopens in 30 minutes” and a third names the blocked lane. The first classifies the problem; the details guide a safe response.

Every gRPC client can read a standard status code and message. With Protocol Buffers, the richer error model can attach typed detail messages in trailing metadata—for example RetryInfo, BadRequest, or QuotaFailure. Clients branch on code and known detail types, not on unstable English text.



A warehouse API returns RESOURCE_EXHAUSTED, message “tenant burst quota exceeded,” RetryInfo{retry_delay:30s}, and QuotaFailure{subject:tenant/42}. A client that owns an idempotent request may schedule one retry after 30 seconds. A client that does not understand the details still sees the standard code.



## Read the visual

The decision path separates four facts: error class, typed delay, effect safety, and action. Changing one fact changes the remediation without touching human message text.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use typed details when clients need structured remediation such as field violations, retry delay, resource identity, quota subject, or support links.

**Practical example.** A cross-language ingestion client needs to distinguish malformed rows from a temporary tenant quota and show the exact invalid fields.

**How to decide.** Keep the canonical code stable and details small. Add rich details only when target language libraries and intermediaries preserve them. Do not expose stack traces or sensitive resource data, and do not tell clients to retry non-idempotent operations blindly.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
status = {'code':'RESOURCE_EXHAUSTED','message':'tenant burst quota exceeded','details':{'retry_seconds':30,'quota_subject':'tenant/42'}}
request_idempotent = True; known_retry = status['details'].get('retry_seconds')
action = f"retry-after-{known_retry}s" if status['code'] == 'RESOURCE_EXHAUSTED' and known_retry and request_idempotent else 'do-not-auto-retry'
fallback_for_old_client = status['code']
```

1. Keep classification, human text, and typed remediation separate.

   Changed values: `{"status": {"code": "RESOURCE_EXHAUSTED", "message": "tenant burst quota exceeded", "details": {"retry_seconds": 30, "quota_subject": "tenant/42"}}}`

2. The client checks its own effect safety and a recognized detail.

   Changed values: `{"request_idempotent": true, "known_retry": 30}`

3. No English string parsing controls the branch.

   Changed values: `{"action": "retry-after-30s"}`

4. A client without rich-detail support still receives the standard code.

   Changed values: `{"fallback_for_old_client": "RESOURCE_EXHAUSTED"}`

[Full runnable example](examples/apis-microservices.py).

Limits: The local model is a dictionary decision table, not gRPC or protobuf encoding. It omits HTTP/2 trailers, library differences, proxies, header limits, backoff/jitter, deadlines, authentication, localization, and sensitive-data review.

## Explore (remaining exploration time)

Change the status code, retry detail, and request idempotency. Watch the client choose retry, fix-input, or stop without parsing the message string.

Open apis-microservices.html for the executable model.

Model limits: The local model is a dictionary decision table, not gRPC or protobuf encoding. It omits HTTP/2 trailers, library differences, proxies, header limits, backoff/jitter, deadlines, authentication, localization, and sensitive-data review.

## Quiz (4 minutes)

1. What should client logic inspect first?
   - The canonical status code and recognized typed details
   - Words inside the English message
   - Server stack-trace lines

2. RetryInfo says 30 seconds, but the request is not idempotent. Safest default?
   - Do not retry automatically without an effect-safety design
   - Retry immediately twice
   - Ignore the status code

3. What is a boundary of rich gRPC errors?
   - Language and proxy support varies, and large trailers can hit limits
   - Every client must use protobuf
   - They replace observability

4. Which existing APIs force clients to parse error-message strings today?
5. For one retryable error, specify the canonical code, detail types, idempotency rule, and sensitive fields to exclude.

<details><summary>Answer key — attempt first</summary>

1. The canonical status code and recognized typed details. Codes and types form the machine contract.

2. Do not retry automatically without an effect-safety design. A delay does not make duplicate effects safe.

3. Language and proxy support varies, and large trailers can hit limits. The richer model is not uniformly supported or free.

</details>

## Sources

- [gRPC error handling guide](https://grpc.io/docs/guides/error/) — Official gRPC documentation; checked October 30, 2026; checked 2026-10-30.
- [Google RPC error details reference](https://cloud.google.com/apis/design/errors#error_payloads) — Official Google API design guidance; checked October 30, 2026; checked 2026-10-30.
- [google.rpc package reference](https://cloud.google.com/storage/docs/reference/rpc/google.rpc) — Official protobuf type reference; checked October 30, 2026; checked 2026-10-30.
