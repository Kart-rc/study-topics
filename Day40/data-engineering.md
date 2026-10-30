# Replace a live table without an empty-name gap

Data engineering · Day40 · 30 minutes

Publish a complete replacement atomically while preserving the product-specific identity, history, and access behavior you actually need.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day29/data-engineering.html">Day29: Consolidation case: recover and publish one corrected partner feed</a></p><p>The partner overwrites the same path. What identity should drive reprocessing?</p><details><summary>Recall first, then reveal the refresher</summary><p>A version/content identity plus audit metadata. A stable path can point at changed bytes; preserve version/content evidence.</p></details><p><a href="../Day1/data-engineering.html">Day1: The commit is the boundary</a></p><p>Blue commits first. Amber uses base 0. What changes?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; Amber detects a conflict. The failed comparison publishes nothing. Amber must refresh before retrying.</p></details>

## Understand (4 minutes)

A grocery shelf should switch from yesterday's price list to today's complete list in one move. Taking the old list down and building the new one line by line leaves shoppers with an empty or half-built list.

An atomic replacement makes one catalog decision: readers see the old complete table or the new complete table, never the gap between DROP and CREATE. Databricks replaces the contents while keeping the table identity and Delta history. Snowflake can swap the names of two prepared table objects in one transaction. Those are related outcomes, not the same mechanism.



prod.orders has 3 validated rows. A rebuild creates 4 corrected rows. With drop-then-create, a reader between statements sees “table missing.” With Databricks CREATE OR REPLACE TABLE, the named table moves from version 7 to version 8. With Snowflake ALTER TABLE prod.orders SWAP WITH prod.orders_next, the two table names exchange objects atomically.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use atomic replacement when a full snapshot or corrected rebuild must become visible to concurrent readers as one publication event.

**Practical example.** A nightly customer dimension rebuild must publish 40 million validated rows without exposing an empty table to dashboards.

