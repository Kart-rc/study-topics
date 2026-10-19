# Consolidation case: recover and publish one corrected partner feed

Data engineering · Day29 · 30 minutes

Join file identity, deterministic MERGE, repair, compute scaling, and live sharing into one safe release decision.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day18/data-engineering.html">Day18: A table grant is only one key: follow the access path</a></p><p>Maya has SELECT on orders but lacks its required container permission. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>The read is denied. SELECT protects the table operation; it does not replace required container access. A denied query is not an empty result.</p></details><p><a href="../Day22/data-engineering.html">Day22: Consolidation case: repair one orders batch without publishing the mistake</a></p><p>Ingest is green but gold has five rows instead of three. First action?</p><details><summary>Recall first, then reveal the refresher</summary><p>Block publish and preserve raw evidence. A transport success does not prove the business result.</p></details>

## Understand (4 minutes)

A carrier sends shipments.csv. At 09:00 it contains 100 orders. At 09:10 the carrier replaces the same path with a corrected file. The new batch has two rows for order 42. Validation then fails after writing 60 rows. Ten analysts are waiting, and a partner reads a live share.

This is not five separate problems. It is one release decision. A safe path must identify the corrected file, choose one winner for order 42, repair without duplicating rows, match compute to the workload, and expose only a certified view.



The release has five gates. Identity: treat the corrected object as a new version, not “the same filename.” Winner: rank order 42 by event_time and a stable tie-breaker before MERGE. Repair: restart the failed branch with repeat-safe writes. Capacity: one heavy reconciliation query needs more per-query power; many waiting readers need concurrency. Share: add or keep the certified view only after reconciliation passes; revoke access if bad data escaped.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this runbook when a file-fed pipeline must recover from corrected inputs and publish current data to internal or external consumers.

**Practical example.** A logistics partner overwrites shipments.csv, duplicate business keys appear, validation partially writes, and a partner share is already live.

**How to decide.** Stop publication first. Prove input identity and one-row-per-key determinism, repair with idempotent writes, choose compute from queue/profile evidence, then expose the narrow certified object. Treat every gate as evidence, not a checkbox.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The release board is a serial safety argument: data stops at the first gate without evidence. The partner sees only the certified exit, never an intermediate repair state.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
gates={'identity':True,'winner':True,'repair':True,'capacity':True,'share':True}
corrected_file={'path':'shipments.csv','version':'v2','rows':101}
order_42=[{'event_time':'09:05','seq':1},{'event_time':'09:07','seq':2}]
winner=max(order_42,key=lambda r:(r['event_time'],r['seq']))
release='PUBLISH' if all(gates.values()) and winner['seq']==2 else 'STOP'
```

1. Represent the five pieces of release evidence.

   Changed values: `{"gates": {"identity": true, "winner": true, "repair": true, "capacity": true, "share": true}}`

2. The corrected object keeps its stable path but gains a new version identity.

   Changed values: `{"corrected_file": {"path": "shipments.csv", "version": "v2", "rows": 101}}`

3. A total order selects the same winner on every retry.

   Changed values: `{"order_42": [{"event_time": "09:05", "seq": 1}, {"event_time": "09:07", "seq": 2}], "winner": {"event_time": "09:07", "seq": 2}}`

4. Publication occurs only when every gate has evidence.

   Changed values: `{"release": "PUBLISH"}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser is a local decision model, not Databricks or Snowflake. It uses five binary gates and ignores storage consistency, transactions across systems, schema drift, masking, cross-region replication, costs, and real query plans. Vendor SQL is illustrative and unexecuted.

## Explore (remaining exploration time)

Toggle each control. The release board names the first unsafe gate and shows which data may reach the partner.

Open data-engineering.html for the executable model.

Model limits: The browser is a local decision model, not Databricks or Snowflake. It uses five binary gates and ignores storage consistency, transactions across systems, schema drift, masking, cross-region replication, costs, and real query plans. Vendor SQL is illustrative and unexecuted.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day21/data-engineering.html">Day21</a>; product material added 2026-10-11.</p><p>Databricks validation fails. Which setting protects publish?</p><details><summary>Recall first, then reveal the product refresher</summary><p>ALL_SUCCESS. Publish should require its quality dependency to succeed.</p></details><p>Snowflake task &lt;code&gt;publish AFTER validate&lt;/code&gt;: when does publish normally start?</p><details><summary>Recall first, then reveal the product refresher</summary><p>After validate succeeds. The dependency, not warehouse availability alone, controls readiness.</p></details>

