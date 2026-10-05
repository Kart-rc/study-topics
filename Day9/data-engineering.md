# Kafka's consumer protocol: reassign incrementally, not behind a global barrier

Data engineering · Day9 · 15 minutes

One consumer restarts.

## Recall (2 minutes)

<p><a href="../Day7/data-engineering.html">Day7: Spark Real-Time Mode: eligibility before milliseconds</a></p><p>A Spark 4.1 query adds a keyed rolling count. What should happen before tuning its RTM epoch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Confirm that the stateful graph is supported; otherwise choose another path. Execution-mode eligibility is a correctness constraint, not a latency knob.</p></details><p><a href="../Day2/data-engineering.html">Day2: Watermarks: when can a window be forgotten?</a></p><p>With max event time 12 and delay 5, what watermark is used in this model&#x27;s next batch?</p><details><summary>Recall first, then reveal the refresher</summary><p>7. Subtract the allowed delay from the prior maximum: 12 − 5 = 7.</p></details>

## Understand (4 minutes)

One consumer restarts. Should every partition stop while ownership is reorganized, or can the unaffected partitions keep moving?

Kafka’s newer consumer protocol moves group coordination toward broker-managed incremental assignment. The important idea is smaller disruption: transfer the ownership that must change while other work continues. This does not mean no pauses or that every older assignor always stops everything.



Our deliberately contrasting models use 24 partitions and a two-second pause. Stopping all partitions costs 48 partition-seconds. Moving only one consumer’s four partitions costs eight. These are exposure comparisons, not Kafka latency predictions.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
partitions = 24; moved = 4; pause_seconds = 2
barrier_exposure = partitions * pause_seconds
incremental_exposure = moved * pause_seconds
unaffected = partitions - moved
reduction_percent = 100 * (barrier_exposure - incremental_exposure) / barrier_exposure
```

1. Define the two contrasting coordination scopes.

   Changed values: `{"partitions": 24, "moved": 4, "pause_seconds": 2}`

2. A full-group barrier costs 48 partition-seconds.

   Changed values: `{"barrier_exposure": 48}`

3. The affected subset costs eight partition-seconds.

   Changed values: `{"incremental_exposure": 8}`

4. Twenty partitions can keep processing in the toy.

   Changed values: `{"unaffected": 20}`

5. The arithmetic isolates scope, not actual speed.

   Changed values: `{"reduction_percent": 83.33333333333333}`

[Full runnable example](examples/data-engineering.py).

Limits: The barrier comparison is not a claim about every classic Kafka group or cooperative assignor. Real migration requires checking client/broker settings, supported assignors, warm-up, and per-partition behavior.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>The classic Kafka consumer group protocol coordinates membership and assignment through a client leader. A membership change can force a synchronized rebalance: consumers revoke partitions, assignment is recomputed, and useful work pauses while the group converges. KIP-848 moves coordination and assignment into the broker and makes reconciliation incremental. Each member can continue processing partitions that are not moving while only the affected ownership changes.</p><p>The new <code>consumer</code> protocol is generally available from Kafka 4.0 and is enabled client-side with <code>group.protocol=consumer</code>. The broker now controls heartbeat and session timing, and the server chooses supported assignors. Several familiar client settings no longer apply. That is an operational contract change, not just a faster implementation.</p><p><strong>Leadership implication:</strong> model the unit of disruption. Global barriers couple one slow or restarting member to the entire group; incremental reconciliation narrows the blast radius. But warm caches, state transfer, revoked partitions, broker capacity, client compatibility, and bad deployment waves can still create lag. Measure per-partition pause and convergence, not only average group throughput.</p><h3>Original detailed example</h3><p><strong>Worked example:</strong> A 24-partition group has six consumers, four partitions each. One member restarts. Suppose revoking and warming each moved partition costs 2 seconds. A barrier-style toy pauses all 24 partitions for the 2-second convergence window: 48 partition-seconds of unavailable processing. An incremental toy moves only the restarting member's four partitions: 8 partition-seconds.</p><pre>barrier exposure = 24 partitions × 2 s = 48 partition-seconds
incremental exposure = 4 partitions × 2 s = 8 partition-seconds</pre><p>This is not a Kafka latency formula. It isolates the coordination effect. In a real group, assignment strategy, cooperative handoff, state restoration, poll behavior, heartbeats, static membership, and broker load determine what users see.</p>

</details>

## Explore (remaining exploration time)

Choose group size, partitions per member, affected members, and warm-up time. Predict the partition-seconds exposed under a group-wide barrier and an incremental handoff, then explain which remaining bottleneck the protocol cannot remove.

Open data-engineering.html for the executable model.

Model limits: A disruption-area calculator, not a Kafka simulator. It assumes evenly assigned partitions, a single fixed warm-up interval, and no overlapping failures. It omits assignor details, cooperative ownership transfer, heartbeats, poll timeouts, static membership, rack awareness, broker failover, state stores, skew, and client-version constraints. Lower modeled exposure does not guarantee a lag-free migration.

## Quiz (4 minutes)

1. One member changes in a large group. What is the core advantage of incremental reconciliation?
   - Every partition is revoked faster
   - Partitions whose ownership is unchanged can continue processing
   - Heartbeats are no longer required

2. What changes when a client selects group.protocol=consumer?
   - The broker controls heartbeat/session timing and supported assignment behavior
   - Kafka becomes exactly-once for every sink
   - Consumer lag can no longer occur

3. Which measurement best tests the model's boundary during rollout?
   - Only average records per second
   - Per-partition processing pauses and convergence time across client versions
   - Only the number of topics

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Partitions whose ownership is unchanged can continue processing. The protocol narrows disruption to ownership that must move instead of imposing a group-wide synchronization barrier.

2. The broker controls heartbeat/session timing and supported assignment behavior. KIP-848 moves key coordination policy server-side; it does not change end-to-end delivery semantics.

3. Per-partition processing pauses and convergence time across client versions. An average can hide long pauses on the small subset of partitions that actually move.

</details>

## Sources

- [Apache Kafka 4.1 documentation: Consumer Rebalance Protocol](https://kafka.apache.org/41/operations/consumer-rebalance-protocol/) — Living versioned documentation; page last modified 2025-12-19; checked 2026-09-29.
- [Apache Kafka 4.0.0 release announcement](https://kafka.apache.org/blog/2025/03/18/apache-kafka-4.0.0-release-announcement/) — Published 2025-03-18; checked 2026-09-29.
- [KIP-848: The Next Generation of the Consumer Rebalance Protocol](https://cwiki.apache.org/confluence/display/KAFKA/KIP-848%3A+The+Next+Generation+of+the+Consumer+Rebalance+Protocol) — Accepted Apache Kafka improvement proposal; living design page; checked 2026-09-29.
