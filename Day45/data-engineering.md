# Keep good rows usable and bad rows inspectable

Data engineering · Day45 · 30 minutes

Choose an ingestion error policy that preserves valid data without hiding malformed or schema-drifted records.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day26/data-engineering.html">Day26: Scale for one heavy query—or for many waiting queries</a></p><p>One query spills while there is no queue. First capacity move?</p><details><summary>Recall first, then reveal the refresher</summary><p>Increase per-query/warehouse size. The symptom is one query exceeding its lane, not many queries waiting.</p></details><p><a href="../Day30/data-engineering.html">Day30: Retrieval lab: choose the control from the incident symptom</a></p><p>Twenty short reader queries wait while individual runtimes are normal. Which lever best matches the symptom?</p><details><summary>Recall first, then reveal the refresher</summary><p>Increase concurrency capacity after confirming queueing. Waiting readers are a concurrency signal, not automatically a per-query-size problem.</p></details>

## Understand (4 minutes)

A warehouse receives four cartons. Two are correct, one has the right items under unfamiliar labels, and one is crushed. Throwing away the whole truck protects consistency but delays every good carton. Accepting everything without labels hides the damage.

Data ingestion needs the same explicit lanes: accepted rows, recoverable surprises, and records that could not be parsed. The useful control is not “ignore errors.” It is “keep every outcome countable and inspectable, then decide what may advance.”



A payments file contains four rows: P-1 is valid; P-2 has amount="twelve"; P-3 is malformed JSON; P-4 is valid. The production decision is whether P-1 and P-4 may enter bronze while P-2 and P-3 remain visible for repair. The answer depends on downstream risk, reconciliation, and whether partial loading changes business meaning.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit exception lanes when source files can contain recoverable drift or isolated corruption and delaying every valid row is more harmful than bounded partial progress.

**Practical example.** A partner sends hourly payment events; two valid records should remain available while a type mismatch and a truncated JSON record are investigated.

