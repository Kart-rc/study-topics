# Watermarks: when can a window be forgotten?

Data engineering · Day2 · 15 minutes

A payment arrives late.

## Recall (2 minutes)

<p><a href="../Day1/data-engineering.html">Day1: The commit is the boundary</a></p><p>Blue commits first. Amber uses base 0. What changes?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; Amber detects a conflict. The failed comparison publishes nothing. Amber must refresh before retrying.</p></details>

## Understand (4 minutes)

A payment arrives late. Should the running count still change? The stream needs a rule for how long it keeps old counting windows open.

A watermark is a progress marker based on event timestamps, with an allowed delay subtracted. It helps decide when old state can be removed. It is not simply the current laptop time. A larger delay keeps more old state so more late events can still be included.



Before the third batch, the largest observed timestamp is minute 12. With a five-minute delay, the toy watermark is 7. The window ending at minute 5 is retired. Event 3 can no longer update it, while the window for event 8 is still retained.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
previous_max = 12; delay = 5
watermark = previous_max - delay
windows = {"0-5": 2, "5-10": 0}
windows.pop("0-5") if 5 < watermark else None
accept_event_3 = "0-5" in windows
windows["5-10"] += 1
```

1. Use event-time progress from the previous batch.

   Changed values: `{"previous_max": 12, "delay": 5}`

2. The progress marker is minute 7.

   Changed values: `{"watermark": 7}`

3. Two counting windows exist before cleanup.

   Changed values: `{"windows": {"0-5": 2, "5-10": 0}}`

4. The old window is removed under this toy rule.

   Changed values: `{"windows": {"5-10": 0}}`

5. The event at minute 3 cannot update removed state.

   Changed values: `{"accept_event_3": false}`

6. The event at minute 8 updates retained state.

   Changed values: `{"windows": {"5-10": 1}}`

[Full runnable example](examples/data-engineering.py).

Limits: This uses the lesson’s simplified prior-batch watermark and window-retention rule. It is not an exact Spark operator implementation or a universal late-row acceptance rule. Output mode, operator, and batch timing matter.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Event time says when something happened; processing time says when your system handled it. A late-arriving event can still belong to an earlier aggregate. Keeping every aggregate forever is expensive, so a streaming engine needs a rule for retiring old state.</p><p>For a single-stream windowed aggregation, Spark tracks event-time progress and a configured delay. Conceptually, the watermark follows the greatest event timestamp observed minus that delay. It is not simply the wall clock. Spark guarantees aggregation of data within the configured lateness bound; data beyond that bound may or may not be aggregated. Actual behavior also depends on the operator, output mode, and trigger progress. <a href="https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html">Spark Structured Streaming guide</a>.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A Kafka stream feeds five-minute payment-count windows. Use minutes after 12:00 and a five-minute delay. Batch 1 contains timestamps 2 and 4. Batch 2 contains 12. Batch 3 contains 3 and 8. The third batch's old event is not “nine minutes late” according to a laptop clock; it is behind the stream's observed event-time progress.</p><p>In the model below, each batch uses the previous batch's maximum to compute its watermark. Before batch 3, the maximum is 12, so the watermark is 7. The window [0,5) is already behind 7 and is removed. Timestamp 3 can no longer update that retired window in this model. Timestamp 8 belongs to [5,10), whose state is still retained.</p><p>Increase the delay to 15 and replay. Before batch 3 the watermark is −3, so the early window remains. You preserved more late corrections by holding state longer. The tradeoff is not “correctness versus speed” in the abstract: it is a stated lateness promise, retained state, and when consumers can treat an output as final.</p><p>The key cleanup condition in this deliberately simplified model is:</p><pre>watermark = previousMaxEventTime - delay
if windowEnd &lt; watermark:
    retire(windowState)</pre><p>For a real rollout, inspect timestamp quality, late-event distributions, state-store growth, and consumer tolerance for corrections. A future-dated producer timestamp is a warning: it can distort progress. Waiting indefinitely is not a free alternative, and blindly dropping everything older than wall-clock time changes the contract.</p>

</details>

## Explore (remaining exploration time)

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
