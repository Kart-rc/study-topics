# A new column needs an explicit landing policy

Data engineering · Day35 · 30 minutes

Trace one arriving coupon_code column through Databricks Auto Loader and Snowflake COPY INTO, then choose pause, rescue, or controlled evolution.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day21/data-engineering.html">Day21: Publish only after the quality gate: make dependencies carry the rule</a></p><p>Validation fails for B21. What should publish do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Stay blocked. The dependency is the business gate, not a timing hint.</p></details><p><a href="../Day25/data-engineering.html">Day25: Share live data without copying it</a></p><p>The provider updates its table from v3 to v4. With access intact, what should a live-share reader query?</p><details><summary>Recall first, then reveal the refresher</summary><p>The current shared data, subject to platform refresh semantics. The share exposes provider-owned data rather than a detached export.</p></details>

## Understand (4 minutes)

A warehouse expects boxes with three labels: order_id, amount, and event_time. One morning a box also has coupon_code. The safe question is not simply “Can the system add it?” It is “Should this load pause for review, preserve the unexpected field separately, or change the table automatically?”

Schema evolution is a policy decision at the ingestion boundary. The data can be preserved while the published contract remains controlled.



File 1 has three columns. File 2 adds coupon_code=FALL10. A pause-and-restart path updates approved schema before File 2 continues. A rescue path keeps the current table columns and stores the extra field in a JSON rescue column. An automatic-evolution path adds a table column only when its required flags and privileges are present.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use an explicit schema-drift policy for semi-structured or partner files whose columns can change independently of your pipeline release.

**Practical example.** A retail partner adds coupon_code before your silver-table model is ready. Preserve the value, alert the owner, and expose it only after contract review.

**How to decide.** Pause and restart when every new column must be visible and reviewed. Rescue when continuity matters more than immediate promotion. Allow table evolution only for trusted file loads with naming, privilege, downstream-compatibility, and observability controls.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The four tiles answer the operational question: did the new field become a first-class column, stay preserved off-contract, or wait behind a restart?


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
expected = ['order_id', 'amount', 'event_time']
incoming = expected + ['coupon_code']
unexpected = [c for c in incoming if c not in expected]
rescued = {'coupon_code': 'FALL10'} if unexpected else {}; published = list(expected)
```

1. Start with the published landing schema.

   Changed values: `{"expected": ["order_id", "amount", "event_time"]}`

2. The next file contains one extra column.

   Changed values: `{"incoming": ["order_id", "amount", "event_time", "coupon_code"]}`

3. Detect coupon_code as drift.

   Changed values: `{"unexpected": ["coupon_code"]}`

4. Preserve the value while keeping the published columns unchanged.

   Changed values: `{"rescued": {"coupon_code": "FALL10"}, "published": ["order_id", "amount", "event_time"]}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser models one additive column. It does not run Databricks or Snowflake, infer data types, process nested fields, widen types, model case rules, partition columns, CSV parsing, NOT NULL changes, Snowpipe, checkpoint recovery, downstream contracts, or cost. Vendor SQL/PySpark is sourced but unexecuted.

## Explore (remaining exploration time)

Choose what happens to coupon_code. Watch the landing schema, rescue area, and operational state change independently.

Open data-engineering.html for the executable model.

Model limits: The browser models one additive column. It does not run Databricks or Snowflake, infer data types, process nested fields, widen types, model case rules, partition columns, CSV parsing, NOT NULL changes, Snowpipe, checkpoint recovery, downstream contracts, or cost. Vendor SQL/PySpark is sourced but unexecuted.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day19/data-engineering.html">Day19</a>; product material added 2026-10-09.</p><p>Databricks: after enabling liquid clustering, what operation rewrites existing data layout in this lesson?</p><details><summary>Recall first, then reveal the product refresher</summary><p>OPTIMIZE (FULL for the explicit full rewrite shown). OPTIMIZE performs clustering work. FULL explicitly forces full reclustering on supported runtimes; VACUUM and grants solve different problems.</p></details><p>Snowflake: does a table need a user clustering key before any micro-partition pruning can occur?</p><details><summary>Recall first, then reveal the product refresher</summary><p>No; metadata is automatic, while a key can improve layout for suitable large tables. Snowflake records micro-partition metadata automatically. User clustering keys are selective optimizations and are unsupported for hybrid tables.</p></details>

