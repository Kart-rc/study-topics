# A queue buys time, not capacity

Software engineering · Day2 · 15 minutes

A worker can finish 100 events each second, but producers send 120.

## Recall (2 minutes)

<p><a href="../Day1/software-engineering.html">Day1: When retries multiply an outage</a></p><p>Four layers each allow two total attempts. Worst-case leaf calls?</p><details><summary>Recall first, then reveal the refresher</summary><p>16. The nested multiplication is 2⁴ = 16.</p></details>

## Understand (4 minutes)

A worker can finish 100 events each second, but producers send 120. A queue gives the worker somewhere to put the extra events. It does not make the worker faster.

Backlog grows by arrivals minus completed work. A bounded queue eventually rejects work if arrivals remain higher than service capacity. Backpressure means the producer actually slows down in response; rejection alone does not prove that happened.

Watch the visual: Where does work go when arrival rate exceeds service?



A 300-item queue fills in 15 seconds at a 20-item-per-second deficit. After arrivals drop to 80, only 20 slots per second are spare, so draining 300 items also takes 15 seconds.



## Read the visual

A bounded reservoir shows queued items on a fixed 300-item scale. For each elapsed second, completed work exits, excess waiting work fills the reservoir, and overflow becomes rejected work. With cooperation, excess offered work stays upstream instead. The conservation equation accounts for all offered items.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int arrivals = 120;
int service = 100;
int growth = arrivals - service;
int secondsToFill = 300 / growth;
arrivals = 80;
int secondsToDrain = 300 / (service - arrivals);
```

1. Events arrive each second.

   Changed values: `{"arrivals": "120"}`

2. The worker finishes 100 each second.

   Changed values: `{"service": "100"}`

3. Twenty events accumulate each second.

   Changed values: `{"growth": "20"}`

4. A 300-item buffer buys 15 seconds.

   Changed values: `{"secondsToFill": "15"}`

5. Producers slow down.

   Changed values: `{"arrivals": "80"}`

6. Only spare capacity drains the backlog: another 15 seconds.

   Changed values: `{"secondsToDrain": "15"}`

[Full runnable example](examples/software-engineering.java).

Limits: This equal-cost, constant-rate calculation assumes service continues and the queue starts empty. Bursts, variable work, scheduling, and retries change real queue behavior.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A queue separates arrival from execution. That helps absorb a burst, but cannot make a slower consumer sustain a faster producer forever. When work arrives faster than it finishes, something must grow, be rejected, or be slowed upstream.</p><p>Google's overload guidance emphasizes graceful resource limits and warns that requests per second can hide different per-request costs. A cheap metadata lookup and a large lineage traversal are not equal units of work. Measure the actual constrained resource before choosing an overload signal. <a href="https://sre.google/sre-book/handling-overload/">Google SRE: Handling Overload</a>.</p><p>The following calculator intentionally assumes equal-cost items so you can feel the conservation rule. You can then name exactly which assumption fails in production.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A lineage ingestion worker completes 100 equal-cost events per second. Producers send 120 per second. With an empty buffer, backlog grows by 20 each second. A 300-item queue fills after 15 seconds. Making the queue ten times bigger delays that moment; it does not remove the 20-item-per-second deficit.</p><p>At second 20, the bounded model has queued 300 items and rejected 100. Lower arrivals to 80 while keeping service at 100. Spare capacity is only 20, so clearing the 300-item backlog takes another 15 seconds. It is not 300 / 100 because new work continues arriving.</p><p>The recurrence shown by the controls is:</p><pre>work = backlog + arrivals
served = min(serviceCapacity, work)
waiting = work - served
rejected = max(0, waiting - bufferLimit)
backlog = min(bufferLimit, waiting)</pre><p>This model serves available work during each one-second bucket and caps waiting work at the bucket boundary. It is a conservation model, not a thread-pool implementation.</p><p>Now enable cooperative backpressure. We model a producer honoring a quota equal to consumer capacity. Rejections stop and existing backlog stops growing, but it does not drain until there is spare capacity. Real backpressure needs a feedback path and an upstream policy. A full queue that merely returns errors is load shedding, not proof that the producer slowed down. Retrying those errors aggressively can recreate Day1's amplification problem.</p><p>A Kafka log may retain backlog outside the worker, but storage retention and consumer lag still have limits. Decide explicitly whether upstream work waits, expires, is rejected, or enters a repair workflow. Do not silently discard business-critical events.</p>

</details>

## Explore (remaining exploration time)

Run 20 seconds at arrivals 120 and service 100. Predict backlog and rejects. Change arrivals to 80 and run 15 more seconds. Reset, enable cooperative backpressure, and repeat. Explain where the unadmitted work must go in a real system.

Open software-engineering.html for the executable model.

Model limits: Equal-cost deterministic items, one-second buckets, a fixed service rate and a bounded waiting buffer. Cooperative backpressure here is an ideal quota honored immediately by the producer; unadmitted demand is counted as deferred, not magically completed. No retries, jitter, CPU saturation curve, partition skew, persistent log, or message expiry are modeled.

## Quiz (4 minutes)

1. Backlog 300, arrivals 80/s, service 100/s. Ideal drain time?
   - 3 seconds
   - 15 seconds
   - It cannot drain

2. Why does a ten-times-larger buffer fail to fix sustained overload?
   - It increases processing capacity only briefly
   - The arrival/service deficit is unchanged
   - Large buffers always lose data

3. The server rejects excess work but clients retry immediately. Is backpressure established?
   - Yes, because the queue is bounded
   - Yes, because errors are visible
   - No; offered upstream load may increase

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 15 seconds. The drain rate is spare capacity: 100 − 80 = 20/s. 300 / 20 = 15 seconds.

2. The arrival/service deficit is unchanged. Buffer size changes how long accumulation can continue, not the sustained service rate.

3. No; offered upstream load may increase. Load shedding protects one boundary. Effective backpressure also requires upstream behavior to reduce or defer offered work.

</details>

## Sources

- [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/) — SRE book, 2016; online chapter; checked 2026-09-22.
