# Kafka tiered storage: retention is not local disk

Data engineering · Day6 · 15 minutes

You need seven days of Kafka replay, but most readers use only the latest six hours.

## Recall (2 minutes)

<p><a href="../Day3/data-engineering.html">Day3: Adaptive skew joins: split the straggler, not the whole job</a></p><p>Median 43.5 MB, factor 5, threshold 256 MB, partition 240 MB. Is it skewed by this rule?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, because it does not also exceed 256 MB. The partition must exceed both boundaries. It clears 217.5 MB but not 256 MB.</p></details><p><a href="../Day5/data-engineering.html">Day5: Iceberg partition evolution: new layout, same query</a></p><p>A two-hour query targets data written before the daily-to-hourly cutover. What does the toy planner scan?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old daily file using the old spec. Old data remains in its original layout and is planned with the metadata for that layout.</p></details>

## Understand (4 minutes)

You need seven days of Kafka replay, but most readers use only the latest six hours. Keeping all seven days on broker disks can be expensive.

Tiered storage keeps recent data locally and older retained segments in remote storage. Retention says whether data still exists for replay. Local retention says whether broker disk holds it. A cold read can need a slower remote path even when the record is retained.



At 120 MiB per second, six hours with three local replicas is about 7.4 TiB. Seven days with one toy remote copy is about 69.2 TiB. A reader rewinding two days is within retention but outside the local hot window.



## Read the visual

The age ruler places recent segments on local disk, older retained segments in remote storage, and expired segments beyond the retention boundary. Moving the rewind marker changes which path a consumer must use. Local disk cannot resurrect an expired record.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
mib_per_second = 120; replicas = 3
local_tib = mib_per_second * 6 * 3600 * replicas / 1024**2
remote_tib = mib_per_second * 168 * 3600 / 1024**2
rewind_hours = 48
read_path = "remote" if rewind_hours > 6 else "local"
```

1. Use MiB and binary TiB consistently.

   Changed values: `{"mib_per_second": 120, "replicas": 3}`

2. Compute the six-hour replicated local footprint.

   Changed values: `{"local_tib": 7.415771484375}`

3. Compute the seven-day single-copy remote estimate.

   Changed values: `{"remote_tib": 69.2138671875}`

4. The consumer asks for data two days old.

   Changed values: `{"rewind_hours": 48}`

5. The request needs the cold path in this simplified layout.

   Changed values: `{"read_path": "remote"}`

[Full runnable example](examples/data-engineering.py).

Limits: The estimate omits indexes, compression, segment overlap, upload lag, and remote replication policy. It does not predict a cloud bill or remote-read latency.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A Kafka log can have two storage horizons. <code>local.retention.ms</code> controls how long eligible completed segments stay on broker disks; <code>retention.ms</code> controls how long the topic retains them overall. With tiered storage, an old offset may remain readable after its segment leaves local disk because Kafka can fetch the uploaded segment from the remote tier.</p><p>This changes the capacity equation, not the log abstraction. Local disk can be sized for a hot window while remote storage carries the longer replay window. But the tiers are not interchangeable: remote reads add latency, bandwidth, request cost, and a dependency on the configured <code>RemoteStorageManager</code>. Kafka 4.3 does not ship an out-of-the-box production implementation, and compacted topics remain a documented limitation.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A fraud-events topic ingests 120 MiB/s. The platform needs seven days of replay but expects routine consumers to stay within six hours. Replication factor three applies to broker-local bytes; the toy remote estimate counts one uploaded copy.</p><pre>local hot bytes = ingress × local hours × 3 replicas
remote retained bytes = ingress × remote hours
120 MiB/s × 6 h × 3 ≈ 7.4 TiB local
120 MiB/s × 168 h ≈ 69.2 TiB remote</pre><p>If a consumer rewinds two days, the record is still logically retained but the old segments are cold: the remote path participates. That may be acceptable for recovery and unacceptable for a latency-sensitive serving consumer. Instrument local/remote fetch behavior and validate the storage plugin under throttling, object-store errors, metadata lag, broker replacement, and deletion.</p>

</details>

## Explore (remaining exploration time)

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
