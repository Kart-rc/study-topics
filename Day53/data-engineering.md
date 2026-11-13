# Cluster for the filters you actually run—not every column you own

Data engineering · Day53 · 30 minutes

Use workload evidence to decide whether reorganizing a large table can skip enough storage to repay its maintenance cost.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day30/data-engineering.html">Day30: Retrieval lab: choose the control from the incident symptom</a></p><p>Twenty short reader queries wait while individual runtimes are normal. Which lever best matches the symptom?</p><details><summary>Recall first, then reveal the refresher</summary><p>Increase concurrency capacity after confirming queueing. Waiting readers are a concurrency signal, not automatically a per-query-size problem.</p></details><p><a href="../Day34/data-engineering.html">Day34: A clone starts shared; changed data becomes its own</a></p><p>A zero-copy clone is created and no rows change. What is copied initially?</p><details><summary>Recall first, then reveal the refresher</summary><p>Metadata references; existing data storage is shared. The clone begins by sharing existing immutable storage.</p></details>

## Understand (4 minutes)

A grocery store groups cereal in one aisle. A shopper looking for cereal can skip produce, dairy, and frozen food. If every product were scattered across every aisle, the shopper would inspect the whole store.

Large analytical tables work similarly. Good layout puts related filter values into fewer storage units. A query can then skip units whose metadata proves they cannot match. The win comes from less data read, not from a magic sort command. Choose keys from repeated, selective filters and verify bytes or partitions scanned before paying to rewrite data.



An orders table has twelve storage units. Rows for customer c52 are scattered across four units, so the query reads four. After layout maintenance groups nearby customer values, the same query reads one unit. A filter on unclustered notes still scans broadly.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Consider clustering when a multi-terabyte table serves repeated selective filters and scan evidence shows poor pruning.

**Practical example.** A financial investigation repeatedly filters an orders table by customer_id and event_date but reads most files or micro-partitions.