## Databricks: fail-and-restart or rescue deliberately · 9 minutes

Auto Loader addNewColumns first fails when a new column appears, then continues with the evolved schema after restart. Rescue keeps the schema fixed and records unexpected fields in _rescued_data. PySpark is sourced and unexecuted.

## Snowflake: COPY evolves only when all gates are open · 9 minutes

Snowflake automatic file-load evolution needs ENABLE_SCHEMA_EVOLUTION, MATCH_BY_COLUMN_NAME, and EVOLVE SCHEMA or OWNERSHIP. It is limited to COPY INTO and Snowpipe. SQL is sourced and unexecuted.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| New column | fail once, evolve, restart | COPY/Snowpipe evolves after all gates |
| Stable schema | rescue | keep evolution off and review separately |
| Gate | mode + schemaLocation + restart | flag + name match + privilege |
| Boundary | schema/type/case rules | file loads/NOT NULL/CSV rules |

Auto Loader uses addNewColumns and discovers coupon_code. Expected first event?

- The stream fails, schema information is updated, and restart uses it
- The field is always dropped
- Snowflake changes too

<details><summary>Reveal after predicting</summary>

The stream fails, schema information is updated, and restart uses it. The fail/restart boundary makes the evolution observable.

</details>

Snowflake table evolution is enabled, but the role lacks EVOLVE SCHEMA or ownership. Result?

- The required evolution gate is missing
- The privilege is unnecessary
- INSERT adds the column automatically

<details><summary>Reveal after predicting</summary>

The required evolution gate is missing. The loading role must have an evolution-capable privilege.

</details>

## Certification connection

Auto Loader schemaLocation, addNewColumns restart behavior, rescue mode, and drift-policy tradeoffs. Delivered coverage is not mastery. ENABLE_SCHEMA_EVOLUTION, MATCH_BY_COLUMN_NAME, EVOLVE SCHEMA privilege, and file-load boundaries. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks Auto Loader schema evolution](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema) — Checked October 25, 2026; checked 2026-10-25.
- [Databricks schema evolution](https://docs.databricks.com/aws/en/data-engineering/schema-evolution) — Updated October 9; checked October 25, 2026; checked 2026-10-25.
- [Snowflake automatic schema evolution](https://docs.snowflake.com/en/user-guide/data-load-schema-evolution) — Checked October 25, 2026; checked 2026-10-25.
- [Snowflake CREATE TABLE ENABLE_SCHEMA_EVOLUTION](https://docs.snowflake.com/en/sql-reference/sql/create-table) — Checked October 25, 2026; checked 2026-10-25.

## Quiz (4 minutes)

1. A trusted file adds coupon_code, but consumers are not ready for a new table column. Best immediate policy?
   - Preserve it in a rescue/quarantine field and alert
   - Drop it silently
   - Publish it everywhere automatically

2. What does schema evolution not remove?
   - The need to test downstream compatibility and privileges
   - The need for files
   - The existence of column names

3. Why might a deliberate restart be useful?
   - It creates an observable review point before the new schema continues
   - It guarantees all type changes
   - It deletes the new data

4. Which partner feeds may evolve automatically, and which must stop or rescue new fields?
5. What alert and contract test would catch a new column before it breaks a downstream Spark job?

<details><summary>Answer key — attempt first</summary>

1. Preserve it in a rescue/quarantine field and alert. Rescue keeps the data without silently changing the consumer contract.

2. The need to test downstream compatibility and privileges. Automatic mechanics do not approve a contract change.

3. It creates an observable review point before the new schema continues. A fail/restart boundary can turn drift into an explicit operational event.

</details>

## Sources

- [Databricks Auto Loader schema inference and evolution](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema) — Living documentation; updated September 11, 2026; checked 2026-10-25.
- [Databricks schema evolution overview](https://docs.databricks.com/aws/en/data-engineering/schema-evolution) — Living documentation; updated October 9, 2026; checked 2026-10-25.
- [Snowflake automatic table schema evolution](https://docs.snowflake.com/en/user-guide/data-load-schema-evolution) — Living documentation; checked 2026-10-25.
- [Snowflake COPY INTO table](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table) — Living SQL reference; checked 2026-10-25.
