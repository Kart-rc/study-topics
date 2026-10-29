# Skip storage blocks that cannot contain the customer

Data engineering · Day39 · 30 minutes

Use min/max statistics and physical layout to avoid reading files or micro-partitions that cannot match a filter.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day23/data-engineering.html">Day23: Retrieval lab: choose the control from the symptom</a></p><p>A date predicate scans every data chunk. First move?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect pruning evidence and recorded ranges. Measure whether layout metadata can exclude data before changing compute or clustering.</p></details><p><a href="../Day27/data-engineering.html">Day27: Choose one source winner before MERGE</a></p><p>Why rank source rows before MERGE?</p><details><summary>Recall first, then reveal the refresher</summary><p>To make one deterministic source winner per target key. One target row should not receive competing source actions.</p></details>

## Understand (4 minutes)

A warehouse labels each box with the smallest and largest customer ID inside. An order for customer 42 does not require opening a box labeled 1–20.

Databricks records statistics for data files. Snowflake records metadata for micro-partitions. At query time, each engine can prune—skip—storage blocks whose ranges cannot match the filter. Better physical grouping creates tighter ranges and more skipping.



Six blocks hold customer ranges 1–20, 21–40, 41–60, and so on. Filtering for customer 42 scans only block 3. If every block overlaps 1–120, all six remain candidates even though only one contains the row.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use pruning evidence when a large table is slow even though queries filter on a selective customer, date, tenant, or region column.

**Practical example.** A 20-TB order table is usually queried by tenant and event date, but each query still scans most files.

