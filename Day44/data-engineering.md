# Retrieval lab: name the missing evidence before repairing the run

Data engineering · Day44 · 30 minutes

Retrieve the cycle's controls from symptoms, locate the first unproven boundary, and repair only after the failed state is understood.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day31/data-engineering.html">Day31: Read only what changed: Delta CDF and Snowflake Streams</a></p><p>A consumer last committed version 100 and version 101 contains an update and insert. What should it read?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only changes after 100, including both operations. The interval begins after the last successful position and preserves operation types.</p></details><p><a href="../Day3/data-engineering.html">Day3: Adaptive skew joins: split the straggler, not the whole job</a></p><p>Median 43.5 MB, factor 5, threshold 256 MB, partition 240 MB. Is it skewed by this rule?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, because it does not also exceed 256 MB. The partition must exceed both boundaries. It clears 217.5 MB but not 256 MB.</p></details>

## Understand (4 minutes)

A parcel tracker can say “label created” even though the carrier never received the box. One green checkpoint does not prove the whole trip.

A data release has four separate claims: the trigger woke the graph, transformation produced the right candidate, publication changed the live version, and serving capacity met demand. Retrieval practice means naming which claim lacks evidence before choosing a repair. A gap is recorded as “not yet demonstrated,” never guessed from silence.



A payments file arrives at 8:52. The graph starts, but the transform fails. The dashboard still reads version 43 from yesterday. The correct first statement is not “the trigger is broken” or “add a cluster.” It is “transform success is unproven.” After the cause is fixed, rerun the failed work and its dependent publication, then check the live version and query queue.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a retrieval/gap session after several related lessons or before a certification practice set, especially when many controls can produce similar symptoms.

**Practical example.** A morning data product is stale even though an arrival trigger fired; the team must distinguish trigger, transform, quality, publication, and serving evidence.

