# Add clusters for waiting queries; add size for a hungry query

Data engineering · Day42 · 30 minutes

Distinguish concurrency scaling from per-query sizing so a busy SQL service does not spend more while fixing the wrong bottleneck.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day30/data-engineering.html">Day30: Retrieval lab: choose the control from the incident symptom</a></p><p>Twenty short reader queries wait while individual runtimes are normal. Which lever best matches the symptom?</p><details><summary>Recall first, then reveal the refresher</summary><p>Increase concurrency capacity after confirming queueing. Waiting readers are a concurrency signal, not automatically a per-query-size problem.</p></details><p><a href="../Day2/data-engineering.html">Day2: Watermarks: when can a window be forgotten?</a></p><p>With max event time 12 and delay 5, what watermark is used in this model&#x27;s next batch?</p><details><summary>Recall first, then reveal the refresher</summary><p>7. Subtract the allowed delay from the prior maximum: 12 − 5 = 7.</p></details>

## Understand (4 minutes)

A grocery store has two different problems. A long checkout line needs more open lanes. One oversized cart needs a lane with more room and staff.

SQL warehouses have the same split. Scale out adds clusters so more independent queries run at once. Scale up gives each cluster more compute and memory, which can help a single query that spills or scans heavily. More clusters do not automatically make one slow query fast.



Thirty queries arrive together. One cluster can actively serve ten in the teaching model, so twenty wait. Three same-sized clusters can serve all thirty concurrently. But one query that needs 18 GB while a cluster offers 12 GB still spills; it needs a larger size or a better plan, not another identical cluster.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this distinction when dashboard or BI users report queues, when a query profile reports spill, or when cost rises after indiscriminate warehouse resizing.

**Practical example.** A finance dashboard opens at 9 AM with 30 short queries while one month-end aggregation spills to disk.