**How to decide.** Abort the batch when completeness is the contract or partial progress breaks reconciliation. Otherwise load valid rows only when rejected and rescued counts, source locations, alert thresholds, replay ownership, and publication gates are all explicit.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The three lanes answer which exact records advance, which preserve recoverable fields, and which need source-level repair; the separate publication verdict prevents landing from being mistaken for business approval.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rows=[{'id':'P-1','state':'valid'},{'id':'P-2','state':'type_mismatch'},{'id':'P-3','state':'malformed'},{'id':'P-4','state':'valid'}]
accepted=[r['id'] for r in rows if r['state']=='valid']; rescued=[r['id'] for r in rows if r['state']=='type_mismatch']
corrupt=[r['id'] for r in rows if r['state']=='malformed']; accounted=len(accepted)+len(rescued)+len(corrupt)
can_publish=accounted==len(rows) and len(corrupt)<=1; decision='publish_with_exception' if can_publish else 'hold'
```

1. Start with two valid rows and two different error classes.

   Changed values: `{"rows": [{"id": "P-1", "state": "valid"}, {"id": "P-2", "state": "type_mismatch"}, {"id": "P-3", "state": "malformed"}, {"id": "P-4", "state": "valid"}]}`

2. Keep valid rows separate from recoverable schema surprises.

   Changed values: `{"accepted": ["P-1", "P-4"], "rescued": ["P-2"]}`

3. Give malformed records their own visible lane and reconcile the counts.

   Changed values: `{"corrupt": ["P-3"], "accounted": 4}`

4. Apply an explicit synthetic publication rule; landing alone is not approval.

   Changed values: `{"can_publish": true, "decision": "publish_with_exception"}`

[Full runnable example](examples/data-engineering.py).

Limits: This local model classifies four fixed synthetic rows. It does not parse files, contact storage, preserve vendor load metadata, model concurrent files, exactly-once replay, schema inference, permissions, cost, encryption, or downstream reconciliation.

## Explore (remaining exploration time)

Switch between abort and inspectable-exception policies. Predict which rows advance and whether publication is allowed before revealing the lanes.

Open data-engineering.html for the executable model.

Model limits: This local model classifies four fixed synthetic rows. It does not parse files, contact storage, preserve vendor load metadata, model concurrent files, exactly-once replay, schema inference, permissions, cost, encryption, or downstream reconciliation.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day26/data-engineering.html">Day26</a>; product material added 2026-10-16.</p><p>Dashboard queries run quickly after starting but wait in line. Common answer?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Add concurrency lanes/clusters. Queue pressure is a scale-out problem.</p></details><p>One reconciliation spills with no queue. Common first direction?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Increase per-query size or tune it. One query needs a wider lane.</p></details>

## Databricks: preserve drift in _rescued_data and malformed input in _corrupt_record · 9 minutes

Auto Loader keeps schema/type surprises in `_rescued_data` and can capture unparseable rows in `_corrupt_record`. Monitor both, reconcile counts, and decide publication separately. The PySpark sketch was not run in Databricks.

## Snowflake: preflight COPY errors, then choose abort or partial load deliberately · 9 minutes

`VALIDATION_MODE=RETURN_ERRORS` inspects without loading. `ABORT_STATEMENT` commits no target rows on error. `CONTINUE` loads valid rows and reports rejected records; those errors are not rows in the target. SQL was not executed.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Recoverable drift | `_rescued_data` | COPY error or explicit transformation |
| Malformed row | `_corrupt_record` | COPY error, not target row |
| Preflight | inspect quality columns | `VALIDATION_MODE` |

P-2 has a type mismatch but its original field should remain inspectable in Auto Loader. Where does it belong?

- _rescued_data
- _corrupt_record
- The checkpoint only

<details><summary>Reveal after predicting</summary>

_rescued_data. The rescued-data column preserves schema, type, and case mismatches; corrupt-record is for rows the parser cannot form.

</details>

What does Snowflake VALIDATION_MODE=RETURN_ERRORS do to the target table?

- It returns load errors without loading rows
- It loads only valid rows
- It swaps the target table

<details><summary>Reveal after predicting</summary>

It returns load errors without loading rows. Validation mode tests files and returns errors instead of loading the target.

</details>

## Certification connection

Data Ingestion and Loading: Auto Loader schema enforcement/evolution, rescued and corrupt records, monitoring, and publication boundaries. Loading, unloading, and transformation planning group: COPY validation, ON_ERROR choice, error evidence, and partial-load boundaries. This is a planning group, not a claimed full COF-C03 objective map. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks Auto Loader schema inference and evolution](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema) — Official documentation; updated September 11, 2026; checked 2026-11-04.
- [Databricks Auto Loader best practices](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/best-practices) — Official documentation; checked November 4, 2026; checked 2026-11-04.
- [Snowflake COPY INTO table](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table) — Official SQL reference; checked November 4, 2026; checked 2026-11-04.
- [Snowflake VALIDATE](https://docs.snowflake.com/en/sql-reference/functions/validate) — Official SQL reference; checked November 4, 2026; checked 2026-11-04.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Official May 4, 2026 guide; rechecked November 4, 2026; checked 2026-11-04.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview rechecked November 4, 2026; full objective IDs and weights remain unverified; checked 2026-11-04.

## Quiz (4 minutes)

1. Two rows are valid, one has a type mismatch, and one is malformed. When is partial progress defensible?
   - Every outcome is visible and the business contract permits partial loading
   - Errors are silently discarded
   - The source path is unknown

2. Why separate recoverable drift from malformed syntax?
   - They need different diagnosis and repair paths
   - Both should be renamed success
   - It guarantees downstream correctness

3. What can still block publication after good rows load?
   - A completeness or reconciliation gate
   - The presence of a bronze table
   - A successful local JavaScript model

4. Which source in your platform may progress partially, and what reconciliation proof makes that safe?
5. Who owns replay of rescued and corrupt records, and how does publication wait for the required outcome?

<details><summary>Answer key — attempt first</summary>

1. Every outcome is visible and the business contract permits partial loading. Partial progress needs evidence, replay ownership, and a business rule that does not require atomic file completeness.

2. They need different diagnosis and repair paths. A schema mismatch may preserve field data; malformed syntax might not yield a record at all.

3. A completeness or reconciliation gate. Landing and publishing are separate decisions; business completeness can require the full file.

</details>

## Sources

- [Databricks Auto Loader schema inference and evolution](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema) — Official documentation; updated September 11, 2026; checked 2026-11-04.
- [Databricks Auto Loader best practices](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/best-practices) — Official documentation; checked November 4, 2026; checked 2026-11-04.
- [Snowflake COPY INTO table](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table) — Official SQL reference; checked November 4, 2026; checked 2026-11-04.
- [Snowflake VALIDATE](https://docs.snowflake.com/en/sql-reference/functions/validate) — Official SQL reference; checked November 4, 2026; checked 2026-11-04.
