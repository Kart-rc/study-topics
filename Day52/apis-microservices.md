# Retry-After says when—not whether a replay is safe

APIs & Microservices · Day52 · 15 minutes

Use Retry-After as scheduling guidance while keeping replay safety tied to HTTP method and application idempotency.

## Recall (2 minutes)

<p><a href="../Day35/apis-microservices.html">Day35: If-Match turns a stale write into 412, not a lost update</a></p><p>Alice writes v8 before Bob sends If-Match v7. What should the origin server do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject the stale change, commonly with 412. The false precondition prevents the method from being applied.</p></details><p><a href="../Day23/apis-microservices.html">Day23: Deprecated is a warning; Sunset is the shutdown date</a></p><p>What does Deprecation communicate?</p><details><summary>Recall first, then reveal the refresher</summary><p>The resource is discouraged now or from a stated time. Deprecation and shutdown time are separate signals.</p></details>

## Understand (4 minutes)

A shop sign saying “back in 10 minutes” tells you when to return. It does not say the cashier forgot the payment you already made.

Retry-After can tell a client how long to wait, notably with 503 and optionally 429. It does not make a non-idempotent operation safe to replay. A POST that might already have created an order still needs an idempotency key, a status lookup, or human reconciliation.



POST /orders with key k-52 receives 503 Retry-After: 30. The client waits 30 seconds and retries with the same key. The server returns the stored result if the first attempt committed. Without the key, waiting changes timing but not duplicate risk.



## Read the visual

A response splits into two independent decisions: a countdown controls when, while method and idempotency state control whether replay is safe.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use Retry-After when overload, maintenance, or rate limiting has a meaningful recovery horizon that clients should respect.

**Practical example.** An order API sheds load with 503 and asks SDK clients to wait 30 seconds before a bounded retry.

**How to decide.** Retry safe/idempotent methods according to policy. For POST or side-effecting calls, require an idempotency contract or status reconciliation. Add jitter, deadlines, attempt limits, and a retry budget; never let every client wake simultaneously.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
first={'method':'POST','key':'k-52','status':503,'retry_after_s':30,'effect_committed':True}
waited_s=first['retry_after_s']; retry={'method':'POST','key':first['key']}
store={'k-52':'order-52'}; response=store.get(retry['key'])
result={'waited_s':waited_s,'response':response,'new_order_created':False,'header_proved_safety':False}
```

1. Model an ambiguous create response with a timing hint.

   Changed values: `{"first": {"method": "POST", "key": "k-52", "status": 503, "retry_after_s": 30, "effect_committed": true}}`

2. Wait and preserve the same application intent key.

   Changed values: `{"waited_s": 30, "retry": {"method": "POST", "key": "k-52"}}`

3. The server resolves the repeated intent to its stored result.

   Changed values: `{"store": {"k-52": "order-52"}, "response": "order-52"}`

4. Replay safety comes from the idempotency contract, not the header.

   Changed values: `{"result": {"waited_s": 30, "response": "order-52", "new_order_created": false, "header_proved_safety": false}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model uses deterministic counters. It does not send HTTP, parse dates, compensate for clock skew, implement rate limits, add jitter, coordinate clients, enforce idempotency storage, model ambiguous transport failures, or guarantee that an upstream recovers on time.

## Explore (remaining exploration time)

Choose method, idempotency key, and response. Predict whether the client should wait, retry, reconcile, or stop.

Open apis-microservices.html for the executable model.

Model limits: The model uses deterministic counters. It does not send HTTP, parse dates, compensate for clock skew, implement rate limits, add jitter, coordinate clients, enforce idempotency storage, model ambiguous transport failures, or guarantee that an upstream recovers on time.

## Quiz (4 minutes)

1. POST /orders without an idempotency key receives Retry-After: 30. What is known?
   - When the server suggests retrying, not whether the first attempt committed
   - That replay cannot duplicate
   - That the server rolled back the first attempt

2. Why reuse k-52 on retry?
   - The server can map repeated intent to the original stored result
   - It makes TCP exactly-once
   - It bypasses authentication

3. What prevents a retry storm?
   - Jitter, attempt limits, deadlines, and a retry budget
   - Retry-After alone in every client
   - Converting every error to 200

4. Which POST retry path currently treats Retry-After as duplicate protection?
5. Where is the idempotency record stored, and how long must it outlive client retries?

<details><summary>Answer key — attempt first</summary>

1. When the server suggests retrying, not whether the first attempt committed. Retry-After is timing guidance, not an application-effect guarantee.

2. The server can map repeated intent to the original stored result. A stable idempotency key protects the named create effect when the server implements it.

3. Jitter, attempt limits, deadlines, and a retry budget. Clients still need bounded, desynchronized retry policy.

</details>

## Sources

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) — IETF standard; published June 2022; checked November 12, 2026; checked 2026-11-12.
- [RFC 6585: Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585.html) — IETF standard defining 429; published April 2012; checked November 12, 2026; checked 2026-11-12.
