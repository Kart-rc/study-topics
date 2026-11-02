# Consolidation case: make the 9 AM payments dashboard trustworthy and fast

Data engineering · Day43 · 30 minutes

Join five separate mechanisms into one release decision: wake on data, read less, reject bad rows, publish atomically, and add the right serving capacity.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day25/data-engineering.html">Day25: Share live data without copying it</a></p><p>The provider updates its table from v3 to v4. With access intact, what should a live-share reader query?</p><details><summary>Recall first, then reveal the refresher</summary><p>The current shared data, subject to platform refresh semantics. The share exposes provider-owned data rather than a detached export.</p></details><p><a href="../Day29/data-engineering.html">Day29: Consolidation case: recover and publish one corrected partner feed</a></p><p>The partner overwrites the same path. What identity should drive reprocessing?</p><details><summary>Recall first, then reveal the refresher</summary><p>A version/content identity plus audit metadata. A stable path can point at changed bytes; preserve version/content evidence.</p></details>

## Understand (4 minutes)

A restaurant can open on time only if five things line up: ingredients arrive, the cook finds the right items, spoiled food is rejected, the menu changes without disappearing, and enough tables are open.

A data product has the same chain. An arrival trigger starts work. Storage statistics skip irrelevant files or micro-partitions. A quality gate decides whether the candidate may continue. Atomic publication keeps the old table visible until the new one is ready. Query evidence decides whether to add clusters for waiting queries or size for one hungry query.



At 8:52 AM, twenty payment files arrive. A date and tenant filter needs only three storage blocks. The candidate has 100 rows; four have a null account ID. The release must leave yesterday's table live. After correction, the candidate publishes as version 43. At 9:00 AM, thirty dashboard queries arrive; three ten-slot lanes clear the queue.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this release chain when a business dashboard or regulated data product has freshness, correctness, continuity, and query-latency obligations at the same time.

**Practical example.** A finance payments dashboard must be current by 9 AM, never expose invalid account rows, and remain queryable during publication.

