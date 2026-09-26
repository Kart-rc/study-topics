# Hedged requests: duplicate only the stragglers

Software engineering · Day6 · 15 minutes

Quantify how a delayed backup can cut tail latency while exposing the extra-load budget it spends.

## Recall (2 minutes)

<p><a href="../Day3/software-engineering.html">Day3: Fencing tokens: stop the worker whose lease already died</a></p><p>A has token 1, B&#x27;s token-2 write was accepted, then A resumes. What should the resource do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject token 1 as stale. The resource has already accepted token 2, so token 1 cannot be current.</p></details><p><a href="../Day5/software-engineering.html">Day5: Consistent hashing: move a slice, not the whole keyspace</a></p><p>Why does adding a node disrupt modulo sharding broadly?</p><details><summary>Recall first, then reveal the refresher</summary><p>The divisor changes, so many hash remainders change. Placement depends directly on node count, so changing it changes many assignments.</p></details>

## Understand (4 minutes)

A distributed request often completes when its slowest dependency finishes. A rare slow replica can therefore dominate user-visible tail latency even when median service time is healthy. A hedged request sends a backup only after the original has exceeded a delay threshold, then uses the first successful result and cancels or ignores the loser.

The threshold is the control surface. Too low, and nearly every request duplicates, raising load enough to create more stragglers. Too high, and the backup arrives too late to change the tail. The 2013 Google paper describes hedged requests as one of several tail-tolerance techniques; it does not make duplication free or safe for arbitrary side effects.



Original teaching case: Six read replicas would return in 40, 45, 50, 55, 80, and 900 ms. A backup takes 70 ms once launched. With a 100 ms hedge delay, only the 900 ms request duplicates and completes at 170 ms. Five ordinary requests stay single-shot.

completion = min(original, hedgeDelay + backupLatency)
extra request iff original > hedgeDelay

This is attractive for idempotent reads with independent replica slowdowns. It is dangerous if both attempts can charge a card, contend on the same bottleneck, share a correlated failure, or outlive cancellation. Production designs need idempotency, deadlines, admission control, per-cluster load budgets, outcome deduplication, and telemetry for hedge rate and winner rate.



## Explore (5 minutes)

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
