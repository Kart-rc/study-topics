# Retrieval lab: choose the control from the symptom

Data engineering · Day23 · 30 minutes

Retrieve the first certification cycle without hints and separate delivered coverage from evidence still missing.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day18/data-engineering.html">Day18: A table grant is only one key: follow the access path</a></p><p>Maya has SELECT on orders but lacks its required container permission. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>The read is denied. SELECT protects the table operation; it does not replace required container access. A denied query is not an empty result.</p></details><p><a href="../Day20/data-engineering.html">Day20: One receipt becomes two item rows: flatten nested data deliberately</a></p><p>R7 has two objects in items. How many item rows should it emit?</p><details><summary>Recall first, then reveal the refresher</summary><p>Two. Flatten counts array elements, not total quantity.</p></details>

## Understand (4 minutes)

This is the fire-drill day. You are given a symptom, not a feature name. Your job is to choose the next control and explain what evidence would prove it worked.

The six prior lessons covered recovery, access paths, pruning, nested data, orchestration gates, and one combined repair. Retrieval matters because an exam or incident will not label the chapter for you.



Orders batch B23 has four symptoms: a retry repeated output, an analyst cannot read the candidate, a date filter scans almost everything, and publish ran after validation failed. The correct response is not “optimize the pipeline.” Each symptom points to a different mechanism and a different proof.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a retrieval-and-gap session after a run of focused lessons to test whether you can select controls from symptoms without feature-name prompts.

**Practical example.** Triage a failed orders pipeline by matching duplicate output, denied access, poor pruning, and unsafe publish to different remedies.

