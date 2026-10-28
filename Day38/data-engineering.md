# Wake on change instead of polling an empty source

Data engineering · Day38 · 30 minutes

Choose an event-driven trigger without confusing the wake-up signal with durable ingestion progress.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day28/data-engineering.html">Day28: Repair the failed branch, not the successful tasks</a></p><p>What does workflow repair usually choose?</p><details><summary>Recall first, then reveal the refresher</summary><p>Which failed tasks restart. The orchestrator chooses the restart point; task logic owns data safety.</p></details><p><a href="../Day16/data-engineering.html">Day16: Fewer tiny tasks: Spark AQE coalesces shuffle partitions</a></p><p>With a 32 MB target, which partitions merge first?</p><details><summary>Recall first, then reveal the refresher</summary><p>8, 12, and 3 MB. The first three adjacent partitions total 23 MB, still below the toy target.</p></details>

## Understand (4 minutes)

A shop can check the mailbox every minute, even when it is empty. Or the carrier can ring a bell when mail arrives.

Polling is the repeated mailbox check. An event-driven trigger is the bell. The bell starts work, but it does not remember which files or rows were safely processed. Durable ingestion state still belongs in Auto Loader checkpoints, a Snowflake Stream, or another explicit progress record.



Partner acme sends three order files at 09:00:00, 09:00:20, and 09:01:30. A 60-second quiet window groups the first two files into one run at 09:01:20. The third file starts another run at 09:02:30. The trigger decides when to wake; the ingestion state decides what remains.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use change-driven orchestration when arrivals are irregular and frequent polling wastes compute or adds avoidable latency.

**Practical example.** Wake a bronze-to-silver order pipeline when partner files or table changes appear instead of running an empty job every five minutes.

