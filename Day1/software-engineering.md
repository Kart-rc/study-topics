# When retries multiply an outage

Software engineering · Day1 · 15 minutes

Calculate worst-case retry amplification and choose where a retry budget belongs.

## Recall (2 minutes)

No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.

## Understand (4 minutes)

A retry asks the same dependency to do more work. It helps when a transient failure clears; during overload it can make recovery harder. If several nested services independently retry, the deepest dependency can receive a multiplied number of attempts. Backoff spaces those attempts out; jitter spreads synchronized clients across time. Neither alone limits the total retry count. AWS on retry behavior.There is a second question: is replay safe? A timeout means the caller did not receive success; it does not prove the remote operation did nothing. For operations with side effects, an idempotency contract can distinguish a repeated request from new intent. AWS on idempotent APIs.

Original teaching case: An API calls a service, which calls a metadata adapter, which calls a throttled catalog. With three retrying layers and three total attempts at each layer, one user request can trigger 3 × 3 × 3 = 27 catalog attempts in the modeled worst case. At 100 original requests, that is 2,700 attempts.Suppose the catalog can recover if load falls below 500 requests per second. Adding retries everywhere moves the system in the opposite direction. A chosen retry owner, bounded attempts, deadlines, admission control, and a retry budget are candidate controls. The right owner needs enough context to recognize transient errors and enough time left to complete useful work.For an onboarding API that creates a dataset, also consider a lost response after successful creation. Retrying with a new identity may create a second dataset. A request token must remain stable for the same intended operation; parameter mismatch should be rejected rather than silently interpreted as a duplicate.

## Explore (5 minutes)

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
