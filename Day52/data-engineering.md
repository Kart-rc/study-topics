# Process the scheduled window—not whatever time the worker wakes up

Data engineering · Day52 · 30 minutes

Anchor an hourly pipeline to explicit interval boundaries so queue delay, retry, and repair do not move the data window.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day35/data-engineering.html">Day35: A new column needs an explicit landing policy</a></p><p>A trusted file adds coupon_code, but consumers are not ready for a new table column. Best immediate policy?</p><details><summary>Recall first, then reveal the refresher</summary><p>Preserve it in a rescue/quarantine field and alert. Rescue keeps the data without silently changing the consumer contract.</p></details><p><a href="../Day7/data-engineering.html">Day7: Spark Real-Time Mode: eligibility before milliseconds</a></p><p>A Spark 4.1 query adds a keyed rolling count. What should happen before tuning its RTM epoch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Confirm that the stateful graph is supported; otherwise choose another path. Execution-mode eligibility is a correctness constraint, not a latency knob.</p></details>

## Understand (4 minutes)

A train ticket says 10:00 even when the train reaches the platform at 10:07. If a report uses 10:07 as its boundary, seven minutes of data move into a different run.

A scheduler answers which interval owns the data. Compute startup answers only when this attempt began. Keep those clocks separate. Pass an explicit half-open window such as [09:00, 10:00) into the transform, persist it with the run, and reuse it on retry.



The hourly payments job is scheduled for 10:00 but starts at 10:07. It must still read events with event_time >= 09:00 and event_time < 10:00. A retry at 10:19 uses the same pair. Using CURRENT_TIMESTAMP would silently change ownership.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit scheduled intervals for incremental jobs whose compute can queue, retry, repair, or run late.

**Practical example.** An hourly payments aggregation starts seven minutes late on shared compute but must publish the same 09:00–10:00 business window.

**How to decide.** Prefer source offsets or watermarks when they define completeness better than time. For schedule-owned batches, use half-open boundaries and a durable run identity. Do not treat a default parameter as a security control.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

