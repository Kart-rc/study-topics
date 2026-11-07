# Send the small lookup table to the data—not the data to the lookup

Data engineering · Day47 · 30 minutes

Recognize when a small-side join can avoid moving a large fact table, and know where Databricks and Snowflake expose different controls.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day27/data-engineering.html">Day27: Choose one source winner before MERGE</a></p><p>Why rank source rows before MERGE?</p><details><summary>Recall first, then reveal the refresher</summary><p>To make one deterministic source winner per target key. One target row should not receive competing source actions.</p></details><p><a href="../Day31/data-engineering.html">Day31: Read only what changed: Delta CDF and Snowflake Streams</a></p><p>A consumer last committed version 100 and version 101 contains an update and insert. What should it read?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only changes after 100, including both operations. The interval begins after the last successful position and preserves operation types.</p></details>

## Understand (4 minutes)

A stadium has 10,000 ticket scans and one 20-row gate map. It is cheaper to give every scanner a copy of the tiny map than to send all ticket scans to one map.

A broadcast join copies a small relation to workers that hold partitions of the large relation. Each worker joins locally. This can remove a large shuffle, but the copied side must fit comfortably in worker memory.



Four workers each hold 2.5 million payment rows. The merchant dimension has 5,000 rows and is 8 MB. Broadcasting sends 8 MB to each worker: 32 MB total. Shuffling both inputs would move the 10-million-row fact side as well. If the “small” side grows to 2 GB, four copies can turn the optimization into memory pressure.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use small-side join planning when a very large fact table repeatedly enriches from a genuinely small, reusable dimension.

**Practical example.** Ten million card events join to 5,000 merchant-risk records before an hourly fraud aggregate.

