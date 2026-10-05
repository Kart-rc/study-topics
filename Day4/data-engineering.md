# Kafka transactions: make the output and offset one decision

Data engineering · Day4 · 15 minutes

A normalizer reads Kafka record 10 and writes a derived record.

## Recall (2 minutes)

<p><a href="../Day1/data-engineering.html">Day1: The commit is the boundary</a></p><p>Blue commits first. Amber uses base 0. What changes?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; Amber detects a conflict. The failed comparison publishes nothing. Amber must refresh before retrying.</p></details><p><a href="../Day3/data-engineering.html">Day3: Adaptive skew joins: split the straggler, not the whole job</a></p><p>Median 43.5 MB, factor 5, threshold 256 MB, partition 240 MB. Is it skewed by this rule?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, because it does not also exceed 256 MB. The partition must exceed both boundaries. It clears 217.5 MB but not 256 MB.</p></details>

## Understand (4 minutes)

A normalizer reads Kafka record 10 and writes a derived record. It crashes before saving where it should resume. On restart, it may write the derived record again.

A Kafka transaction can group Kafka output and the consumer’s next position into one decision. They commit together or abort together. A reader configured for committed data hides aborted output. An unrelated database or HTTP call is outside this boundary.



The first attempt prepares an edge but aborts. The second prepares it again and commits it with next offset 11. A committed reader sees one edge even though there were two physical attempts.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
visible = []; next_offset = 10
pending = ["edge from record 10"]
pending = []
pending = ["edge from record 10"]; staged_offset = 11
visible, next_offset = pending.copy(), staged_offset
```

1. No derived output is committed yet.

   Changed values: `{"visible": [], "next_offset": 10}`

2. The first attempt stages its output.

   Changed values: `{"pending": ["edge from record 10"]}`

3. Abort discards this attempt from committed visibility.

   Changed values: `{"pending": []}`

4. Retry stages output and the next position.

   Changed values: `{"pending": ["edge from record 10"], "staged_offset": 11}`

5. This single toy step represents the Kafka transaction commit.

   Changed values: `{"visible": ["edge from record 10"], "next_offset": 11}`

[Full runnable example](examples/data-engineering.py).

Limits: The tuple assignment stands for a Kafka transaction, not a client API implementation. It omits transaction markers and fencing. Only a committed reader gets this visibility rule; external side effects remain separate.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Idempotent production prevents a producer retry from appending the same batch twice. A consume-transform-produce application has a second problem: it must make the derived output and the consumed input offset agree. If it writes output, crashes, and has not committed the offset, the replacement reads the input again.</p><p>Kafka transactions can atomically commit records across topic partitions together with the consumer-group offsets. A downstream consumer using <code>isolation.level=read_committed</code> hides records from aborted transactions. Current Kafka 4.3 documentation also requires disabling automatic offset commits for the direct producer/consumer pattern and assigning a <code>transactional.id</code> to the producer.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A lineage normalizer reads input offset 10 and emits a canonical lineage edge. The process fails immediately after the output send.</p><p>Without a transaction, the first edge remains visible while offset 10 remains uncommitted. The restarted consumer processes offset 10 again, so two edges are visible unless the sink independently deduplicates them.</p><p>With a transaction, the first attempt's output and offset update abort together. The retry commits one output and offset 11. The log can still contain an aborted record, so a <code>read_uncommitted</code> consumer may observe both physical attempts. The transaction guarantee depends on the reader honoring the transaction markers.</p><pre>beginTransaction()
produce(derivedEdge)
sendOffsetsToTransaction(offset 11)
commitTransaction()  // output + position become visible together</pre><p>The precise boundary matters: Kafka can coordinate Kafka output topics and Kafka offsets. A write to an arbitrary REST API, Snowflake table, or object store does not join that transaction merely because its input came from Kafka. Such sinks need their own idempotency key, transactional connector, or colocated output/offset checkpoint.</p>

</details>

## Explore (remaining exploration time)

Predict the visible output count for all four combinations of transaction on/off and read-committed on/off. Then explain why an external API call inside the application is outside this atomic boundary.

Open data-engineering.html for the executable model.

Model limits: One input record, one output record, one crash point, and an ideal retry. It does not execute Kafka or model producer epochs, fencing, coordinator failure, timeouts, rebalances, multi-partition ordering, retries, transaction markers in detail, or external sinks. Physical-record counts are illustrative; exact log internals and retention are omitted.

## Quiz (4 minutes)

1. The worker writes output, crashes before committing its input offset, then restarts without a transaction. What is likely?
   - The input is skipped
   - The input is processed again and the output can duplicate
   - Kafka rolls back the external world

2. Why is read_committed part of the end-to-end Kafka pattern?
   - It hides records belonging to aborted transactions
   - It makes every sink transactional
   - It disables consumer groups

3. The application also calls a billing REST API. What is safe to claim?
   - The Kafka transaction rolls the API call back
   - Exactly-once extends automatically to all network calls
   - The API needs a separate idempotency or coordination design

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. The input is processed again and the output can duplicate. The committed position still points to the input, while the first output already exists.

2. It hides records belonging to aborted transactions. Transaction markers only protect readers that choose committed isolation.

3. The API needs a separate idempotency or coordination design. Kafka's atomic offset/output primitive does not enlist an arbitrary external side effect.

</details>

## Sources

- [Apache Kafka 4.3 design: delivery semantics and transactions](https://kafka.apache.org/43/design/design/) — Kafka 4.3 documentation; last modified 2026-05-22; checked 2026-09-24.
- [Apache Kafka 4.3 consumer configuration: isolation.level](https://kafka.apache.org/43/configuration/consumer-configs/) — Kafka 4.3 documentation; last modified 2026-05-22; checked 2026-09-24.
