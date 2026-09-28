# Spark changelog checkpoints: persist the delta, snapshot in the background

Data engineering · Day8 · 15 minutes

Reason about foreground checkpoint cost, recovery replay, and why changelog checkpointing changes latency without changing the state contract.

## Recall (2 minutes)

<p><a href="../Day1/data-engineering.html">Day1: The commit is the boundary</a></p><p>Blue commits first. Amber uses base 0. What changes?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; Amber detects a conflict. The failed comparison publishes nothing. Amber must refresh before retrying.</p></details><p><a href="../Day5/data-engineering.html">Day5: Iceberg partition evolution: new layout, same query</a></p><p>A two-hour query targets data written before the daily-to-hourly cutover. What does the toy planner scan?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old daily file using the old spec. Old data remains in its original layout and is planned with the metadata for that layout.</p></details>

## Understand (4 minutes)

A stateful Structured Streaming operator has two different obligations: make every committed micro-batch durable, and make recovery bounded. Traditional RocksDB checkpointing uploads a manifest plus newly generated SST files during the commit path. Changelog checkpointing instead writes the changes made since the prior checkpoint; background snapshots later compact that history and trim old changelogs.

The mental model is a database write-ahead log plus periodic base image. The delta can make the foreground commit much smaller when a large state store changes only a little per trigger. The background snapshot is not optional housekeeping: without a recent base, recovery would replay an ever-growing log. Spark documents the mode as backward-compatible in both directions, but a query restart is required when switching it.

Design consequence: do not translate “less checkpoint I/O per batch” into “recovery is free.” Watch commit latency, durable bytes, snapshot age or lag, and restore time together. A slow object store can move work off the hot path while still leaving a recovery liability.



Worked example: A 200 GB RocksDB state store mutates 400 MB per batch. Suppose its incremental-snapshot path uploads 1.2 GB of changed SST files per commit, while a changelog records the 400 MB logical delta. Across 12 batches, the foreground path moves 14.4 GB versus 4.8 GB. If a background snapshot is taken every sixth batch, a failure just before the next snapshot must restore the latest base and replay up to five deltas.

foreground snapshot bytes = 12 × 1.2 GB = 14.4 GB
foreground changelog bytes = 12 × 0.4 GB = 4.8 GB
worst replay after a base = 5 × 0.4 GB = 2.0 GB

The 1.2 GB is an observed/planned SST-upload input, not a claim that Spark uploads the whole 200 GB state each batch. Measure it from your workload: compaction, key distribution, file layout, and churn determine physical write amplification.



## Explore (5 minutes)

Predict which path moves fewer foreground bytes. Change state size, logical delta, changed-SST upload, snapshot cadence, and failure batch. Then explain why lowering commit latency can increase recovery work if snapshots fall behind.

Open data-engineering.html for the executable model.

Model limits: A byte-accounting teaching model. It treats per-batch delta and changed-SST upload as constants and represents each background snapshot as one full logical-state transfer. Spark snapshots are incremental, implementation details and compaction affect physical bytes, uploads may overlap, and restore time depends on storage throughput, parallelism, checksums, cache state, and version. It does not execute Spark or prove compatibility for a particular checkpoint.

## Quiz (4 minutes)

1. A 300 GB state store changes 100 MB per trigger, while compaction produces 900 MB of new SST files. What should you predict?
   - Changelog checkpointing can reduce foreground durable bytes
   - Both modes must upload all 300 GB each trigger
   - Changelog removes the need for durable storage

2. Why does Spark still create snapshots in the background?
   - To make each query stateless
   - To bound replay and trim accumulated changelogs
   - To avoid ever restarting the query

3. Which observation most directly tests the operational boundary of this optimization?
   - Only the input records per second
   - Only the RocksDB logical row count
   - Checkpoint commit latency together with snapshot age and restore time

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Changelog checkpointing can reduce foreground durable bytes. The benefit comes from persisting the small change instead of the larger set of changed physical files.

2. To bound replay and trim accumulated changelogs. A recent base keeps recovery from replaying an unbounded history of deltas.

3. Checkpoint commit latency together with snapshot age and restore time. Foreground latency can improve while recovery exposure grows, so both paths must be measured.

</details>

## Sources

- [Apache Spark 4.0 Structured Streaming guide: RocksDB state store changelog checkpointing](https://spark.apache.org/docs/4.0.0/streaming/apis-on-dataframes-and-datasets.html#rocksdb-state-store-changelog-checkpointing) — Living versioned documentation; feature introduced in Spark 3.5.0; checked 2026-09-28.
- [Apache Spark 3.5.0 release notes](https://spark.apache.org/releases/spark-release-3-5-0.html) — Released 2023-09-13; checked 2026-09-28.
- [Apache JIRA SPARK-43421: implement changelog checkpointing](https://issues.apache.org/jira/browse/SPARK-43421) — Created 2023-06-01; resolved for 3.5.0; checked 2026-09-28.
