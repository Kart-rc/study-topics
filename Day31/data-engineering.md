# Read only what changed: Delta CDF and Snowflake Streams

Data engineering · Day31 · 30 minutes

Move a durable change boundary forward without rereading the whole table.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day19/data-engineering.html">Day19: Skip the chunks that cannot contain day 42</a></p><p>Every chunk has min 1 and max 60. What can the engine conclude for day 42?</p><details><summary>Recall first, then reveal the refresher</summary><p>Every chunk remains a candidate. Day 42 lies inside every recorded range, so min/max alone cannot exclude a chunk.</p></details><p><a href="../Day23/data-engineering.html">Day23: Retrieval lab: choose the control from the symptom</a></p><p>A date predicate scans every data chunk. First move?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect pruning evidence and recorded ranges. Measure whether layout metadata can exclude data before changing compute or clustering.</p></details>

## Understand (4 minutes)

Imagine a librarian who keeps a slip showing the last shelf update you processed. On the next visit, you read only the newer slips. Incremental change processing does the same thing for rows.

The important idea is not “CDC is fast.” It is a bounded interval: read changes after a known position, write the result safely, then advance the position. If the change history disappears before you read it, the shortcut is gone and you must recover from a snapshot or another durable source.



Version 100 contains orders A and B. Version 101 updates A and inserts C. A downstream job whose last successful position is 100 reads only the update for A and the insert for C. It writes both idempotently, records 101, and stops. A retry from 100 may see the same two changes again, so the sink still needs a repeat-safe key or transaction.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a change feed when a large table changes in small batches and downstream work can be expressed as inserts, updates, and deletes.

**Practical example.** A customer-360 table changes every minute, while a serving cache needs only the rows that changed since its last successful refresh.

