# Skip the chunks that cannot contain day 42

Data engineering · Day19 · 30 minutes

Explain how min/max metadata and data layout reduce scan work without changing query results.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day10/data-engineering.html">Day10: Save the order and a “send later” note together</a></p><p>E7 reached Kafka, but the relay crashed before marking it sent. What can happen?</p><details><summary>Recall first, then reveal the refresher</summary><p>E7 is sent again. The saved ticket is still pending, so the relay may resend it. Kafka receiving E7 does not update the order database. A later relay crash cannot undo a committed order.</p></details><p><a href="../Day4/data-engineering.html">Day4: Kafka transactions: make the output and offset one decision</a></p><p>The worker writes output, crashes before committing its input offset, then restarts without a transaction. What is likely?</p><details><summary>Recall first, then reveal the refresher</summary><p>The input is processed again and the output can duplicate. The committed position still points to the input, while the first output already exists.</p></details>

## Understand (4 minutes)

Imagine looking for page 42 in six labeled boxes. If every box says “pages 1–60,” you must open all six. If the labels are 1–10, 11–20, and so on, only one box can contain page 42. Data engines use the same idea: metadata records value ranges for a file or micro-partition, then a filter can skip chunks whose ranges cannot match.

This is pruning or data skipping. It reduces bytes considered by the scan. It does not create an index lookup, guarantee a duration, or fix a query that lacks a useful filter.



Our synthetic orders table has 60 days across six equal chunks. The query is WHERE order_day = 42. A scattered layout gives every chunk a 1–60 range, so all six are candidates. A clustered layout gives non-overlapping ten-day ranges, so only the 41–50 chunk is scanned.

The browser model calculates candidates from the displayed ranges. It does not estimate cloud latency or cost. The product sections show how Databricks and Snowflake maintain related metadata but reorganize data through different mechanisms.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when selective filters on a large table still scan many files or micro-partitions and query profiles show poor pruning.

**Practical example.** A daily sales table is repeatedly filtered by order_day for a narrow reporting window. The team compares scan candidates before and after changing physical layout.

