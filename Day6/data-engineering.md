# Kafka tiered storage: retention is not local disk

Data engineering · Day6 · 15 minutes

Separate replay retention from broker-local residency and size the hot tier without pretending remote storage is free.

## Recall (2 minutes)

<p><a href="../Day3/data-engineering.html">Day3: Adaptive skew joins: split the straggler, not the whole job</a></p><p>Median 43.5 MB, factor 5, threshold 256 MB, partition 240 MB. Is it skewed by this rule?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, because it does not also exceed 256 MB. The partition must exceed both boundaries. It clears 217.5 MB but not 256 MB.</p></details><p><a href="../Day5/data-engineering.html">Day5: Iceberg partition evolution: new layout, same query</a></p><p>A two-hour query targets data written before the daily-to-hourly cutover. What does the toy planner scan?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old daily file using the old spec. Old data remains in its original layout and is planned with the metadata for that layout.</p></details>

## Understand (4 minutes)

A Kafka log can have two storage horizons. local.retention.ms controls how long eligible completed segments stay on broker disks; retention.ms controls how long the topic retains them overall. With tiered storage, an old offset may remain readable after its segment leaves local disk because Kafka can fetch the uploaded segment from the remote tier.

This changes the capacity equation, not the log abstraction. Local disk can be sized for a hot window while remote storage carries the longer replay window. But the tiers are not interchangeable: remote reads add latency, bandwidth, request cost, and a dependency on the configured RemoteStorageManager. Kafka 4.3 does not ship an out-of-the-box production implementation, and compacted topics remain a documented limitation.



Original teaching case: A fraud-events topic ingests 120 MiB/s. The platform needs seven days of replay but expects routine consumers to stay within six hours. Replication factor three applies to broker-local bytes; the toy remote estimate counts one uploaded copy.

local hot bytes = ingress × local hours × 3 replicas
remote retained bytes = ingress × remote hours
120 MiB/s × 6 h × 3 ≈ 7.4 TiB local
120 MiB/s × 168 h ≈ 69.2 TiB remote

If a consumer rewinds two days, the record is still logically retained but the old segments are cold: the remote path participates. That may be acceptable for recovery and unacceptable for a latency-sensitive serving consumer. Instrument local/remote fetch behavior and validate the storage plugin under throttling, object-store errors, metadata lag, broker replacement, and deletion.



## Explore (5 minutes)

Predict whether a 24-hour rewind is local with a six-hour hot window. Then raise local retention and explain the capacity/latency trade rather than calling one setting universally better.

Open data-engineering.html for the executable model.

Model limits: A steady-rate byte calculator with one uploaded remote copy, fixed replication, perfect upload completion, and time-based retention. It omits compression, segment roll timing, active segments, size-based limits, cleanup lag, compacted topics, replicas or caching in the remote implementation, request and egress cost, metadata storage, failures, quotas, and latency distributions.

## Quiz (4 minutes)

1. A consumer rewinds 24 hours while local retention is six hours and overall retention is seven days. Where is the segment in this model?
   - Expired
   - Local only
   - Remote tier

2. What does a shorter local retention window primarily buy?
   - Less broker-local disk at the cost of more cold reads
   - Infinite replay
   - Removal of the remote-storage dependency

3. Which production assumption is false for Kafka 4.3 itself?
   - Completed segments can be uploaded
   - Kafka supplies a production RemoteStorageManager implementation out of the box
   - Remote reads can serve an old retained offset

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Remote tier. The offset remains within overall retention but lies beyond the local hot window.

2. Less broker-local disk at the cost of more cold reads. Tiering decouples the hot disk window from the longer logical retention window.

3. Kafka supplies a production RemoteStorageManager implementation out of the box. The official documentation requires users to configure an implementation and calls out that Kafka does not provide one out of the box.

</details>

## Sources

- [Apache Kafka 4.3 documentation: Tiered Storage](https://kafka.apache.org/43/operations/tiered-storage/) — Last modified 2026-06-25; checked 2026-09-26.
- [Apache Kafka 4.3 configuration: Tiered Storage Configs](https://kafka.apache.org/43/configuration/tiered-storage-configs/) — Kafka 4.3 documentation; page dated 2026-05-22; checked 2026-09-26.
