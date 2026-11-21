# End compute with the work—not after an arbitrary idle gap

Data engineering · Day60 · 30 minutes

Choose job-scoped or inactivity-scoped compute lifecycle from arrival gaps, startup tolerance, and cost evidence.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day39/data-engineering.html">Day39: Skip storage blocks that cannot contain the customer</a></p><p>Only block 3 has min/max 41–60. What happens for customer_id = 42?</p><details><summary>Recall first, then reveal the refresher</summary><p>Blocks 1, 2, 4, 5, and 6 can be pruned. The other ranges cannot contain 42.</p></details><p><a href="../Day11/data-engineering.html">Day11: Read the labels before opening the boxes: Parquet page skipping</a></p><p>Grouped pages, target 45: what happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Read B; return no rows. 45 lies within B’s bounds, so B must be read. No stored ID equals 45. Skipping B would assume more than the label proves; nearby IDs do not satisfy equality.</p></details>

## Understand (4 minutes)

A taxi hired for one trip stops charging when the trip ends. A rented room stays open until its idle timer expires. Those are different lifecycle boundaries.

Job-scoped compute follows the unit of work. Inactivity-scoped compute follows time since the last command. A short timeout can repeatedly stop and restart between predictable queries; a long timeout can pay for unused capacity. The right setting comes from observed gaps and startup tolerance, not a universal number.



Four reports arrive 90 seconds apart. A 60-second inactivity timeout suspends between every report, causing four starts. A 300-second timeout keeps one warehouse session alive for the burst. After the burst, job-scoped compute can terminate with the job; an inactivity timer waits for its threshold.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit compute-lifecycle design for scheduled bursts, sparse orchestration, and shared task graphs.

**Practical example.** A retail platform runs four quarter-hour reconciliation queries, then remains idle for hours.

**How to decide.** Measure arrival gaps, queue/startup delay, idle cost, minimum billing, and workload support. Prefer work-scoped managed compute when supported; tune inactivity only where the platform exposes that boundary.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

One consistent time axis shows four query arrivals, the timeout boundary, resulting starts, and idle time kept.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
arrivals=[0,90,180,270]; threshold=60
starts=1+sum((b-a)>threshold for a,b in zip(arrivals,arrivals[1:]))
long_threshold=300; long_starts=1+sum((b-a)>long_threshold for a,b in zip(arrivals,arrivals[1:]))
result={'short_threshold_starts':starts,'long_threshold_starts':long_starts,'gap_seconds':90}
```

1. Model one four-query burst and a short inactivity threshold.

   Changed values: `{"arrivals": [0, 90, 180, 270], "threshold": 60}`

2. A new start is needed whenever the idle gap exceeds the threshold.

   Changed values: `{"starts": 4}`

3. A longer threshold keeps the burst together.

   Changed values: `{"long_threshold": 300, "long_starts": 1}`

4. Compare lifecycle consequences before mapping them to vendor cost.

   Changed values: `{"result": {"short_threshold_starts": 4, "long_threshold_starts": 1, "gap_seconds": 90}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local model treats startup as instant and counts only idle seconds. It omits DBUs/credits, 60-second minimum billing, query runtime, caches, autoscaling, queueing, cloud capacity, editions, permissions, and real vendor execution.

## Explore (remaining exploration time)

Switch the toy burst between 60- and 300-second idle thresholds. Predict starts and idle seconds.

Open data-engineering.html for the executable model.

Model limits: The local model treats startup as instant and counts only idle seconds. It omits DBUs/credits, 60-second minimum billing, query runtime, caches, autoscaling, queueing, cloud capacity, editions, permissions, and real vendor execution.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day30/data-engineering.html">Day30</a>; product material added 2026-10-20.</p><p>A single reconciliation query scans too much data while no queries queue. What evidence/control pairing fits?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Query profile, then reduce work or scale up. Per-query work is different from concurrent demand.</p></details><p>After revoking a live share, what limit remains?</p><details><summary>Recall first, then reveal the product refresher</summary><p>A consumer may retain data already exported. Revocation controls future provider access; it cannot recall consumer-managed copies.</p></details>

## Databricks: make task support choose serverless or classic jobs compute · 9 minutes

Choose Databricks compute by task support and lifecycle. Shared jobs compute can reduce starts but can idle between assigned tasks. SQL was not executed.

## Snowflake: AUTO_SUSPEND follows inactivity, not task completion · 9 minutes

Snowflake AUTO_SUSPEND follows inactivity and is approximate. Match it to workload gaps and billing evidence. SQL was not executed.

## Compare and predict (2 minutes)

These are not direct equivalents: one is job/task compute selection, the other is a reusable warehouse's inactivity policy.

Which Databricks task requires classic jobs compute in the current support table?

- Spark Submit
- SQL
- Notebook

<details><summary>Reveal after predicting</summary>

Spark Submit. Spark Submit is listed with classic jobs compute support.

</details>

What does Snowflake AUTO_SUSPEND=0 mean?

- Never auto-suspend
- Suspend immediately
- End at task completion

<details><summary>Reveal after predicting</summary>

Never auto-suspend. Zero or NULL disables automatic suspension.

</details>

## Certification connection

Focused compute selection, serverless prerequisites and limitations, classic jobs compute, shared-task lifecycle, and performance-mode evidence. Focused virtual-warehouse auto-suspend/resume, inactivity semantics, billing and provisioning tradeoffs, and privilege boundary. Planning groups only; full COF-C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks: configure compute for jobs](https://docs.databricks.com/aws/en/jobs/compute) — Official documentation; checked November 20, 2026; checked 2026-11-20.
- [Snowflake: warehouse considerations](https://docs.snowflake.com/en/user-guide/warehouses-considerations) — Official documentation; checked November 20, 2026; checked 2026-11-20.
- [Databricks: classic compute for jobs](https://docs.databricks.com/aws/en/jobs/run-classic-jobs) — Official documentation; updated November 2026; checked November 20, 2026; checked 2026-11-20.
- [Snowflake ALTER WAREHOUSE](https://docs.snowflake.com/en/sql-reference/sql/alter-warehouse) — Official SQL reference; checked November 20, 2026; checked 2026-11-20.

## Quiz (4 minutes)

1. Queries arrive every 90 seconds. What does a 60-second idle timeout do?
   - Suspends between queries and causes four starts
   - Keeps one session for the burst
   - Ends exactly at job completion

2. What ends classic Databricks jobs compute?
   - The job run lifecycle
   - A Snowflake AUTO_SUSPEND property
   - A JSON Schema keyword

3. Why can a very short Snowflake AUTO_SUSPEND be wasteful?
   - Repeated resume cycles can meet minimum billing again
   - It changes table schemas
   - It deletes query results

4. Which production gap distribution should drive this setting?
5. What startup-latency and cost evidence would change your choice?

<details><summary>Answer key — attempt first</summary>

1. Suspends between queries and causes four starts. Each gap exceeds the inactivity threshold.

2. The job run lifecycle. Jobs compute terminates automatically after the run; shared job compute can remain idle between tasks.

3. Repeated resume cycles can meet minimum billing again. The setting must match workload gaps and billing behavior.

</details>

## Sources

- [Databricks: configure compute for jobs](https://docs.databricks.com/aws/en/jobs/compute) — Official documentation; checked November 20, 2026; checked 2026-11-20.
- [Snowflake: warehouse considerations](https://docs.snowflake.com/en/user-guide/warehouses-considerations) — Official documentation; checked November 20, 2026; checked 2026-11-20.
