# Retrieval lab: choose the control from the incident symptom

Data engineering · Day30 · 30 minutes

Retrieve the control before seeing the answer, then name the evidence that would confirm it.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day24/data-engineering.html">Day24: A file&#x27;s path is its ticket: retries are safe, overwrites are not</a></p><p>A producer sends the same object-store notification twice. What should durable file-ingestion state normally do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Recognize the path and skip a second file load. Durable state turns notification retries into a path-level no-op.</p></details><p><a href="../Day12/data-engineering.html">Day12: Cross out one exact row: Iceberg position deletes</a></p><p>Which pair hides O11 in the example?</p><details><summary>Recall first, then reveal the refresher</summary><p>orders-A.parquet and position 1. Positions start at zero, and the file path is part of the identity. O11 is row 1 only in orders-A.parquet.</p></details>

## Understand (4 minutes)

An incident channel contains six short messages: “the partner replaced the same file,” “order 42 has two source rows,” “the transform failed after loading,” “one reconciliation query is slow,” “twenty readers are queued,” and “a partner can still see the bad view.”

The exam skill is not remembering six product names. It is mapping a symptom to the smallest control that changes the mechanism, then checking evidence. This session retrieves Days24–29; it does not infer personal mastery.



Use the same diagnostic order each time. First name what changed: object identity, source-row cardinality, task state, per-query work, concurrency, or publication access. Then choose one control. Finally ask for observable proof. “It ran” is weak evidence. A content key, one-row-per-key query, graph-run state, query profile, queue history, or revoked grant is stronger.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this retrieval session after several related platform lessons, or before a sandbox lab, when feature names are starting to blur together.

**Practical example.** A logistics pipeline has a corrected object, duplicate business keys, a failed branch, mixed warehouse pressure, and a live partner share.

