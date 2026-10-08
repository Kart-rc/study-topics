# Unaligned checkpoints: save the waiting records too

Data engineering · Day17 · 30 minutes

See why a recovery snapshot sometimes needs the queue as well as the running total.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day8/data-engineering.html">Day8: Spark changelog checkpoints: persist the delta, snapshot in the background</a></p><p>A 300 GB state store changes 100 MB per trigger, while compaction produces 900 MB of new SST files. What should you predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Changelog checkpointing can reduce foreground durable bytes. The benefit comes from persisting the small change instead of the larger set of changed physical files.</p></details><p><a href="../Day2/data-engineering.html">Day2: Watermarks: when can a window be forgotten?</a></p><p>With max event time 12 and delay 5, what watermark is used in this model&#x27;s next batch?</p><details><summary>Recall first, then reveal the refresher</summary><p>7. Subtract the allowed delay from the prior maximum: 12 − 5 = 7.</p></details>

## Understand (4 minutes)

A cashier has counted $10. Two receipts, worth $2 and $3, are waiting on the desk. A useful handover must account for both the counted money and the waiting receipts.

A streaming operator has the same problem. Its saved state might contain a running total, while records still sit in network buffers. A checkpoint is a coordinated recovery snapshot. In an aligned checkpoint, inputs wait at checkpoint markers until the operator has a consistent boundary. Backpressure can make this wait long.

An unaligned checkpoint records in-flight data as well as operator state. Checkpoint markers can overtake buffered records. Recovery restores the saved state and processes the saved records. This trades less waiting on busy channels for more checkpoint data.



Our snapshot stores state=10 and channel=[2,3]. After a crash, replaying that channel produces 15. Saving only 10 loses the waiting records in this deliberately broken recovery model. Saving 15 and replaying the same two records would count them twice. The snapshot must describe a consistent cut through the work.

Flink coordinates that cut across operators and channels. This example isolates the accounting; it does not implement the distributed protocol.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Checkpoint alignment and start delays grow during backpressure, while checkpoint storage still has capacity.

**Practical example.** A Kafka-to-Flink aggregation spends most checkpoint time waiting behind queued records. Compare aligned and unaligned runs with the same workload; inspect duration, checkpoint bytes, and recovery time.

**How to decide.** Consider unaligned checkpoints when waiting dominates. If object-store throughput is already the bottleneck, extra channel data can make things worse. Locate the delay before changing the setting.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The dashed worker area is temporary memory. The solid snapshot area survives a crash. With two +2 records, the unaligned-style snapshot holds total 10 plus two waiting records; recovery replays them to reach 14. The aligned-style toy drains those records before saving, so the snapshot holds total 14 and an empty channel. Both account for every record exactly once. The deliberately broken option holds 10 and no channel, losing 4. It is NOT an aligned checkpoint. This is single-channel accounting, not Flink barrier coordination.


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

Predict what survives a crash. Save, crash, restore, then replay one record per click. Compare saving the queue with draining it first. Both should reach the same total. Finally try the deliberately broken state-only snapshot.

Open data-engineering.html for the executable model.

Model limits: JavaScript executes local arithmetic on one synthetic channel. It omits barrier coordination, source positions, sink transactions, storage latency, and rescaling. A real unaligned checkpoint still takes time and may wait for the current record to finish.


</details>

## Databricks: checkpoint identity and Delta retries · 9 minutes

### Use case and mechanism

Use case. A receipt-copy job stops after writing a batch. You need to restart without copying those rows twice. Use a durable checkpoint for the same Structured Streaming query and a Delta sink. This example copies rows; the total is queried afterward, so it needs no aggregation state store.Think of two durable records: the checkpoint remembers the query’s progress; the Delta transaction log remembers a batch already accepted by that query. If progress recording trails the sink commit, a retry can recognize that accepted batch. Replacing the checkpoint starts a new query identity and can copy old input again.Different from Flink: this is micro-batch replay and sink deduplication. It does not enable Flink’s unaligned-checkpoint feature or save Flink network buffers.

Visual: source receipts feed a checkpoint identity and durable output bar. The same A:1 replay keeps total 15; replacing the checkpoint starts B and can raise it to 30. The browser runs this bounded JavaScript model; vendor snippets are not executed.

```sql
-- Run in an existing, authorized sandbox catalog/schema.
CREATE TABLE sandbox.study17.receipts (id STRING, amount INT) USING DELTA;
INSERT INTO sandbox.study17.receipts VALUES ('base', 10);
-- Run the Python stream once. Then add the next receipts:
INSERT INTO sandbox.study17.receipts VALUES ('r2', 2), ('r3', 3);
-- Run the SAME Python stream again, using the SAME checkpoint.
SELECT SUM(amount) FROM sandbox.study17.receipts_copy; -- expected: 15
```

```python
# Prerequisite: sandbox.study17.checkpoints is a writable UC volume.
# Use a dedicated path per query. Keep this path on subsequent runs.
q = (spark.readStream.table("sandbox.study17.receipts")
     .writeStream
     .option("checkpointLocation",
             "/Volumes/sandbox/study17/checkpoints/receipts_copy")
     .trigger(availableNow=True)
     .toTable("sandbox.study17.receipts_copy"))
q.awaitTermination()
```

