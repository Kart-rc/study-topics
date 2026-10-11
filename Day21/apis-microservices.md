# Retry-After is a floor, not a synchronized alarm clock

APIs & Microservices · Day21 · 15 minutes

Use 429/503 plus Retry-After to slow clients without creating a retry herd or duplicating unsafe work.

## Recall (2 minutes)

<p><a href="../Day13/apis-microservices.html">Day13: Add, migrate, remove: evolve an API field safely</a></p><p>Why does replacing name with display_name break an old v1 client?</p><details><summary>Recall first, then reveal the refresher</summary><p>The client still reads name, which disappeared. A rename is remove-plus-add. The old client&#x27;s expected field is gone.</p></details><p><a href="../Day17/apis-microservices.html">Day17: Keyset pagination: continue after a row, not a position</a></p><p>After page A,B and insertion of X before A, what does OFFSET 2 return?</p><details><summary>Recall first, then reveal the refresher</summary><p>B,C. Positions shift. B becomes third and is returned again.</p></details>

## Understand (4 minutes)

A crowded café asks customers to return after three minutes. If everyone sets the same alarm, the doorway floods again at exactly minute three.

Retry-After tells a client how long it ought to wait before a follow-up request. A robust client respects that minimum, then may add bounded jitter so many clients do not synchronize.



Five clients receive 429 Too Many Requests and Retry-After: 3. Immediate retry sends five more requests at second 1. Exact retry moves all five to second 3. Respecting the three-second floor and adding bounded jitter spreads them across seconds 3–5.

Timing does not make a non-idempotent payment safe to repeat. Retry permission and operation semantics are separate decisions.



## Read the visual

The timeline keeps the same five clients and moves only their retry markers, so the peak at each second is directly visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when an API enforces quotas or is temporarily unavailable and clients can retry safely.

**Practical example.** An ingestion API returns 429 with Retry-After: 3; SDK clients wait at least three seconds and add bounded jitter.

**How to decide.** Retry safe/idempotent operations within a deadline. Require an idempotency mechanism or explicit status lookup before repeating side-effecting requests.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
retry_after=3
client_jitter=[0,0,1,1,2]
retry_times=[retry_after+j for j in client_jitter]
peak=max(retry_times.count(t) for t in set(retry_times))
earliest=min(retry_times)
```

1. Record the server floor and bounded client jitter.

   Changed values: `{"retry_after": 3, "client_jitter": [0, 0, 1, 1, 2]}`

2. Schedule no request before the floor.

   Changed values: `{"retry_times": [3, 3, 4, 4, 5]}`

3. Measure concentration and compliance.

   Changed values: `{"peak": 2, "earliest": 3}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executed local Python scheduling arithmetic. It did not send HTTP requests or model network delay, clock skew, or server recovery.

## Explore (remaining exploration time)

Compare immediate, exact, and jittered schedules for five clients. Notice load concentration and the earliest retry.

Open apis-microservices.html for the executable model.

Model limits: The teaching schedule uses whole seconds and fixed jitter. Real clients must parse HTTP-date or delay-seconds, account for clocks and deadlines, cap attempts, and observe operation semantics.

## Quiz (4 minutes)

1. Retry-After: 3. Is a retry at second 1 compliant with the advice?
   - Yes
   - No
   - Only for POST

2. Why add jitter after the floor?
   - To retry earlier
   - To spread synchronized clients
   - To make POST idempotent

3. What must be decided separately?
   - Whether repeating the operation is safe
   - Whether 3 is an integer
   - Whether HTTP has headers

4. Which operations in your API are safe to retry after 429?
5. Where should the client’s total deadline cap Retry-After and backoff?

<details><summary>Answer key — attempt first</summary>

1. No. The field asks the client to wait.

2. To spread synchronized clients. Jitter reduces the retry herd; it does not change method semantics.

3. Whether repeating the operation is safe. Timing and idempotency are different boundaries.

</details>

## Sources

- [RFC 9110 §10.2.3 Retry-After](https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.3) — Published 2022-06; checked 2026-10-11.
- [RFC 6585 §4 429 Too Many Requests](https://www.rfc-editor.org/rfc/rfc6585.html#section-4) — Published 2012-04; checked 2026-10-11.