**How to decide.** Count an area as delivered when the lesson exists. Count it as retained only after a fresh private answer or real sandbox action; silence is not evidence of mastery or failure.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The three columns force the decision sequence: observe the symptom, choose one control family, then demand proof. Changing the symptom replaces all three rather than decorating a fixed template.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
symptoms={"duplicate":"recovery_identity","denied":"authorization_path","scan":"pruning_evidence","publish":"dependency_gate"}
evidence={"duplicate":"one_effect_after_replay","denied":"allow_and_deny_tests","scan":"fewer_bytes_scanned","publish":"blocked_on_failed_validation"}
case="publish"
decision={"control":symptoms[case],"proof":evidence[case]}
```

1. Map four incident signals to distinct control families.

   Changed values: `{"symptoms": {"duplicate": "recovery_identity", "denied": "authorization_path", "scan": "pruning_evidence", "publish": "dependency_gate"}}`

2. Name the proof required for each control.

   Changed values: `{"evidence": {"duplicate": "one_effect_after_replay", "denied": "allow_and_deny_tests", "scan": "fewer_bytes_scanned", "publish": "blocked_on_failed_validation"}}`

3. Retrieve one decision from the symptom, not from a feature name.

   Changed values: `{"case": "publish", "decision": {"control": "dependency_gate", "proof": "blocked_on_failed_validation"}}`

[Full runnable example](examples/data-engineering.py).

Limits: Executed local Python over a synthetic retrieval map. It did not grade a learner or run either vendor platform.

## Explore (remaining exploration time)

Choose one B23 symptom. Predict the control, reveal it, and name the missing vendor evidence before moving on.

Open data-engineering.html for the executable model.

Model limits: The browser is an open-book local JavaScript retrieval coach. It cannot measure memory, exam readiness, product UI skill, permissions, performance, or the result of vendor execution.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day18/data-engineering.html">Day18</a>; product material added 2026-10-08.</p><p>Databricks: SELECT and USE CATALOG exist, but USE SCHEMA is absent. What repairs the modeled read?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Grant USE SCHEMA on study18.sales to orders_readers. The schema gate is missing. Compute size and an unrelated table grant do not supply it. Other effective grants are intentionally excluded in this fixture.</p></details><p>Snowflake: the active role has table and container grants but lacks warehouse USAGE. What is the narrow repair?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Grant USAGE on study_wh to orders_reader. This fresh table query needs usable compute. Warehouse USAGE supplies the missing permission; admin access is unnecessarily broad and retention is unrelated.</p></details>

## Databricks retrieval: identify the next evidence-producing action · 9 minutes

Authorized Databricks sandbox; SQL/YAML unexecuted.

```sql
SELECT try_parse_json(payload) AS v FROM bronze.b23;
SELECT event_id, count(*) FROM bronze.b23 GROUP BY event_id HAVING count(*) > 1;
-- publish depends on validate with ALL_SUCCESS
```

Choose the query/control from the symptom, then run it in a real sandbox separately.

## Snowflake retrieval: choose the query, privilege, or task evidence · 9 minutes

Authorized Snowflake sandbox; SQL unexecuted.

```sql
SELECT TRY_PARSE_JSON(payload) AS v FROM bronze.b23;
SHOW GRANTS TO ROLE b23_pipeline;
SELECT * FROM TABLE(INFORMATION_SCHEMA.COMPLETE_TASK_GRAPHS());
```

Choose the narrow diagnostic and state what result would confirm the cause.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Bad JSON | `try_parse_json` + quarantine count | `TRY_PARSE_JSON` + quarantine count |
| Denied read | Unity Catalog path + compute | role grants + warehouse |
| Unsafe publish | task outcome + `ALL_SUCCESS` | task graph history |
| Missing evidence | real workspace run | real account run |

A product lesson exists but no sandbox action ran. What is true?

- The objective is mastered
- Curriculum coverage exists; execution skill is unassessed
- The exam is ready to book

<details><summary>Reveal after predicting</summary>

Curriculum coverage exists; execution skill is unassessed. Delivery is not hands-on evidence.

</details>

Which retrieval response is strongest?

- Name a feature
- Choose a diagnostic and state confirming/disconfirming evidence
- Increase compute

<details><summary>Reveal after predicting</summary>

Choose a diagnostic and state confirming/disconfirming evidence. Diagnosis needs a falsifiable next observation.

</details>

## Certification connection

Retrieval/gap session across delivered cycle-one material; retention and sandbox skill unassessed. Retrieval across planning groups only; full COF-C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks Lakeflow Jobs](https://docs.databricks.com/aws/en/jobs) — Updated 2026-10-09; checked 2026-10-13.
- [Databricks task dependencies](https://docs.databricks.com/aws/en/jobs/run-if) — Updated 2026-09-11; checked 2026-10-13.
- [Snowflake troubleshooting tasks](https://docs.snowflake.com/en/user-guide/tasks-ts) — Living documentation; checked 2026-10-13.
- [Snowflake COMPLETE_TASK_GRAPHS](https://docs.snowflake.com/en/sql-reference/functions/complete_task_graphs) — Living documentation; checked 2026-10-13.

## Quiz (4 minutes)

1. A date predicate scans every data chunk. First move?
   - Increase compute
   - Inspect pruning evidence and recorded ranges
   - Add a publish task

2. Validation failed but publish ran. Which boundary failed?
   - Orchestration dependency
   - JSON parsing
   - Table ownership only

3. What can this public retrieval page establish about personal mastery?
   - Complete readiness
   - Nothing without explicit fresh private evidence
   - A failed exam

4. Which of the four symptoms can you diagnose without reopening an earlier lesson?
5. Which vendor action still needs real sandbox evidence this week?

<details><summary>Answer key — attempt first</summary>

1. Inspect pruning evidence and recorded ranges. Measure whether layout metadata can exclude data before changing compute or clustering.

2. Orchestration dependency. The workflow allowed an unsafe transition.

3. Nothing without explicit fresh private evidence. Delivered curriculum and personal mastery remain separate.

</details>

## Sources

- [Databricks Data Engineer Associate certification](https://www.databricks.com/learn/certification/data-engineer-associate) — Official page; checked 2026-10-13; checked 2026-10-13.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — May 4, 2026 guide linked by program; checked 2026-10-13.
- [SnowPro Core COF-C03](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official page; checked 2026-10-13; checked 2026-10-13.