A fixed scheduled interval sits above a movable worker-start marker, showing that queue delay changes execution time but not row ownership.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
scheduled_end=60; scheduled_start=0; actual_start=67
events=[55,60,62,67]
selected=[t for t in events if scheduled_start <= t < scheduled_end]
result={'window':[scheduled_start,scheduled_end],'actual_start':actual_start,'selected':selected,'retry_reuses_window':True}
```

1. Represent 09:00 as minute 0, scheduled 10:00 as 60, and actual 10:07 as 67.

   Changed values: `{"scheduled_end": 60, "scheduled_start": 0, "actual_start": 67}`

2. Create events on both sides of the scheduled boundary.

   Changed values: `{"events": [55, 60, 62, 67]}`

3. Apply the half-open scheduled interval, independent of worker start.

   Changed values: `{"selected": [55]}`

4. Persist the stable window for a later retry.

   Changed values: `{"result": {"window": [0, 60], "actual_start": 67, "selected": [55], "retry_reuses_window": true}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local Python and JavaScript models compare synthetic timestamps. They do not execute Lakeflow Jobs, Snowflake tasks, SQL warehouses, retries, daylight-saving transitions, watermarks, late-data correction, time zones, permissions, or billing.

## Explore (remaining exploration time)

Move the actual start and retry time. Predict which timestamps belong to the 10:00 run when the scheduled window stays fixed.

Open data-engineering.html for the executable model.

Model limits: The local Python and JavaScript models compare synthetic timestamps. They do not execute Lakeflow Jobs, Snowflake tasks, SQL warehouses, retries, daylight-saving transitions, watermarks, late-data correction, time zones, permissions, or billing.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day30/data-engineering.html">Day30</a>; product material added 2026-10-20.</p><p>A single reconciliation query scans too much data while no queries queue. What evidence/control pairing fits?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Query profile, then reduce work or scale up. Per-query work is different from concurrent demand.</p></details><p>After revoking a live share, what limit remains?</p><details><summary>Recall first, then reveal the product refresher</summary><p>A consumer may retain data already exported. Revocation controls future provider access; it cannot recall consumer-managed copies.</p></details>

## Databricks: inject trigger time and overrideable job parameters · 9 minutes

Recall Day29 parameter precedence. Pass trigger-derived or explicit job parameters into the task and persist the resolved interval. Job start time is not the same as cron trigger time. A permitted operator can override job parameters, so defaults are not security. Not executed in Databricks.

## Snowflake: read the current and last successful task-graph schedule · 9 minutes

Recall Day28 graph-run identity. Inside a task, SYSTEM$TASK_RUNTIME_INFO can return the latest successful graph's original schedule and the current graph group's original schedule. Those boundaries remain stable across graph tasks and retries; the function fails outside a task run. SQL not executed in Snowflake.

## Compare and predict (2 minutes)

Both products can anchor work to scheduler context, but the mechanisms differ. Databricks supplies dynamic references and job parameters; durable previous-success logic may need explicit state. Snowflake exposes current and last-successful original task-graph schedules inside a task. Neither makes CURRENT_TIMESTAMP a safe interval contract.

A Databricks cron run triggers at 10:00 but starts at 10:07. Which reference best anchors the window end?

- job.trigger.time
- job.start_time
- The query completion timestamp

<details><summary>Reveal after predicting</summary>

job.trigger.time. Trigger time represents the scheduled boundary; start time includes queue delay.

</details>

A Snowflake task graph is retried at 10:19. Which value preserves the original 10:00 boundary?

- CURRENT_TASK_GRAPH_ORIGINAL_SCHEDULED_TIMESTAMP
- CURRENT_TIMESTAMP
- The retry query start time

<details><summary>Reveal after predicting</summary>

CURRENT_TASK_GRAPH_ORIGINAL_SCHEDULED_TIMESTAMP. The runtime value is tied to the original schedule of the graph run group.

</details>

## Certification connection

Lakeflow Jobs parameters, dynamic values, trigger versus start time, repair/backfill boundaries, and permissions. Task-graph runtime information, original scheduled timestamps, retry identity, and scheduling boundaries. Planning groups only; full COF-C03 IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and recorded example is local Python.

- [Databricks dynamic value references](https://docs.databricks.com/aws/en/jobs/dynamic-value-references) — Official Databricks documentation; checked November 12, 2026; checked 2026-11-12.
- [Databricks job parameters](https://docs.databricks.com/aws/en/jobs/parameters) — Official Databricks documentation; updated November 2026; checked November 12, 2026; checked 2026-11-12.
- [Snowflake SYSTEM$TASK_RUNTIME_INFO](https://docs.snowflake.com/en/sql-reference/functions/system_task_runtime_info) — Official Snowflake reference; checked November 12, 2026; checked 2026-11-12.
- [Snowflake task graphs](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Official Snowflake documentation; checked November 12, 2026; checked 2026-11-12.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official May 4, 2026 guide; last weekly check November 11, 2026; checked 2026-11-12.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview; last weekly check November 11, 2026; full study-guide objective IDs and weights remain unverified; checked 2026-11-12.

## Quiz (4 minutes)

1. The 10:00 run starts at 10:07. Which upper bound preserves ownership?
   - 10:00, the scheduled boundary
   - 10:07, the worker start
   - The time the query finishes

2. Why use a half-open interval [09:00,10:00)?
   - Adjacent runs meet without sharing the 10:00 row
   - It makes late data impossible
   - It removes the need for a run identifier

3. When is scheduled time insufficient?
   - When source offsets or watermarks define completeness better than wall time
   - Whenever compute starts on time
   - Whenever the table has a timestamp

4. Which production job still derives its window from CURRENT_TIMESTAMP?
5. How will a repair run recover the original boundaries and run identity?

<details><summary>Answer key — attempt first</summary>

1. 10:00, the scheduled boundary. Compute delay must not redefine the business interval.

2. Adjacent runs meet without sharing the 10:00 row. The next run owns exactly 10:00, avoiding a boundary duplicate.

3. When source offsets or watermarks define completeness better than wall time. Event-time completeness can require source-specific progress, not only a clock.

</details>

## Sources

- [Databricks dynamic value references](https://docs.databricks.com/aws/en/jobs/dynamic-value-references) — Official Databricks documentation; checked November 12, 2026; checked 2026-11-12.
- [Databricks job parameters](https://docs.databricks.com/aws/en/jobs/parameters) — Official Databricks documentation; updated November 2026; checked November 12, 2026; checked 2026-11-12.
- [Snowflake SYSTEM$TASK_RUNTIME_INFO](https://docs.snowflake.com/en/sql-reference/functions/system_task_runtime_info) — Official Snowflake reference; checked November 12, 2026; checked 2026-11-12.
- [Snowflake task graphs](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Official Snowflake documentation; checked November 12, 2026; checked 2026-11-12.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official May 4, 2026 guide; last weekly check November 11, 2026; checked 2026-11-12.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview; last weekly check November 11, 2026; full study-guide objective IDs and weights remain unverified; checked 2026-11-12.
