# A quality rule needs a measurement and an explicit consequence

Data engineering · Day41 · 30 minutes

Separate detecting bad rows from deciding whether to keep, drop, block, or notify so the product mechanism matches the publication risk.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day24/data-engineering.html">Day24: A file&#x27;s path is its ticket: retries are safe, overwrites are not</a></p><p>A producer sends the same object-store notification twice. What should durable file-ingestion state normally do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Recognize the path and skip a second file load. Durable state turns notification retries into a path-level no-op.</p></details><p><a href="../Day28/data-engineering.html">Day28: Repair the failed branch, not the successful tasks</a></p><p>What does workflow repair usually choose?</p><details><summary>Recall first, then reveal the refresher</summary><p>Which failed tasks restart. The orchestrator chooses the restart point; task logic owns data safety.</p></details>

## Understand (4 minutes)

A scale can report that a package is overweight. It does not decide whether to label the package, remove one item, or stop the truck.

A data-quality rule has three parts: the condition, the measured result, and the consequence. Databricks Lakeflow expectations evaluate rows inside a pipeline and can warn, drop rows, or fail an update. Snowflake data metric functions run on a schedule and return measurements; expectations and notifications interpret those measurements. Monitoring alone does not rewrite or stop an unrelated load.



A 100-row orders batch contains four rows with a missing order_id. Warn keeps 100 and records four failures. Drop publishes 96. Fail-update publishes no new version. A scheduled Snowflake NULL_COUNT can report 4; a separate expectation such as “value = 0” marks a quality issue and can notify.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use governed quality checks when a measurable defect has a named owner and a deliberate publication consequence.

**Practical example.** A bronze orders feed may retain and count malformed rows, while the finance-ready table must fail publication when any order ID is missing.

**How to decide.** Warn while learning a baseline, drop only when losing invalid rows is acceptable and auditable, fail when partial publication is unsafe, and notify when asynchronous monitoring is the right control. Do not turn every anomaly into a pipeline outage.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The same 100 rows flow through one measured defect and three consequences. The output count and retained version change directly, making measurement-versus-enforcement visible.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
total=100; invalid=4
warn={'published':total,'violations':invalid}
drop={'published':total-invalid,'violations':invalid}
fail={'published':0 if invalid else total,'old_version_remains':invalid>0}
```

1. Measure one batch and one rule.

   Changed values: `{"total": 100, "invalid": 4}`

2. Warn keeps rows and records failures.

   Changed values: `{"warn": {"published": 100, "violations": 4}}`

3. Drop removes only invalid rows.

   Changed values: `{"drop": {"published": 96, "violations": 4}}`

4. Fail prevents the new update from becoming visible.

   Changed values: `{"fail": {"published": 0, "old_version_remains": true}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local model counts one null rule over one batch. It does not execute either platform, model streaming retries, pipeline graphs, event-log retention, DMF schedules, alerts, editions, permissions, costs, or downstream publication orchestration. Vendor SQL/Python was not run.

## Explore (remaining exploration time)

Move the invalid-row count and choose warn, drop, or fail. Predict published rows and recorded violations, then compare the product implementations.

Open data-engineering.html for the executable model.

Model limits: The local model counts one null rule over one batch. It does not execute either platform, model streaming retries, pipeline graphs, event-log retention, DMF schedules, alerts, editions, permissions, costs, or downstream publication orchestration. Vendor SQL/Python was not run.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day21/data-engineering.html">Day21</a>; product material added 2026-10-11.</p><p>Databricks validation fails. Which setting protects publish?</p><details><summary>Recall first, then reveal the product refresher</summary><p>ALL_SUCCESS. Publish should require its quality dependency to succeed.</p></details><p>Snowflake task &lt;code&gt;publish AFTER validate&lt;/code&gt;: when does publish normally start?</p><details><summary>Recall first, then reveal the product refresher</summary><p>After validate succeeds. The dependency, not warehouse availability alone, controls readiness.</p></details>

## Databricks: expectations sit inside the pipeline update · 9 minutes

Lakeflow expectations can retain and measure, drop violating rows, or fail and roll back a table update. A failed triggered flow does not automatically stop independent parallel flows; design the publication boundary. SQL was not run.

## Snowflake: DMFs measure on a schedule; expectations interpret results · 9 minutes

Snowflake DMFs run on a schedule and return measurements. Expectations classify results and notifications can report violations; stopping publication requires a separate control. Data Quality Monitoring has edition requirements. SQL was not run.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Location | pipeline update | scheduled table/view monitor |
| Result | warn/drop/fail | measurement/expectation |
| Boundary | flow graph | separate enforcement |

A Lakeflow update must publish all valid rows or nothing. Which action?

- FAIL UPDATE
- warn
- DROP ROW

<details><summary>Reveal after predicting</summary>

FAIL UPDATE. Fail-update rolls back the table update on violation.

</details>

Snowflake NULL_COUNT returns 4. What is guaranteed?

- A measurement of four nulls for that evaluation
- The source load rolled back
- Four rows were deleted

<details><summary>Reveal after predicting</summary>

A measurement of four nulls for that evaluation. DMFs measure; consequence is separately configured.

</details>

## Certification connection

Focused Lakeflow expectation syntax, warn/drop/fail semantics, rollback, metrics, flow boundaries, and troubleshooting. Delivered coverage is not mastery. Focused system DMFs, schedules, expectations, results, notifications, edition and enforcement boundaries. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks: Manage data quality with pipeline expectations](https://docs.databricks.com/aws/en/ldp/expectations) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [Snowflake: System data metric functions](https://docs.snowflake.com/en/user-guide/data-quality-system-dmfs) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [Snowflake: Use SQL to set up data metric functions](https://docs.snowflake.com/en/user-guide/data-quality-working) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [Snowflake: Use SQL to work with expectations](https://docs.snowflake.com/en/user-guide/data-quality-expectations) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Guide dated May 4, 2026; checked 2026-10-31.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview last verified October 26, 2026; full IDs/weights unverified; checked 2026-10-31.

## Quiz (4 minutes)

1. 100 rows include four invalid IDs. DROP publishes how many?
   - 96
   - 100
   - 0

2. Why is a DMF result not automatically a pipeline gate?
   - Measurement and enforcement are separate decisions
   - DMFs cannot return numbers
   - Schedules delete rows

3. When is warn preferable to fail?
   - You are establishing a baseline and the defect is not publication-critical
   - Any bad row creates an illegal ledger
   - The table has no owner

4. Which three data rules should warn, drop, and fail respectively in your platform?
5. Who owns each threshold, notification, exception, and recovery action?

<details><summary>Answer key — attempt first</summary>

1. 96. The four violating rows are removed.

2. Measurement and enforcement are separate decisions. A metric measures; an expectation/notification or orchestration control supplies consequence.

3. You are establishing a baseline and the defect is not publication-critical. Warn preserves flow while producing evidence for a deliberate threshold.

</details>

## Sources

- [Databricks: Manage data quality with pipeline expectations](https://docs.databricks.com/aws/en/ldp/expectations) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [Snowflake: System data metric functions](https://docs.snowflake.com/en/user-guide/data-quality-system-dmfs) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [Snowflake: Use SQL to set up data metric functions](https://docs.snowflake.com/en/user-guide/data-quality-working) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [Snowflake: Use SQL to work with expectations](https://docs.snowflake.com/en/user-guide/data-quality-expectations) — Official documentation; checked October 31, 2026; checked 2026-10-31.
