# gRPC retries stop when response headers commit the RPC

APIs & Microservices · Day29 · 15 minutes

Place retryable failures before the commit point and make side effects safe.

## Recall (2 minutes)

<p><a href="../Day18/apis-microservices.html">Day18: 202 means accepted: give long-running work a status resource</a></p><p>POST returns 202. What may the client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The request was accepted; processing is incomplete. 202 is not a completion guarantee. The client needs a status observation to know the eventual outcome.</p></details><p><a href="../Day22/apis-microservices.html">Day22: One idempotency key, one create effect</a></p><p>Retry k-77 with the same payload. Correct outcome?</p><details><summary>Recall first, then reveal the refresher</summary><p>Return the stored result. The repeated intent maps to the original effect and response.</p></details>

## Understand (4 minutes)

A courier can try another route while the sealed delivery receipt is still blank. Once the recipient signs, the courier stops choosing routes and hands the outcome to you.

gRPC can buffer a call’s history and create a new attempt after eligible failures. But once the client receives response headers, the RPC is committed: gRPC stops automatic retry and gives control to the application.



Attempt 1 sends Reserve(order-42). If the transport closes with configured UNAVAILABLE before response headers, a policy may start attempt 2 after backoff. If headers arrive and the stream later fails, there is no automatic retry. The application must interpret the outcome. Because a server may have performed work before a failure is observed, use an idempotency key for side effects.



## Read the visual

The attempt timeline places the response-header commit point between “library may retry” and “application owns the outcome,” making a subtle protocol boundary visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use configured gRPC retries for transient failures on calls whose replay risk is understood and bounded.

**Practical example.** A reservation RPC briefly hits an unavailable replica before any response headers are returned.

**How to decide.** Set a realistic deadline, retry only appropriate status codes with bounded attempts/backoff, throttle retry storms, and use idempotency keys or read-only semantics. Do not retry FAILED_PRECONDITION until state is fixed.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
failure_point='before_headers'
retryable_status='UNAVAILABLE'
headers_received=failure_point=='after_headers'
policy={'UNAVAILABLE':True,'max_attempts':3}
retry=policy.get(retryable_status,False) and not headers_received
```

1. Attempt one fails before the commit point with an eligible status.

   Changed values: `{"failure_point": "before_headers", "retryable_status": "UNAVAILABLE"}`

2. No response headers have committed the RPC.

   Changed values: `{"headers_received": false}`

3. Apply a bounded explicit retry policy.

   Changed values: `{"policy": {"UNAVAILABLE": true, "max_attempts": 3}}`

4. The client may create a new attempt only before commitment.

   Changed values: `{"retry": true}`

[Full runnable example](examples/apis-microservices.py).

Limits: This browser ignores language-specific support, service-config delivery, pushback, throttling, jitter, hedging, streaming details, deadlines, and server-side execution races. It does not contact a gRPC server. Retry safety depends on method semantics and idempotency beyond the client library.

## Explore (remaining exploration time)

Move the failure before or after response headers. The attempt timeline shows whether gRPC may retry automatically.

Open apis-microservices.html for the executable model.

Model limits: This browser ignores language-specific support, service-config delivery, pushback, throttling, jitter, hedging, streaming details, deadlines, and server-side execution races. It does not contact a gRPC server. Retry safety depends on method semantics and idempotency beyond the client library.

## Quiz (4 minutes)

1. When does gRPC consider the RPC committed for retry purposes?
   - When response headers are received
   - When DNS resolves
   - When the client object is created

2. UNAVAILABLE occurs before headers and matches a configured policy. What may happen?
   - A new attempt after backoff
   - The method becomes read-only
   - Infinite retries by default

3. Which status should not be retried until state is fixed?
   - FAILED_PRECONDITION
   - UNAVAILABLE
   - OK

4. Which of your RPC methods are safe to replay, and what idempotency key protects side effects?
5. Which metrics distinguish original attempts, retry attempts, and application-level retries?

<details><summary>Answer key — attempt first</summary>

1. When response headers are received. After response headers, no further automatic retries are attempted.

2. A new attempt after backoff. The client may replace the failed call within policy limits.

3. FAILED_PRECONDITION. FAILED_PRECONDITION signals that explicit state repair is required first.

</details>

## Sources

- [gRPC retry guide](https://grpc.io/docs/guides/retry/) — Updated November 26, 2025; checked 2026-10-19.
- [gRPC status codes guide](https://grpc.io/docs/guides/status-codes/) — Updated August 21, 2024; checked 2026-10-19.
- [gRPC deadlines guide](https://grpc.io/docs/guides/deadlines/) — Updated July 7, 2025; checked 2026-10-19.
