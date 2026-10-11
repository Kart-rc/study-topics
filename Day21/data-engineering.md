# Publish only after the quality gate: make dependencies carry the rule

Data engineering · Day21 · 30 minutes

Model a pipeline as a DAG where publish waits for validated data and cleanup still runs after failure.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day6/data-engineering.html">Day6: Kafka tiered storage: retention is not local disk</a></p><p>A consumer rewinds 24 hours while local retention is six hours and overall retention is seven days. Where is the segment in this model?</p><details><summary>Recall first, then reveal the refresher</summary><p>Remote tier. The offset remains within overall retention but lies beyond the local hot window.</p></details><p><a href="../Day13/data-engineering.html">Day13: Two copies before success: Kafka&#x27;s ISR write gate</a></p><p>Only the leader remains in the ISR. With min.insync.replicas=2 and acks=all, what happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Kafka rejects the write. The current ISR has one member, below the required two, so an acks=all write is rejected.</p></details>

## Understand (4 minutes)

A restaurant does not serve a plate before the safety check. A data workflow needs the same rule: publish depends on validation succeeding.

A directed acyclic graph, or DAG, records those prerequisites. It allows independent work to run together, but it prevents the final step from starting early.



Batch B21 lands 1,000 rows. The quality task finds 12 invalid customer IDs. A correct graph blocks publish, records the failed gate, and still runs cleanup or notification.

The green “ingest succeeded” signal is not enough. The business outcome is whether only validated rows become visible.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use task dependencies when later work is unsafe or meaningless until named prerequisites finish.

**Practical example.** Ingest sales, validate keys, publish a gold table only after validation, and notify after the graph finishes.

**How to decide.** Use a DAG for durable, observable multi-step work. Keep one atomic SQL transaction when all changes fit one database and one short unit of work.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Follow the green ingest node to the quality gate. The publish edge changes from blocked to allowed; the finalizer remains reachable in both outcomes.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
tasks={"ingest":"success","validate":"failed"}
can_publish=tasks["ingest"]=="success" and tasks["validate"]=="success"
result={"publish":"success" if can_publish else "blocked","finalize":"failure" if "failed" in tasks.values() else "success"}
```

1. Record the two observed task outcomes.

   Changed values: `{"tasks": {"ingest": "success", "validate": "failed"}}`

2. Evaluate the explicit publish gate.

   Changed values: `{"can_publish": false}`

3. Derive business publish and terminal handling separately.

   Changed values: `{"result": {"publish": "blocked", "finalize": "failure"}}`

[Full runnable example](examples/data-engineering.py).

Limits: Executed local Python over synthetic states; no vendor scheduler or SQL ran.

## Explore (remaining exploration time)

Choose whether B21 passes validation. Predict which nodes run and which table customers can query.

Open data-engineering.html for the executable model.

Model limits: The browser models task state only. It does not schedule compute, persist checkpoints, retry tasks, charge credits, or reproduce either vendor runtime.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day19/data-engineering.html">Day19</a>; product material added 2026-10-09.</p><p>Databricks: after enabling liquid clustering, what operation rewrites existing data layout in this lesson?</p><details><summary>Recall first, then reveal the product refresher</summary><p>OPTIMIZE (FULL for the explicit full rewrite shown). OPTIMIZE performs clustering work. FULL explicitly forces full reclustering on supported runtimes; VACUUM and grants solve different problems.</p></details><p>Snowflake: does a table need a user clustering key before any micro-partition pruning can occur?</p><details><summary>Recall first, then reveal the product refresher</summary><p>No; metadata is automatic, while a key can improve layout for suitable large tables. Snowflake records micro-partition metadata automatically. User clustering keys are selective optimizations and are unsupported for hybrid tables.</p></details>

## Databricks: Lakeflow Jobs dependencies and Run if · 9 minutes

Authorized non-production workspace; YAML unexecuted. Job control uses YAML here because SQL does not define this Lakeflow Jobs dependency graph.

```yaml
- task_key: publish
  depends_on: [{task_key: validate}]
  run_if: ALL_SUCCESS
- task_key: notify_failure
  depends_on: [{task_key: validate}]
  run_if: AT_LEAST_ONE_FAILED
```

The local model shows publish blocked and failure notification selected.

## Snowflake: CREATE TASK … AFTER and one finalizer · 9 minutes

Authorized Snowflake sandbox; SQL unexecuted.

```sql
CREATE TASK validate AFTER ingest AS CALL assert_b21_quality();
CREATE TASK publish AFTER validate AS CALL publish_b21();
CREATE TASK finish FINALIZE = ingest AS CALL record_graph_result();
```

The local model builds the dependency links but does not resume or execute tasks.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Dependency form | Job task config | SQL `AFTER` |
| Success gate | `ALL_SUCCESS` | Successful predecessors |
| Terminal work | failure/all-done task | one finalizer per root |

Databricks validation fails. Which setting protects publish?

- ALL_DONE
- ALL_SUCCESS
- AT_LEAST_ONE_FAILED

<details><summary>Reveal after predicting</summary>

ALL_SUCCESS. Publish should require its quality dependency to succeed.

</details>

Snowflake task <code>publish AFTER validate</code>: when does publish normally start?

- Before validate
- After validate succeeds
- Whenever its warehouse starts

<details><summary>Reveal after predicting</summary>

After validate succeeds. The dependency, not warehouse availability alone, controls readiness.

</details>

## Certification connection

Focused task dependencies and outcome gates; not complete Lakeflow Jobs coverage. Focused task graph dependencies, ownership, and finalization; full C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks Lakeflow Jobs task dependencies](https://docs.databricks.com/aws/en/jobs/run-if) — Updated 2026-09-11; checked 2026-10-11.
- [Snowflake task graphs](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Living documentation; checked 2026-10-11.
- [Snowflake CREATE TASK](https://docs.snowflake.com/en/sql-reference/sql/create-task) — Living documentation; checked 2026-10-11.

## Quiz (4 minutes)

1. Validation fails for B21. What should publish do?
   - Run because ingest was green
   - Stay blocked
   - Publish 988 rows silently

2. Why keep a finalizer or failure handler?
   - To bypass validation
   - To record/clean up after either outcome
   - To create a cycle

3. When is a DAG excessive?
   - A single short database transaction can enforce the whole change
   - Tasks need different compute
   - The workflow needs retry history

4. Which business invariant should your publish task enforce?
5. What state must be preserved before retrying a failed task graph?

<details><summary>Answer key — attempt first</summary>

1. Stay blocked. The dependency is the business gate, not a timing hint.

2. To record/clean up after either outcome. Terminal handling is different from publishing business data.

3. A single short database transaction can enforce the whole change. Do not replace one atomic unit with distributed orchestration without a reason.

</details>

## Sources

- [Databricks: configure task dependencies](https://docs.databricks.com/aws/en/jobs/run-if) — Updated 2026-09-11; checked 2026-10-11.
- [Snowflake: create a task graph](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Living documentation; checked 2026-10-11.
