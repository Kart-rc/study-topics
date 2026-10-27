# Retrieval lab: name the failed boundary before changing the pipeline

Data engineering · Day37 · 30 minutes

Diagnose five look-alike order-pipeline incidents, then choose a product-specific observation and a safe first action.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day22/data-engineering.html">Day22: Consolidation case: repair one orders batch without publishing the mistake</a></p><p>Ingest is green but gold has five rows instead of three. First action?</p><details><summary>Recall first, then reveal the refresher</summary><p>Block publish and preserve raw evidence. A transport success does not prove the business result.</p></details><p><a href="../Day26/data-engineering.html">Day26: Scale for one heavy query—or for many waiting queries</a></p><p>One query spills while there is no queue. First capacity move?</p><details><summary>Recall first, then reveal the refresher</summary><p>Increase per-query/warehouse size. The symptom is one query exceeding its lane, not many queries waiting.</p></details>

## Understand (4 minutes)

A parcel disappears. Replacing the truck will not help if the real problem is a locked loading dock, a rejected label, the wrong customer shelf, an expired tracking bookmark, or a test copy that still depends on the original box.

Data incidents often look alike from the dashboard. Diagnose the boundary that stopped preserving truth before changing pipeline code: identity, schema, row policy, change position, or clone dependency.



The same synthetic order O-42 from Day36 now produces one of five symptoms. An S3 read returns access denied. A new coupon_code is absent from the published table. Tenant beta can see an acme row. Fulfillment misses changes after downtime. A QA clone fails after source files or policy dependencies change.

Each symptom points to a different first inspection. A retry is useful only after the failed boundary is known.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this retrieval map during incident triage, certification practice, design reviews, and post-release checks for governed incremental pipelines.

**Practical example.** An on-call engineer sees missing fulfillment updates after a weekend outage and must decide whether to inspect cloud access, schema rescue data, tenant policy, the change cursor, or clone dependencies.

