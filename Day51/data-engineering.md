# Retrieve the control first; restore only after you name what failed

Data engineering · Day51 · 30 minutes

Retrieve the Days45–50 control chain, then fill the table-recovery gap with product-specific history and retention limits.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day29/data-engineering.html">Day29: Consolidation case: recover and publish one corrected partner feed</a></p><p>The partner overwrites the same path. What identity should drive reprocessing?</p><details><summary>Recall first, then reveal the refresher</summary><p>A version/content identity plus audit metadata. A stable path can point at changed bytes; preserve version/content evidence.</p></details><p><a href="../Day33/data-engineering.html">Day33: Open the S3 door without handing out AWS keys</a></p><p>The caller has a platform grant and the path is finance, but AWS does not trust the platform identity. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>The read is denied at role assumption. Every link must allow the request; a platform grant cannot replace the AWS trust policy.</p></details>

## Understand (4 minutes)

A guardrail prevents a car from leaving the road. A tow truck recovers it afterward. They solve different problems.

Days45–50 built preventive and detective controls: preserve bad rows, keep array position, inspect join plans, mask values, bind workload identity, and test the whole chain. Today adds a missing recovery control. After an accidental delete, first identify the last known-good table state. Restore or clone only after proving the target point and retention boundary.



orders_silver had 1,000 rows. Statement delete-51 removed 880, leaving 120. The safe response is not “rerun everything.” Inspect history, verify the earlier state, create a recoverable copy where possible, reconcile counts, then choose the production cutover.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use history-based recovery when a governed Delta or Snowflake table was changed or dropped and the required historical files are still retained.

**Practical example.** A production cleanup job deletes 880 of 1,000 order rows; the incident team needs a verified pre-delete table state without replaying every upstream source.

**How to decide.** Prefer a historical clone for investigation when the product supports it. Restore in place only after impact, downstream readers, retention, permissions, and reconciliation are understood. Replay source data when history is unavailable or external effects also need repair.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

