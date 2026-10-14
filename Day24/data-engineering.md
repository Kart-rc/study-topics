# A file's path is its ticket: retries are safe, overwrites are not

Data engineering · Day24 · 30 minutes

Explain file-ingestion identity, then implement and compare it in Databricks Auto Loader and Snowflake Snowpipe.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day8/data-engineering.html">Day8: Spark changelog checkpoints: persist the delta, snapshot in the background</a></p><p>A 300 GB state store changes 100 MB per trigger, while compaction produces 900 MB of new SST files. What should you predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Changelog checkpointing can reduce foreground durable bytes. The benefit comes from persisting the small change instead of the larger set of changed physical files.</p></details><p><a href="../Day15/data-engineering.html">Day15: Keep the newest fact: Kafka compaction and tombstones</a></p><p>After replaying offset 23, what is O17&#x27;s state?</p><details><summary>Recall first, then reveal the refresher</summary><p>Absent; the null value is a delete marker. The tombstone tells a keyed rebuild to remove O17.</p></details>

## Understand (4 minutes)

Imagine a concert usher who marks each ticket number as used. The same ticket can be scanned twice without admitting two people. But if someone changes the name printed on an already-used ticket, the usher still sees the same ticket number and refuses it.

File ingestion works similarly: the service remembers a file identity, usually its path/name. Duplicate notifications do not necessarily create duplicate loads. Replacing the contents at the same path is dangerous because the ingestion memory can still say “already seen.”



The first event for orders/2026-10-14-18.json loads rows O-7 and O-8. A repeated event for that path is skipped. A corrected file uploaded to the same path can also be skipped. Uploading the correction as ...-18-v2.json gives it a new identity; downstream logic can then reconcile O-7 rather than blindly appending another order.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use managed file ingestion when producers land immutable files in object storage and the pipeline must recover from duplicate notifications or restarts.

**Practical example.** An S3 producer writes hourly order files. A notification is retried after a network timeout, and one batch later needs a correction.

**How to decide.** Treat source files as immutable, keep ingestion state durable, and publish corrections under a new path. Add business-key reconciliation because file-level exactly-once does not remove duplicates across different files.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Read left to right: an arrival presents a path, ingestion memory answers seen/not-seen, and that answer selects LOAD or SKIP. The versioned correction changes the identity rather than decorating the same path.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
seen=set()
path='orders/2026-10-14-18.json'
first_action='LOAD' if path not in seen else 'SKIP'
seen.add(path)
retry_action='SKIP' if path in seen else 'LOAD'
corrected='orders/2026-10-14-18-v2.json'
correction_action='LOAD' if corrected not in seen else 'SKIP'
```

1. Start with empty ingestion memory and one immutable path.

   Changed values: `{"path": "orders/2026-10-14-18.json"}`

2. The first arrival loads, then the path is remembered.

   Changed values: `{"first_action": "LOAD"}`

3. A repeated event for the same identity is skipped.

   Changed values: `{"retry_action": "SKIP"}`

4. A versioned correction has a new identity and can load.

   Changed values: `{"corrected": "orders/2026-10-14-18-v2.json", "correction_action": "LOAD"}`

[Full runnable example](examples/data-engineering.py).

Limits: Executed local Python over path strings. No object store, notification service, vendor checkpoint, pipe or table was used.

## Explore (remaining exploration time)

Choose each arrival scenario and predict LOAD or SKIP before revealing the remembered identity.

Open data-engineering.html for the executable model.

Model limits: This local JavaScript model reduces identity to a path string. Real products have checkpoints/load metadata, permissions, retention, schema handling, concurrency and downstream table semantics. It does not contact Databricks, Snowflake or object storage.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day20/data-engineering.html">Day20</a>; product material added 2026-10-10.</p><p>Databricks: R7 has two item objects. variant_explode emits?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Two children correlated with R7. It counts elements, not units.</p></details><p>Snowflake: TRY_PARSE_JSON returns SQL NULL. Meaning?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Parsing failed or input was NULL; handle explicitly. Do not collapse malformed input into empty business data.</p></details>

## Databricks: Auto Loader remembers files in its checkpoint · 9 minutes

Use an authorized non-production workspace. SQL is unexecuted vendor practice.

```sql
CREATE OR REFRESH STREAMING TABLE bronze_orders AS
SELECT *, _metadata.file_path AS source_file
FROM STREAM read_files('s3://acme-study/orders/', format => 'json');
```

Auto Loader persists discovered-file state in its checkpoint and can resume after failure. Keep inputs immutable; use a new path for a correction and reconcile downstream.

## Snowflake: Snowpipe remembers loaded filenames for a limited window · 9 minutes

Use an authorized non-production account. SQL is unexecuted vendor practice.

```sql
CREATE PIPE orders_pipe AUTO_INGEST=TRUE AS
COPY INTO bronze_orders FROM @orders_stage FILE_FORMAT=(TYPE=CSV);
SELECT * FROM TABLE(INFORMATION_SCHEMA.COPY_HISTORY(
  TABLE_NAME=>'BRONZE_ORDERS', START_TIME=>DATEADD('hour',-1,CURRENT_TIMESTAMP())));
