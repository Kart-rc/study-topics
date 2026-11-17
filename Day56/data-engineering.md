# Close the old customer version before opening the new one

Data engineering · Day56 · 30 minutes

Preserve one non-overlapping Type-2 history when customer changes arrive late or are replayed.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day37/data-engineering.html">Day37: Retrieval lab: name the failed boundary before changing the pipeline</a></p><p>Changes disappear only after a long outage. Which evidence is most useful first?</p><details><summary>Recall first, then reveal the refresher</summary><p>The durable cursor and retained change-history window. The symptom is about an incremental position crossing a retention boundary.</p></details><p><a href="../Day9/data-engineering.html">Day9: Kafka&#x27;s consumer protocol: reassign incrementally, not behind a global barrier</a></p><p>One member changes in a large group. What is the core advantage of incremental reconciliation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Partitions whose ownership is unchanged can continue processing. The protocol narrows disruption to ownership that must move instead of imposing a group-wide synchronization barrier.</p></details>

## Understand (4 minutes)

A passport office does not erase your old passport when it issues a new one. It stamps the old validity period closed and opens a new period.

A slowly changing dimension Type 2 table does the same for business facts. Each key has dated versions. A change for customer c56 at time 20 closes the current basic row at 20 and inserts pro starting at 20. The hard invariant is not “keep two rows”; it is “for one key, validity ranges do not overlap and one row is current.” Sequence evidence, duplicate handling, deletes, null rules, and late events must be explicit.



Before: c56 | basic | [0,∞). After the event (c56, pro, ts=20): basic | [0,20) and pro | [20,∞). Replaying the exact event must not create a second pro row.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use Type-2 history when analytics or audit questions need the value that was valid at an earlier business time.

**Practical example.** A financial data platform must explain which customer tier and risk segment applied when an order was approved.