**How to decide.** First measure compressed and runtime size, freshness, skew, and the physical plan. Broadcast only when the copied side is safely small. On Snowflake, inspect the optimizer's chosen plan rather than looking for a Databricks-style broadcast hint.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The dimension visibly fans out while each fact partition stays on its worker. Increasing dimension size expands every copy, exposing the memory trade rather than merely printing a cost formula.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
fact_rows=10_000_000; dimension_mb=8; workers=4
broadcast_transfer_mb=dimension_mb*workers
fact_rows_per_worker=fact_rows//workers
candidate=dimension_mb<=256; result={'transfer_mb':broadcast_transfer_mb,'fact_rows_per_worker':fact_rows_per_worker,'candidate':candidate}
```

1. Start with a large fact relation and a measured small dimension.

   Changed values: `{"fact_rows": 10000000, "dimension_mb": 8, "workers": 4}`

2. Broadcast creates one dimension copy per worker.

   Changed values: `{"broadcast_transfer_mb": 32}`

3. Fact partitions remain where their worker can join locally.

   Changed values: `{"fact_rows_per_worker": 2500000}`

4. A threshold is only a teaching guard; the real physical plan and memory decide.

   Changed values: `{"candidate": true, "result": {"transfer_mb": 32, "fact_rows_per_worker": 2500000, "candidate": true}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local model uses size arithmetic, not a Spark or Snowflake optimizer. It omits serialization overhead, compression, statistics quality, join type support, skew, cache reuse, spill, network topology, warehouse internals, concurrency, and actual query profiles.

## Explore (remaining exploration time)

Change the dimension size and worker count. Predict copied bytes and whether the dimension is still a safe candidate before revealing the modeled plan.

Open data-engineering.html for the executable model.

Model limits: The local model uses size arithmetic, not a Spark or Snowflake optimizer. It omits serialization overhead, compression, statistics quality, join type support, skew, cache reuse, spill, network topology, warehouse internals, concurrency, and actual query profiles.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day23/data-engineering.html">Day23</a>; product material added 2026-10-13.</p><p>A product lesson exists but no sandbox action ran. What is true?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Curriculum coverage exists; execution skill is unassessed. Delivery is not hands-on evidence.</p></details><p>Which retrieval response is strongest?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Choose a diagnostic and state confirming/disconfirming evidence. Diagnosis needs a falsifiable next observation.</p></details>

## Databricks: hint the small alias, then verify the executed plan · 9 minutes

Hint the small alias with `BROADCAST`, then verify the executed plan and memory. SQL not run in Databricks.

## Snowflake: inspect the managed plan; DIRECTED controls scan order, not broadcast · 9 minutes

Snowflake manages join distribution. Inspect Query Profile; `DIRECTED` is scan/join-order control, not broadcast. SQL not run in Snowflake.

## Compare and predict (2 minutes)

| Decision | Databricks | Snowflake |
|---|---|---|
| Small-side distribution | `BROADCAST` hint plus optimizer/AQE | Managed; no broadcast hint |
| Evidence | Executed physical plan | Query Profile |
| Order control | Statistics and hints | `DIRECTED` is order, not broadcast |

Which Databricks alias should receive BROADCAST?

- The measured small build-side alias
- The largest fact alias
- Every table

<details><summary>Reveal after predicting</summary>

The measured small build-side alias. Broadcast the genuinely small side, subject to join support and memory.

</details>

What does Snowflake DIRECTED not promise?

- Replication of the small table to every worker
- A constrained scan/join order
- The same relational result

<details><summary>Reveal after predicting</summary>

Replication of the small table to every worker. DIRECTED is not a Databricks-style broadcast hint.

</details>

## Certification connection

Data Transformation and Modeling plus Troubleshooting and Optimization: broadcast join selection, memory tradeoffs, AQE, and physical-plan evidence. Performance plus Architecture and Connectivity planning groups: managed join planning, Query Profile evidence, and the precise limit of DIRECTED. Planning groups only; no complete COF-C03 map claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks SQL hints](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-qry-select-hints) — Official Databricks documentation; checked November 6, 2026; checked 2026-11-06.
- [Databricks adaptive query execution](https://docs.databricks.com/aws/en/optimizations/aqe) — Official Databricks documentation; checked November 6, 2026; checked 2026-11-06.
- [Snowflake JOIN](https://docs.snowflake.com/en/sql-reference/constructs/join) — Official Snowflake SQL reference; checked November 6, 2026; checked 2026-11-06.
- [Snowflake Query Profile](https://docs.snowflake.com/en/user-guide/ui-snowsight-activity) — Official Snowflake documentation; checked November 6, 2026; checked 2026-11-06.

## Quiz (4 minutes)

1. An 8 MB dimension joins to a 10-million-row fact table on four workers. What does broadcast change?
   - Each worker receives the 8 MB dimension so its fact partition can join locally
   - All fact rows move to one worker
   - The join becomes logically different

2. Why is a broadcast hint not a universal fix?
   - The copied side can exceed memory and some join strategies may not support the hint
   - It deletes table statistics
   - It makes keys unique

3. What is the closest Snowflake action?
   - Inspect Query Profile and improve pruning/statistics/query shape; Snowflake has no Databricks broadcast hint
   - Add BROADCAST to Snowflake SQL
   - Disable the optimizer

4. Which production dimension is small enough to consider broadcasting, and what measured size supports that claim?
5. Which Query Profile or Spark-plan evidence would make you reverse the decision?

<details><summary>Answer key — attempt first</summary>

1. Each worker receives the 8 MB dimension so its fact partition can join locally. Broadcast changes physical data movement, not relational results.

2. The copied side can exceed memory and some join strategies may not support the hint. Replication trades shuffle for copies and memory; Databricks also documents that hints are not guaranteed for unsupported strategies.

3. Inspect Query Profile and improve pruning/statistics/query shape; Snowflake has no Databricks broadcast hint. The products expose different controls: Snowflake manages distribution and exposes plan evidence.

</details>

## Sources

- [Databricks SQL hints](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-qry-select-hints) — Official Databricks documentation; checked November 6, 2026; checked 2026-11-06.
- [Databricks adaptive query execution](https://docs.databricks.com/aws/en/optimizations/aqe) — Official Databricks documentation; checked November 6, 2026; checked 2026-11-06.
- [Snowflake JOIN](https://docs.snowflake.com/en/sql-reference/constructs/join) — Official Snowflake SQL reference; checked November 6, 2026; checked 2026-11-06.
- [Snowflake Query Profile](https://docs.snowflake.com/en/user-guide/ui-snowsight-activity) — Official Snowflake documentation; checked November 6, 2026; checked 2026-11-06.
