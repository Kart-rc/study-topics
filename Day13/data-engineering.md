# Two copies before success: Kafka's ISR write gate

Data engineering · Day13 · 15 minutes

See when a Kafka producer gets success—and when Kafka refuses the write—using a three-replica partition.

## Recall (2 minutes)

<p><a href="../Day8/data-engineering.html">Day8: Spark changelog checkpoints: persist the delta, snapshot in the background</a></p><p>A 300 GB state store changes 100 MB per trigger, while compaction produces 900 MB of new SST files. What should you predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Changelog checkpointing can reduce foreground durable bytes. The benefit comes from persisting the small change instead of the larger set of changed physical files.</p></details><p><a href="../Day10/data-engineering.html">Day10: Save the order and a “send later” note together</a></p><p>E7 reached Kafka, but the relay crashed before marking it sent. What can happen?</p><details><summary>Recall first, then reveal the refresher</summary><p>E7 is sent again. The saved ticket is still pending, so the relay may resend it. Kafka receiving E7 does not update the order database. A later relay crash cannot undo a committed order.</p></details>

## Understand (4 minutes)

You hand a package to a courier. You do not want “delivered” to mean that one person briefly held it. You want a second trusted person to have a copy too.

A Kafka partition can use the same idea. Imagine three replicas: one leader and two followers. The in-sync replica set, or ISR, is the group currently caught up enough to take part in the write contract.

With acks=all, every replica currently in the ISR must acknowledge. With min.insync.replicas=2, Kafka also refuses a write when fewer than two replicas remain in the ISR.

The replication factor says how many copies the partition is configured to have. The ISR says which copies are currently caught up. They are not the same number during a failure.



Orders has replication factor 3, min.insync.replicas=2, and the producer uses acks=all.

All three replicas are in sync. All three acknowledge O42. Success.Follower B falls behind. The ISR now contains the leader and Follower A. Both acknowledge O43. Success.Follower A also falls behind. Only the leader remains in the ISR. Kafka rejects O44 instead of reporting a one-copy success.accepted = acks != "all" or len(isr) >= min_isr

This protects the producer-success contract. It does not mean data can never be lost under every configuration. Leader-election policy, rack placement, storage failures, retries, and producer idempotence still matter.



## Read the visual

How many replicas must acknowledge this write? The ISR membership boundary determines the required acknowledgers for acks=all. A two-replica minimum is an admission gate, not an instruction to stop after two acknowledgements when three replicas are in ISR.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
replication_factor = 3
min_isr = 2
acks = "all"
isr = ["leader", "follower-a"]
first_accepted = acks != "all" or len(isr) >= min_isr
first_ack_count = len(isr) if first_accepted else 0
isr = ["leader"]
second_accepted = acks != "all" or len(isr) >= min_isr
```

1. Configure three replicas, require two in sync, and ask every current ISR member to acknowledge.

   Changed values: `{"replication_factor": 3, "min_isr": 2, "acks": "all"}`

2. Follower B is lagging, so two replicas remain in the ISR.

   Changed values: `{"isr": ["leader", "follower-a"]}`

3. Two meets the minimum. Both current ISR members acknowledge, so O43 succeeds.

   Changed values: `{"first_accepted": true, "first_ack_count": 2}`

4. Now one is below the minimum. Kafka must reject O44 for this configuration.

   Changed values: `{"isr": ["leader"], "second_accepted": false}`

[Full runnable example](examples/data-engineering.py).

Limits: Executes the boolean producer gate over a Python list. It does not run a Kafka broker or reproduce replication and high-watermark timing.

<details><summary>Optional deeper explanation and original worked example</summary>

<p><strong>Leadership question:</strong> alarm on under-replicated partitions and low ISR counts before producers start failing. Keep rack or AZ placement aligned with the failure you intend to survive. The setting creates backpressure by rejecting unsafe success; teams must decide how producers surface and retry that failure.</p>

</details>

## Explore (remaining exploration time)

Predict the producer result. Move each follower into or out of the ISR, then compare acks=all with acks=1.

Open data-engineering.html for the executable model.

Model limits: This model checks only the producer acknowledgement gate for one partition. It does not simulate replication lag, the high watermark, ELR semantics, leader election, rack failure, retries, or producer idempotence. Kafka 4.3 documents an ELR-specific semantic change; this lesson models the ordinary ISR case.

## Quiz (4 minutes)

1. Only the leader remains in the ISR. With min.insync.replicas=2 and acks=all, what happens?
   - Kafka reports success
   - Kafka rejects the write
   - Kafka silently changes the replication factor

2. Replication factor is 3, but the ISR has 2 members. Which number controls this write gate?
   - The ISR size compared with min.insync.replicas
   - Only the configured replication factor
   - The consumer group size

3. What does this small model not prove?
   - That two ISR members can satisfy a minimum of two
   - That a one-member ISR is below two
   - That data can never be lost under every Kafka failure and configuration

4. Explain why Kafka refuses O44 even though the leader is still alive.
5. Change the failure from one lagging follower to an Availability Zone loss. What additional evidence would you need?

<details><summary>Answer key — attempt first</summary>

1. Kafka rejects the write. The current ISR has one member, below the required two, so an acks=all write is rejected.

2. The ISR size compared with min.insync.replicas. The configured copies and the currently in-sync copies are different facts. The gate uses the current ISR.

3. That data can never be lost under every Kafka failure and configuration. The gate is one durability control, not a proof covering election policy, correlated failure, retries, storage, or every Kafka feature.

</details>

## Sources

- [Apache Kafka 4.3 broker configuration: min.insync.replicas](https://kafka.apache.org/43/configuration/broker-configs/#min.insync.replicas) — Living 4.3 documentation; version page last modified 2026-05-22; checked 2026-10-03.
- [Apache Kafka 4.3 producer configuration: acks](https://kafka.apache.org/43/configuration/producer-configs/#acks) — Living 4.3 documentation; checked 2026-10-03.
