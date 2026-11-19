# Retrieval gap: match every pipeline claim to evidence before you trust the green run

Data engineering · Day58 · 30 minutes

Retrieve the controls from Days52–57, connect each claim to its evidence, and name the curriculum gap without pretending it is a personal weakness.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day38/data-engineering.html">Day38: Wake on change instead of polling an empty source</a></p><p>A file-arrival trigger starts the job twice for the same landing period. What protects the result?</p><details><summary>Recall first, then reveal the refresher</summary><p>Durable ingestion progress and idempotent writes. A wake-up signal is not the processing ledger.</p></details><p><a href="../Day10/data-engineering.html">Day10: Save the order and a “send later” note together</a></p><p>E7 reached Kafka, but the relay crashed before marking it sent. What can happen?</p><details><summary>Recall first, then reveal the refresher</summary><p>E7 is sent again. The saved ticket is still pending, so the relay may resend it. Kafka receiving E7 does not update the order database. A later relay crash cannot undo a committed order.</p></details>

## Understand (4 minutes)

A restaurant inspection does not pass because the front sign is green. The inspector checks the delivery log, refrigerator temperature, preparation record, and serving permit.

A data pipeline needs the same discipline. “The run succeeded” is only one claim. The interval must be fixed, Type-2 history must have one current row, query layout must be supported by workload evidence, deployment must match the reviewed declaration, and the shared object must be the verified one. Day58 retrieves those five controls from Days52–57.

The public record shows a curriculum gap, not a learner diagnosis: the examples ran locally, but no Databricks or Snowflake sandbox evidence exists. The next cycle should also revisit compute choice and semi-structured ingestion, which this cycle did not teach deeply.



Pipeline p58 reports “success.” Its fixed 09:00–10:00 window selected one event; history has one current row; the promoted declaration matches review; and the secure share points at the checked object. Query pruning is still a separate claim: it needs file or micro-partition evidence, not the green run badge.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a retrieval-and-gap review after a sequence of focused lessons, before adding another mechanism or claiming readiness.

**Practical example.** A platform lead reviews the recovery pipeline from scheduling through governed consumption and asks which claims have direct product evidence.

