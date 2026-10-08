# Save a few entry tickets: the token bucket

Software engineering · Day11 · 15 minutes

Allow a short burst while keeping the long-term arrival rate under control.

## Recall (2 minutes)

<p><a href="../Day3/software-engineering.html">Day3: Fencing tokens: stop the worker whose lease already died</a></p><p>A has token 1, B&#x27;s token-2 write was accepted, then A resumes. What should the resource do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject token 1 as stale. The resource has already accepted token 2, so token 1 cannot be current.</p></details><p><a href="../Day7/software-engineering.html">Day7: Deadline propagation: pass the remaining budget</a></p><p>A service spends 140 ms of a 500 ms deadline before a child call. What budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>360 ms. Propagation deducts elapsed time from the original end-to-end budget.</p></details>

## Understand (4 minutes)

A café can serve a small crowd that arrives together, but cannot accept an unlimited crowd forever. Give its door a jar of entry tickets. One admitted request takes one ticket. A clock adds tickets gradually, and the jar has a fixed capacity.

This is a token bucket. Capacity controls the burst; refill rate controls sustained admission. Empty means “try later.” It does not mean “add the request to a hidden queue.”

Our order service starts with three tickets and refills two per second. Five requests arrive at time zero. The first three enter. Two are refused. After half a second, one new ticket exists, so one more request can enter. Waiting ten seconds cannot grow the jar beyond three.



The Java trace follows the same five-request burst. It admits three, refuses two, waits half a second, and admits one more. Refused requests do not consume tickets. In the lab, an admitted request stays active until you explicitly finish it.

Try a slow backend: admit three, wait, then admit another three without finishing any. Six requests are now active even though the bucket worked correctly. Admission rate is not concurrency. A separate active-request limit may be needed to protect database connections.

AWS API Gateway uses this family of throttling algorithms, but documents its throttles as best-effort targets. This exact toy is not an account quota guarantee. A distributed implementation also needs coordinated state or a deliberate allowance for local bursts.



## Read the visual

Why can requests stay active while the ticket jar refills? Ticket slots and active-work count are separate ledgers. Time refills only the jar; finishing work clears only the active requests.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
double capacity = 3;
double rate = 2;
double tokens = capacity;
int admitted = 0;
int refused = 0;
for (int i = 0; i < 5; i++) {
  if (tokens >= 1) { tokens -= 1; admitted++; }
  else { refused++; }
}
double elapsed = 0.5;
tokens = Math.min(capacity, tokens + rate * elapsed);
if (tokens >= 1) { tokens -= 1; admitted++; }
tokens = Math.min(capacity, tokens + rate * 10);
```

1. Three entry tickets are ready. Refill will add two each second.

   Changed values: `{"capacity": "3.0", "rate": "2.0", "tokens": "3.0", "admitted": "0", "refused": "0"}`

2. The immediate burst consumes three tickets and refuses two requests.

   Changed values: `{"tokens": "0.0", "admitted": "3", "refused": "2"}`

3. Half a second adds exactly one ticket.

   Changed values: `{"tokens": "1.0", "elapsed": "0.5"}`

4. One new request spends that ticket. Four requests have entered in total.

   Changed values: `{"tokens": "0.0", "admitted": "4"}`

5. A long idle period refills only to the three-ticket cap.

   Changed values: `{"tokens": "3.0"}`

[Full runnable example](examples/software-engineering.java).

Limits: Single-threaded arithmetic model. Production code needs a monotonic clock, atomic state updates, and a distribution strategy. No AWS calls occur.

## Explore (remaining exploration time)

Send five requests immediately. Predict the admitted count. Wait 0.5 seconds and send one. Then build active work by waiting without finishing requests.

Open software-engineering.html for the executable model.

Model limits: One deterministic bucket, one clock, cost of one ticket per request, and atomic updates. No threads, cross-node coordination or retries. Active work is shown separately to reveal why rate limiting does not cap concurrency. AWS managed throttling is best effort, unlike this exact toy.

## Quiz (4 minutes)

1. Five requests arrive at time zero. After 0.5 seconds one more arrives. How many total are admitted?
   - 3
   - 4
   - 6

2. Why cap the jar at three?
   - To prevent idle time accumulating an unlimited burst
   - To cap active requests forever
   - To make every request equally fast

3. The backend slows down. Active requests keep rising despite correct token accounting. What is missing?
   - An infinite bucket
   - A faster retry loop
   - A limit on active work or another overload control

4. Explain why the safer choice works in this example.
5. Change one assumption. What would fail, and what evidence would reveal it?

<details><summary>Answer key — attempt first</summary>

1. 4. Three use the initial tickets. Half a second adds one ticket, so the sixth request enters. The two earlier refusals are not automatically queued.

2. To prevent idle time accumulating an unlimited burst. Capacity bounds saved admission credit. It does not finish old work or determine service duration, so it is not a concurrency or latency guarantee.

3. A limit on active work or another overload control. A rate limit regulates arrivals. Long-lived work can accumulate. More burst credit or aggressive retries can worsen that pressure.

</details>

## Sources

- [AWS API Gateway: HTTP API throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html) — Living official documentation; publication date not shown; checked 2026-10-01.