**How to decide.** Use a schedule when arrivals are predictable or the source cannot emit a trustworthy signal. Even with triggers, keep processing idempotent and store progress independently because notifications can be delayed, coalesced, or repeated.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The arrival timeline answers when bursts split into separate runs. Moving the third file or the quiet window changes the grouping, while the processed-file ledger stays visibly separate from wake-up count.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
arrivals = [0, 20, 90]
quiet_seconds = 60
run_times = [arrivals[1] + quiet_seconds, arrivals[2] + quiet_seconds]
processed_files = ['part-1.json', 'part-2.json', 'part-3.json']; wakeups = len(run_times)
```

1. Three files arrive; the last gap is 70 seconds.

   Changed values: `{"arrivals": [0, 20, 90]}`

2. Require one quiet minute before starting a run.

   Changed values: `{"quiet_seconds": 60}`

3. The 70-second gap closes the first burst before file 3 arrives.

   Changed values: `{"run_times": [80, 150]}`

4. Keep processed-file identity separate from the two wake-ups.

   Changed values: `{"processed_files": ["part-1.json", "part-2.json", "part-3.json"], "wakeups": 2}`

[Full runnable example](examples/data-engineering.py).

Limits: The local model groups three synthetic arrival times. It does not call cloud notifications, Lakeflow Jobs, Auto Loader, Snowflake Streams or Tasks; model delivery guarantees; calculate service cost; or prove exactly-once effects. Vendor configurations are sourced examples and were not executed.

## Explore (remaining exploration time)

Change the arrival gap and quiet window. Predict whether three files create one run, two runs, or three runs before reading the timeline.

Open data-engineering.html for the executable model.

Model limits: The local model groups three synthetic arrival times. It does not call cloud notifications, Lakeflow Jobs, Auto Loader, Snowflake Streams or Tasks; model delivery guarantees; calculate service cost; or prove exactly-once effects. Vendor configurations are sourced examples and were not executed.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day20/data-engineering.html">Day20</a>; product material added 2026-10-10.</p><p>Databricks: R7 has two item objects. variant_explode emits?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Two children correlated with R7. It counts elements, not units.</p></details><p>Snowflake: TRY_PARSE_JSON returns SQL NULL. Meaning?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Parsing failed or input was NULL; handle explicitly. Do not collapse malformed input into empty business data.</p></details>

## Databricks: a file-arrival trigger wakes the job; Auto Loader remembers the files · 9 minutes

A file-arrival trigger decides when a Lakeflow Job starts. Auto Loader and its checkpoint decide which immutable files remain. Debounce with Wait after last change; cap frequency with Minimum time between triggers. The PySpark sketch was not run.

## Snowflake: a Stream exposes change; a triggered Task consumes it · 9 minutes

A triggered Task wakes when a Stream reports data. It has no schedule, starts suspended, and must be resumed. The task must consume changes before Stream retention expires. SQL was not executed.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Wake-up | file/table/model trigger | Stream change |
| Progress | checkpoint | Stream offset |
| Burst control | debounce/cooldown | one instance and recheck |
| Boundary | same-name overwrite | staleness/directory refresh |

A Databricks file-arrival job reruns. Which state prevents re-reading every immutable file?

- The Auto Loader checkpoint
- The trigger's display name
- The job owner

<details><summary>Reveal after predicting</summary>

The Auto Loader checkpoint. Trigger state and ingestion progress are separate.

</details>

A Snowflake triggered task exists but never runs. First lifecycle check?

- The task was resumed and its Stream has detectable, retained changes
- A schedule was added
- The warehouse is named like the Stream

<details><summary>Reveal after predicting</summary>

The task was resumed and its Stream has detectable, retained changes. Triggered tasks omit SCHEDULE and begin suspended.

</details>

## Certification connection

Focused change-driven orchestration, file-arrival rate controls, Auto Loader checkpoint ownership, permissions and limitations. Delivered coverage is not mastery. Focused triggered Tasks, Streams, serverless target completion, lifecycle, monitoring and retention boundary. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks Lakeflow Jobs schedules and triggers](https://docs.databricks.com/aws/en/jobs/triggers) — Updated October 6, 2026; checked 2026-10-28.
- [Databricks file-arrival triggers](https://docs.databricks.com/aws/en/jobs/file-arrival-triggers) — Updated September 11, 2026; checked 2026-10-28.
- [Snowflake triggered tasks](https://docs.snowflake.com/en/user-guide/tasks-triggered) — Living official documentation; checked 2026-10-28.
- [Snowflake Streams introduction](https://docs.snowflake.com/en/user-guide/streams-intro) — Living official documentation; checked 2026-10-28.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Guide dated May 4, 2026; checked 2026-10-28.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview; full objective IDs and weights still unverified; checked 2026-10-28.

## Quiz (4 minutes)

1. A file-arrival trigger starts the job twice for the same landing period. What protects the result?
   - Durable ingestion progress and idempotent writes
   - The trigger name
   - A shorter polling interval

2. Why add a quiet window after the last file?
   - To group files that belong to one burst before starting work
   - To guarantee every producer is finished forever
   - To replace schema validation

3. When is a schedule the simpler choice?
   - Arrivals are predictable or no dependable change signal exists
   - Every file has a unique name
   - The table has a primary key

4. Which current pipelines poll mostly empty sources, and what evidence would justify replacing the schedule?
5. Where is durable progress stored if the trigger repeats or arrives late?

<details><summary>Answer key — attempt first</summary>

1. Durable ingestion progress and idempotent writes. A wake-up signal is not the processing ledger.

2. To group files that belong to one burst before starting work. Debouncing trades a little latency for fewer partial-batch runs.

3. Arrivals are predictable or no dependable change signal exists. A trigger adds machinery only when irregular arrivals justify it.

</details>

## Sources

- [Databricks Lakeflow Jobs schedules and triggers](https://docs.databricks.com/aws/en/jobs/triggers) — Updated October 6, 2026; checked 2026-10-28.
- [Databricks file-arrival triggers](https://docs.databricks.com/aws/en/jobs/file-arrival-triggers) — Updated September 11, 2026; checked 2026-10-28.
- [Snowflake triggered tasks](https://docs.snowflake.com/en/user-guide/tasks-triggered) — Living official documentation; checked 2026-10-28.
- [Snowflake Streams introduction](https://docs.snowflake.com/en/user-guide/streams-intro) — Living official documentation; checked 2026-10-28.