**How to decide.** First confirm the filter is eligible and statistics exist. Improve layout only when repeated workload evidence justifies the write, maintenance, and service cost; do not cluster every column.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The six ranges answer the pruning question directly. Increasing overlap widens ranges, turns skipped blocks into candidates, and makes the scan cost visible without pretending to run a vendor optimizer.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
target = 42; ranges = [(1,20),(21,40),(41,60),(61,80),(81,100),(101,120)]
candidates = [i + 1 for i, (lo, hi) in enumerate(ranges) if lo <= target <= hi]
pruned = len(ranges) - len(candidates)
scan_fraction = len(candidates) / len(ranges)
```

1. Create six storage-block ranges and one equality filter.

   Changed values: `{"target": 42, "ranges": [[1, 20], [21, 40], [41, 60], [61, 80], [81, 100], [101, 120]]}`

2. Keep only blocks whose metadata range can contain 42.

   Changed values: `{"candidates": [3]}`

3. Five blocks can be skipped without opening them.

   Changed values: `{"pruned": 5}`

4. The toy query scans one sixth of the blocks.

   Changed values: `{"scan_fraction": 0.16666666666666666}`

[Full runnable example](examples/data-engineering.py).

Limits: The local model uses six equal synthetic ranges and one equality predicate. It does not execute either engine, measure bytes or cost, model nulls, expressions, joins, cached results, dynamic file pruning, semi-structured data, or optimizer decisions. Vendor SQL was not run.

## Explore (remaining exploration time)

Move the overlap control. Predict how many of six blocks remain candidates for customer 42 before reading the scan count.

Open data-engineering.html for the executable model.

Model limits: The local model uses six equal synthetic ranges and one equality predicate. It does not execute either engine, measure bytes or cost, model nulls, expressions, joins, cached results, dynamic file pruning, semi-structured data, or optimizer decisions. Vendor SQL was not run.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day24/data-engineering.html">Day24</a>; product material added 2026-10-14.</p><p>A corrected source file keeps the already-loaded name. Best cross-product action?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Publish a versioned name, then reconcile business keys. Both products treat file identity as ingestion memory; immutability makes corrections visible.</p></details><p>Two different files contain order O-7. What does file-level deduplication guarantee?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Each unseen file can load once; business-key dedup is separate. The file identity and business identity are different layers.</p></details>

## Databricks: file statistics make data skipping possible · 9 minutes

Delta file min/max statistics let the engine skip impossible files. Collect statistics for recurring filter columns; use liquid clustering only when workload evidence supports its maintenance cost. SQL was not run.

## Snowflake: micro-partition metadata drives pruning · 9 minutes

Snowflake creates micro-partitions automatically and prunes with their metadata. High overlap depth is evidence of weak clustering for a filter. Clustering can cost serverless credits; measure first. SQL was not run.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Unit | file | micro-partition |
| Metadata | file statistics | automatic partition metadata |
| Layout | liquid clustering | clustering key |
| Evidence | scanned files/bytes | profile and clustering info |

A Delta query scans every file despite a selective late-schema filter. First check?

- Whether skipping statistics exist for that column
- Whether the table name is short
- Whether the query returns JSON

<details><summary>Reveal after predicting</summary>

Whether skipping statistics exist for that column. Pruning needs relevant statistics.

</details>

Snowflake average clustering depth rises for CUSTOMER_ID. What does that suggest?

- More overlapping micro-partitions for that key
- Every query is cached
- The role lost access

<details><summary>Reveal after predicting</summary>

More overlapping micro-partitions for that key. Higher depth means more overlap and often weaker pruning.

</details>

## Certification connection

Focused file statistics, data skipping, liquid-clustering choice, workload evidence, and maintenance boundaries. Delivered coverage is not mastery. Focused micro-partition metadata, pruning, overlap depth, clustering information, Automatic Clustering cost, and Query Profile evidence. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks data skipping](https://docs.databricks.com/aws/en/tables/data-skipping) — Updated October 20, 2026; checked 2026-10-29.
- [Databricks liquid clustering](https://docs.databricks.com/aws/en/tables/clustering) — Living official documentation; checked October 29, 2026; checked 2026-10-29.
- [Snowflake micro-partitions and data clustering](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions) — Living official documentation; checked October 29, 2026; checked 2026-10-29.
- [Snowflake SYSTEM$CLUSTERING_INFORMATION](https://docs.snowflake.com/en/sql-reference/functions/system_clustering_information) — Living official documentation; checked October 29, 2026; checked 2026-10-29.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Guide dated May 4, 2026; checked 2026-10-29.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview last verified October 26, 2026; full IDs/weights unverified; checked 2026-10-29.

## Quiz (4 minutes)

1. Only block 3 has min/max 41–60. What happens for customer_id = 42?
   - Blocks 1, 2, 4, 5, and 6 can be pruned
   - All blocks must be opened
   - The row is deleted

2. Why can clustering improve pruning?
   - It groups similar filter values so block ranges overlap less
   - It makes every query use one CPU
   - It replaces permissions

3. When should you avoid adding another clustering key?
   - The workload rarely filters on it or maintenance cost exceeds scan savings
   - The column has a name
   - The table has six files

4. Which two filter columns dominate bytes scanned in your largest tables?
5. What query-profile evidence would justify paying for layout maintenance?

<details><summary>Answer key — attempt first</summary>

1. Blocks 1, 2, 4, 5, and 6 can be pruned. The other ranges cannot contain 42.

2. It groups similar filter values so block ranges overlap less. Tighter, less-overlapping ranges eliminate more candidate blocks.

3. The workload rarely filters on it or maintenance cost exceeds scan savings. Layout is a workload-and-cost decision, not a checklist item.

</details>

## Sources

- [Databricks data skipping](https://docs.databricks.com/aws/en/tables/data-skipping) — Updated October 20, 2026; checked 2026-10-29.
- [Databricks liquid clustering](https://docs.databricks.com/aws/en/tables/clustering) — Living official documentation; checked October 29, 2026; checked 2026-10-29.
- [Snowflake micro-partitions and data clustering](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions) — Living official documentation; checked October 29, 2026; checked 2026-10-29.
- [Snowflake SYSTEM$CLUSTERING_INFORMATION](https://docs.snowflake.com/en/sql-reference/functions/system_clustering_information) — Living official documentation; checked October 29, 2026; checked 2026-10-29.