**How to decide.** First confirm the predicate and scan profile. Reorganize only when repeated savings justify rewrite or maintenance cost; a small table or broad scan may not benefit.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Six equally sized boxes use the same scale. Orange chunks remain candidates; gray chunks are eliminated by the filter and their min/max labels.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
ranges = [(1,10),(11,20),(21,30),(31,40),(41,50),(51,60)]
target = 42
candidates = [lo <= target <= hi for lo, hi in ranges]
scanned = sum(candidates)
skipped = len(ranges) - scanned
result_total = 125
```

1. Define six chunk ranges and the target day.

   Changed values: `{"ranges": [[1, 10], [11, 20], [21, 30], [31, 40], [41, 50], [51, 60]], "target": 42}`

2. Compare the target with each min/max label.

   Changed values: `{"candidates": [false, false, false, false, true, false], "scanned": 1}`

3. Five chunks are excluded; the synthetic result remains 125.

   Changed values: `{"skipped": 5, "result_total": 125}`

[Full runnable example](examples/data-engineering.py).

Limits: Executed Python range checks. The result total is a fixed teaching value; no Parquet, Delta or Snowflake data is read.

## Explore (remaining exploration time)

Predict how many chunks can contain day 42. Switch the layout, then change to a function-wrapped predicate and explain why the toy cannot use its range labels.

Open data-engineering.html for the executable model.

Model limits: Local JavaScript uses six hand-authored ranges and one equality filter. Real engines use richer metadata, optimizer rules, caches and column pruning; candidate count is not billed bytes or elapsed time.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day17/data-engineering.html">Day17</a>; product material added 2026-10-08.</p><p>After a Databricks Delta sink commit, restarting with the same valid checkpoint replays a batch. What protects the copied rows?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Same query + batch in Delta. The same query/batch can be recognized by the Delta sink. A new query identity changes that boundary. This says nothing about independent duplicate business events.</p></details><p>You SELECT a Snowflake stream, then INSERT from it inside a transaction that rolls back. What persists?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Neither change persists. SELECT does not consume the stream. The rolled-back consuming transaction preserves the old target and stream position, allowing a retry.</p></details>

## Databricks: liquid clustering groups file ranges · 9 minutes

Use an authorized unpartitioned Delta sandbox. SQL is unexecuted.

```sql
ALTER TABLE study19.sales.orders CLUSTER BY (order_day);
OPTIMIZE study19.sales.orders FULL;
SELECT SUM(amount) FROM study19.sales.orders WHERE order_day = 42;
```

The local model changes six overlapping ranges to non-overlapping ranges. FULL requires DBR 16.4 LTS+ and can be expensive; predictive optimization may manage OPTIMIZE for eligible managed tables.

## Snowflake: micro-partition pruning after clustering maintenance · 9 minutes

Use an authorized standard-table sandbox. SQL is unexecuted.

```sql
SELECT SYSTEM$CLUSTERING_INFORMATION('STUDY19.SALES.ORDERS', '(ORDER_DAY)');
ALTER TABLE study19.sales.orders CLUSTER BY (order_day);
SELECT SUM(amount) FROM study19.sales.orders WHERE order_day = 42;
```

The local model shows overlap before and separated ranges after maintenance. Real Automatic Clustering is asynchronous and consumes serverless credits; metadata exists even without a user clustering key.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Skip unit | File | Micro-partition |
| Layout | Liquid clustering | Clustering key |
| Maintenance | Predictive optimization or explicit OPTIMIZE | Automatic Clustering |
| Tradeoff | Rewrite compute vs scan savings | Serverless credits vs pruning savings |

Databricks: after enabling liquid clustering, what operation rewrites existing data layout in this lesson?

- OPTIMIZE (FULL for the explicit full rewrite shown)
- VACUUM
- GRANT SELECT

<details><summary>Reveal after predicting</summary>

OPTIMIZE (FULL for the explicit full rewrite shown). OPTIMIZE performs clustering work. FULL explicitly forces full reclustering on supported runtimes; VACUUM and grants solve different problems.

</details>

Snowflake: does a table need a user clustering key before any micro-partition pruning can occur?

- Yes, always
- No; metadata is automatic, while a key can improve layout for suitable large tables
- Only on hybrid tables

<details><summary>Reveal after predicting</summary>

No; metadata is automatic, while a key can improve layout for suitable large tables. Snowflake records micro-partition metadata automatically. User clustering keys are selective optimizations and are unsupported for hybrid tables.

</details>

## Certification connection

Focused performance lesson: data-skipping statistics, liquid clustering and OPTIMIZE tradeoffs. Not full domain coverage. Focused performance planning group: micro-partition pruning, overlap and clustering-key maintenance. Full C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks data skipping](https://docs.databricks.com/aws/en/tables/data-skipping) — Living docs; checked 2026-10-09; checked 2026-10-09.
- [Databricks liquid clustering](https://docs.databricks.com/aws/en/tables/clustering) — Living docs; checked 2026-10-09; checked 2026-10-09.
- [Snowflake micro-partitions and pruning](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions) — Living docs; checked 2026-10-09; checked 2026-10-09.
- [Snowflake clustering keys](https://docs.snowflake.com/en/user-guide/tables-clustering-keys) — Living docs; checked 2026-10-09; checked 2026-10-09.

## Quiz (4 minutes)

1. Every chunk has min 1 and max 60. What can the engine conclude for day 42?
   - Skip all chunks
   - Every chunk remains a candidate
   - Only chunk 4 is a candidate

2. After clustering into ten-day ranges, which chunk is a candidate?
   - 41–50 only
   - 1–10 only
   - All six

3. What does one candidate chunk prove?
   - The query will finish in one second
   - The result is correct without reading rows
   - Only that this toy can prune five chunks using its metadata

4. What query-profile evidence would justify reorganizing this table?
5. Give one predicate that would defeat this simplified min/max model.

<details><summary>Answer key — attempt first</summary>

1. Every chunk remains a candidate. Day 42 lies inside every recorded range, so min/max alone cannot exclude a chunk.

2. 41–50 only. Only 41–50 can contain 42. The query result is unchanged; less data is considered.

3. Only that this toy can prune five chunks using its metadata. Pruning narrows scan candidates. It is not a latency promise and the remaining chunk still needs row evaluation.

</details>

## Sources

- [Databricks data skipping](https://docs.databricks.com/aws/en/tables/data-skipping) — Living docs; checked 2026-10-09; checked 2026-10-09.
- [Snowflake micro-partitions and clustering](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions) — Living docs; checked 2026-10-09; checked 2026-10-09.
