# Write the recovery note first: WAL before data pages

Software engineering · Day14 · 15 minutes

See why a database can acknowledge a commit before every changed table page reaches disk.

## Recall (2 minutes)

<p><a href="../Day5/software-engineering.html">Day5: Consistent hashing: move a slice, not the whole keyspace</a></p><p>Why does adding a node disrupt modulo sharding broadly?</p><details><summary>Recall first, then reveal the refresher</summary><p>The divisor changes, so many hash remainders change. Placement depends directly on node count, so changing it changes many assignments.</p></details><p><a href="../Day9/software-engineering.html">Day9: Merkle trees: localize replica drift before repairing it</a></p><p>Two replicas have equal Merkle roots built from the same canonical range. What is the useful inference?</p><details><summary>Recall first, then reveal the refresher</summary><p>Their summarized contents match with the assurance of the hash. The root summarizes current canonical contents; it says nothing about history or future drift.</p></details>

## Understand (4 minutes)

A warehouse manager changes a shelf but first writes the change in a fireproof notebook. If power fails before the shelf label is updated, the notebook can restore the intended result.

A database calls that durable notebook a write-ahead log (WAL). “Ahead” is the rule: flush the log record before allowing the changed data page to reach durable storage.

1 · WAL durableO42: stock 5 → 4

2 · Commit successClient may continue

3 · Data page laterStock page becomes 4

Crash between 2 and 3? REDO reads WAL and writes 4.



Order O42 buys one item. The on-disk page still says stock is 5.

Create WAL record: set stock to 4.Flush that record to durable storage.Acknowledge the transaction.Write the data page later.append_wal("stock=4")
flush_wal()
ack_commit()
write_page_later()

If the server crashes after the flush but before the page write, recovery redoes stock=4. If it crashes before the WAL flush, the transaction was not durably committed and must not be acknowledged.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int pageStock = 5;
int walStock = 4;
boolean walDurable = false;
walDurable = true;
boolean commitAcknowledged = true;
boolean crashedBeforePageWrite = true;
int recoveredStock = walDurable ? walStock : pageStock;
```

1. The data page still has 5. The log record describes the intended value 4.

   Changed values: `{"pageStock": "5", "walStock": "4", "walDurable": "false"}`

2. Flush the WAL record, then acknowledge the commit.

   Changed values: `{"walDurable": "true", "commitAcknowledged": "true"}`

3. Power fails while the old data page is still on disk.

   Changed values: `{"crashedBeforePageWrite": "true"}`

4. Recovery sees durable WAL and redoes the committed value.

   Changed values: `{"recoveredStock": "4"}`

[Full runnable example](examples/software-engineering.java).

Limits: Runs a four-variable Java model. It does not execute PostgreSQL, force an fsync, model UNDO, or test a storage device.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>WAL turns random page flushing into sequential log flushing on the commit path. That improves throughput, but the log is now a critical durability dependency. Track WAL flush latency, checkpoint pressure, archive health, replication lag, and recovery-time objectives together.</p>

</details>

## Explore (remaining exploration time)

Choose the crash point. Predict the value on the data page before recovery and the value after REDO.

Open software-engineering.html for the executable model.

Model limits: This model shows REDO for one value. Real recovery also handles transaction boundaries, checksums, torn pages, checkpoints, full-page images, replication, and storage guarantees. WAL durability still depends on correct hardware and operating-system flush behavior.

## Quiz (4 minutes)

1. The crash happens after WAL is flushed but before the data page is written. What restores stock=4?
   - REDO from the WAL record
   - The client resends the SQL
   - A cache always survives

2. Why is the order called write-ahead?
   - The log becomes durable before the related data page
   - Data pages are always written twice
   - Reads must happen before writes

3. What is outside this toy?
   - A single value changing from 5 to 4
   - Checkpoint and torn-page recovery details
   - Replaying a durable record

4. Explain how WAL lets the database delay a data-page flush after commit.
5. Suppose the storage device lies about flush completion. Which guarantee is lost?

<details><summary>Answer key — attempt first</summary>

1. REDO from the WAL record. The durable log contains the committed change, so recovery can redo it.

2. The log becomes durable before the related data page. The recovery description must reach durable storage before the page it describes.

3. Checkpoint and torn-page recovery details. Production databases coordinate many pages and transactions and rely on stronger storage behavior than this scalar model.

</details>

## Sources

- [PostgreSQL 18: Write-Ahead Logging (WAL)](https://www.postgresql.org/docs/current/wal-intro.html) — Current PostgreSQL 18 documentation; foundation; checked 2026-10-04.
- [PostgreSQL 18: WAL configuration and checkpoints](https://www.postgresql.org/docs/current/wal-configuration.html) — Current PostgreSQL 18 documentation; foundation; checked 2026-10-04.
