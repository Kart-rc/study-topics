# One bookmark, no gap: handing a snapshot to CDC

Data engineering · Day14 · 15 minutes

Use one log position to connect a database snapshot to the live change stream without skipping a change.

## Recall (2 minutes)

<p><a href="../Day5/data-engineering.html">Day5: Iceberg partition evolution: new layout, same query</a></p><p>A two-hour query targets data written before the daily-to-hourly cutover. What does the toy planner scan?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old daily file using the old spec. Old data remains in its original layout and is planned with the metadata for that layout.</p></details><p><a href="../Day9/data-engineering.html">Day9: Kafka&#x27;s consumer protocol: reassign incrementally, not behind a global barrier</a></p><p>One member changes in a large group. What is the core advantage of incremental reconciliation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Partitions whose ownership is unchanged can continue processing. The protocol narrows disruption to ownership that must move instead of imposing a group-wide synchronization barrier.</p></details>

## Understand (4 minutes)

Imagine photographing a departure board while new trains are being added. The photo gives a complete starting view. A bookmark tells you exactly where to start reading the live update tape.

Change data capture (CDC) does the same thing for a database. First it reads a consistent snapshot. It also records a source-log position. Then it streams changes from that position.

Snapshot at 100O42 = queued

BookmarkAfter LSN 100

Live log101: O42 paid102: O43 queued

Snapshot state + changes after 100 = current state

LSN means log sequence number: a position on the database change tape. The exact name varies by database.



Our snapshot contains order O42 as queued at position 100. While the snapshot is being copied, two committed changes arrive.

Keep the snapshot row: O42 is queued.Replay change 101: O42 becomes paid.Replay change 102: O43 appears as queued.snapshot, boundary = read_snapshot_and_position()
for change in log.after(boundary):
    apply(change)

Starting after 101 creates a gap: the payment at 101 disappears. Starting after 99 replays the boundary record too. An idempotent upsert may hide that duplicate in one table, but an append-only downstream sink would still see it.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
snapshot = {'O42': 'queued'}
boundary_lsn = 100
log = [(100, 'O42', 'queued'), (101, 'O42', 'paid'), (102, 'O43', 'queued')]
replay = [event for event in log if event[0] > boundary_lsn]
replay_lsns = [event[0] for event in replay]
current = snapshot.copy()
for lsn, order_id, status in replay:
    current[order_id] = status
```

1. Capture the starting rows and the source position that belongs to that snapshot.

   Changed values: `{"snapshot": {"O42": "queued"}, "boundary_lsn": 100}`

2. The toy log includes the boundary record plus two later changes.

   Changed values: `{"log": [[100, "O42", "queued"], [101, "O42", "paid"], [102, "O43", "queued"]]}`

3. Use one explicit rule: replay only records after position 100.

   Changed values: `{"replay": [[101, "O42", "paid"], [102, "O43", "queued"]], "replay_lsns": [101, 102]}`

4. Apply 101 and 102 in order. The current view now contains both orders.

   Changed values: `{"current": {"O42": "paid", "O43": "queued"}, "lsn": 102, "order_id": "O43", "status": "queued"}`

[Full runnable example](examples/data-engineering.py).

Limits: Executes an in-memory Python list with an exclusive integer boundary. It does not connect to MySQL, Debezium, Kafka, or a real sink.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Debezium’s MySQL workflow takes a repeatable-read snapshot, records the binlog position, emits snapshot reads with that position, records completion in connector offsets, and then continues streaming. Operations teams should monitor snapshot duration, retained-log headroom, offset persistence, and sink lag as one recovery envelope.</p>

</details>

## Explore (remaining exploration time)

Predict the final orders. Move the stream bookmark earlier or later, then inspect duplicate and missing events.

Open data-engineering.html for the executable model.

Model limits: This is an exclusive-boundary toy with one ordered log. Real connectors coordinate locks or repeatable-read snapshots, persist offsets, handle schema history, retention, restarts, and database-specific log coordinates. Downstream consumers must still handle replay safely.

## Quiz (4 minutes)

1. The snapshot is at 100 and streaming starts after 101. What is wrong?
   - LSN 101 is missed
   - LSN 100 is read twice and nothing is missed
   - The snapshot becomes newer

2. Why keep the snapshot position?
   - To join the still picture to the live log at one boundary
   - To choose a Kafka partition count
   - To make every sink exactly once

3. What does the toy not guarantee?
   - That replay after 100 includes 101 and 102
   - That every downstream side effect is idempotent
   - That starting after 101 misses 101

4. Explain why the snapshot alone is stale before it finishes copying.
5. If the source log is deleted before catch-up, what fails and what alert would expose it?

<details><summary>Answer key — attempt first</summary>

1. LSN 101 is missed. The payment at 101 is neither in the snapshot nor in the replay. That is a gap.

2. To join the still picture to the live log at one boundary. The position says which committed changes belong after the snapshot.

3. That every downstream side effect is idempotent. The connector boundary prevents a source gap; sinks must still make their own replay behavior safe.

</details>

## Sources

- [Debezium 3.7 MySQL connector: snapshot workflow](https://debezium.io/documentation/reference/stable/connectors/mysql.html#mysql-snapshots) — Living 3.7 documentation; snapshot records a binlog position and later streams from it; checked 2026-10-04.
- [Debezium 3.7 MySQL connector: setting the binlog position](https://debezium.io/documentation/reference/stable/connectors/mysql.html#setting-the-binlog-position) — Living 3.7 documentation; moving later can skip events and moving earlier can duplicate them; checked 2026-10-04.
