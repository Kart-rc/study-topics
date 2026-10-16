# Scale for one heavy query—or for many waiting queries

Data engineering · Day26 · 30 minutes

Separate query-size capacity from query-concurrency capacity, then make the choice in Databricks and Snowflake.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day20/data-engineering.html">Day20: One receipt becomes two item rows: flatten nested data deliberately</a></p><p>R7 has two objects in items. How many item rows should it emit?</p><details><summary>Recall first, then reveal the refresher</summary><p>Two. Flatten counts array elements, not total quantity.</p></details><p><a href="../Day22/data-engineering.html">Day22: Consolidation case: repair one orders batch without publishing the mistake</a></p><p>Ingest is green but gold has five rows instead of three. First action?</p><details><summary>Recall first, then reveal the refresher</summary><p>Block publish and preserve raw evidence. A transport success does not prove the business result.</p></details>

## Understand (4 minutes)

Imagine a supermarket. A wider checkout lane helps one shopper with a huge cart. Opening more lanes helps many shoppers who are waiting. Data warehouses have the same two controls: make a worker larger for a heavy query, or add workers/clusters for concurrency.

Do not resize first and ask why later. Look at the symptom: one query spills or runs slowly, or many otherwise healthy queries sit in a queue.



At 09:00, one finance query needs 70 capacity units. At 10:00, twelve dashboard queries each need 10. A 40-unit worker cannot run the finance query efficiently; a single 80-unit worker can. But twelve dashboard requests still queue behind one another unless the service can add clusters.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this decision whenever a SQL endpoint is slow: first distinguish per-query pressure from concurrency pressure.

**Practical example.** A month-end reconciliation spills on one cluster, while the morning BI dashboard is fast once it starts but waits in a queue.

**How to decide.** Scale up for a query that cannot fit or parallelize well. Scale out for many independent queries waiting. Add auto-stop/suspend only after choosing the right capacity shape.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Read the diagram as two separate questions. The left pair compares one query with one worker. The right pair compares arrivals with available lanes; it never suggests that a larger lane automatically creates more lanes.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
heavy_need=70
worker_capacity=40
scale_up=80 if heavy_need>worker_capacity else worker_capacity
small_queries=12
queries_per_cluster=4
clusters=(small_queries+queries_per_cluster-1)//queries_per_cluster
initial_wait=max(0,small_queries-clusters*queries_per_cluster)
```

1. Start with a heavy query that exceeds one worker shape.

   Changed values: `{"heavy_need": 70, "worker_capacity": 40}`

2. Choose a larger shape for the single-query need.

   Changed values: `{"scale_up": 80}`

3. Now model many independent dashboard queries.

   Changed values: `{"small_queries": 12, "queries_per_cluster": 4}`

4. Add lanes until all twelve can begin in this teaching model.

   Changed values: `{"clusters": 3, "initial_wait": 0}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser uses synthetic capacity units and a simple queue formula. Real engines schedule stages, cache data, isolate workloads, and charge differently. The Databricks and Snowflake SQL below is unexecuted vendor practice.

## Explore (remaining exploration time)

Move the heavy-query size and concurrent-query count. The diagram changes from a wider lane to more lanes and explains the bottleneck.

Open data-engineering.html for the executable model.

Model limits: The browser uses synthetic capacity units and a simple queue formula. Real engines schedule stages, cache data, isolate workloads, and charge differently. The Databricks and Snowflake SQL below is unexecuted vendor practice.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day21/data-engineering.html">Day21</a>; product material added 2026-10-11.</p><p>Databricks validation fails. Which setting protects publish?</p><details><summary>Recall first, then reveal the product refresher</summary><p>ALL_SUCCESS. Publish should require its quality dependency to succeed.</p></details><p>Snowflake task &lt;code&gt;publish AFTER validate&lt;/code&gt;: when does publish normally start?</p><details><summary>Recall first, then reveal the product refresher</summary><p>After validate succeeds. The dependency, not warehouse availability alone, controls readiness.</p></details>

## Databricks: warehouse size and cluster range answer different questions · 9 minutes

Vendor configuration is unexecuted. Warehouse size addresses per-query capacity; min/max clusters address concurrency; auto-stop addresses idle cost. Confirm serverless availability and workspace policy.

## Snowflake: warehouse size versus multi-cluster concurrency · 9 minutes

Vendor SQL is unexecuted. Warehouse size is the per-cluster shape. A multi-cluster warehouse adds clusters for queued concurrency and requires the relevant edition. AUTO_SUSPEND controls idle use.

## Compare and predict (2 minutes)

| Decision | Databricks SQL | Snowflake |
|---|---|---|
| Heavy query | warehouse size/tune | warehouse size/tune |
| Queue | cluster range | multi-cluster |
| Idle | auto stop | auto suspend/resume |

Dashboard queries run quickly after starting but wait in line. Common answer?

- Add concurrency lanes/clusters
- Only make each cluster larger
- Turn off query history

<details><summary>Reveal after predicting</summary>

Add concurrency lanes/clusters. Queue pressure is a scale-out problem.

</details>

One reconciliation spills with no queue. Common first direction?

- Increase per-query size or tune it
- Add more identical concurrency clusters only
- Reduce observability

<details><summary>Reveal after predicting</summary>

Increase per-query size or tune it. One query needs a wider lane.

</details>

## Certification connection

Focused SQL warehouse sizing, concurrency scaling, and idle-cost controls; not complete compute or optimization coverage. Focused warehouse sizing, multi-cluster concurrency, and auto-suspend decisions; planning groups only because full COF-C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks SQL warehouse types](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-types) — Updated September 11, 2026; checked 2026-10-16.
- [Databricks: create a SQL warehouse](https://docs.databricks.com/aws/en/compute/sql-warehouse/create) — Living documentation; checked 2026-10-16.
- [Snowflake virtual warehouse overview](https://docs.snowflake.com/en/user-guide/warehouses-overview) — Living documentation; checked 2026-10-16.
- [Snowflake multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) — Living documentation; checked 2026-10-16.

## Quiz (4 minutes)

1. One query spills while there is no queue. First capacity move?
   - Increase per-query/warehouse size
   - Add more identical clusters only
   - Increase retry count

2. Queries are fast after they start, but twenty wait. Best direction?
   - Scale out concurrency
   - Make SQL longer
   - Disable autoscaling

3. Why keep auto-stop or auto-suspend?
   - To reduce idle compute cost
   - To improve data correctness
   - To replace access control

4. Which production metrics would distinguish spill/scan pressure from queue pressure?
5. Where would you isolate dashboard and ETL workloads instead of scaling one shared endpoint?

<details><summary>Answer key — attempt first</summary>

1. Increase per-query/warehouse size. The symptom is one query exceeding its lane, not many queries waiting.

2. Scale out concurrency. More lanes address waiting independent work.

3. To reduce idle compute cost. Idle-time controls address cost, not query semantics.

</details>

## Sources

- [Databricks SQL warehouse types](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-types) — Updated September 11, 2026; checked 2026-10-16.
- [Databricks: create a SQL warehouse](https://docs.databricks.com/aws/en/compute/sql-warehouse/create) — Living documentation; checked 2026-10-16.
- [Snowflake virtual warehouse overview](https://docs.snowflake.com/en/user-guide/warehouses-overview) — Living documentation; checked 2026-10-16.
- [Snowflake multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) — Living documentation; checked 2026-10-16.