**How to decide.** Keep delivered curriculum, local execution, product execution, and personal mastery as four separate states. Fill missing product evidence in an authorized sandbox; do not infer skill from silence.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Five claim-to-evidence gates make it visible that a green run, a correct table, a good layout, a reviewed deployment, and a governed share are separate assertions.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
claims=['fixed_window','one_current_row','query_layout','declared_promotion','verified_share']
evidence={'fixed_window':'trigger parameters','one_current_row':'history invariant','query_layout':'pruning evidence','declared_promotion':'reviewed diff','verified_share':'recipient read'}
product_lab='not_run'; delivered=set(evidence)==set(claims)
result={'claims_retrieved':len(claims),'evidence_links':len(evidence),'delivered':delivered,'product_lab':product_lab,'gap':'real_platform_evidence'}
```

1. Retrieve the five claims from Days52–57.

   Changed values: `{"claims": ["fixed_window", "one_current_row", "query_layout", "declared_promotion", "verified_share"]}`

2. Attach one distinct evidence type to each claim.

   Changed values: `{"evidence": {"fixed_window": "trigger parameters", "one_current_row": "history invariant", "query_layout": "pruning evidence", "declared_promotion": "reviewed diff", "verified_share": "recipient read"}}`

3. Separate curriculum completeness from real product execution.

   Changed values: `{"product_lab": "not_run", "delivered": true}`

4. Record the gap without turning it into a mastery judgment.

   Changed values: `{"result": {"claims_retrieved": 5, "evidence_links": 5, "delivered": true, "product_lab": "not_run", "gap": "real_platform_evidence"}}`

[Full runnable example](examples/data-engineering.py).

Limits: The world retrieves five controls with one synthetic pipeline. It does not run Databricks or Snowflake, inspect real query profiles, prove permissions, execute a deployment, measure retention, or assess the learner. Guide coverage is not exam readiness.

## Explore (remaining exploration time)

Switch between a full evidence chain, a green run only, and a layout claim only. Predict which claims remain unproven.

Open data-engineering.html for the executable model.

Model limits: The world retrieves five controls with one synthetic pipeline. It does not run Databricks or Snowflake, inspect real query profiles, prove permissions, execute a deployment, measure retention, or assess the learner. Guide coverage is not exam readiness.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day19/data-engineering.html">Day19</a>; product material added 2026-10-09.</p><p>Databricks: after enabling liquid clustering, what operation rewrites existing data layout in this lesson?</p><details><summary>Recall first, then reveal the product refresher</summary><p>OPTIMIZE (FULL for the explicit full rewrite shown). OPTIMIZE performs clustering work. FULL explicitly forces full reclustering on supported runtimes; VACUUM and grants solve different problems.</p></details><p>Snowflake: does a table need a user clustering key before any micro-partition pruning can occur?</p><details><summary>Recall first, then reveal the product refresher</summary><p>No; metadata is automatic, while a key can improve layout for suitable large tables. Snowflake records micro-partition metadata automatically. User clustering keys are selective optimizations and are unsupported for hybrid tables.</p></details>

## Databricks retrieval: reconstruct the evidence chain · 9 minutes

Retrieve fixed job parameters, ordered AUTO CDC history, query evidence, reviewed bundle promotion, and verified sharing as separate controls. No Databricks command was run.

## Snowflake retrieval: separate task, table, profile, deployment, and share evidence · 9 minutes

Use task history, transactional history checks, query evidence, reviewed change evidence, and recipient verification separately. No Snowflake SQL was run; full COF-C03 IDs/weights remain unverified.

## Compare and predict (2 minutes)

Both products require claim-specific evidence. Their mechanics differ, and neither green status proves the other layers.

A Databricks job succeeded. What still needs separate proof?

- The fixed interval, history invariant, layout effect, reviewed promotion, and recipient access
- Nothing
- Only the notebook color

<details><summary>Reveal after predicting</summary>

The fixed interval, history invariant, layout effect, reviewed promotion, and recipient access. Success is one state, not five guarantees.

</details>

A Snowflake task succeeded. Which evidence supports a sharing claim?

- The intended secure object is in the intended share and the recipient can read it
- TASK_HISTORY alone
- A warehouse is running

<details><summary>Reveal after predicting</summary>

The intended secure object is in the intended share and the recipient can read it. Run evidence and consumer-boundary evidence are different.

</details>

## Certification connection

Retrieves Days52–57 controls across Jobs, transformation, optimization, CI/CD, and governance; identifies real sandbox evidence plus compute/ingestion as delivered-curriculum gaps. Retrieves task, transactional history, performance, promotion, and sharing evidence. Planning groups only; full COF-C03 objective IDs and weights remain unverified after the November 18 official check. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks Data Engineer Associate certification](https://www.databricks.com/learn/certification/data-engineer-associate) — Official exam overview and weights; rechecked November 18, 2026; checked 2026-11-18.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official guide for the May 4, 2026 exam version; rechecked November 18, 2026; checked 2026-11-18.
- [SnowPro Core COF-C03 certification](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview and study-guide entry; rechecked November 18, 2026; full objective IDs and weights not retrieved; checked 2026-11-18.
- [Databricks Auto Loader schema evolution](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema) — Official documentation; checked November 18, 2026; checked 2026-11-18.
- [Snowflake semi-structured data types](https://docs.snowflake.com/en/sql-reference/data-types-semistructured) — Official documentation; checked November 18, 2026; checked 2026-11-18.

## Quiz (4 minutes)

1. p58 succeeded, but its input used wake time. Which claim fails first?
   - The business interval is fixed
   - The cluster exists
   - The workflow has a name

2. Which evidence supports a clustering decision?
   - Observed filter workload and pruning/scan evidence
   - One current Type-2 row
   - A secure-view name

3. What can this repository truthfully say today?
   - The curriculum was delivered and local models ran; product execution and mastery are not assessed
   - Both certifications are ready
   - Every COF-C03 objective ID is covered

4. Which claim in your current pipeline has only a green badge rather than direct evidence?
5. Which authorized sandbox action would turn one Day58 curriculum gap into execution evidence?

<details><summary>Answer key — attempt first</summary>

1. The business interval is fixed. A successful run can answer the wrong interval.

2. Observed filter workload and pruning/scan evidence. Physical layout needs workload and scan evidence.

3. The curriculum was delivered and local models ran; product execution and mastery are not assessed. The public record tracks delivery, not personal readiness.

</details>

## Sources

- [Databricks Data Engineer Associate certification](https://www.databricks.com/learn/certification/data-engineer-associate) — Official exam overview and weights; rechecked November 18, 2026; checked 2026-11-18.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official guide for the May 4, 2026 exam version; rechecked November 18, 2026; checked 2026-11-18.
- [SnowPro Core COF-C03 certification](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview and study-guide entry; rechecked November 18, 2026; full objective IDs and weights not retrieved; checked 2026-11-18.
