# Choose one source winner before MERGE

Data engineering · Day27 · 30 minutes

Make MERGE deterministic by reducing duplicate source events to one winner for each business key.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day10/data-engineering.html">Day10: Save the order and a “send later” note together</a></p><p>E7 reached Kafka, but the relay crashed before marking it sent. What can happen?</p><details><summary>Recall first, then reveal the refresher</summary><p>E7 is sent again. The saved ticket is still pending, so the relay may resend it. Kafka receiving E7 does not update the order database. A later relay crash cannot undo a committed order.</p></details><p><a href="../Day17/data-engineering.html">Day17: Unaligned checkpoints: save the waiting records too</a></p><p>The replay saves 10 and [2,3]. What should recovery produce?</p><details><summary>Recall first, then reveal the refresher</summary><p>15. Replaying the two not-yet-counted records adds 5, once.</p></details>

## Understand (4 minutes)

Think of a race with one podium place. If two runners both arrive for “order 42,” the referee must choose one winner before updating the official record. A database MERGE has the same need: each target row should see one source winner.

The safe shape is raw events → rank within each business key → keep rank 1 → MERGE. “Latest” needs a complete, deterministic order: event time plus an ingestion sequence or event ID for ties.



Order 42 arrives twice: PACKED at 10:02, sequence 7 and SHIPPED at 10:05, sequence 9. Rank by event_time DESC, ingest_sequence DESC. SHIPPED becomes row 1. The MERGE sees only that row, so the target moves from PACKED to SHIPPED once.

A second order can be processed in the same batch because ranking is partitioned by order_id.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this before an upsert whenever one micro-batch or staged load may contain two records for the same target key.

**Practical example.** A Kafka retry and a late shipment event both put order 42 into the same landing batch.

**How to decide.** Define the business key, the winning order, and the tie-breaker explicitly. Reject or quarantine rows when the system cannot select a truthful winner.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The podium is the contract boundary: every duplicate can exist on the left, but only rank 1 crosses into MERGE. When timestamps tie, the sequence slider visibly becomes the deciding evidence.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
events=[{'status':'PACKED','minute':2,'seq':7},{'status':'SHIPPED','minute':5,'seq':9}]
ranked=sorted(events,key=lambda e:(e['minute'],e['seq']),reverse=True)
winner=ranked[0]
target={'order_id':42,'status':winner['status']}
```

1. Two source rows compete for order 42.

   Changed values: `{"events": [{"status": "PACKED", "minute": 2, "seq": 7}, {"status": "SHIPPED", "minute": 5, "seq": 9}]}`

2. Order by event time and then the deterministic ingestion sequence.

   Changed values: `{"ranked": [{"status": "SHIPPED", "minute": 5, "seq": 9}, {"status": "PACKED", "minute": 2, "seq": 7}]}`

3. Keep rank 1 before touching the target.

   Changed values: `{"winner": {"status": "SHIPPED", "minute": 5, "seq": 9}}`

4. MERGE now receives one source action for the target key.

   Changed values: `{"target": {"order_id": 42, "status": "SHIPPED"}}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser ranks three synthetic rows; it does not execute Delta Lake or Snowflake. Real correctness also depends on key quality, timestamp semantics, late-event policy, concurrent writers, isolation, schema evolution, and product/runtime versions. Vendor SQL is unexecuted.

## Explore (remaining exploration time)

Change the second event time and tie-breaker. The podium shows exactly which record reaches MERGE.

Open data-engineering.html for the executable model.

Model limits: The browser ranks three synthetic rows; it does not execute Delta Lake or Snowflake. Real correctness also depends on key quality, timestamp semantics, late-event policy, concurrent writers, isolation, schema evolution, and product/runtime versions. Vendor SQL is unexecuted.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day20/data-engineering.html">Day20</a>; product material added 2026-10-10.</p><p>Databricks: R7 has two item objects. variant_explode emits?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Two children correlated with R7. It counts elements, not units.</p></details><p>Snowflake: TRY_PARSE_JSON returns SQL NULL. Meaning?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Parsing failed or input was NULL; handle explicitly. Do not collapse malformed input into empty business data.</p></details>

