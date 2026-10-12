# Consolidation case: repair one orders batch without publishing the mistake

Data engineering · Day22 · 30 minutes

Use recovery state, least privilege, tolerant parsing, deduplication, scan evidence, and a publish gate as one incident response.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day19/data-engineering.html">Day19: Skip the chunks that cannot contain day 42</a></p><p>Every chunk has min 1 and max 60. What can the engine conclude for day 42?</p><details><summary>Recall first, then reveal the refresher</summary><p>Every chunk remains a candidate. Day 42 lies inside every recorded range, so min/max alone cannot exclude a chunk.</p></details><p><a href="../Day7/data-engineering.html">Day7: Spark Real-Time Mode: eligibility before milliseconds</a></p><p>A Spark 4.1 query adds a keyed rolling count. What should happen before tuning its RTM epoch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Confirm that the stateful graph is supported; otherwise choose another path. Execution-mode eligibility is a correctness constraint, not a latency knob.</p></details>

## Understand (4 minutes)

Symptom first: the orders dashboard shows five item rows, but the source manifest says the batch should contain three. Ingest is green and consumer lag is zero. Those signals prove movement, not correctness.

Treat the raw batch like a sealed evidence bag: stop publish, preserve the original input and checkpoint, repair into a new candidate, validate the counts, then promote it. Do not edit the visible gold table while still discovering the failure.



Batch B22 contains four envelopes: valid o-41 with two items, a duplicate o-41, valid o-42 with one item, and malformed o-43. Naive flattening emits five rows. The repaired result is two orders and three item rows; one duplicate is excluded and one malformed envelope is quarantined.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this recovery sequence when a batch passed transport checks but violates a business invariant after parsing, deduplication, or flattening.

**Practical example.** A retail order batch is present and on time, yet repeated events and bad JSON inflate the gold item count.