## Databricks: corrected object → ranked Delta source → repaired job → Delta Share · 9 minutes

Carry the corrected object through an auditable identity, deterministic ranked MERGE, idempotent repair, workload-aware warehouse choice, and a narrow Delta Share. Vendor code is unexecuted.

## Snowflake: content metadata → QUALIFY → MERGE → task retry → secure share · 9 minutes

Capture staged-file content metadata, QUALIFY one deterministic source row, MERGE repeat-safely, choose scale-up versus multi-cluster from evidence, and share only certified objects. Vendor SQL is unexecuted.

## Compare and predict (2 minutes)

| Gate | Databricks | Snowflake |
|---|---|---|
| Identity | Auto Loader metadata + explicit overwrite policy | load metadata + content key |
| Winner | ROW_NUMBER then MERGE | QUALIFY then MERGE |
| Repair | repair tasks; repeat-safe writes | retry graph; repeat-safe writes |
| Capacity | size vs clusters/serverless | size vs multi-cluster |
| Share | Delta Sharing | Secure Sharing |

Ten short reader queries queue behind each other. Which lever fits the symptom?

- Only make one query larger
- Concurrency scaling after confirming the queue pattern
- Force reload the file

<details><summary>Reveal after predicting</summary>

Concurrency scaling after confirming the queue pattern. Waiting readers are a concurrency signal, not automatically a per-query-size signal.

</details>

What should cross the live-sharing boundary?

- The staging table during repair
- A reconciled certified object with revocable access
- Every file version

<details><summary>Reveal after predicting</summary>

A reconciled certified object with revocable access. The share should expose the narrow published contract, not intermediate state.

</details>

## Certification connection

Cycle-two consolidation of delivered file identity, deterministic MERGE, repair, compute scaling, and sharing controls; not complete exam coverage. Cycle-two consolidation of load identity, deterministic MERGE, task recovery, warehouse scaling, and Secure Sharing; planning groups only, not complete COF-C03 coverage. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks SQL warehouse behavior](https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-behavior) — Updated October 8, 2026; checked 2026-10-19.
- [Databricks REVOKE ON SHARE](https://docs.databricks.com/aws/en/sql/language-manual/security-revoke-share) — Living documentation; checked 2026-10-19.
- [Snowflake staged-file metadata](https://docs.snowflake.com/en/user-guide/querying-metadata) — Living documentation; checked 2026-10-19.
- [Snowflake multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) — Living documentation; checked 2026-10-19.
- [Snowflake Secure Data Sharing](https://docs.snowflake.com/en/user-guide/data-sharing-intro) — Living documentation; checked 2026-10-19.

## Quiz (4 minutes)

1. The partner overwrites the same path. What identity should drive reprocessing?
   - Filename alone
   - A version/content identity plus audit metadata
   - Order count only

2. Two staged rows match order 42. What happens before MERGE?
   - Rank with a total order and keep one
   - Let the engine pick
   - Insert both

3. Reconciliation fails after a partial write. What may be shared?
   - The raw target immediately
   - Only the last certified view; stop or revoke the bad publication path
   - Every repair attempt

4. Which of the five gates is weakest in one of your real pipelines, and what evidence is missing?
5. If the partner already read bad rows, what containment, notification, and repair steps follow?

<details><summary>Answer key — attempt first</summary>

1. A version/content identity plus audit metadata. A stable path can point at changed bytes; preserve version/content evidence.

2. Rank with a total order and keep one. One deterministic source winner removes ambiguous updates.

3. Only the last certified view; stop or revoke the bad publication path. Publication is a correctness boundary, not merely the last task.

</details>

## Sources

- [Databricks Auto Loader options](https://docs.databricks.com/aws/en/spark/api-options) — Updated October 5, 2026; checked 2026-10-19.
- [Databricks Delta MERGE](https://docs.databricks.com/aws/en/delta/merge) — Updated September 11, 2026; checked 2026-10-19.
- [Databricks job repair](https://docs.databricks.com/aws/en/jobs/repair-job-failures) — Updated September 11, 2026; checked 2026-10-19.
- [Snowflake loading considerations](https://docs.snowflake.com/en/user-guide/data-load-considerations-load) — Living documentation; checked 2026-10-19.
- [Snowflake MERGE](https://docs.snowflake.com/en/sql-reference/sql/merge) — Living documentation; checked 2026-10-19.
- [Snowflake Secure Data Sharing](https://docs.snowflake.com/en/user-guide/data-sharing-intro) — Living documentation; checked 2026-10-19.
