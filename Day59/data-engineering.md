# A checkpoint remembers progress; a rate limit controls the next bite

Data engineering · Day59 · 30 minutes

Separate ingestion correctness from ingestion capacity so backlog tuning never destroys recovery evidence.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day33/data-engineering.html">Day33: Open the S3 door without handing out AWS keys</a></p><p>The caller has a platform grant and the path is finance, but AWS does not trust the platform identity. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>The read is denied at role assumption. Every link must allow the request; a platform grant cannot replace the AWS trust policy.</p></details><p><a href="../Day37/data-engineering.html">Day37: Retrieval lab: name the failed boundary before changing the pipeline</a></p><p>Changes disappear only after a long outage. Which evidence is most useful first?</p><details><summary>Recall first, then reveal the refresher</summary><p>The durable cursor and retained change-history window. The symptom is about an incremental position crossing a retention boundary.</p></details>

## Understand (4 minutes)

A deli ticket tells the cook which order comes next. A tray size tells the cook how many sandwiches to carry. One remembers position; the other limits work.

Streaming ingestion needs both ideas. A checkpoint or committed offset remembers durable progress after a crash. A batch-size or client-capacity control bounds how much work enters the next processing interval. Raising the limit can drain a backlog faster, but it does not make progress durable. Deleting progress state can make the system repeat or miss work.



Source receipts-59 has 2,500 files. A hard limit of 1,000 files produces batches of 1,000, 1,000, and 500. The checkpoint advances after each committed batch. If batch two fails before commit, recovery resumes from the batch-one checkpoint—not from the configured limit.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use separate progress and capacity controls when a stream has a backlog or bursty arrivals.

**Practical example.** A retail data platform must catch up after an object-store notification outage without replaying already committed receipts.

**How to decide.** Preserve durable progress first. Tune batch or client capacity from memory, latency, cost, and downstream evidence. Never use state expiry as a casual throughput knob.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

One timeline carries two independent labels: batch capacity and committed progress. Losing the second label makes the retry cursor unknowable.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
total=2500; hard_limit=1000; checkpoint=0
batch1=min(hard_limit,total-checkpoint); checkpoint+=batch1
batch2=min(hard_limit,total-checkpoint); failed_before_commit=True
result={'checkpoint':checkpoint,'retry_starts_at':checkpoint+1,'failed_batch_size':batch2,'remaining_after_retry':total-checkpoint}
```

1. Start with the backlog, capacity limit, and no committed progress.

   Changed values: `{"total": 2500, "hard_limit": 1000, "checkpoint": 0}`

2. Commit the first 1,000 files and advance durable progress.

   Changed values: `{"checkpoint": 1000, "batch1": 1000}`

3. Read another 1,000, then fail before committing progress.

   Changed values: `{"batch2": 1000, "failed_before_commit": true}`

4. Recover from committed progress, independent of the rate limit.

   Changed values: `{"result": {"checkpoint": 1000, "retry_starts_at": 1001, "failed_batch_size": 1000, "remaining_after_retry": 1500}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local model counts files of equal cost. It does not run cloud discovery, Spark, Snowpipe Streaming, schemas, rejected rows, autoscaling, network limits, warehouse cost, or product recovery.

## Explore (remaining exploration time)

Change the model between durable progress plus a 1,000-file limit and a limit with lost progress. Predict the retry cursor.

Open data-engineering.html for the executable model.

Model limits: The local model counts files of equal cost. It does not run cloud discovery, Spark, Snowpipe Streaming, schemas, rejected rows, autoscaling, network limits, warehouse cost, or product recovery.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day26/data-engineering.html">Day26</a>; product material added 2026-10-16.</p><p>Dashboard queries run quickly after starting but wait in line. Common answer?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Add concurrency lanes/clusters. Queue pressure is a scale-out problem.</p></details><p>One reconciliation spills with no queue. Common first direction?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Increase per-query size or tune it. One query needs a wider lane.</p></details>

## Databricks: bound Auto Loader work without weakening its checkpoint · 9 minutes

Use maxFilesPerTrigger or maxBytesPerTrigger to bound a micro-batch; keep the checkpoint durable. SQL was not executed in Databricks.

## Snowflake: offset tokens prove channel progress; they do not size the client · 9 minutes

Offset tokens track per-channel committed progress. Source retention and client capacity remain separate. Snowflake code was not executed.

## Compare and predict (2 minutes)

Both separate progress from capacity, but their state and throughput controls are not one-to-one equivalents.

Which Databricks setting bounds file count per micro-batch?

- cloudFiles.maxFilesPerTrigger
- cloudFiles.maxFileAge
- VACUUM

<details><summary>Reveal after predicting</summary>

cloudFiles.maxFilesPerTrigger. The file-count limit is hard.

</details>

A Snowpipe channel returns token 1000 after restart. What else must exist?

- Retained source records after 1000
- A larger warehouse only
- A deleted producer buffer

<details><summary>Reveal after predicting</summary>

Retained source records after 1000. The token cannot recreate source rows.

</details>

## Certification connection

Focused ingestion sizing, checkpoints, Auto Loader file and byte limits, and recovery evidence. Focused high-performance Snowpipe Streaming channels, offset tokens, source retention, and capacity boundaries. Planning groups only; full COF-C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks Auto Loader production guidance](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/production) — Official documentation; checked November 19, 2026; checked 2026-11-19.
- [Snowpipe Streaming named channels and offset tokens](https://docs.snowflake.com/en/user-guide/snowpipe-streaming/snowpipe-streaming-channels) — Official documentation; checked November 19, 2026; checked 2026-11-19.
- [Snowpipe Streaming best practices](https://docs.snowflake.com/en/user-guide/snowpipe-streaming/snowpipe-streaming-high-performance-best-practices) — Official documentation; checked November 19, 2026; checked 2026-11-19.

## Quiz (4 minutes)

1. Batch one committed and batch two failed. What proves the retry cursor?
   - The durable checkpoint or committed offset
   - The 1,000-file limit
   - The worker count

2. Why is maxBytesPerTrigger not an exact memory ceiling?
   - Databricks documents it as a soft limit
   - Bytes are always zero
   - It deletes the checkpoint

3. What is the Snowpipe Streaming boundary?
   - Offset tokens track per-channel progress; retained source data and throughput controls remain client responsibilities
   - One token sizes every batch
   - The token makes producer memory durable

4. Which backlog metric tells you capacity is insufficient?
5. Which durable artifact proves the next safe source position?

<details><summary>Answer key — attempt first</summary>

1. The durable checkpoint or committed offset. Capacity does not record completion.

2. Databricks documents it as a soft limit. A soft input limit can be exceeded.

3. Offset tokens track per-channel progress; retained source data and throughput controls remain client responsibilities. Progress, retention, and capacity are separate responsibilities.

</details>

## Sources

- [Databricks Auto Loader production guidance](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/production) — Official documentation; checked November 19, 2026; checked 2026-11-19.
- [Snowpipe Streaming named channels and offset tokens](https://docs.snowflake.com/en/user-guide/snowpipe-streaming/snowpipe-streaming-channels) — Official documentation; checked November 19, 2026; checked 2026-11-19.