Boundary. The browser executes a simplified JavaScript model of query identity, batch identity, and durable output. It does not run Spark or reproduce checkpoint files. The snippets below were checked against documentation but were not executed in a Databricks account. Expected results are predictions. Source retention, supported restart changes, and sink choice still matter; arbitrary external API calls are outside Delta’s protection.

## Snowflake: a stream advances when the work commits · 9 minutes

### Use case and mechanism

Use case. New receipts land in a Snowflake table. A SQL job copies only the new inserts into a downstream table. An append-only stream identifies the new rows. Its stored position is tied to table history; it is not a queue containing copies of the rows.Reading the stream with SELECT leaves its position unchanged. A committed transaction that consumes it with INSERT advances the position. Rollback keeps both the old target data and the old position, so the next attempt can read the same change set.Different from Flink: this is transactional change consumption inside Snowflake. There is no unaligned-checkpoint switch for a Snowflake stream.

Visual: source history V0→V1 stays in place while the stream position moves only at COMMIT. A dashed tentative box holds 2+3; rollback clears it without changing durable total 10. Retry then commits total 15.

```sql
-- Use an authorized sandbox schema and an active small warehouse.
CREATE TABLE study17_receipts (id STRING, amount INTEGER);
INSERT INTO study17_receipts VALUES ('base', 10);
CREATE TABLE study17_copy AS SELECT * FROM study17_receipts;
CREATE STREAM study17_changes
  ON TABLE study17_receipts APPEND_ONLY = TRUE;
INSERT INTO study17_receipts VALUES ('r2', 2), ('r3', 3);

SELECT * FROM study17_changes; -- inspect; position does not advance
BEGIN TRANSACTION;
INSERT INTO study17_copy SELECT id, amount FROM study17_changes;
ROLLBACK; -- rehearsal: neither target rows nor stream advance persist

BEGIN TRANSACTION;
INSERT INTO study17_copy SELECT id, amount FROM study17_changes;
COMMIT;
SELECT SUM(amount) FROM study17_copy; -- expected: 15
SELECT COUNT(*) FROM study17_changes; -- expected: 0
```

Boundary. This JavaScript model has two inserts, one consumer, no concurrent writers, and enough retained source history. V0/V1 are illustrative table versions, not literal Snowflake offset values. Real streams can become stale if history expires. A task can schedule the SQL, but scheduling alone does not establish this transaction boundary. The Snowflake SQL has not been executed in an account here.

## Compare and predict (2 minutes)

| System | Recovery memory | Boundary |
|---|---|---|
| Flink unaligned | State plus in-flight channel data | Snapshot size can rise |
| Databricks | Query checkpoint and Delta batch identity | Fresh checkpoint starts fresh query |
| Snowflake | Stream position and target transaction | SELECT does not consume; retained history required |

After a Databricks Delta sink commit, restarting with the same valid checkpoint replays a batch. What protects the copied rows?

- Same query + batch in Delta
- Flink unaligned checkpoints
- No duplicates in source

<details><summary>Reveal after predicting</summary>

Same query + batch in Delta. The same query/batch can be recognized by the Delta sink. A new query identity changes that boundary. This says nothing about independent duplicate business events.

</details>

You SELECT a Snowflake stream, then INSERT from it inside a transaction that rolls back. What persists?

- Both changes persist
- Neither change persists
- SELECT advances the stream

<details><summary>Reveal after predicting</summary>

Neither change persists. SELECT does not consume the stream. The rolled-back consuming transaction preserves the old target and stream position, allowing a retry.

</details>

## Certification connection

Supporting recovery lesson; not full domain coverage. Flink internals are enrichment. Related incremental-processing practice. Official overview verified; exact objective IDs/weights pending access to full study guide. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks Structured Streaming checkpoints](https://docs.databricks.com/aws/en/structured-streaming/checkpoints) — Updated 2026-09-11; checked 2026-10-08.
- [Databricks Delta streaming reads and writes](https://docs.databricks.com/aws/en/structured-streaming/delta-lake) — Updated 2026-09-11; checked 2026-10-08.
- [Snowflake Introduction to streams](https://docs.snowflake.com/en/user-guide/streams-intro) — Undated living documentation; checked 2026-10-08.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Exam version 2026-05-04; checked 2026-10-08.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Undated current exam overview; checked 2026-10-08.
- [Snowflake CREATE STREAM syntax](https://docs.snowflake.com/en/sql-reference/sql/create-stream) — Undated SQL reference; checked 2026-10-08.
- [Snowflake transaction boundaries](https://docs.snowflake.com/en/sql-reference/transactions) — Undated SQL reference; checked 2026-10-08.
- [Databricks Unity Catalog volume files](https://docs.databricks.com/aws/en/volumes/volume-files) — Living product documentation; checked 2026-10-08.

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