**How to decide.** Start at the first unproven boundary and request its native evidence. Repair from there. Do not infer personal mastery from lesson delivery; only an explicit answer or real sandbox result can close a learner gap.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The evidence ladder makes later stages visibly unreachable until the first missing proof is resolved, preventing symptom-driven repairs at the wrong boundary.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
stages=['wake','transform','quality','publish','serve']; evidence={'wake':True,'transform':False,'quality':None,'publish':None,'serve':None}
first_unproven=next(s for s in stages if evidence[s] is not True)
repair=['transform','quality','publish']; preserved=['wake']
mastery='not_assessed'; coverage='delivered'
```

1. The graph woke, but the transform did not finish; later stages have no evidence.

   Changed values: `{"stages": ["wake", "transform", "quality", "publish", "serve"], "evidence": {"wake": true, "transform": false, "quality": null, "publish": null, "serve": null}}`

2. Walk in dependency order and stop at transform.

   Changed values: `{"first_unproven": "transform"}`

3. Plan a targeted repair of the failed boundary and dependent decisions.

   Changed values: `{"repair": ["transform", "quality", "publish"], "preserved": ["wake"]}`

4. Keep public delivery coverage separate from private learner evidence.

   Changed values: `{"mastery": "not_assessed", "coverage": "delivered"}`

[Full runnable example](examples/data-engineering.py).

Limits: This local diagnostic uses four fixed stages and synthetic states. It does not query either vendor, reproduce permissions, concurrent runs, retries, task-history retention, data correctness, cloud-event delivery, or real query latency.

## Explore (remaining exploration time)

Choose the observed incident. Predict the first missing proof, then compare it with the evidence ladder before selecting a repair.

Open data-engineering.html for the executable model.

Model limits: This local diagnostic uses four fixed stages and synthetic states. It does not query either vendor, reproduce permissions, concurrent runs, retries, task-history retention, data correctness, cloud-event delivery, or real query latency.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day22/data-engineering.html">Day22</a>; product material added 2026-10-12.</p><p>Why count quarantined rows?</p><details><summary>Recall first, then reveal the product refresher</summary><p>To preserve reconciliation evidence. A repair must explain every source envelope.</p></details><p>Which product feature alone proves the repaired data is correct?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Neither; explicit business reconciliation is required. Orchestration carries a gate; it does not define the invariant.</p></details>

## Databricks retrieval: inspect the failed task, then repair current code deliberately · 9 minutes

Inspect the failed task first. Repair failed tasks plus downstream dependents only after fixing the cause. Databricks runs repaired tasks with current job settings, so definition drift is part of the decision. The Jobs API was not called.

## Snowflake retrieval: use graph history to find the first error before RETRY LAST · 9 minutes

Read COMPLETE_TASK_GRAPHS and TASK_HISTORY to locate the first error and task details. After fixing the cause, RETRY LAST begins a new graph run at failed tasks; it does not undo external effects. SQL was not executed.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Locate failure | Jobs run/task state | COMPLETE_TASK_GRAPHS + TASK_HISTORY |
| Repair | repair run | RETRY LAST |
| Boundary | current task settings | new graph run; no external rewind |

A Databricks transform failed and publish was skipped. After fixing the notebook, what is the narrow repair?

- Rerun the failed transform and dependent publish
- Rerun only the successful trigger
- Scale the SQL warehouse

<details><summary>Reveal after predicting</summary>

Rerun the failed transform and dependent publish. The failed boundary and its dependent publication need recomputation; successful wake-up is not the defect.

</details>

Snowflake reports the first error in TRANSFORM_PAYMENTS. What should happen before RETRY LAST?

- Inspect task error/query evidence and fix the cause
- Drop the live table
- Add a multi-cluster warehouse

<details><summary>Reveal after predicting</summary>

Inspect task error/query evidence and fix the cause. Retry is appropriate only after the failure is understood; capacity and publication changes do not repair bad transformation logic.

</details>

## Certification connection

Retrieves cycle-four release controls and adds a bounded gap on task-level evidence and repair semantics. Coverage is not mastery. Retrieves cycle-four controls and adds graph/task history plus RETRY LAST boundaries. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks Lakeflow Jobs task dependencies](https://docs.databricks.com/aws/en/jobs/run-if) — Official documentation; updated November 2, 2026; checked November 3, 2026; checked 2026-11-03.
- [Databricks Jobs API: repair a run](https://docs.databricks.com/api/jobs/v2/list-runs) — Official API reference; checked November 3, 2026; checked 2026-11-03.
- [Snowflake COMPLETE_TASK_GRAPHS](https://docs.snowflake.com/en/sql-reference/functions/complete_task_graphs) — Official SQL reference; checked November 3, 2026; checked 2026-11-03.
- [Snowflake TASK_HISTORY](https://docs.snowflake.com/en/sql-reference/functions/task_history) — Official SQL reference; checked November 3, 2026; checked 2026-11-03.
- [Snowflake task graphs](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Official documentation; checked November 3, 2026; checked 2026-11-03.
- [Snowflake EXECUTE TASK](https://docs.snowflake.com/en/sql-reference/sql/execute-task) — Official SQL reference; checked November 3, 2026; checked 2026-11-03.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Official May 4, 2026 guide; rechecked November 3, 2026; checked 2026-11-03.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview rechecked November 3, 2026; full study-guide objective IDs and weights remain unverified; checked 2026-11-03.

## Quiz (4 minutes)

1. The graph started, but no candidate table exists. What should be proved next?
   - Whether transformation completed
   - Whether more serving clusters are needed
   - Whether the live table should be dropped

2. Why repair from the first failed task and its dependents?
   - Successful independent work can remain evidence while downstream state is recomputed
   - Every task must always rerun
   - It guarantees vendor code is correct

3. What would close a personal certification gap?
   - An explicit retained answer or authorized sandbox result
   - The public coverage row alone
   - No response after lesson delivery

4. Which boundary in your last failed pipeline was assumed rather than proved?
5. What real Databricks and Snowflake sandbox evidence will you collect before marking this cycle retained?

<details><summary>Answer key — attempt first</summary>

1. Whether transformation completed. Trigger evidence only proves wake-up; transformation is the next boundary.

2. Successful independent work can remain evidence while downstream state is recomputed. A targeted repair preserves useful completed work while rebuilding state that depends on the failure.

3. An explicit retained answer or authorized sandbox result. Coverage is curriculum evidence; mastery requires assessment or real execution evidence.

</details>

## Sources

- [Databricks Lakeflow Jobs task dependencies](https://docs.databricks.com/aws/en/jobs/run-if) — Official documentation; updated November 2, 2026; checked November 3, 2026; checked 2026-11-03.
- [Databricks Jobs API: repair a run](https://docs.databricks.com/api/jobs/v2/list-runs) — Official API reference; checked November 3, 2026; checked 2026-11-03.
- [Snowflake COMPLETE_TASK_GRAPHS](https://docs.snowflake.com/en/sql-reference/functions/complete_task_graphs) — Official SQL reference; checked November 3, 2026; checked 2026-11-03.
- [Snowflake TASK_HISTORY](https://docs.snowflake.com/en/sql-reference/functions/task_history) — Official SQL reference; checked November 3, 2026; checked 2026-11-03.
