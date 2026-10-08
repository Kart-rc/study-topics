# Hedged requests: duplicate only the stragglers

Software engineering · Day6 · 15 minutes

Five reads finish quickly; one takes 900 milliseconds.

## Recall (2 minutes)

<p><a href="../Day3/software-engineering.html">Day3: Fencing tokens: stop the worker whose lease already died</a></p><p>A has token 1, B&#x27;s token-2 write was accepted, then A resumes. What should the resource do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject token 1 as stale. The resource has already accepted token 2, so token 1 cannot be current.</p></details><p><a href="../Day5/software-engineering.html">Day5: Consistent hashing: move a slice, not the whole keyspace</a></p><p>Why does adding a node disrupt modulo sharding broadly?</p><details><summary>Recall first, then reveal the refresher</summary><p>The divisor changes, so many hash remainders change. Placement depends directly on node count, so changing it changes many assignments.</p></details>

## Understand (4 minutes)

Five reads finish quickly; one takes 900 milliseconds. Waiting for the slowest replica makes the user experience worse.

A hedged request starts a backup only when the first request is still pending after a delay. The first usable result wins. This can reduce long waits, but the duplicate work consumes capacity and may hit the same bottleneck.



The original read takes 900 ms. Start the backup at 100 ms; it takes another 70 ms. The result arrives at 170 ms. A normal 50 ms read finishes before the hedge is launched.



## Read the visual

All six request timelines share a 1000 ms scale. An original starts at zero. Only requests unfinished at the hedge delay launch a backup. The finish marker is the first usable response; the other attempt is wasted or cancelled.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int originalMs = 900;
int hedgeDelayMs = 100;
int backupMs = 70;
boolean launchBackup = originalMs > hedgeDelayMs;
int completionMs = Math.min(originalMs, hedgeDelayMs + backupMs);
boolean hedgeNormalRead = 50 > hedgeDelayMs;
```

1. The original read is a straggler.

   Changed values: `{"originalMs": "900"}`

2. Wait before creating extra work.

   Changed values: `{"hedgeDelayMs": "100"}`

3. The backup’s runtime starts after launch.

   Changed values: `{"backupMs": "70"}`

4. Only the straggler triggers a backup.

   Changed values: `{"launchBackup": "true"}`

5. The backup wins at 170 ms.

   Changed values: `{"completionMs": "170"}`

6. A 50 ms read does not duplicate.

   Changed values: `{"hedgeNormalRead": "false"}`

[Full runnable example](examples/software-engineering.java).

Limits: This uses fixed independent latencies and does not cancel real work. Hedging state-changing operations can duplicate effects. Even canceled read requests may keep consuming resources.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A distributed request often completes when its slowest dependency finishes. A rare slow replica can therefore dominate user-visible tail latency even when median service time is healthy. A hedged request sends a backup only after the original has exceeded a delay threshold, then uses the first successful result and cancels or ignores the loser.</p><p>The threshold is the control surface. Too low, and nearly every request duplicates, raising load enough to create more stragglers. Too high, and the backup arrives too late to change the tail. The 2013 Google paper describes hedged requests as one of several tail-tolerance techniques; it does not make duplication free or safe for arbitrary side effects.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> Six read replicas would return in 40, 45, 50, 55, 80, and 900 ms. A backup takes 70 ms once launched. With a 100 ms hedge delay, only the 900 ms request duplicates and completes at 170 ms. Five ordinary requests stay single-shot.</p><pre>completion = min(original, hedgeDelay + backupLatency)
extra request iff original &gt; hedgeDelay</pre><p>This is attractive for idempotent reads with independent replica slowdowns. It is dangerous if both attempts can charge a card, contend on the same bottleneck, share a correlated failure, or outlive cancellation. Production designs need idempotency, deadlines, admission control, per-cluster load budgets, outcome deduplication, and telemetry for hedge rate and winner rate.</p>

</details>

## Explore (remaining exploration time)

Predict the maximum completion time at a 100 ms threshold. Lower the threshold to 50 ms, then decide whether the saved milliseconds justify the new duplicate rate.

Open software-engineering.html for the executable model.

Model limits: Six deterministic original latencies and one constant backup latency. It omits random distributions, correlated replicas, queues, cancellation delay, retries, failures, deadlines, request fan-out, network cost, idempotency, server-side deduplication, and the feedback loop by which extra traffic changes latency.

## Quiz (4 minutes)

1. Why delay a hedge instead of sending two copies immediately?
   - To target stragglers and limit extra load
   - To make writes idempotent
   - To remove deadlines

2. With a 100 ms delay and a 70 ms backup, what happens to a 900 ms original in the toy model?
   - It completes at 70 ms
   - It completes at 170 ms
   - It must wait 900 ms

3. When can hedging worsen the very tail it is meant to reduce?
   - When extra attempts increase load on the same constrained system
   - When all requests are reads
   - When metrics include percentiles

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. To target stragglers and limit extra load. The delay lets ordinary requests finish without paying for a duplicate.

2. It completes at 170 ms. The backup starts at 100 ms and takes another 70 ms.

3. When extra attempts increase load on the same constrained system. Unbudgeted duplication can deepen queues and create a feedback loop.

</details>

## Sources

- [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/) — Published in Communications of the ACM 56, 2013, pp. 74–80; checked 2026-09-26.
