# Unaligned checkpoints: save the waiting records too

Data engineering · Day17 · 15 minutes

See why a recovery snapshot sometimes needs the queue as well as the running total.

## Recall (2 minutes)

<p><a href="../Day8/data-engineering.html">Day8: Spark changelog checkpoints: persist the delta, snapshot in the background</a></p><p>A 300 GB state store changes 100 MB per trigger, while compaction produces 900 MB of new SST files. What should you predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Changelog checkpointing can reduce foreground durable bytes. The benefit comes from persisting the small change instead of the larger set of changed physical files.</p></details><p><a href="../Day2/data-engineering.html">Day2: Watermarks: when can a window be forgotten?</a></p><p>With max event time 12 and delay 5, what watermark is used in this model&#x27;s next batch?</p><details><summary>Recall first, then reveal the refresher</summary><p>7. Subtract the allowed delay from the prior maximum: 12 − 5 = 7.</p></details>

## Understand (4 minutes)

A cashier has counted $10. Two receipts, worth $2 and $3, are waiting on the desk. A useful handover must account for both the counted money and the waiting receipts.

A streaming operator has the same problem. Its saved state might contain a running total, while records still sit in network buffers. A checkpoint is a coordinated recovery snapshot. In an aligned checkpoint, inputs wait at checkpoint markers until the operator has a consistent boundary. Backpressure can make this wait long.

An unaligned checkpoint records in-flight data as well as operator state. Checkpoint markers can overtake buffered records. Recovery restores the saved state and processes the saved records. This trades less waiting on busy channels for more checkpoint data.

Already processedTotal = 10

Still in flightRecord A = 2; record B = 3

Recover both10 + 2 + 3 = 15



Our snapshot stores state=10 and channel=[2,3]. After a crash, replaying that channel produces 15. Saving only 10 loses the waiting records in this deliberately broken recovery model. Saving 15 and replaying the same two records would count them twice. The snapshot must describe a consistent cut through the work.

Flink coordinates that cut across operators and channels. This example isolates the accounting; it does not implement the distributed protocol.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Checkpoint alignment and start delays grow during backpressure, while checkpoint storage still has capacity.

**Practical example.** A Kafka-to-Flink aggregation spends most checkpoint time waiting behind queued records. Compare aligned and unaligned runs with the same workload; inspect duration, checkpoint bytes, and recovery time.

**How to decide.** Consider unaligned checkpoints when waiting dominates. If object-store throughput is already the bottleneck, extra channel data can make things worse. Locate the delay before changing the setting.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
state = 10
channel = [2, 3]
snapshot = {"state": state, "channel": channel.copy()}
state = 0
channel = []
restored = snapshot["state"] + sum(snapshot["channel"])
broken_restore = snapshot["state"]
```

1. Two records have not contributed to the total.

   Changed values: `{"state": 10, "channel": [2, 3]}`

2. Save both parts of the recovery snapshot.

   Changed values: `{"snapshot": {"state": 10, "channel": [2, 3]}}`

3. Simulate losing process memory. The durable snapshot survives.

   Changed values: `{"state": 0, "channel": []}`

4. Including the saved channel gives 15; ignoring it leaves 10.

   Changed values: `{"restored": 15, "broken_restore": 10}`

[Full runnable example](examples/data-engineering.py).

Limits: Executed Python accounting, not Flink. The lab uses repeated +2 records so you can vary queue length.

## Explore (remaining exploration time)

Predict the restored total. Switch between saving the whole snapshot and forgetting its channel. Change the waiting-record count; see which records recovery can find.

Open data-engineering.html for the executable model.

Model limits: JavaScript executes local arithmetic on one synthetic channel. It omits barrier coordination, source positions, sink transactions, storage latency, and rescaling. A real unaligned checkpoint still takes time and may wait for the current record to finish.

## Quiz (4 minutes)

1. The replay saves 10 and [2,3]. What should recovery produce?
   - 10
   - 15
   - 20

2. Why can an unaligned checkpoint help?
   - It deletes queued records
   - It makes the sink transactional
   - It saves in-flight data instead of waiting for it to drain

3. When is this a poor first fix?
   - Checkpoint storage is saturated
   - Alignment delay dominates
   - There are records in flight

4. Which metrics distinguish barrier waiting from slow checkpoint storage?
5. What error results from saving state 15 and replaying [2,3] again?

<details><summary>Answer key — attempt first</summary>

1. 15. Replaying the two not-yet-counted records adds 5, once.

2. It saves in-flight data instead of waiting for it to drain. The records remain part of recovery. This does not add sink transactions.

3. Checkpoint storage is saturated. Extra saved channel data can worsen an I/O bottleneck.

</details>

## Sources

- [Apache Flink: checkpointing under backpressure](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/state/checkpointing_under_backpressure/) — Living documentation; stable version 2.3.0; unaligned checkpoints introduced in 1.11; checked 2026-10-07.