```

Snowpipe keeps load metadata for 14 days. Use immutable, versioned names; avoid overlapping Snowpipe and bulk COPY metadata.

## Compare and predict (2 minutes)

| Question | Databricks Auto Loader | Snowflake Snowpipe |
|---|---|---|
| Memory | checkpoint file state | pipe load metadata |
| Recovery | resume checkpoint | queued event + managed COPY |
| Same-path overwrite | avoid; path already seen | avoid; name ignored inside 14 days |
| Different files, same order | reconcile downstream | reconcile downstream |

A corrected source file keeps the already-loaded name. Best cross-product action?

- Overwrite it
- Publish a versioned name, then reconcile business keys
- Delete ingestion history

<details><summary>Reveal after predicting</summary>

Publish a versioned name, then reconcile business keys. Both products treat file identity as ingestion memory; immutability makes corrections visible.

</details>

Two different files contain order O-7. What does file-level deduplication guarantee?

- Only one O-7 row
- Each unseen file can load once; business-key dedup is separate
- The second file is automatically deleted

<details><summary>Reveal after predicting</summary>

Each unseen file can load once; business-key dedup is separate. The file identity and business identity are different layers.

</details>

## Certification connection

Focused Auto Loader file identity, checkpoint recovery and immutable-source decisions; not complete ingestion-domain coverage. Focused Snowpipe file-load metadata, duplicate-event and overwrite decisions; planning group only because full COF-C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks Auto Loader overview](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/) — Updated September 11, 2026; checked 2026-10-14.
- [Databricks Auto Loader options](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/options) — Living documentation; checked 2026-10-14.
- [Snowflake Snowpipe introduction](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-intro) — Living documentation; checked 2026-10-14.
- [Snowflake managing Snowpipe](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-manage) — Living documentation; checked 2026-10-14.

## Quiz (4 minutes)

1. A producer sends the same object-store notification twice. What should durable file-ingestion state normally do?
   - Load the path twice
   - Recognize the path and skip a second file load
   - Delete the table

2. A correction replaces bytes at an already-loaded path. Safest publishing rule?
   - Reuse the same path
   - Write a versioned path and reconcile business keys
   - Disable checkpoints

3. What does file-level exactly-once fail to prove?
   - A path is not reprocessed
   - Two different files cannot contain the same order
   - A checkpoint exists

4. Why is an immutable source-path rule valuable even when the producer can overwrite objects?
5. Where would you reconcile duplicate order IDs that arrive in two different files?

<details><summary>Answer key — attempt first</summary>

1. Recognize the path and skip a second file load. Durable state turns notification retries into a path-level no-op.

2. Write a versioned path and reconcile business keys. A new identity makes the correction observable; reconciliation controls row effects.

3. Two different files cannot contain the same order. Business duplicates can arrive under different paths.

</details>

## Sources

- [Databricks Auto Loader overview](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/) — Updated September 11, 2026; checked 2026-10-14.
- [Snowflake Snowpipe overview](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-intro) — Living documentation; checked 2026-10-14.
- [Snowflake managing Snowpipe](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-manage) — Living documentation; checked 2026-10-14.