**How to decide.** Choose from the symptom before opening documentation. If you cannot name the confirming evidence, mark a curriculum gap for practice. Do not convert a browser score into certification readiness.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The visual is a diagnostic path: the symptom identifies the broken stage, the control changes that stage, and the evidence shows whether the diagnosis was right.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
symptom='twenty readers wait'
mechanism='concurrency' if 'readers' in symptom else 'unknown'
control='scale_out_after_queue_evidence' if mechanism=='concurrency' else 'investigate'
evidence=['queued_time','active_queries','cluster_count']
```

1. Start from the observed symptom, not a memorized product name.

   Changed values: `{"symptom": "twenty readers wait"}`

2. Name the system property that changed.

   Changed values: `{"mechanism": "concurrency"}`

3. Choose the narrow control that addresses that mechanism.

   Changed values: `{"control": "scale_out_after_queue_evidence"}`

4. Name the observations needed to confirm the diagnosis.

   Changed values: `{"evidence": ["queued_time", "active_queries", "cluster_count"]}`

[Full runnable example](examples/data-engineering.py).

Limits: This is a local JavaScript retrieval model using six synthetic incident symptoms. It does not run Databricks or Snowflake, inspect permissions, query profiles, costs, editions, object-store versions, or task histories. Product mastery remains not assessed until real sandbox work and fresh assessment evidence exist.

## Explore (remaining exploration time)

Pick a symptom, predict the control, then reveal the evidence. The diagram changes the broken stage rather than repeating a generic card layout.

Open data-engineering.html for the executable model.

Model limits: This is a local JavaScript retrieval model using six synthetic incident symptoms. It does not run Databricks or Snowflake, inspect permissions, query profiles, costs, editions, object-store versions, or task histories. Product mastery remains not assessed until real sandbox work and fresh assessment evidence exist.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day23/data-engineering.html">Day23</a>; product material added 2026-10-13.</p><p>A product lesson exists but no sandbox action ran. What is true?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Curriculum coverage exists; execution skill is unassessed. Delivery is not hands-on evidence.</p></details><p>Which retrieval response is strongest?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Choose a diagnostic and state confirming/disconfirming evidence. Diagnosis needs a falsifiable next observation.</p></details>

## Databricks retrieval: identify the control before opening the console · 9 minutes

Retrieve from symptom: object identity, deterministic source shaping, job repair, scale-up versus concurrency, and narrow/revocable Delta Sharing. Code is unexecuted.

## Snowflake retrieval: separate load identity, task state, warehouse pressure, and sharing · 9 minutes

Retrieve from symptom: staged-file content metadata, QUALIFY before MERGE, task-graph retry, scale-up versus multi-cluster, and revocable Secure Sharing. SQL is unexecuted.

## Compare and predict (2 minutes)

| Symptom | Databricks | Snowflake |
|---|---|---|
| Changed file | Auto Loader identity/policy | content key/load history |
| Duplicate key | rank before Delta MERGE | QUALIFY before MERGE |
| Failed branch | job repair | retry task graph |
| Workload | size vs clusters | size vs multi-cluster |
| Exposure | Delta Share revoke | Secure Share revoke |

A single reconciliation query scans too much data while no queries queue. What evidence/control pairing fits?

- Query profile, then reduce work or scale up
- Multi-cluster only
- Revoke the share

<details><summary>Reveal after predicting</summary>

Query profile, then reduce work or scale up. Per-query work is different from concurrent demand.

</details>

After revoking a live share, what limit remains?

- A consumer may retain data already exported
- The provider can erase every recipient copy
- MERGE becomes deterministic

<details><summary>Reveal after predicting</summary>

A consumer may retain data already exported. Revocation controls future provider access; it cannot recall consumer-managed copies.

</details>

## Certification connection

Cycle-two retrieval across delivered controls; gaps require real sandbox evidence. Not complete exam coverage or mastery. Cycle-two retrieval across planning-group material only. Full COF-C03 objectives/weights and mastery remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks job repair](https://docs.databricks.com/aws/en/jobs/repair-job-failures) — Updated October 9, 2026; checked 2026-10-20.
- [Databricks SQL warehouse behavior](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-behavior) — Updated October 8, 2026; checked 2026-10-20.
- [Snowflake task graph retry](https://docs.snowflake.com/en/user-guide/tasks-graphs) — Living documentation; checked 2026-10-20.
- [Snowflake multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) — Living documentation; checked 2026-10-20.
- [Snowflake Secure Data Sharing](https://docs.snowflake.com/en/user-guide/data-sharing-intro) — Living documentation; checked 2026-10-20.

## Quiz (4 minutes)

1. Twenty short reader queries wait while individual runtimes are normal. Which lever best matches the symptom?
   - Increase concurrency capacity after confirming queueing
   - Reload the file
   - Add another MERGE source row

2. Two staged rows match order 42. What comes before MERGE?
   - A deterministic total order that keeps one source row
   - A random engine choice
   - A larger warehouse only

3. What does this retrieval score establish?
   - Which prompts need more practice, not certification mastery
   - A guaranteed exam pass
   - Vendor-platform execution

4. Which symptom do you still confuse with a different mechanism, and what evidence would separate them?
5. What exact vendor-platform task will you run to turn this coverage into practice?

<details><summary>Answer key — attempt first</summary>

1. Increase concurrency capacity after confirming queueing. Waiting readers are a concurrency signal, not automatically a per-query-size problem.

2. A deterministic total order that keeps one source row. MERGE needs an unambiguous source winner.

3. Which prompts need more practice, not certification mastery. A teaching model can expose recall gaps but cannot substitute for product practice or a fresh assessment.

</details>

## Sources

- [Databricks Certified Data Engineer Associate](https://www.databricks.com/learn/certification/data-engineer-associate) — Current certification overview; checked 2026-10-20.
- [Databricks exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Version dated May 4, 2026; checked 2026-10-20.
- [SnowPro Core COF-C03](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Current certification overview; checked 2026-10-20.
- [Databricks Auto Loader options](https://docs.databricks.com/aws/en/spark/api-options) — Living documentation; checked 2026-10-20.
- [Snowflake staged-file metadata](https://docs.snowflake.com/en/user-guide/querying-metadata) — Living documentation; checked 2026-10-20.