**How to decide.** Start with the earliest boundary whose evidence contradicts the expected state. Collect read-only evidence first. Do not infer a personal knowledge gap from this generated exercise; use submitted answers and authorized product labs to decide what needs more study.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The three-stage incident path answers which state to inspect before touching code. Changing the symptom changes both the suspected boundary and the first observation; the visual does not pretend that one green pipeline status explains all failures.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
symptom = 'changes missing after downtime'
boundary = 'change position and retention'
evidence = ['durable cursor', 'earliest retained version or STALE_AFTER']
first_action = 'reconcile the gap; do not blind-retry'
```

1. Start with one observable fact, not a guessed root cause.

   Changed values: `{"symptom": "changes missing after downtime"}`

2. Map the symptom to the state most likely to have expired.

   Changed values: `{"boundary": "change position and retention"}`

3. Name read-only evidence for both product paths.

   Changed values: `{"evidence": ["durable cursor", "earliest retained version or STALE_AFTER"]}`

4. Choose a safe action that preserves the missing-interval question.

   Changed values: `{"first_action": "reconcile the gap; do not blind-retry"}`

[Full runnable example](examples/data-engineering.py).

Limits: This local JavaScript teaching model maps five synthetic symptoms to likely first inspections. It does not run AWS, Databricks, or Snowflake, prove root cause, inspect logs, test privileges, recover expired history, validate policy semantics, or establish certification mastery. Vendor SQL/PySpark is sourced but unexecuted.

## Explore (remaining exploration time)

Choose a symptom, predict the broken boundary, then reveal the safest first observation. Notice that retrying is never the first universal answer.

Open data-engineering.html for the executable model.

Model limits: This local JavaScript teaching model maps five synthetic symptoms to likely first inspections. It does not run AWS, Databricks, or Snowflake, prove root cause, inspect logs, test privileges, recover expired history, validate policy semantics, or establish certification mastery. Vendor SQL/PySpark is sourced but unexecuted.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day25/data-engineering.html">Day25</a>; product material added 2026-10-15.</p><p>A consumer needs current rows but must not own a writable copy. Best common mechanism?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Live read-only share. Both products expose provider-owned data through read-only sharing.</p></details><p>What survives after a recipient exported shared rows before revocation?</p><details><summary>Recall first, then reveal the product refresher</summary><p>The recipient-created export may remain. Revocation stops future shared access; it cannot recall an independent copy already made.</p></details>

## Databricks retrieval: separate access, schema, policy, cursor, and clone evidence · 9 minutes

Classify the symptom before acting: external-location trust, Auto Loader schema/rescue state, effective row-filter context, CDF/checkpoint position, or shallow-clone source dependency. Expired history requires reconciliation, not a blind retry. Vendor commands are unexecuted.

## Snowflake retrieval: read the Stream clock and policy context before recreating anything · 9 minutes

Inspect STALE and STALE_AFTER, policy context, and clone dependencies as separate states. Recreating a stale Stream resumes future tracking but does not automatically recover the missed interval. Vendor SQL is unexecuted.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Progress | checkpoint / CDF version | Stream offset and STALE_AFTER |
| History gone | reconcile, then reset deliberately | reconcile, then recreate for future changes |
| Policy | effective identity + composition | policy context + mapping objects |
| Clone | shallow source-file dependency | clone-point history + policy references |

A Databricks CDF read requests a version that retention removed. Best first response?

- Preserve the gap, reconcile from authoritative data, then reset deliberately
- Retry until history reappears
- Replace the row filter

<details><summary>Reveal after predicting</summary>

Preserve the gap, reconcile from authoritative data, then reset deliberately. Expired history is not recreated by retrying.

</details>

A Snowflake Stream is stale. What does recreating it prove?

- Only that future tracking can restart; missed changes still need reconciliation
- That every missed row was recovered
- That row policies are correct

<details><summary>Reveal after predicting</summary>

Only that future tracking can restart; missed changes still need reconciliation. A new Stream does not automatically reconstruct the lost interval.

</details>

## Certification connection

Retrieval across Days31–36: CDF/checkpoints, row filters, external locations, schema evolution, clones, and release diagnosis. Delivered practice is not mastery; no personal gap is inferred. Retrieval across Days31–36: Streams, row policies, storage integrations, schema evolution, cloning, and gap reconciliation. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks change data feed](https://docs.databricks.com/aws/en/tables/features/change-data-feed) — Updated October 9, 2026; checked 2026-10-27.
- [Databricks Structured Streaming checkpoints](https://docs.databricks.com/aws/en/structured-streaming/checkpoints) — Updated September 11, 2026; checked 2026-10-27.
- [Databricks row filters and column masks](https://docs.databricks.com/aws/en/tables/row-and-column-filters) — Living documentation; checked 2026-10-27.
- [Snowflake Streams introduction](https://docs.snowflake.com/en/user-guide/streams-intro) — Living documentation; checked 2026-10-27.
- [Snowflake SHOW STREAMS](https://docs.snowflake.com/en/sql-reference/sql/show-streams) — Living documentation; checked 2026-10-27.
- [Snowflake row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) — Living documentation; checked 2026-10-27.

## Quiz (4 minutes)

1. Changes disappear only after a long outage. Which evidence is most useful first?
   - The durable cursor and retained change-history window
   - The clone name
   - The number of columns

2. Why inspect evidence before retrying?
   - A retry can repeat the same failure or hide the boundary that lost truth
   - Retries repair every policy
   - Retries recreate expired history

3. What does this retrieval session establish about your readiness?
   - Only delivered practice; mastery still needs answers and real product evidence
   - A passing certification result
   - Complete COF-C03 coverage

4. Pick one recent data incident. Which boundary-owned state would have shortened diagnosis most?
5. Which Day31–36 product behavior can you explain from memory, and which one needs a real sandbox check?

<details><summary>Answer key — attempt first</summary>

1. The durable cursor and retained change-history window. The symptom is about an incremental position crossing a retention boundary.

2. A retry can repeat the same failure or hide the boundary that lost truth. A retry is an action, not a diagnosis.

3. Only delivered practice; mastery still needs answers and real product evidence. Generated curriculum coverage and personal mastery are separate.

</details>

## Sources

- [Databricks change data feed](https://docs.databricks.com/aws/en/tables/features/change-data-feed) — Updated October 9, 2026; checked 2026-10-27.
- [Databricks Structured Streaming checkpoints](https://docs.databricks.com/aws/en/structured-streaming/checkpoints) — Updated September 11, 2026; checked 2026-10-27.
- [Databricks row filters and column masks](https://docs.databricks.com/aws/en/tables/row-and-column-filters) — Living documentation; checked 2026-10-27.
- [Snowflake Streams introduction](https://docs.snowflake.com/en/user-guide/streams-intro) — Living documentation; checked 2026-10-27.
- [Snowflake SHOW STREAMS](https://docs.snowflake.com/en/sql-reference/sql/show-streams) — Living documentation; checked 2026-10-27.
- [Snowflake row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) — Living documentation; checked 2026-10-27.