**How to decide.** Treat each mechanism as a separate control with its own evidence. Do not use more compute to hide a quality failure, do not publish by dropping the live table, and do not assume an arrival trigger proves data was processed.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The release path keeps triggering, pruning, quality, publication, and serving as separate gates. A failure changes the downstream path and the exact live-table state.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
files=20; candidate_rows=100; invalid_rows=4; live_version=42
blocks_read=3; blocks_skipped=files-blocks_read
quality_ok=invalid_rows==0; publish_allowed=quality_ok
visible_version=43 if publish_allowed else live_version; queued_queries=0
```

1. Start with arrived files and yesterday's live table.

   Changed values: `{"files": 20, "candidate_rows": 100, "invalid_rows": 4, "live_version": 42}`

2. A selective filter prunes seventeen toy storage blocks.

   Changed values: `{"blocks_read": 3, "blocks_skipped": 17}`

3. Four invalid rows stop publication.

   Changed values: `{"quality_ok": false, "publish_allowed": false}`

4. The old version remains visible; serving never sees the bad candidate.

   Changed values: `{"visible_version": 42, "queued_queries": 0}`

[Full runnable example](examples/data-engineering.py).

Limits: This local release model uses fixed row, block, and query counts. It does not run either vendor, model cloud-event delivery, retries, concurrent writers, catalog privileges, task history, full SQL semantics, warm-up, credits, or a real query profile.

## Explore (remaining exploration time)

Choose the failure point. Follow the same candidate from arrival to serving and identify exactly where it must stop and what remains visible.

Open data-engineering.html for the executable model.

Model limits: This local release model uses fixed row, block, and query counts. It does not run either vendor, model cloud-event delivery, retries, concurrent writers, catalog privileges, task history, full SQL semantics, warm-up, credits, or a real query profile.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day27/data-engineering.html">Day27</a>; product material added 2026-10-17.</p><p>What should cross the source/target boundary?</p><details><summary>Recall first, then reveal the product refresher</summary><p>One ranked winner per business key. Both products are safer when MERGE receives one deterministic source row per key.</p></details><p>Snowflake strict nondeterministic-merge checking errors. Best fix?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Deduplicate/rank the source by the business rule. Define the winner instead of disabling the guardrail.</p></details>

## Databricks: make a failed expectation leave the previous table live · 9 minutes

A file-arrival trigger wakes the job; data-skipping statistics reduce reads; a fail-update expectation rolls back the failing update; atomic replacement publishes only the validated candidate; queue/spill evidence chooses serving capacity. SQL was not run.

## Snowflake: measure quality, then make the swap an explicit release gate · 9 minutes

A stream wakes a triggered task; micro-partition metadata prunes reads; DMFs measure and notify; orchestration must block the SWAP on a breach; multi-cluster addresses concurrency. Snowflake SQL was not run.

## Compare and predict (2 minutes)

| Concern | Databricks | Snowflake |
|---|---|---|
| Wake | file arrival + job | stream + triggered task |
| Quality | fail-update expectation | DMF evidence + orchestration |
| Publish | replace table | swap tables |
| Concurrency | IWM / cluster bounds | multi-cluster |

A Databricks fail-update expectation finds four null account IDs. What publishes?

- The prior live table remains
- Four bad rows plus 96 good rows
- An empty table

<details><summary>Reveal after predicting</summary>

The prior live table remains. The failing update rolls back; publication must not advance to the candidate.

</details>

A Snowflake DMF expectation reports NULL_COUNT 4. What prevents an unsafe SWAP?

- Explicit orchestration that checks the result and blocks
- The multi-cluster warehouse
- Micro-partition pruning

<details><summary>Reveal after predicting</summary>

Explicit orchestration that checks the result and blocks. The quality signal must be connected to the release decision; compute and pruning do not enforce it.

</details>

## Certification connection

Consolidates event-driven ingestion, storage skipping, fail-update quality gates, atomic replacement, and SQL warehouse evidence. Delivered coverage is not mastery. Consolidates triggered tasks, pruning, DMF evidence, controlled table swap, and multi-cluster serving. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks file arrival triggers](https://docs.databricks.com/aws/en/jobs/file-arrival-triggers) — Official documentation; updated October 7, 2026; checked November 2, 2026; checked 2026-11-02.
- [Databricks data skipping](https://docs.databricks.com/aws/en/tables/data-skipping) — Official documentation; checked November 2, 2026; checked 2026-11-02.
- [Databricks pipeline expectations](https://docs.databricks.com/aws/en/ldp/expectations) — Official documentation; updated October 26, 2026; checked November 2, 2026; checked 2026-11-02.
- [Databricks CREATE TABLE and REPLACE](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-table-using) — Official SQL reference; checked November 2, 2026; checked 2026-11-02.
- [Databricks SQL warehouse behavior](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-behavior) — Official documentation; updated October 8, 2026; checked November 2, 2026; checked 2026-11-02.
- [Snowflake triggered tasks](https://docs.snowflake.com/en/user-guide/tasks-triggered) — Official documentation; checked November 2, 2026; checked 2026-11-02.
- [Snowflake micro-partitions and pruning](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions) — Official documentation; checked November 2, 2026; checked 2026-11-02.
- [Snowflake ALTER TABLE, SWAP, and DMF syntax](https://docs.snowflake.com/en/sql-reference/sql/alter-table) — Official SQL reference; checked November 2, 2026; checked 2026-11-02.
- [Snowflake multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) — Official documentation; checked November 2, 2026; checked 2026-11-02.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official guide for exams on or after May 4, 2026; rechecked November 2, 2026; checked 2026-11-02.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview rechecked November 2, 2026; full study-guide IDs and weights still not exposed; checked 2026-11-02.

## Quiz (4 minutes)

1. Four invalid account rows reach the quality gate. What should the dashboard read?
   - Yesterday's valid live table
   - A partially updated table
   - No table name

2. Why is the arrival trigger not a progress checkpoint?
   - It wakes work but does not prove which records committed
   - It automatically swaps tables
   - It sizes the SQL warehouse

3. The release is valid, but thirty short queries wait. Which evidence-driven move fits?
   - Add concurrent serving clusters
   - Disable the quality gate
   - Drop and recreate the table

4. Which five pieces of evidence would you require before declaring this dashboard ready?
5. Where can a retry occur without exposing a partial or bad table?

<details><summary>Answer key — attempt first</summary>

1. Yesterday's valid live table. The candidate must fail before atomic publication, preserving the last good version.

2. It wakes work but does not prove which records committed. Triggering and durable processing progress are separate responsibilities.

3. Add concurrent serving clusters. The bottleneck is query concurrency after a successful release, not data correctness or publication.

</details>

## Sources

- [Databricks file arrival triggers](https://docs.databricks.com/aws/en/jobs/file-arrival-triggers) — Official documentation; updated October 7, 2026; checked November 2, 2026; checked 2026-11-02.
- [Databricks data skipping](https://docs.databricks.com/aws/en/tables/data-skipping) — Official documentation; checked November 2, 2026; checked 2026-11-02.
- [Databricks pipeline expectations](https://docs.databricks.com/aws/en/ldp/expectations) — Official documentation; updated October 26, 2026; checked November 2, 2026; checked 2026-11-02.
- [Databricks CREATE TABLE and REPLACE](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-table-using) — Official SQL reference; checked November 2, 2026; checked 2026-11-02.
- [Databricks SQL warehouse behavior](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-behavior) — Official documentation; updated October 8, 2026; checked November 2, 2026; checked 2026-11-02.
- [Snowflake triggered tasks](https://docs.snowflake.com/en/user-guide/tasks-triggered) — Official documentation; checked November 2, 2026; checked 2026-11-02.
- [Snowflake micro-partitions and pruning](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions) — Official documentation; checked November 2, 2026; checked 2026-11-02.
- [Snowflake ALTER TABLE, SWAP, and DMF syntax](https://docs.snowflake.com/en/sql-reference/sql/alter-table) — Official SQL reference; checked November 2, 2026; checked 2026-11-02.
- [Snowflake multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) — Official documentation; checked November 2, 2026; checked 2026-11-02.