**How to decide.** Choose Type 2 only for attributes whose history matters. Use Type 1 for corrections where old values have no business meaning. Define sequence, tie, delete, late-arrival, and replay rules before choosing a product mechanism.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Two validity rows share the time-20 boundary, while the broken branch makes their overlap and double-current failure visible.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rows=[{'id':'c56','tier':'basic','from':0,'to':None,'current':True}]
event={'id':'c56','tier':'pro','ts':20}
rows[0].update({'to':event['ts'],'current':False})
rows.append({'id':'c56','tier':'pro','from':20,'to':None,'current':True}); result={'ranges':[(r['tier'],r['from'],r['to']) for r in rows],'current_count':sum(r['current'] for r in rows)}
```

1. Start with one current version.

   Changed values: `{"rows": [{"id": "c56", "tier": "basic", "from": 0, "to": null, "current": true}]}`

2. Receive the ordered change.

   Changed values: `{"event": {"id": "c56", "tier": "pro", "ts": 20}}`

3. Close the previous half-open range.

   Changed values: `{"rows": [{"id": "c56", "tier": "basic", "from": 0, "to": 20, "current": false}]}`

4. Open the new version and verify one current row.

   Changed values: `{"rows": [{"id": "c56", "tier": "basic", "from": 0, "to": 20, "current": false}, {"id": "c56", "tier": "pro", "from": 20, "to": null, "current": true}], "result": {"ranges": [["basic", 0, 20], ["pro", 20, null]], "current_count": 1}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local worlds model one key and one ordered update. They do not run Lakeflow AUTO CDC, Delta, Snowflake streams/tasks, transactions, late events, deletes, schema evolution, bitemporal history, concurrent writers, retention, or production recovery.

## Explore (remaining exploration time)

Apply the c56 event, then replay it. Predict the row ranges and current-row count.

Open data-engineering.html for the executable model.

Model limits: The local worlds model one key and one ordered update. They do not run Lakeflow AUTO CDC, Delta, Snowflake streams/tasks, transactions, late events, deletes, schema evolution, bitemporal history, concurrent writers, retention, or production recovery.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day29/data-engineering.html">Day29</a>; product material added 2026-10-19.</p><p>Ten short reader queries queue behind each other. Which lever fits the symptom?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Concurrency scaling after confirming the queue pattern. Waiting readers are a concurrency signal, not automatically a per-query-size signal.</p></details><p>What should cross the live-sharing boundary?</p><details><summary>Recall first, then reveal the product refresher</summary><p>A reconciled certified object with revocable access. The share should expose the narrow published contract, not intermediate state.</p></details>

## Databricks: declare keys, sequence, and SCD Type 2 in AUTO CDC · 9 minutes

Recall Day31's distinction between a feed and a correct target. `AUTO CDC INTO` declares keys, sequence and `STORED AS SCD TYPE 2`; prerequisites, delete semantics and late data still need design. SQL not executed in Databricks.

## Snowflake: make close-and-insert an explicit stream/task transaction · 9 minutes

Recall Day31's stream offset boundary. Snowflake stream/task processing makes Type-2 close-and-insert explicit; keep both effects in a transaction and deduplicate before MERGE. There is no direct managed AUTO CDC equivalent. SQL not executed in Snowflake.

## Compare and predict (2 minutes)

Databricks AUTO CDC manages declared Type-2 mechanics. Snowflake uses explicit stream/task and DML patterns. Both require deterministic keys/order, delete rules, deduplication, non-overlapping ranges, and verification.

What prevents duplicate c56 versions in Databricks?

- A stable key plus deterministic sequence and flow semantics
- Warehouse size
- The table comment

<details><summary>Reveal after predicting</summary>

A stable key plus deterministic sequence and flow semantics. CDC history needs identity and order.

</details>

Why keep Snowflake close-and-insert atomic?

- A failure between them can leave zero or two current rows
- It changes the account edition
- It makes every MERGE deterministic

<details><summary>Reveal after predicting</summary>

A failure between them can leave zero or two current rows. Both effects form one history transition.

</details>

## Certification connection

AUTO CDC, keys, sequence, Type-2 history, duplicate/late-event boundary, and Lakeflow pipeline prerequisites. Streams, triggered tasks, explicit close-and-insert transaction, MERGE nondeterminism boundary, and no-direct-managed-equivalent comparison. Planning groups only; full COF-C03 IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and recorded example is local Python.

- [Databricks: AUTO CDC INTO](https://docs.databricks.com/aws/en/ldp/developer/ldp-sql-ref-apply-changes-into) — Official Databricks documentation; checked November 16, 2026; checked 2026-11-16.
- [Databricks: AUTO CDC APIs](https://docs.databricks.com/aws/en/ldp/cdc) — Official Databricks documentation; checked November 16, 2026; checked 2026-11-16.
- [Snowflake: Introduction to streams and tasks](https://docs.snowflake.com/en/user-guide/data-pipelines-intro) — Official Snowflake documentation; checked November 16, 2026; checked 2026-11-16.
- [Snowflake: MERGE](https://docs.snowflake.com/en/sql-reference/sql/merge) — Official Snowflake documentation; checked November 16, 2026; checked 2026-11-16.

## Quiz (4 minutes)

1. What must happen when c56 changes at time 20?
   - Close basic at 20 and open pro at 20
   - Overwrite basic in place
   - Insert pro while leaving basic current

2. Why is a sequence column essential?
   - It decides event order and helps reject stale or duplicate changes
   - It grants table access
   - It chooses warehouse size

3. When is Type 1 simpler and better?
   - When old values have no business or audit meaning
   - Whenever events arrive late
   - Whenever history is required

4. Which customer attribute in your platform genuinely needs historical truth rather than overwrite semantics?
5. How will you define ordering when two source changes have the same timestamp?

<details><summary>Answer key — attempt first</summary>

1. Close basic at 20 and open pro at 20. Adjacent half-open ranges preserve history without overlap.

2. It decides event order and helps reject stale or duplicate changes. Type-2 correctness depends on a deterministic change order.

3. When old values have no business or audit meaning. Do not pay history complexity for attributes whose previous values are irrelevant.

</details>

## Sources

- [Databricks: AUTO CDC INTO](https://docs.databricks.com/aws/en/ldp/developer/ldp-sql-ref-apply-changes-into) — Official Databricks documentation; checked November 16, 2026; checked 2026-11-16.
- [Databricks: AUTO CDC APIs](https://docs.databricks.com/aws/en/ldp/cdc) — Official Databricks documentation; checked November 16, 2026; checked 2026-11-16.
- [Snowflake: Introduction to streams and tasks](https://docs.snowflake.com/en/user-guide/data-pipelines-intro) — Official Snowflake documentation; checked November 16, 2026; checked 2026-11-16.
- [Snowflake: MERGE](https://docs.snowflake.com/en/sql-reference/sql/merge) — Official Snowflake documentation; checked November 16, 2026; checked 2026-11-16.