## Databricks: rank the Delta source, then MERGE one row per key · 9 minutes

Use ROW_NUMBER over the business key with a deterministic descending order, filter to rn = 1, then MERGE. Vendor SQL is unexecuted. Runtime-specific duplicate detection is a boundary, not a correctness strategy.

## Snowflake: QUALIFY the staged source before MERGE · 9 minutes

QUALIFY ROW_NUMBER() = 1 makes the staged source unique before MERGE. Keep ERROR_ON_NONDETERMINISTIC_MERGE as a guardrail; setting it false does not define a business winner. Vendor SQL is unexecuted.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Winner | ROW_NUMBER then rn=1 | ROW_NUMBER + QUALIFY |
| Guardrail | duplicate source matches can fail | nondeterministic merge parameter |
| Shared rule | one deterministic source row per key | one deterministic source row per key |

What should cross the source/target boundary?

- Every retry
- One ranked winner per business key
- A random source row

<details><summary>Reveal after predicting</summary>

One ranked winner per business key. Both products are safer when MERGE receives one deterministic source row per key.

</details>

Snowflake strict nondeterministic-merge checking errors. Best fix?

- Set the parameter FALSE
- Deduplicate/rank the source by the business rule
- Retry until it succeeds

<details><summary>Reveal after predicting</summary>

Deduplicate/rank the source by the business rule. Define the winner instead of disabling the guardrail.

</details>

## Certification connection

Focused Delta MERGE source shaping, window ranking, and duplicate-match diagnosis; not complete transformation coverage. Focused MERGE determinism, QUALIFY, and source deduplication; planning groups only because full COF-C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks Delta Lake MERGE](https://docs.databricks.com/aws/en/delta/merge) — Updated September 11, 2026; checked 2026-10-17.
- [Snowflake MERGE command](https://docs.snowflake.com/en/sql-reference/sql/merge) — Living documentation; checked 2026-10-17.
- [Snowflake ROW_NUMBER](https://docs.snowflake.com/en/sql-reference/functions/row_number) — Living documentation; checked 2026-10-17.
- [Snowflake QUALIFY](https://docs.snowflake.com/en/sql-reference/constructs/qualify) — Living documentation; checked 2026-10-17.

## Quiz (4 minutes)

1. Why rank source rows before MERGE?
   - To make one deterministic source winner per target key
   - To disable transactions
   - To make every row rank 1

2. Two events have the same event time. What is still needed?
   - A deterministic tie-breaker
   - A random choice
   - A larger warehouse only

3. Can source deduplication repair a wrong business key?
   - Yes
   - No
   - Only in Snowflake

4. What fields define a deterministic winner in your event stream?
5. Which duplicate pattern should be quarantined instead of silently ranked?

<details><summary>Answer key — attempt first</summary>

1. To make one deterministic source winner per target key. One target row should not receive competing source actions.

2. A deterministic tie-breaker. A complete ordering prevents a different winner on a later run.

3. No. Ranking cannot fix an identity model that groups unrelated records.

</details>

## Sources

- [Databricks Delta Lake MERGE](https://docs.databricks.com/aws/en/delta/merge) — Updated September 11, 2026; checked 2026-10-17.
- [Snowflake MERGE command](https://docs.snowflake.com/en/sql-reference/sql/merge) — Living documentation; checked 2026-10-17.
- [Snowflake ROW_NUMBER](https://docs.snowflake.com/en/sql-reference/functions/row_number) — Living documentation; checked 2026-10-17.
- [Snowflake QUALIFY](https://docs.snowflake.com/en/sql-reference/constructs/qualify) — Living documentation; checked 2026-10-17.
