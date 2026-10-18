# Repair the failed branch, not the successful tasks

Data engineering · Day28 · 30 minutes

Retry only the broken part of a workflow—and make every retried task safe to run again.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day23/data-engineering.html">Day23: Retrieval lab: choose the control from the symptom</a></p><p>A date predicate scans every data chunk. First move?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect pruning evidence and recorded ranges. Measure whether layout metadata can exclude data before changing compute or clustering.</p></details><p><a href="../Day11/data-engineering.html">Day11: Read the labels before opening the boxes: Parquet page skipping</a></p><p>Grouped pages, target 45: what happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Read B; return no rows. 45 lies within B’s bounds, so B must be read. No stored ID equals 45. Skipping B would assume more than the label proves; nearby IDs do not satisfy equality.</p></details>

## Understand (4 minutes)

Picture a three-stop delivery route: ingest → validate → publish. Ingest finished. Validate wrote 60 rows, then failed. Publish never started. Repair should resume at validate, not repeat the successful ingest.

But repair is not magic rollback. The failed task usually starts again from its beginning. If it appends the same first 60 rows again, the table now contains duplicates. The scheduler chooses where to restart; task code decides whether restarting is safe.



Run 17 ingests 100 orders. Validate writes orders 1–60 and crashes on order 61. A repair leaves ingest alone, restarts validate, and schedules publish only after validate succeeds. Safe validate uses MERGE on order_id or replaces the run partition. Unsafe validate blindly appends and turns 60 existing rows into 120.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use repair/retry after a multi-task workflow partially fails and successful upstream work is still valid.

**Practical example.** A nightly order workflow ingested its source once, but validation failed after a partial write and publishing was skipped.

**How to decide.** Repair the smallest failed branch only after checking every restarted task’s write pattern. Prefer MERGE, overwrite-by-run, or a processing marker; do not assume the orchestrator makes an append idempotent.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The workflow graph has two simultaneous stories: task state moves from failed/blocked to success, while the row counter reveals whether retrying the task was actually safe.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
tasks={'ingest':'SUCCESS','validate':'FAILED','publish':'BLOCKED'}
rows_before_repair=60
restart=[name for name,state in tasks.items() if state in ('FAILED','BLOCKED')]
write_mode='merge'
rows_after_repair=100 if write_mode=='merge' else 160
```

1. Record the state after validate fails.

   Changed values: `{"tasks": {"ingest": "SUCCESS", "validate": "FAILED", "publish": "BLOCKED"}}`

2. Validate already left partial output.

   Changed values: `{"rows_before_repair": 60}`

3. Repair selects the failed task and its dependent task.

   Changed values: `{"restart": ["validate", "publish"]}`

4. A repeat-safe write removes the duplicate risk.

   Changed values: `{"write_mode": "merge", "rows_after_repair": 100}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser models one linear graph and one partial write. It does not execute Lakeflow Jobs or Snowflake tasks, model parallel branches, dynamic values, permissions, transaction isolation, or external side effects. Vendor commands are unexecuted.

## Explore (remaining exploration time)

Choose whether validate appends or merges, then replay the failed branch. Watch both the task states and row count.

Open data-engineering.html for the executable model.

Model limits: The browser models one linear graph and one partial write. It does not execute Lakeflow Jobs or Snowflake tasks, model parallel branches, dynamic values, permissions, transaction isolation, or external side effects. Vendor commands are unexecuted.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day22/data-engineering.html">Day22</a>; product material added 2026-10-12.</p><p>Why count quarantined rows?</p><details><summary>Recall first, then reveal the product refresher</summary><p>To preserve reconciliation evidence. A repair must explain every source envelope.</p></details><p>Which product feature alone proves the repaired data is correct?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Neither; explicit business reconciliation is required. Orchestration carries a gate; it does not define the invariant.</p></details>

## Databricks: Repair run selects tasks; your code supplies idempotence · 9 minutes

Repair reruns unsuccessful tasks from the beginning. Use MERGE or overwrite-by-run so partial output does not duplicate. Vendor SQL is unexecuted.

## Snowflake: RETRY LAST starts at failed tasks in the task graph · 9 minutes

RETRY LAST begins a new attempt at failed tasks, subject to eligibility rules. Target GRAPH_RUN_GROUP_ID when you need a specific run. Vendor SQL is unexecuted.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Restart | unsuccessful tasks and dependents | failed/canceled tasks and eligible children |
| Identity | repair history | attempt + graph run group |
| Shared trap | task writes still need idempotence | task writes still need idempotence |

What must you inspect before pressing repair/retry?

- Only the dashboard color
- Partial outputs and side effects of restarted tasks
- Only total runtime

<details><summary>Reveal after predicting</summary>

Partial outputs and side effects of restarted tasks. A retry is safe only if repeated task effects are safe.

</details>

Which Snowflake identifier ties retry attempts to the original graph run?

- GRAPH_RUN_GROUP_ID
- WAREHOUSE_SIZE
- QUERY_TAG only

<details><summary>Reveal after predicting</summary>

GRAPH_RUN_GROUP_ID. The retry shares the graph-run group and increments the attempt number.

</details>

## Certification connection

Focused job repair and task idempotence; not complete orchestration coverage. Focused task-graph retry identity, eligibility and safe writes; planning groups only, not complete COF-C03 coverage. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks: troubleshoot and repair job failures](https://docs.databricks.com/aws/en/jobs/repair-job-failures) — Updated October 9, 2026; checked 2026-10-18.
- [Snowflake EXECUTE TASK](https://docs.snowflake.com/en/sql-reference/sql/execute-task) — Living documentation; checked 2026-10-18.
- [Snowflake task graphs](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Living documentation; checked 2026-10-18.

## Quiz (4 minutes)

1. What does workflow repair usually choose?
   - Which failed tasks restart
   - How a database deduplicates rows
   - The business key

2. Validate wrote 60 rows before failing. Safest retry write?
   - Blind append
   - Idempotent MERGE or run-partition overwrite
   - Skip validation forever

3. Should a successful independent task rerun during a branch repair?
   - Always
   - Normally no
   - Only because its logs expired

4. Which writes in one of your production DAGs are not safe to repeat from the beginning?
5. When would you reject a repair and start a fresh full run instead?

<details><summary>Answer key — attempt first</summary>

1. Which failed tasks restart. The orchestrator chooses the restart point; task logic owns data safety.

2. Idempotent MERGE or run-partition overwrite. A repeat-safe write prevents the partial output from being duplicated.

3. Normally no. Repair preserves successful work unless dependencies or correctness require a full rerun.

</details>

## Sources

- [Databricks: troubleshoot and repair job failures](https://docs.databricks.com/aws/en/jobs/repair-job-failures) — Updated October 9, 2026; checked 2026-10-18.
- [Snowflake EXECUTE TASK](https://docs.snowflake.com/en/sql-reference/sql/execute-task) — Living documentation; checked 2026-10-18.
- [Snowflake task graphs](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Living documentation; checked 2026-10-18.
