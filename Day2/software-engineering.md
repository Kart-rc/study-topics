# A queue buys time, not capacity

Software engineering · Day2 · 15 minutes

Predict queue growth and drain time, then distinguish a buffer, load shedding, and genuine upstream backpressure.

## Recall (2 minutes)

<p><a href="../Day1/software-engineering.html">Day1: When retries multiply an outage</a></p><p>Four layers each allow two total attempts. Worst-case leaf calls?</p><details><summary>Recall first, then reveal the refresher</summary><p>16. The nested multiplication is 2⁴ = 16.</p></details>

## Understand (4 minutes)

A queue separates arrival from execution. That helps absorb a burst, but cannot make a slower consumer sustain a faster producer forever. When work arrives faster than it finishes, something must grow, be rejected, or be slowed upstream.

Google's overload guidance emphasizes graceful resource limits and warns that requests per second can hide different per-request costs. A cheap metadata lookup and a large lineage traversal are not equal units of work. Measure the actual constrained resource before choosing an overload signal. Google SRE: Handling Overload.

The following calculator intentionally assumes equal-cost items so you can feel the conservation rule. You can then name exactly which assumption fails in production.



Original teaching case: A lineage ingestion worker completes 100 equal-cost events per second. Producers send 120 per second. With an empty buffer, backlog grows by 20 each second. A 300-item queue fills after 15 seconds. Making the queue ten times bigger delays that moment; it does not remove the 20-item-per-second deficit.

At second 20, the bounded model has queued 300 items and rejected 100. Lower arrivals to 80 while keeping service at 100. Spare capacity is only 20, so clearing the 300-item backlog takes another 15 seconds. It is not 300 / 100 because new work continues arriving.

The recurrence shown by the controls is:

work = backlog + arrivals
served = min(serviceCapacity, work)
waiting = work - served
rejected = max(0, waiting - bufferLimit)
backlog = min(bufferLimit, waiting)

This model serves available work during each one-second bucket and caps waiting work at the bucket boundary. It is a conservation model, not a thread-pool implementation.

Now enable cooperative backpressure. We model a producer honoring a quota equal to consumer capacity. Rejections stop and existing backlog stops growing, but it does not drain until there is spare capacity. Real backpressure needs a feedback path and an upstream policy. A full queue that merely returns errors is load shedding, not proof that the producer slowed down. Retrying those errors aggressively can recreate Day1's amplification problem.

A Kafka log may retain backlog outside the worker, but storage retention and consumer lag still have limits. Decide explicitly whether upstream work waits, expires, is rejected, or enters a repair workflow. Do not silently discard business-critical events.



## Explore (5 minutes)

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