**How to decide.** Use incremental MERGE when only a small known delta changes. Use replacement when the entire result is authoritative, validation happens before publication, rollback is planned, and product-specific grants, policies, streams, dependencies, and history have been checked.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The shared timeline answers whether a reader can observe an empty catalog name. The product visuals then separate Databricks version replacement from Snowflake name swapping instead of suggesting false equivalence.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
old_rows = ['o1', 'o2', 'o3']; new_rows = ['o1', 'o2-fixed', 'o3', 'o4']
drop_create_views = {'before': len(old_rows), 'during': 0, 'after': len(new_rows)}
atomic_views = {'before': len(old_rows), 'during': len(old_rows), 'after': len(new_rows)}
gap_seen = drop_create_views['during'] == 0; gap_avoided = atomic_views['during'] > 0
```

1. Prepare complete old and new snapshots.

   Changed values: `{"old_rows": ["o1", "o2", "o3"], "new_rows": ["o1", "o2-fixed", "o3", "o4"]}`

2. Two statements create an observable missing-name interval.

   Changed values: `{"drop_create_views": {"before": 3, "during": 0, "after": 4}}`

3. One publication decision keeps a complete snapshot visible.

   Changed values: `{"atomic_views": {"before": 3, "during": 3, "after": 4}}`

4. The same reader moment distinguishes the mechanisms.

   Changed values: `{"gap_seen": true, "gap_avoided": true}`

[Full runnable example](examples/data-engineering.py).

Limits: The local model has two snapshots and three reader moments. It does not execute either product, model concurrent writers, streaming checkpoints, streams, dynamic tables, foreign dependencies, grants, policies, retention, storage costs, or every DDL restriction. Vendor SQL was not run.

## Explore (remaining exploration time)

Choose drop/create or atomic publication. Step through a reader arriving before, during, and after the switch; then inspect the distinct Databricks and Snowflake identity paths.

Open data-engineering.html for the executable model.

Model limits: The local model has two snapshots and three reader moments. It does not execute either product, model concurrent writers, streaming checkpoints, streams, dynamic tables, foreign dependencies, grants, policies, retention, storage costs, or every DDL restriction. Vendor SQL was not run.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day26/data-engineering.html">Day26</a>; product material added 2026-10-16.</p><p>Dashboard queries run quickly after starting but wait in line. Common answer?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Add concurrency lanes/clusters. Queue pressure is a scale-out problem.</p></details><p>One reconciliation spills with no queue. Common first direction?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Increase per-query size or tune it. One query needs a wider lane.</p></details>

## Databricks: replace contents, keep the table identity · 9 minutes

Databricks CREATE OR REPLACE publishes new Delta contents as one transaction while retaining table identity and history. It avoids a missing-name gap; verify schema, policies, dependencies, runtime support, and writer conflicts. SQL was not run.

## Snowflake: prepare blue and green objects, then swap their names · 9 minutes

Snowflake SWAP WITH exchanges two table names in one transaction. Prepare and validate a green object, then atomically put it behind the production name while keeping the former live object under the other name. Verify privileges and dependencies. SQL was not run.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Primitive | CREATE OR REPLACE | SWAP WITH |
| Stable concept | table identity/history | objects remain; names exchange |
| Review | policies and writers | ownership, grants and dependencies |

A Databricks pipeline must fully republish a Delta table used by concurrent readers. Preferred primitive?

- CREATE OR REPLACE TABLE
- DROP, wait, then CREATE
- Rename every column

<details><summary>Reveal after predicting</summary>

CREATE OR REPLACE TABLE. Replace is one transaction and keeps the table identity/history semantics documented for this use.

</details>

After Snowflake ORDERS SWAP WITH ORDERS_NEXT, where is the old live object?

- Under the ORDERS_NEXT name
- Permanently deleted
- Merged into the new object

<details><summary>Reveal after predicting</summary>

Under the ORDERS_NEXT name. The two objects exchange names in one transaction.

</details>

## Certification connection

Focused atomic Delta replacement, identity/history preservation, concurrent readers, policies, validation, and rollback boundaries. Delivered coverage is not mastery. Focused blue/green table publication with SWAP WITH, privileges, name/object identity, validation, and rollback boundaries. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks: Drop or replace a table](https://docs.databricks.com/aws/en/tables/operations/drop-table) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [Databricks SQL: CREATE TABLE using a data source](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-table-using) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [Snowflake ALTER TABLE: SWAP WITH](https://docs.snowflake.com/en/sql-reference/sql/alter-table) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [Snowflake CREATE TABLE](https://docs.snowflake.com/en/sql-reference/sql/create-table) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Guide dated May 4, 2026; checked 2026-10-30.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview last verified October 26, 2026; full IDs/weights unverified; checked 2026-10-30.

## Quiz (4 minutes)

1. A reader starts while DROP finished but CREATE has not. What can it observe?
   - The table name is missing
   - A guaranteed old snapshot
   - A guaranteed new snapshot

2. Why validate a replacement before the atomic switch?
   - Atomic visibility does not prove the new rows are correct
   - Validation makes DDL free
   - It changes every grant automatically

3. When is MERGE usually simpler than full replacement?
   - A small identified set of rows changes
   - Every row is rebuilt authoritatively
   - Readers require a new snapshot

4. Which full-rebuild tables are currently published with multiple DDL statements?
5. For one candidate, list the grants, policies, downstream objects, and rollback evidence that must survive publication.

<details><summary>Answer key — attempt first</summary>

1. The table name is missing. Two DDL statements expose an intermediate catalog state.

2. Atomic visibility does not prove the new rows are correct. Atomicity protects the publication boundary, not data quality.

3. A small identified set of rows changes. A targeted delta does not require rebuilding and publishing the whole table.

</details>

## Sources

- [Databricks: Drop or replace a table](https://docs.databricks.com/aws/en/tables/operations/drop-table) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [Databricks SQL: CREATE TABLE using a data source](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-table-using) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [Snowflake ALTER TABLE: SWAP WITH](https://docs.snowflake.com/en/sql-reference/sql/alter-table) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [Snowflake CREATE TABLE](https://docs.snowflake.com/en/sql-reference/sql/create-table) — Official documentation; checked October 30, 2026; checked 2026-10-30.