**How to decide.** Add concurrency capacity when many short queries wait. Increase size or optimize SQL when one query lacks memory or compute. Separate workloads when their SLOs and cost controls differ; measure queue and spill evidence before changing either knob.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The visual keeps queue capacity and per-query memory on separate readouts. Moving the cluster control can empty the queue while leaving the same spill unchanged.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
queries=30; slots_per_cluster=10; clusters=1
running=min(queries, slots_per_cluster*clusters); queued=queries-running
clusters=3; running=min(queries, slots_per_cluster*clusters); queued=queries-running
memory_need_gb=18; cluster_memory_gb=12; spill_gb=max(0,memory_need_gb-cluster_memory_gb)
```

1. Start with one concurrency lane group.

   Changed values: `{"queries": 30, "slots_per_cluster": 10, "clusters": 1}`

2. Ten run and twenty wait.

   Changed values: `{"running": 10, "queued": 20}`

3. Three clusters admit all thirty in the toy.

   Changed values: `{"clusters": 3, "running": 30, "queued": 0}`

4. The same large query still exceeds per-cluster capacity.

   Changed values: `{"memory_need_gb": 18, "cluster_memory_gb": 12, "spill_gb": 6}`

[Full runnable example](examples/data-engineering.py).

Limits: The local arithmetic uses ten query slots per cluster and one memory threshold. Real admission, scheduling, caching, I/O, serverless prediction, query shape, cluster warm-up, permissions, editions, and credits differ. No vendor warehouse or SQL ran.

## Explore (remaining exploration time)

Change query count, clusters, and memory demand. Predict whether the queue or the large query remains the limiting problem.

Open data-engineering.html for the executable model.

Model limits: The local arithmetic uses ten query slots per cluster and one memory threshold. Real admission, scheduling, caching, I/O, serverless prediction, query shape, cluster warm-up, permissions, editions, and credits differ. No vendor warehouse or SQL ran.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day25/data-engineering.html">Day25</a>; product material added 2026-10-15.</p><p>A consumer needs current rows but must not own a writable copy. Best common mechanism?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Live read-only share. Both products expose provider-owned data through read-only sharing.</p></details><p>What survives after a recipient exported shared rows before revocation?</p><details><summary>Recall first, then reveal the product refresher</summary><p>The recipient-created export may remain. Revocation stops future shared access; it cannot recall an independent copy already made.</p></details>

## Databricks: use queue and spill evidence to choose the knob · 9 minutes

Databricks serverless IWM manages queuing and autoscaling. For classic/pro, configure cluster bounds. Use Peak Queued Queries for concurrency and Query Profile spill for per-query sizing. Warehouse creation uses UI/API/Terraform, not SQL; the sketch was not run.

## Snowflake: multi-cluster is a concurrency control, not a slow-query cure · 9 minutes

Snowflake auto-scale mode has MIN less than MAX; STANDARD favors less queuing and ECONOMY favors fuller clusters. Multi-cluster is an Enterprise Edition feature and targets concurrency, not one slow query. SQL was not run.

## Compare and predict (2 minutes)

| Decision | Databricks | Snowflake |
|---|---|---|
| Concurrency | queued queries / clusters | multi-cluster min/max |
| Single query | size or plan | resize or plan |
| Boundary | SKU/permissions | edition/credits |

Databricks shows zero queued queries but a query spills. First move?

- Inspect plan and size
- Increase max clusters
- Add a second dashboard

<details><summary>Reveal after predicting</summary>

Inspect plan and size. Scale-out does not add memory to the cluster running that query.

</details>

Snowflake has many short queued queries. Which feature targets this?

- Multi-cluster auto-scale
- A larger result cache key
- A longer statement timeout

<details><summary>Reveal after predicting</summary>

Multi-cluster auto-scale. Multi-cluster adds concurrent same-sized compute lanes.

</details>

## Certification connection

Focused SQL warehouse sizing, queuing, concurrency scaling, monitoring evidence, permissions, and cost boundaries. Delivered coverage is not mastery. Focused virtual warehouse size, multi-cluster auto-scale, scaling policy, edition, concurrency, and credit boundaries. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks SQL warehouse sizing, scaling, and queuing behavior](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-behavior) — Official documentation; updated October 8, 2026; checked November 1, 2026; checked 2026-11-01.
- [Databricks: Create a SQL warehouse](https://docs.databricks.com/aws/en/compute/sql-warehouse/create) — Official documentation; checked November 1, 2026; checked 2026-11-01.
- [Snowflake: Multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) — Official documentation; checked November 1, 2026; checked 2026-11-01.
- [Snowflake CREATE WAREHOUSE](https://docs.snowflake.com/en/sql-reference/sql/create-warehouse) — Official SQL reference; checked November 1, 2026; checked 2026-11-01.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official guide for exams on or after May 4, 2026; rechecked November 1, 2026; checked 2026-11-01.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview rechecked November 1, 2026; full IDs/weights still unverified; checked 2026-11-01.

## Quiz (4 minutes)

1. 30 queries, one ten-slot cluster, no spill. Which first change addresses the queue?
   - Increase maximum clusters
   - Double every table
   - Increase one query timeout

2. Why can three clusters leave one spilling query slow?
   - Clusters improve concurrency; each query still runs on one cluster's resources
   - Spill is a network permission
   - Queues delete query plans

3. What evidence should block blind scale-out?
   - No queue, but query profile shows spill
   - Peak queued queries stay above zero
   - Thirty short queries arrive together

4. Which warehouse currently shows queue evidence, and which shows spill or plan evidence?
5. What cost and latency SLO will tell you whether the change worked?

<details><summary>Answer key — attempt first</summary>

1. Increase maximum clusters. More same-sized clusters create concurrent lanes for independent queries.

2. Clusters improve concurrency; each query still runs on one cluster's resources. The bottleneck is per-query capacity or plan shape, not the number of parallel lanes.

3. No queue, but query profile shows spill. With no queue and visible spill, more clusters target the wrong problem.

</details>

## Sources

- [Databricks SQL warehouse sizing, scaling, and queuing behavior](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-behavior) — Official documentation; updated October 8, 2026; checked November 1, 2026; checked 2026-11-01.
- [Databricks: Create a SQL warehouse](https://docs.databricks.com/aws/en/compute/sql-warehouse/create) — Official documentation; checked November 1, 2026; checked 2026-11-01.
- [Snowflake: Multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) — Official documentation; checked November 1, 2026; checked 2026-11-01.
- [Snowflake CREATE WAREHOUSE](https://docs.snowflake.com/en/sql-reference/sql/create-warehouse) — Official SQL reference; checked November 1, 2026; checked 2026-11-01.
