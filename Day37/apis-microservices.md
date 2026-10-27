# 202 Accepted means queued, not completed

APIs & Microservices · Day37 · 15 minutes

Return an explicit status monitor for asynchronous work and make clients handle eventual failure instead of treating 202 as business success.

## Recall (2 minutes)

<p><a href="../Day22/apis-microservices.html">Day22: One idempotency key, one create effect</a></p><p>Retry k-77 with the same payload. Correct outcome?</p><details><summary>Recall first, then reveal the refresher</summary><p>Return the stored result. The repeated intent maps to the original effect and response.</p></details><p><a href="../Day26/apis-microservices.html">Day26: Budget GraphQL breadth before nested lists multiply</a></p><p>10 repos × 10 issues × 10 comments produces how many comment nodes?</p><details><summary>Recall first, then reveal the refresher</summary><p>1000. Nested list widths multiply.</p></details>

## Understand (4 minutes)

A repair shop says, “We accepted your car.” That does not mean the repair passed inspection.

HTTP 202 Accepted means processing was accepted but has not completed and might not ultimately happen. RFC 9110 says the response ought to describe current status and point to or embed a status monitor.



POST /exports returns 202 with job exp-42 and /exports/exp-42. The worker later moves it from queued to running to succeeded or failed. The client polls the monitor and downloads only after success.



## Read the visual

The request, monitor, and client-action states make 202's non-final nature visible. Only the succeeded branch turns the download action green; failed is a first-class terminal outcome.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use 202 when work cannot finish within the request latency budget and completion will happen in a separate worker or batch process.

**Practical example.** A user starts a 200 GB governed export, backfill, model build, or cross-region copy that may take minutes.

**How to decide.** Use synchronous 200/201 when work is complete. For 202, return a durable job identity, status monitor, failure details, retry guidance, and idempotent submission behavior. Do not use 202 merely to hide overload.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
response = {'status': 202, 'job_id': 'exp-42', 'monitor': '/exports/exp-42'}
job_state = 'queued'
job_state = 'running'
job_state = 'succeeded'; client_action = 'download result'
```

1. Accept work and identify its monitor.

   Changed values: `{"response": {"status": 202, "job_id": "exp-42", "monitor": "/exports/exp-42"}}`

2. The business operation is not complete.

   Changed values: `{"job_state": "queued"}`

3. A worker starts the asynchronous operation.

   Changed values: `{"job_state": "running"}`

4. Only the terminal success enables download.

   Changed values: `{"job_state": "succeeded", "client_action": "download result"}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model uses one in-memory job. It does not run HTTP, define a standard status-monitor header, persist jobs, authenticate monitor access, guarantee delivery, model webhooks, retries, cancellation, expiry, idempotency keys, rate limits, or RFC-compliant response bodies.

## Explore (remaining exploration time)

Move exp-42 through queued, running, failed, and succeeded. Watch which client action is safe at each state.

Open apis-microservices.html for the executable model.

Model limits: The model uses one in-memory job. It does not run HTTP, define a standard status-monitor header, persist jobs, authenticate monitor access, guarantee delivery, model webhooks, retries, cancellation, expiry, idempotency keys, rate limits, or RFC-compliant response bodies.

## Quiz (4 minutes)

1. Server returns 202 for exp-42. What can the client claim?
   - The request was accepted for processing, not that the export succeeded
   - The file is complete
   - The worker cannot reject it later

2. What should the response provide?
   - A durable status description and link or identifier for a monitor
   - Only a cheerful message
   - A 201 Location for a completed file

3. When should the client download?
   - Only after the monitor reaches succeeded
   - Immediately after 202
   - Whenever queued lasts ten seconds

4. Which APIs currently return 202 without a durable monitor or explicit failure state?
5. How will clients safely retry the initial submission without creating a second job?

<details><summary>Answer key — attempt first</summary>

1. The request was accepted for processing, not that the export succeeded. 202 is intentionally noncommittal.

2. A durable status description and link or identifier for a monitor. The client needs a way to observe later outcome.

3. Only after the monitor reaches succeeded. Business completion is a later state.

</details>

## Sources

- [RFC 9110: 202 Accepted](https://www.rfc-editor.org/rfc/rfc9110.html#name-202-accepted) — Internet standard; published June 2022; checked 2026-10-27.
- [RFC 9110: 201 Created](https://www.rfc-editor.org/rfc/rfc9110.html#name-201-created) — Internet standard; published June 2022; checked 2026-10-27.
