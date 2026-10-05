# When retries multiply an outage

Software engineering · Day1 · 15 minutes

A failed request can trigger a second request.

## Recall (2 minutes)

<p>No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.</p>

## Understand (4 minutes)

A failed request can trigger a second request. If every service in a call chain retries, one user action can create many calls at the bottom of the chain.

Count total attempts, including the first call. Three layers allowing three attempts each can produce 3 × 3 × 3 = 27 attempts at the deepest service. Waiting between attempts helps timing; it does not reduce this worst-case count. Choose a retry owner and a total budget.



For 100 user requests, the nested policy can produce 2,700 catalog calls. If only one layer retries three times and the others try once, the same worst-case calculation gives 300. Both are upper bounds, not predictions of everyday traffic.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int userRequests = 100;
int apiAttempts = 3;
int serviceAttempts = 3;
int adapterAttempts = 3;
int catalogCalls = userRequests * apiAttempts * serviceAttempts * adapterAttempts;
int oneOwnerCalls = userRequests * 3;
```

1. Start with 100 original requests.

   Changed values: `{"userRequests": "100"}`

2. The API permits three total attempts.

   Changed values: `{"apiAttempts": "3"}`

3. The next layer also retries.

   Changed values: `{"serviceAttempts": "3"}`

4. The final layer also retries.

   Changed values: `{"adapterAttempts": "3"}`

5. The nested upper bound is 2,700 calls.

   Changed values: `{"catalogCalls": "2700"}`

6. One retry owner reduces this upper bound to 300.

   Changed values: `{"oneOwnerCalls": "300"}`

[Full runnable example](examples/software-engineering.java).

Limits: This Java arithmetic assumes every nested call exhausts all attempts. It does not implement backoff, deadlines, or side effects. Retrying a write also requires a stable request identity and duplicate protection.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A retry asks the same dependency to do more work. It helps when a transient failure clears; during overload it can make recovery harder. If several nested services independently retry, the deepest dependency can receive a multiplied number of attempts. Backoff spaces those attempts out; jitter spreads synchronized clients across time. Neither alone limits the total retry count. <a href="https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/">AWS on retry behavior</a>.</p><p>There is a second question: is replay safe? A timeout means the caller did not receive success; it does not prove the remote operation did nothing. For operations with side effects, an idempotency contract can distinguish a repeated request from new intent. <a href="https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/">AWS on idempotent APIs</a>.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> An API calls a service, which calls a metadata adapter, which calls a throttled catalog. With three retrying layers and three total attempts at each layer, one user request can trigger 3 × 3 × 3 = 27 catalog attempts in the modeled worst case. At 100 original requests, that is 2,700 attempts.</p><p>Suppose the catalog can recover if load falls below 500 requests per second. Adding retries everywhere moves the system in the opposite direction. A chosen retry owner, bounded attempts, deadlines, admission control, and a retry budget are candidate controls. The right owner needs enough context to recognize transient errors and enough time left to complete useful work.</p><p>For an onboarding API that creates a dataset, also consider a lost response after successful creation. Retrying with a new identity may create a second dataset. A request token must remain stable for the same intended operation; parameter mismatch should be rejected rather than silently interpreted as a duplicate.</p>

</details>

## Explore (remaining exploration time)

Set layers to 3 and attempts to 3. Predict the result, then compare with a single retry owner. Explain why adding jitter changes timing but not this worst-case count. Write one error you would retry and one you would fail immediately; justify both using the operation contract.

Open software-engineering.html for the executable model.

Model limits: This computes a worst-case count when every downstream attempt fails and each parent repeats its full child work. It omits time, successes, circuit breakers, queueing, cancellation propagation, and correlated failures. Counts are not a latency forecast.

## Quiz (4 minutes)

1. Four layers each allow two total attempts. Worst-case leaf calls?
   - 8
   - 16
   - 6

2. A create request times out. What is established?
   - Creation failed
   - No side effect occurred
   - Caller lacks confirmation

3. Jitter is enabled. What still needs a bound?
   - Total retries and deadline
   - Only log size
   - Nothing

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 16. The nested multiplication is 2⁴ = 16.

2. Caller lacks confirmation. The remote side effect may already have happened. Query status or retry using the operation’s idempotency contract.

3. Total retries and deadline. Jitter spreads attempts; it does not impose a total work or time budget.

</details>

## Sources

- [AWS retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) — Undated living article; checked 2026-09-21.
- [AWS idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) — Undated living article; checked 2026-09-21.
