# Spark Real-Time Mode: eligibility before milliseconds

Data engineering · Day7 · 15 minutes

Decide when Structured Streaming Real-Time Mode changes the latency floor—and when query shape makes it the wrong execution mode.

## Recall (2 minutes)

<p><a href="../Day4/data-engineering.html">Day4: Kafka transactions: make the output and offset one decision</a></p><p>The worker writes output, crashes before committing its input offset, then restarts without a transaction. What is likely?</p><details><summary>Recall first, then reveal the refresher</summary><p>The input is processed again and the output can duplicate. The committed position still points to the input, while the first output already exists.</p></details><p><a href="../Day6/data-engineering.html">Day6: Kafka tiered storage: retention is not local disk</a></p><p>A consumer rewinds 24 hours while local retention is six hours and overall retention is seven days. Where is the segment in this model?</p><details><summary>Recall first, then reveal the refresher</summary><p>Remote tier. The offset remains within overall retention but lies beyond the local hot window.</p></details>

## Understand (4 minutes)

Traditional Structured Streaming repeatedly plans and executes micro-batches. Making the trigger smaller can reduce batching delay, but scheduler and coordination work become a larger fraction of every batch. Spark 4.1 introduces Real-Time Mode (RTM), a different execution path for continuous, sub-second processing; the release describes first official support for Scala stateless workloads.

The architectural question comes before the trigger value: is the query inside the supported surface? Spark 4.1 documents an allowlist and rejects unsupported sources, operators, or sinks; its error catalog also says async progress tracking is unsupported. Stateful aggregation, stream-stream joins, and arbitrary state are not merely tuning problems if the RTM scope does not support them.



Original teaching case: A Kafka fraud pre-filter parses events, applies a stateless rule, and writes candidates to another Kafka topic. At 20,000 events/s, four tasks each processing 8,000 events/s provide 32,000 events/s of toy capacity. A 500 ms micro-batch contributes about 250 ms average batching wait before processing; a 50 ms real-time epoch contributes about 25 ms in this deliberately simple model.

Add a per-card rolling counter and the choice changes. The business logic now needs durable keyed state. In Spark 4.1, shrinking the RTM epoch does not make that unsupported operator eligible; use a supported stateful mode or redesign the split so only the stateless prefix runs in RTM.

eligibility = supported source + stateless operator graph + supported sink
capacity = tasks × per-task rate
approximate batching wait = epoch / 2

Before adoption, validate connector semantics, checkpoint/restart behavior, backpressure, CPU overhead, observability, and the exact Spark distribution your managed platform exposes.



## Explore (5 minutes)

Predict the result for a stateless query at 20,000 events/s, then add state and raise input above capacity. Explain why latency tuning cannot repair either ineligibility or sustained overload.

Open data-engineering.html for the executable model.

Model limits: A stateless eligibility flag plus a steady-rate capacity and half-epoch waiting estimate. It does not run Spark, reproduce RTM scheduling, model Kafka partitions, sinks, serialization, network, checkpointing, recovery, backpressure, skew, GC, executor loss, stateful support added after 4.1, or any managed-service version differences.

## Quiz (4 minutes)

1. A Spark 4.1 query adds a keyed rolling count. What should happen before tuning its RTM epoch?
   - Confirm that the stateful graph is supported; otherwise choose another path
   - Set the epoch to one millisecond
   - Disable checkpoints

2. Why can a smaller epoch fail to improve a saturated stream?
   - Input still exceeds processing capacity
   - Epochs automatically add executors
   - Kafka stops retaining offsets

3. Which claim is outside this model?
   - Half an epoch is used as a teaching estimate
   - A real deployment will achieve the displayed latency
   - Stateful shape changes eligibility in the lesson

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Confirm that the stateful graph is supported; otherwise choose another path. Execution-mode eligibility is a correctness constraint, not a latency knob.

2. Input still exceeds processing capacity. A scheduling interval cannot remove sustained capacity debt.

3. A real deployment will achieve the displayed latency. The calculator omits the runtime factors required to predict production latency.

</details>

## Sources

- [Apache Spark 4.1.0 release notes](https://spark.apache.org/releases/spark-release-4-1-0.html) — Apache release page; page publication date not stated; checked 2026-09-27.
- [Apache Spark 4.1.0 error catalog: STREAMING_REAL_TIME_MODE](https://spark.apache.org/docs/4.1.0/sql-error-conditions.html#streaming_real_time_mode) — Spark 4.1.0 documentation; checked 2026-09-27.
