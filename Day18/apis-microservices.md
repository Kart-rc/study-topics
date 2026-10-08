# 202 means accepted: give long-running work a status resource

APIs & Microservices · Day18 · 15 minutes

Distinguish accepting a request from successfully finishing its work.

## Recall (2 minutes)

<p><a href="../Day11/apis-microservices.html">Day11: Write the order form down: an OpenAPI request contract</a></p><p>A body contains only sku: MUG. Both required settings are present. What fails?</p><details><summary>Recall first, then reveal the refresher</summary><p>The required quantity field check. The body exists, so its presence check passes. The object lacks quantity. A properties declaration neither requires a field nor inserts a default.</p></details><p><a href="../Day15/apis-microservices.html">Day15: One clock across the call chain: gRPC deadlines</a></p><p>After 120 ms of a 500 ms deadline, what budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>380 ms remaining. The original end-to-end promise has 380 ms left.</p></details>

## Understand (4 minutes)

A dry cleaner gives you a receipt when you drop off a coat. The receipt means the coat was accepted, not that it is clean. An HTTP 202 Accepted response has the same limit: processing is incomplete and may later fail.

For an export that takes minutes, our API returns a job ID and a status URL. The client checks that resource. The status resource can return HTTP 200 because reading the status succeeded while its body says the export failed. Transport status and job state answer different questions.



POST /exports
→ 202 Accepted
Location: /jobs/J42
{"id":"J42","state":"queued","statusUrl":"/jobs/J42"}

GET /jobs/J42
→ 200 OK
{"id":"J42","state":"failed","error":"source_unavailable"}

The Location header and JSON shape are our API convention, not a universal 202 schema. A 202 response should help the client find a monitor, but HTTP cannot later turn that original response into a success or failure. The client needs another observation.



## Read the visual

The lifecycle branches into success and failure while the original acceptance response remains fixed. Status retrieval and job outcome are displayed separately.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when work takes longer than a comfortable synchronous request and the user can wait for a result.

**Practical example.** A data platform starts a large CSV export, returns J42, and later exposes a completed download or a durable failure reason.

**How to decide.** Prefer a normal synchronous response for fast bounded work. For asynchronous work define status retention, access checks, retry behavior and polling limits as part of the contract.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
job = {"id": "J42", "state": "queued"}
post_status = 202
job["state"] = "running"
get_status = 200
job["state"] = "failed"
job["error"] = "source_unavailable"
get_status = 200
```

1. Acceptance creates a job receipt; the result is not ready.

   Changed values: `{"job": {"id": "J42", "state": "queued"}, "post_status": 202}`

2. Reading the monitor succeeds while work remains incomplete.

   Changed values: `{"job": {"id": "J42", "state": "running"}, "get_status": 200}`

3. The monitor remains readable and explains the failure. The original POST status stays 202.

   Changed values: `{"job": {"id": "J42", "state": "failed", "error": "source_unavailable"}}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executed Python state dictionary, not an HTTP server. Header and body design are an original illustrative convention.

## Explore (remaining exploration time)

Watch J42 move from queued to running. Choose success or failure before advancing again. Compare the GET HTTP status with the job state.

Open apis-microservices.html for the executable model.

Model limits: The browser runs a local state machine with no server, durable queue or worker. It omits authentication, polling backoff, cancellation and idempotency. Retrying POST may create another job unless the API separately defines deduplication.

## Quiz (4 minutes)

1. POST returns 202. What may the client conclude?
   - The CSV exists
   - The request was accepted; processing is incomplete
   - The job cannot fail

2. GET /jobs/J42 returns 200 with state failed. Is that contradictory?
   - No; fetching status succeeded while the job failed
   - Yes, 200 always means the export succeeded
   - Yes, failures must erase the job

3. A POST response is lost and the client retries. Does 202 itself deduplicate requests?
   - Always
   - Only with a Location header
   - No; deduplication requires a separate API contract

4. Design a status response that lets the client distinguish retryable failure from completion.
5. How would you prevent another user from reading J42’s status or download?

<details><summary>Answer key — attempt first</summary>

1. The request was accepted; processing is incomplete. 202 is not a completion guarantee. The client needs a status observation to know the eventual outcome.

2. No; fetching status succeeded while the job failed. The GET operation and the background export are distinct. A readable failure status is useful API data.

3. No; deduplication requires a separate API contract. 202 defines response semantics, not idempotency. The API needs a separate identity and replay policy to avoid duplicate jobs.

</details>

## Sources

- [RFC 9110: HTTP Semantics, section 15.3.3](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.3.3) — 2022-06; checked 2026-10-08.
