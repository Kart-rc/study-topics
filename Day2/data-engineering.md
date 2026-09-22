# Watermarks: when can a window be forgotten?

Data engineering · Day2 · 15 minutes

Separate event time from arrival time, trace state cleanup, and choose a lateness policy that preserves the consumer promise.

## Recall (2 minutes)

<p><a href="../Day1/data-engineering.html">Day1: The commit is the boundary</a></p><p>Blue commits first. Amber uses base 0. What changes?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; Amber detects a conflict. The failed comparison publishes nothing. Amber must refresh before retrying.</p></details>

## Understand (4 minutes)

Event time says when something happened; processing time says when your system handled it. A late-arriving event can still belong to an earlier aggregate. Keeping every aggregate forever is expensive, so a streaming engine needs a rule for retiring old state.

For a single-stream windowed aggregation, Spark tracks event-time progress and a configured delay. Conceptually, the watermark follows the greatest event timestamp observed minus that delay. It is not simply the wall clock. Spark guarantees aggregation of data within the configured lateness bound; data beyond that bound may or may not be aggregated. Actual behavior also depends on the operator, output mode, and trigger progress. Spark Structured Streaming guide.



Original teaching case: A Kafka stream feeds five-minute payment-count windows. Use minutes after 12:00 and a five-minute delay. Batch 1 contains timestamps 2 and 4. Batch 2 contains 12. Batch 3 contains 3 and 8. The third batch's old event is not “nine minutes late” according to a laptop clock; it is behind the stream's observed event-time progress.

In the model below, each batch uses the previous batch's maximum to compute its watermark. Before batch 3, the maximum is 12, so the watermark is 7. The window [0,5) is already behind 7 and is removed. Timestamp 3 can no longer update that retired window in this model. Timestamp 8 belongs to [5,10), whose state is still retained.

Increase the delay to 15 and replay. Before batch 3 the watermark is −3, so the early window remains. You preserved more late corrections by holding state longer. The tradeoff is not “correctness versus speed” in the abstract: it is a stated lateness promise, retained state, and when consumers can treat an output as final.

The key cleanup condition in this deliberately simplified model is:

watermark = previousMaxEventTime - delay
if windowEnd < watermark:
    retire(windowState)

For a real rollout, inspect timestamp quality, late-event distributions, state-store growth, and consumer tolerance for corrections. A future-dated producer timestamp is a warning: it can distort progress. Waiting indefinitely is not a free alternative, and blindly dropping everything older than wall-clock time changes the contract.



## Explore (5 minutes)

Predict batch 3 before clicking. Step through with delay 5, then reset and use delay 15. Compare the early window count and retired state. Finally explain why an idle wall clock does not, by itself, prove that event-time completeness has advanced.

Open data-engineering.html for the executable model.

Model limits: This deterministic window-state model uses synthetic batches, previous-batch watermarks, and a strict windowEnd < watermark retirement rule. It is not Spark. It omits multi-input watermark policies, sink/output modes, no-data triggers, state-store implementation and exact operator cutoffs. Its rejection of retired-window events must not be interpreted as Spark guaranteeing that all data beyond the delay is dropped.

## Quiz (4 minutes)

1. With max event time 12 and delay 5, what watermark is used in this model's next batch?
   - 17
   - 7
   - The current wall clock

2. Why does a larger delay retain more early windows?
   - It moves the cleanup boundary farther behind event-time progress
   - It makes producers send earlier
   - It removes the need for state

3. An event exceeds Spark's configured lateness delay. What is safe to claim?
   - It is always dropped
   - It is always counted
   - Its aggregation is no longer guaranteed; it may still be processed

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 7. Subtract the allowed delay from the prior maximum: 12 − 5 = 7.

2. It moves the cleanup boundary farther behind event-time progress. A slower cleanup boundary leaves more windows available for late updates, consuming more state.

3. Its aggregation is no longer guaranteed; it may still be processed. Spark's lateness guarantee is one-sided. Do not replace it with a universal hard-drop rule.

</details>

## Sources

- [Apache Spark Structured Streaming: watermark semantics](https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html) — Living documentation; publication date not stated; checked 2026-09-22.