A control-selection lane separates prevention and masking from history-based recovery, then shows the last known-good state becoming a new audited version.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
history=[{'version':40,'rows':1000,'op':'MERGE'},{'version':41,'rows':120,'op':'DELETE'}]
current=history[-1]; target=next(x for x in history if x['version']==40)
history.append({'version':42,'rows':target['rows'],'op':'RESTORE_FROM_40'})
result={'before':current['rows'],'after':history[-1]['rows'],'recovered':history[-1]['rows']-current['rows'],'new_version':history[-1]['version']}
```

1. Record the synthetic table history around the incident.

   Changed values: `{"history": [{"version": 40, "rows": 1000, "op": "MERGE"}, {"version": 41, "rows": 120, "op": "DELETE"}]}`

2. Name the current damage and the intended recovery point.

   Changed values: `{"current": {"version": 41, "rows": 120, "op": "DELETE"}, "target": {"version": 40, "rows": 1000, "op": "MERGE"}}`

3. Model restore as a new history entry, not erasure of the delete.

   Changed values: `{"history": [{"version": 40, "rows": 1000, "op": "MERGE"}, {"version": 41, "rows": 120, "op": "DELETE"}, {"version": 42, "rows": 1000, "op": "RESTORE_FROM_40"}]}`

4. Reconcile the recovered row count and preserve the audit trail.

   Changed values: `{"result": {"before": 120, "after": 1000, "recovered": 880, "new_version": 42}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local Python and JavaScript models use row counts and named versions. They do not execute Delta RESTORE, Snowflake Time Travel, VACUUM, Fail-safe, permissions, concurrent writes, streaming checkpoints, clones, costs, lineage, downstream side effects, or disaster recovery.

## Explore (remaining exploration time)

Choose the failure and retained-history state. Predict whether the control prevents, detects, recovers, or cannot repair the loss.

Open data-engineering.html for the executable model.

Model limits: The local Python and JavaScript models use row counts and named versions. They do not execute Delta RESTORE, Snowflake Time Travel, VACUUM, Fail-safe, permissions, concurrent writes, streaming checkpoints, clones, costs, lineage, downstream side effects, or disaster recovery.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day28/data-engineering.html">Day28</a>; product material added 2026-10-18.</p><p>What must you inspect before pressing repair/retry?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Partial outputs and side effects of restarted tasks. A retry is safe only if repeated task effects are safe.</p></details><p>Which Snowflake identifier ties retry attempts to the original graph run?</p><details><summary>Recall first, then reveal the product refresher</summary><p>GRAPH_RUN_GROUP_ID. The retry shares the graph-run group and increments the attempt number.</p></details>

## Databricks: inspect Delta history, then RESTORE to a proven version · 9 minutes

Recall Day28 identity/grants and Days45–47 evidence controls. Inspect history and the candidate version, then RESTORE only with MODIFY permission and retained files. RESTORE creates a new version. SQL not executed in Databricks.

## Snowflake: query before the statement, clone the historical table, then reconcile · 9 minutes

Recall Day28 authorization and Days45/48 data-quality and masking controls. Use BEFORE(STATEMENT) to verify and clone a historical table within Time Travel retention. UNDROP addresses dropped objects. SQL not executed in Snowflake.

## Compare and predict (2 minutes)

Databricks RESTORE creates a new Delta version and depends on retained files plus MODIFY. Snowflake Time Travel can query or clone a historical point and UNDROP a dropped object, bounded by retention. These are related recovery controls, not identical commands.

A Databricks version is visible in history, but VACUUM removed its data files. What is the key consequence?

- History metadata alone cannot guarantee a complete restore
- RESTORE silently recreates every file
- The masking policy restores the rows

<details><summary>Reveal after predicting</summary>

History metadata alone cannot guarantee a complete restore. The official history guidance warns that deleted files can make an older version unrestorable.

</details>

A Snowflake DELETE ran as statement delete-51 and retention is active. What is the safest first recovery move?

- Query or clone BEFORE the statement and reconcile it
- Use UNDROP TABLE for the existing table
- Increase warehouse size and rerun DELETE

<details><summary>Reveal after predicting</summary>

Query or clone BEFORE the statement and reconcile it. BEFORE(STATEMENT) identifies the pre-delete state; UNDROP is for a dropped object.

</details>

## Certification connection

Retrieval across Days45–50 plus a bounded data-protection gap: Delta history, RESTORE permissions, retained-file limits, and reconciliation. Retrieval across Days45–50 plus a bounded protection gap: Time Travel query/clone, UNDROP distinction, retention and edition constraints. Planning groups only; full COF-C03 IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and recorded example is local Python.

- [Databricks: Work with table history](https://docs.databricks.com/aws/en/tables/history) — Official Databricks documentation; checked November 11, 2026; checked 2026-11-11.
- [Databricks SQL RESTORE](https://docs.databricks.com/aws/en/sql/language-manual/delta-restore) — Official SQL reference; checked November 11, 2026; checked 2026-11-11.
- [Snowflake Time Travel](https://docs.snowflake.com/en/user-guide/data-time-travel) — Official Snowflake documentation; checked November 11, 2026; checked 2026-11-11.
- [Snowflake CREATE ... CLONE](https://docs.snowflake.com/en/sql-reference/sql/create-clone) — Official SQL reference; checked November 11, 2026; checked 2026-11-11.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official May 4, 2026 guide; rechecked November 11, 2026; checked 2026-11-11.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview; full study-guide objective IDs and weights remain unverified; checked 2026-11-11.

## Quiz (4 minutes)

1. The mask works, but 880 rows were deleted. Which control is missing?
   - A retained historical state plus a verified recovery procedure
   - A larger broadcast threshold
   - Another masking policy

2. Why verify a clone or historical query before an in-place restore?
   - To prove the target state and reconciliation before changing production again
   - To make both products use identical syntax
   - To bypass retention

3. When must the team replay source data instead?
   - When required history or files have expired or external effects also need reconstruction
   - Whenever a query is slow
   - Whenever the analyst role is masked

4. Which production table has a tested recovery point rather than only backups on paper?
5. What row, checksum, and downstream checks would you require before cutover?

<details><summary>Answer key — attempt first</summary>

1. A retained historical state plus a verified recovery procedure. Masking governs reads; it does not restore deleted rows.

2. To prove the target state and reconciliation before changing production again. Recovery should reduce uncertainty before the next destructive change.

3. When required history or files have expired or external effects also need reconstruction. History-based recovery is bounded by retained state and protected effects.

</details>

## Sources

- [Databricks: Work with table history](https://docs.databricks.com/aws/en/tables/history) — Official Databricks documentation; checked November 11, 2026; checked 2026-11-11.
- [Databricks SQL RESTORE](https://docs.databricks.com/aws/en/sql/language-manual/delta-restore) — Official SQL reference; checked November 11, 2026; checked 2026-11-11.
- [Snowflake Time Travel](https://docs.snowflake.com/en/user-guide/data-time-travel) — Official Snowflake documentation; checked November 11, 2026; checked 2026-11-11.
- [Snowflake CREATE ... CLONE](https://docs.snowflake.com/en/sql-reference/sql/create-clone) — Official SQL reference; checked November 11, 2026; checked 2026-11-11.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official May 4, 2026 guide; rechecked November 11, 2026; checked 2026-11-11.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview; full study-guide objective IDs and weights remain unverified; checked 2026-11-11.
