# Keep the newest fact: Kafka compaction and tombstones

Data engineering · Day15 · 15 minutes

Rebuild a keyed table from a compacted Kafka topic without mistaking compaction for instant deletion.

## Recall (2 minutes)

<p><a href="../Day6/data-engineering.html">Day6: Kafka tiered storage: retention is not local disk</a></p><p>A consumer rewinds 24 hours while local retention is six hours and overall retention is seven days. Where is the segment in this model?</p><details><summary>Recall first, then reveal the refresher</summary><p>Remote tier. The offset remains within overall retention but lies beyond the local hot window.</p></details><p><a href="../Day10/data-engineering.html">Day10: Save the order and a “send later” note together</a></p><p>E7 reached Kafka, but the relay crashed before marking it sent. What can happen?</p><details><summary>Recall first, then reveal the refresher</summary><p>E7 is sent again. The saved ticket is still pending, so the relay may resend it. Kafka receiving E7 does not update the order database. A later relay crash cannot undo a committed order.</p></details>

## Understand (4 minutes)

A whiteboard may show every status change for an order. A recovery copy only needs the newest status for each order.


Kafka log compaction removes older records when a newer record has the same key. It keeps the newest known value for each key. It does not change record order or renumber offsets.


Visual question: What disappears during compaction—and what stays at its offset?


A keyed record with a null value is a tombstone: a delete marker. Kafka retains it for a period so rebuilding consumers can observe the delete, then may clean the tombstone too.



The order-state topic receives four records:

20  O42  packed
21  O17  queued
22  O42  shipped
23  O17  null


Replay all four records: O42 becomes shipped and O17 is removed.
After compaction, the useful tail can contain only 22 and 23.
After the tombstone retention period, 23 can disappear too. A new rebuild still leaves O17 absent.
The cleaner works in the background. A consumer that is caught up can still see every new record before cleaning removes older copies.



## Read the visual

What disappears during compaction—and what stays at its offset? Each row keeps its original offset position. Struck-through records are removed; the key connectors explain why. The newest O42 survives. O17’s null deletes that key; later cleanup can remove the tombstone too.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a compacted topic when services need to rebuild the latest value for each key after a restart, such as an order-status cache or a table of active data-quality rules.

**Practical example.** A replacement order service replays the topic into an empty table. It keeps O42 as shipped and removes O17 when it reads the tombstone. It needs today's state, so retaining every earlier packed or queued value adds recovery work without helping that purpose.

**How to decide.** Choose stable keys and allow enough tombstone retention for the slowest supported rebuild. Keep a separate history when every change matters for audit. For a small table with infrequent refreshes, a database snapshot may be simpler.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
records = [(20, 'O42', 'packed'), (21, 'O17', 'queued'), (22, 'O42', 'shipped'), (23, 'O17', None)]
state = {}
for offset, key, value in records:
    if value is None:
        state.pop(key, None)
    else:
        state[key] = value
latest = {}
for offset, key, value in records:
    latest[key] = (offset, value)
compacted = sorted((offset, key, value) for key, (offset, value) in latest.items())
compacted_offsets = [row[0] for row in compacted]
```

1. Start with every change in original offset order.

   Changed values: `{"records": [[20, "O42", "packed"], [21, "O17", "queued"], [22, "O42", "shipped"], [23, "O17", null]]}`

2. Replay the full log. A null value removes its key.

   Changed values: `{"state": {"O42": "shipped"}, "offset": 23, "key": "O17", "value": null}`

3. The cleaner identifies the newest record for each key.

   Changed values: `{"latest": {"O42": [22, "shipped"], "O17": [23, null]}}`

4. Keep offsets 22 and 23. Their original order and offset numbers remain.

   Changed values: `{"compacted": [[22, "O42", "shipped"], [23, "O17", null]], "compacted_offsets": [22, 23]}`

[Full runnable example](examples/data-engineering.py).

Limits: Executes an in-memory keyed replay. It does not run a Kafka broker or model asynchronous segment cleaning.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Compaction and time/size retention can be combined. For recovery topics, size the delete-retention window against the slowest legitimate full rebuild. Monitor dirty ratio, cleaner backlog, consumer lag, and the age of the oldest rebuilding consumer together.</p>

</details>

## Explore (remaining exploration time)

Switch among the live log, the compacted log, and the state after the tombstone expires. Predict O42 and O17 before rebuilding.

Open data-engineering.html for the executable model.

Model limits: This is one partition with two keys and an immediate logical cleaner. Real cleaning is asynchronous and segment-based. Settings such as cleanup.policy, min.compaction.lag.ms, max.compaction.lag.ms, and delete.retention.ms change timing. Compaction keeps the latest value per key; it is not a complete audit history.

## Quiz (4 minutes)

1. After replaying offset 23, what is O17's state?
   - Absent; the null value is a delete marker
   - queued forever
   - The key becomes the text null

2. What survives compaction for O42?
   - Its oldest value at 20
   - At least its newest value, shipped at 22
   - Every historical value forever

3. What is the important boundary?
   - Compaction is an asynchronous retention process, not an instant delete or audit log
   - Compaction renumbers all offsets
   - Consumers cannot read while cleaning runs

4. Why must a delete marker remain long enough for rebuilding consumers to see it?
5. A team needs every status change for audit. Why is a compacted topic alone insufficient?

<details><summary>Answer key — attempt first</summary>

1. Absent; the null value is a delete marker. The tombstone tells a keyed rebuild to remove O17.

2. At least its newest value, shipped at 22. Compaction retains the latest known value for a key while older copies become removable.

3. Compaction is an asynchronous retention process, not an instant delete or audit log. Cleaning happens later and may leave old copies for a while; offsets and ordering remain stable.

</details>

## Sources

- [Apache Kafka 4.3 design: Log Compaction](https://kafka.apache.org/43/design/design/#log_compaction) — Living 4.3 documentation; foundation and guarantees; checked 2026-10-05.
- [Apache Kafka 4.3 topic configurations](https://kafka.apache.org/43/configuration/topic-configs/) — Living 4.3 documentation; cleaner and tombstone timing settings; checked 2026-10-05.