**How to decide.** Choose it when the source retains enough change history, consumers can keep independent progress, deletes matter, and the sink is repeat-safe. Prefer a full snapshot when the dataset is small or recovery simplicity matters more than incremental cost.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The timeline makes the interval concrete: the saved position closes the left side, the latest version closes the right side, and retention can cut away the left edge before a consumer catches up.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
changes = {101: ['A:update', 'C:insert'], 102: ['B:delete'], 103: ['D:insert']}
last_success = 100
pending = [op for version in sorted(changes) if version > last_success for op in changes[version]]
last_success = 103 if pending else last_success
```

1. Represent each table version as the row operations introduced at that version.

   Changed values: `{"changes": {"101": ["A:update", "C:insert"], "102": ["B:delete"], "103": ["D:insert"]}}`

2. The durable consumer position records only completed work.

   Changed values: `{"last_success": 100}`

3. Read the open-closed interval after the saved position.

   Changed values: `{"pending": ["A:update", "C:insert", "B:delete", "D:insert"]}`

4. Advance only after the synthetic sink accepts the pending operations.

   Changed values: `{"last_success": 103}`

[Full runnable example](examples/data-engineering.py).

Limits: This is a local JavaScript interval model over five synthetic versions. It does not run Delta Lake or Snowflake, model schema evolution, prove exactly-once delivery, measure cost, or recover missing history. Vendor SQL below is sourced but unexecuted.

## Explore (remaining exploration time)

Move the consumer position and retention window. Predict which rows are readable and when recovery must fall back to a snapshot.

Open data-engineering.html for the executable model.

Model limits: This is a local JavaScript interval model over five synthetic versions. It does not run Delta Lake or Snowflake, model schema evolution, prove exactly-once delivery, measure cost, or recover missing history. Vendor SQL below is sourced but unexecuted.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day17/data-engineering.html">Day17</a>; product material added 2026-10-08.</p><p>After a Databricks Delta sink commit, restarting with the same valid checkpoint replays a batch. What protects the copied rows?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Same query + batch in Delta. The same query/batch can be recognized by the Delta sink. A new query identity changes that boundary. This says nothing about independent duplicate business events.</p></details><p>You SELECT a Snowflake stream, then INSERT from it inside a transaction that rolls back. What persists?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Neither change persists. SELECT does not consume the stream. The rolled-back consuming transaction preserves the old target and stream position, allowing a retry.</p></details>

## Databricks: query Delta changes between table versions · 9 minutes

Databricks CDF exposes row-level inserts, updates, and deletes with commit metadata. Query an explicit version interval, store progress only after the sink succeeds, and plan snapshot recovery when history is gone. Automatic and legacy CDF share read APIs but differ in how changes are produced. SQL is unexecuted.

## Snowflake: consume a stream offset inside the DML transaction · 9 minutes

A Snowflake stream is an offset over source-table change metadata. The offset advances when a consuming DML transaction commits, not when the stream is merely queried. Use one stream per independent consumer and monitor staleness. SQL is unexecuted.

## Compare and predict (2 minutes)

| Question | Databricks CDF | Snowflake Stream |
|---|---|---|
| Position | explicit versions/checkpoint | stream object offset |
| Advance | consumer checkpoint | committed consuming DML |
| Independent consumers | independent checkpoints | one stream per consumer |
| Lost history | snapshot/reseed | recreate and recover |

A Snowflake stream is selected but the transaction rolls back. What happens to its offset?

- It remains available for retry
- It always advances
- The table is deleted

<details><summary>Reveal after predicting</summary>

It remains available for retry. Only committed consuming DML advances the stream offset.

</details>

A Databricks consumer needs changes that retention already removed. What is the safe response?

- Rebuild from a trusted snapshot and reseed progress
- Invent a starting version
- Ignore deletes

<details><summary>Reveal after predicting</summary>

Rebuild from a trusted snapshot and reseed progress. A missing interval requires recovery, not silent advancement.

</details>

## Certification connection

Focused practice on incremental ingestion and transformation with CDF, version boundaries, deletion semantics, and recovery. This is delivered curriculum, not platform execution or mastery. Focused planning-group coverage of streams, change metadata, transaction-driven offset advancement, retention, and staleness. Full COF-C03 coverage and mastery are not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks change data feed](https://docs.databricks.com/aws/en/tables/features/change-data-feed) — Updated October 9, 2026; checked 2026-10-21.
- [Databricks table_changes function](https://docs.databricks.com/aws/en/sql/language-manual/functions/table_changes) — Updated October 15, 2026; checked 2026-10-21.
- [Snowflake streams introduction](https://docs.snowflake.com/en/user-guide/streams-intro) — Living documentation; checked 2026-10-21.
- [Snowflake CHANGES clause](https://docs.snowflake.com/en/sql-reference/constructs/changes) — Living documentation; checked 2026-10-21.

## Quiz (4 minutes)

1. A consumer last committed version 100 and version 101 contains an update and insert. What should it read?
   - Only changes after 100, including both operations
   - Every historical row
   - Only inserts

2. What happens when required change history has already expired?
   - Recover from a trusted snapshot or other durable source
   - Guess the missing rows
   - Advance the position silently

3. Why must the sink still be repeat-safe?
   - A retry can deliver the same change interval again
   - Change feeds remove all network failures
   - Deletes never repeat

4. How would you make the downstream write and position update repeat-safe across a crash?
5. Which retention, lag, and schema-change signals would prove your incremental pipeline can recover?

<details><summary>Answer key — attempt first</summary>

1. Only changes after 100, including both operations. The interval begins after the last successful position and preserves operation types.

2. Recover from a trusted snapshot or other durable source. A position cannot recreate change records that retention removed.

3. A retry can deliver the same change interval again. Incremental reading does not by itself make the cross-system write atomic.

</details>

## Sources

- [Databricks change data feed](https://docs.databricks.com/aws/en/tables/features/change-data-feed) — Updated October 9, 2026; checked 2026-10-21.
- [Snowflake streams introduction](https://docs.snowflake.com/en/user-guide/streams-intro) — Living documentation; checked 2026-10-21.
- [Snowflake CHANGES clause](https://docs.snowflake.com/en/sql-reference/constructs/changes) — Living documentation; checked 2026-10-21.