**How to decide.** Contain first when visible data may be wrong. Replay from preserved raw data into an isolated candidate; publish only after explicit reconciliation. For a harmless late batch, normal retry may be enough.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The timeline is an incident evidence chain: visible data stays held through four changing intermediate states and changes only after the reconciliation gate.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
events=[{"id":"e1","order":"o-41","items":["A","B"]},{"id":"e1","order":"o-41","items":["A","B"]},{"id":"e2","order":"o-42","items":["C"]},None]
valid=[e for e in events if e is not None]
unique={e["id"]:e for e in valid}
items=[(e["order"],item) for e in unique.values() for item in e["items"]]
gate={"orders":len(unique),"items":len(items),"duplicate":len(valid)-len(unique),"malformed":len(events)-len(valid)}
publish=gate=={"orders":2,"items":3,"duplicate":1,"malformed":1}
```

1. Represent two valid events, one duplicate, and one malformed envelope.

   Changed values: `{"events": [{"id": "e1", "order": "o-41", "items": ["A", "B"]}, {"id": "e1", "order": "o-41", "items": ["A", "B"]}, {"id": "e2", "order": "o-42", "items": ["C"]}, null]}`

2. Quarantine the malformed value and deduplicate by stable event identity.

   Changed values: `{"valid": [{"id": "e1", "order": "o-41", "items": ["A", "B"]}, {"id": "e1", "order": "o-41", "items": ["A", "B"]}, {"id": "e2", "order": "o-42", "items": ["C"]}], "unique": {"e1": {"id": "e1", "order": "o-41", "items": ["A", "B"]}, "e2": {"id": "e2", "order": "o-42", "items": ["C"]}}}`

3. Flatten once, then compute the publish evidence.

   Changed values: `{"items": [["o-41", "A"], ["o-41", "B"], ["o-42", "C"]], "gate": {"orders": 2, "items": 3, "duplicate": 1, "malformed": 1}}`

4. Compare all four observed counts with the contract.

   Changed values: `{"publish": true}`

[Full runnable example](examples/data-engineering.py).

Limits: Executed local Python over synthetic in-memory values. No vendor platform, checkpoint, privilege, or SQL was executed.

## Explore (remaining exploration time)

Move the incident through containment, parse, deduplicate, reconcile, and publish. Watch the visible row count stay unchanged until the final gate.

Open data-engineering.html for the executable model.

Model limits: The browser is a local JavaScript state machine over four synthetic envelopes. It does not run Databricks, Snowflake, Spark, warehouses, permissions, checkpoints, or production SQL.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day17/data-engineering.html">Day17</a>; product material added 2026-10-08.</p><p>After a Databricks Delta sink commit, restarting with the same valid checkpoint replays a batch. What protects the copied rows?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Same query + batch in Delta. The same query/batch can be recognized by the Delta sink. A new query identity changes that boundary. This says nothing about independent duplicate business events.</p></details><p>You SELECT a Snowflake stream, then INSERT from it inside a transaction that rolls back. What persists?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Neither change persists. SELECT does not consume the stream. The rolled-back consuming transaction preserves the old target and stream position, allowing a retry.</p></details>

## Databricks: isolate, repair, validate, then let the job DAG publish · 9 minutes

Authorized non-production workspace; SQL/YAML unexecuted.

```sql
CREATE OR REPLACE TEMP VIEW parsed AS
SELECT *, try_parse_json(payload) AS v FROM bronze.orders_b22;
-- deduplicate by event_id, explode items into repair.b22_items
```

Lakeflow Jobs: `publish` depends on `validate` with `run_if: ALL_SUCCESS`. The local replay shows 4 envelopes → 3 valid → 2 unique orders → 3 items → publish.

## Snowflake: quarantine parse failures, flatten the candidate, gate the task · 9 minutes

Authorized Snowflake sandbox; SQL unexecuted.

```sql
SELECT *, TRY_PARSE_JSON(payload) AS v FROM bronze.orders_b22;
-- deduplicate with ROW_NUMBER, then LATERAL FLATTEN into repair.b22_items
CREATE TASK publish AFTER validate AS CALL publish_b22();
```

The local replay shows the changing counts; it does not run a warehouse or task graph.

## Compare and predict (2 minutes)

| Decision | Databricks | Snowflake |
|---|---|---|
| Tolerant parse | `try_parse_json` | `TRY_PARSE_JSON` |
| Nested expansion | `variant_explode` where supported | `LATERAL FLATTEN` |
| Publish gate | Jobs `ALL_SUCCESS` | Tasks `AFTER` |
| Execution | Not run | Not run |

Why count quarantined rows?

- To preserve reconciliation evidence
- To make JSON valid
- To skip authorization

<details><summary>Reveal after predicting</summary>

To preserve reconciliation evidence. A repair must explain every source envelope.

</details>

Which product feature alone proves the repaired data is correct?

- Databricks Jobs
- Snowflake Tasks
- Neither; explicit business reconciliation is required

<details><summary>Reveal after predicting</summary>

Neither; explicit business reconciliation is required. Orchestration carries a gate; it does not define the invariant.

</details>

## Certification connection

Consolidates Days17–21 recovery, access, nested-data, performance, and orchestration concepts; not complete exam coverage. Consolidates planning groups only; full COF-C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks VARIANT type](https://docs.databricks.com/aws/en/semi-structured/variant) — Living documentation; checked 2026-10-12.
- [Databricks task dependencies](https://docs.databricks.com/aws/en/jobs/run-if) — Updated 2026-09-11; checked 2026-10-12.
- [Snowflake TRY_PARSE_JSON](https://docs.snowflake.com/en/sql-reference/functions/try_parse_json) — Living documentation; checked 2026-10-12.
- [Snowflake FLATTEN](https://docs.snowflake.com/en/sql-reference/functions/flatten) — Living documentation; checked 2026-10-12.
- [Snowflake task graphs](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Living documentation; checked 2026-10-12.

## Quiz (4 minutes)

1. Ingest is green but gold has five rows instead of three. First action?
   - Publish and inspect later
   - Block publish and preserve raw evidence
   - Delete the checkpoint

2. After repair, which evidence supports publish?
   - Lag is zero
   - 2 unique orders, 3 items, 1 duplicate excluded, 1 malformed quarantined
   - The warehouse is running

3. When should layout tuning happen?
   - Before correctness
   - Only after query evidence shows a selective, repeated access path
   - For every table automatically

4. Which green signal in your platform could hide a wrong business result?
5. What four counts would your own repaired-batch publish gate reconcile?

<details><summary>Answer key — attempt first</summary>

1. Block publish and preserve raw evidence. A transport success does not prove the business result.

2. 2 unique orders, 3 items, 1 duplicate excluded, 1 malformed quarantined. The gate should reconcile the business invariant and every excluded record.

3. Only after query evidence shows a selective, repeated access path. Correctness and recoverability come first; optimize from measured scans.

</details>

## Sources

- [Databricks Lakeflow expectations](https://docs.databricks.com/aws/en/ldp/expectations) — Living documentation; checked 2026-10-12.
- [Databricks task dependencies and Run if](https://docs.databricks.com/aws/en/jobs/run-if) — Updated 2026-09-11; checked 2026-10-12.
- [Snowflake TRY_PARSE_JSON](https://docs.snowflake.com/en/sql-reference/functions/try_parse_json) — Living documentation; checked 2026-10-12.
- [Snowflake FLATTEN](https://docs.snowflake.com/en/sql-reference/functions/flatten) — Living documentation; checked 2026-10-12.
- [Snowflake task graphs](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Living documentation; checked 2026-10-12.