**How to decide.** Start with query history and scan evidence. Prefer automatic or managed layout where appropriate, use a small stable key set, measure maintenance credits or rewrite work, and remove a key that does not repay its cost.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Four storage units show c52 scattered and then grouped, making the number read and skipped visible on one consistent scale.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
units_before=[['c52','c10'],['c20','c52'],['c52','c70'],['c90','c52']]
scanned_before=sum('c52' in unit for unit in units_before)
units_after=[['c10','c20'],['c52','c52'],['c70','c80'],['c90','c99']]; scanned_after=sum('c52' in unit for unit in units_after)
result={'before':scanned_before,'after':scanned_after,'skipped_after':len(units_after)-scanned_after}
```

1. Place c52 in every synthetic storage unit.

   Changed values: `{"units_before": [["c52", "c10"], ["c20", "c52"], ["c52", "c70"], ["c90", "c52"]]}`

2. Count units whose metadata cannot rule out c52.

   Changed values: `{"scanned_before": 4}`

3. Regroup rows so c52 occupies one unit.

   Changed values: `{"units_after": [["c10", "c20"], ["c52", "c52"], ["c70", "c80"], ["c90", "c99"]], "scanned_after": 1}`

4. Compare units read and skipped for the same predicate.

   Changed values: `{"result": {"before": 4, "after": 1, "skipped_after": 3}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local Python and JavaScript worlds use tiny lists and exact metadata. They do not run Delta, Photon, OPTIMIZE, predictive optimization, Snowflake Automatic Clustering, micro-partition pruning, Query Profile, concurrent DML, statistics collection, cloud storage, or credit billing.

## Explore (remaining exploration time)

Move c52 between storage units and compare scattered versus grouped layout. Predict the number of units a customer filter must read.

Open data-engineering.html for the executable model.

Model limits: The local Python and JavaScript worlds use tiny lists and exact metadata. They do not run Delta, Photon, OPTIMIZE, predictive optimization, Snowflake Automatic Clustering, micro-partition pruning, Query Profile, concurrent DML, statistics collection, cloud storage, or credit billing.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day17/data-engineering.html">Day17</a>; product material added 2026-10-08.</p><p>After a Databricks Delta sink commit, restarting with the same valid checkpoint replays a batch. What protects the copied rows?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Same query + batch in Delta. The same query/batch can be recognized by the Delta sink. A new query identity changes that boundary. This says nothing about independent duplicate business events.</p></details><p>You SELECT a Snowflake stream, then INSERT from it inside a transaction that rolls back. What persists?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Neither change persists. SELECT does not consume the stream. The rolled-back consuming transaction preserves the old target and stream position, allowing a retry.</p></details>

## Databricks: liquid clustering reorganizes files for data skipping · 9 minutes

Recall Day31 change feeds and Day47 plan evidence. Liquid clustering declares layout keys; OPTIMIZE rewrites files to colocate key values for data skipping. Maintenance may be managed by predictive optimization for eligible Unity Catalog managed tables or scheduled explicitly. SQL not executed in Databricks.

## Snowflake: clustering keys guide automatic micro-partition maintenance · 9 minutes

Recall Day47 Query Profile evidence. Snowflake micro-partition metadata enables pruning. A clustering key can improve very large tables with repeated filters; Automatic Clustering maintains the key, with credit cost when reclustering. Sustained DML can increase maintenance. SQL not executed in Snowflake.

## Compare and predict (2 minutes)

Both mechanisms improve pruning by reducing overlap, but they operate on different storage units and maintenance systems. Databricks liquid clustering rewrites Delta files through OPTIMIZE or eligible predictive optimization. Snowflake Automatic Clustering maintains micro-partitions after a key is defined and can consume credits. Measure each in its native evidence.

A Databricks query filters customer_id but c52 still appears in four files. What action is evidence-aligned?

- Verify the filter is frequent/selective, define a useful clustering key, run or schedule maintenance, then re-measure
- Add every table column as a key
- Increase retries

<details><summary>Reveal after predicting</summary>

Verify the filter is frequent/selective, define a useful clustering key, run or schedule maintenance, then re-measure. Layout changes should follow workload evidence and be verified after file rewrite.

</details>

A Snowflake table receives sustained DML after a clustering key is added. What should you watch?

- Pruning improvement and Automatic Clustering credit usage
- Only result row count
- Kafka consumer lag

<details><summary>Reveal after predicting</summary>

Pruning improvement and Automatic Clustering credit usage. The benefit and background maintenance cost can both change with DML.

</details>

## Certification connection

Liquid clustering, OPTIMIZE, data skipping, managed maintenance, runtime and cost boundaries. Micro-partition pruning, clustering keys, Automatic Clustering, DML and credit boundaries. Planning groups only; full COF-C03 IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and recorded example is local Python.

- [Databricks: Use liquid clustering for tables](https://docs.databricks.com/aws/en/tables/clustering) — Official Databricks documentation; checked November 13, 2026; checked 2026-11-13.
- [Databricks: Optimize data file layout](https://docs.databricks.com/aws/en/tables/operations/optimize) — Official Databricks documentation; checked November 13, 2026; checked 2026-11-13.
- [Snowflake: Clustering keys and clustered tables](https://docs.snowflake.com/en/user-guide/tables-clustering-keys) — Official Snowflake documentation; checked November 13, 2026; checked 2026-11-13.
- [Snowflake: Automatic Clustering](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering) — Official Snowflake documentation; checked November 13, 2026; checked 2026-11-13.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official May 4, 2026 guide; last weekly check November 11, 2026; checked 2026-11-13.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview; last weekly check November 11, 2026; full study-guide objective IDs and weights remain unverified; checked 2026-11-13.

## Quiz (4 minutes)

1. c52 appears in one of four storage units after maintenance. What changed?
   - The query can skip three units using metadata
   - Every query became faster
   - The table stopped accepting writes

2. Why inspect query history before choosing a clustering key?
   - Repeated selective filters determine whether skipped reads can repay maintenance
   - The newest column is always best
   - Clustering removes compute cost

3. When should you avoid adding another key?
   - When maintenance cost rises but scan evidence barely improves
   - Whenever a table has more than one column
   - Whenever filters use dates

4. Which production filter currently reads far more storage than its selectivity suggests?
5. What before/after scan evidence and maintenance cost would justify retaining its layout key?

<details><summary>Answer key — attempt first</summary>

1. The query can skip three units using metadata. The benefit is bounded to predicates that align with useful layout metadata.

2. Repeated selective filters determine whether skipped reads can repay maintenance. A key earns its place through workload evidence, not schema prominence.

3. When maintenance cost rises but scan evidence barely improves. Clustering is an optimization with rewrite or service cost, not a free correctness feature.

</details>

## Sources

- [Databricks: Use liquid clustering for tables](https://docs.databricks.com/aws/en/tables/clustering) — Official Databricks documentation; checked November 13, 2026; checked 2026-11-13.
- [Databricks: Optimize data file layout](https://docs.databricks.com/aws/en/tables/operations/optimize) — Official Databricks documentation; checked November 13, 2026; checked 2026-11-13.
- [Snowflake: Clustering keys and clustered tables](https://docs.snowflake.com/en/user-guide/tables-clustering-keys) — Official Snowflake documentation; checked November 13, 2026; checked 2026-11-13.
- [Snowflake: Automatic Clustering](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering) — Official Snowflake documentation; checked November 13, 2026; checked 2026-11-13.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official May 4, 2026 guide; last weekly check November 11, 2026; checked 2026-11-13.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview; last weekly check November 11, 2026; full study-guide objective IDs and weights remain unverified; checked 2026-11-13.
