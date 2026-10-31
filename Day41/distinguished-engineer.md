# Failover buys continuity; failback must reconcile the writes made while away

Distinguished Engineer · Day41 · 15 minutes

Treat return-to-primary as a separate migration with reverse replication, consistency evidence, and another traffic decision.

## Recall (2 minutes)

<p><a href="../Day24/distinguished-engineer.html">Day24: A migration ends when the old path can be removed</a></p><p>New-system traffic is 100%, but one old dependency remains. Decision?</p><details><summary>Recall first, then reveal the refresher</summary><p>Keep and move the dependency. Cutover percentage alone does not prove removability.</p></details><p><a href="../Day28/distinguished-engineer.html">Day28: Measure the journey, not the sign-ups</a></p><p>Which metric best represents platform activation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Teams completing the valuable production journey. A platform earns value when users complete a useful outcome.</p></details>

## Understand (4 minutes)

Moving into a hotel during a home repair is not the same as moving home. The belongings acquired at the hotel must come back too.

After failover, the recovery region becomes the live source of truth. Failback requires rebuilding or validating the original region, replicating new writes back, proving the lag is within the RPO, then redirecting traffic. A tested failover button without a failback plan leaves the organization operating indefinitely in recovery mode.



Primary had 1,000 orders at failover. Recovery accepts 27 new orders. Redirecting traffic back before reverse synchronization exposes only 1,000. Replicate and validate first; then primary has 1,027 before the controlled cutback.



## Read the visual

The authoritative write location moves to recovery, accumulates visible writes, and returns only after a reverse-sync gate. The gap is a labeled quantity, not a generic region arrow.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Design failback whenever regional recovery changes the authoritative write location or buffers regional messages.

**Practical example.** An order API fails from us-east-1 to us-west-2, where Kafka and the database accept new writes for six hours.

**How to decide.** Remain in the recovery region until the primary is healthy, reverse replication is complete, in-flight messages are reconciled, dependencies are ready, and the business approves the second risk event. Do not rush back merely because the original region is reachable.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
primary_at_failover=1000; recovery_writes=27
unsafe_cutback_visible=primary_at_failover
reconciled_primary=primary_at_failover+recovery_writes
unsafe_gap=reconciled_primary-unsafe_cutback_visible; safe_gap=reconciled_primary-reconciled_primary
```

1. Record the old primary checkpoint and recovery-period writes.

   Changed values: `{"primary_at_failover": 1000, "recovery_writes": 27}`

2. Without reverse sync, cutback exposes only the old checkpoint.

   Changed values: `{"unsafe_cutback_visible": 1000}`

3. Reverse replication restores the full append-only count.

   Changed values: `{"reconciled_primary": 1027}`

4. Evidence distinguishes an unsafe 27-write gap from zero in the toy.

   Changed values: `{"unsafe_gap": 27, "safe_gap": 0}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The arithmetic model has one append-only count. It does not model conflicts, dual writes, message ordering, DNS caches, replication topology, RPO/RTO, data sovereignty, dependent services, or AWS DRS operations.

## Explore (remaining exploration time)

Add recovery-region writes and toggle reverse synchronization. Watch the cutback expose a gap or a reconciled total.

Open distinguished-engineer.html for the executable model.

Model limits: The arithmetic model has one append-only count. It does not model conflicts, dual writes, message ordering, DNS caches, replication topology, RPO/RTO, data sovereignty, dependent services, or AWS DRS operations.

## Quiz (4 minutes)

1. Recovery accepted 27 writes. Primary has not reverse-synced. Immediate cutback exposes what?
   - A 27-write gap
   - All 1,027 automatically
   - A guaranteed duplicate only

2. Why is failback a separate change event?
   - It changes authority and traffic again after data reconciliation
   - DNS never changes
   - Recovery data is read-only

3. When should you delay failback?
   - Primary is reachable but reverse replication and dependency checks are incomplete
   - All checks pass and lag is within policy
   - A drill has a named owner

4. Which service becomes authoritative during each regional failover?
5. What exact data and dependency evidence authorizes failback?

<details><summary>Answer key — attempt first</summary>

1. A 27-write gap. The original primary lacks recovery-period writes.

2. It changes authority and traffic again after data reconciliation. Return requires its own readiness, evidence and rollback.

3. Primary is reachable but reverse replication and dependency checks are incomplete. Reachability alone is not consistency or service readiness.

</details>

## Sources

- [AWS Elastic Disaster Recovery: recovery and failback](https://docs.aws.amazon.com/drs/latest/userguide/failback.html) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [AWS Prescriptive Guidance: Multi-Region fundamental 2 — understanding data](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html) — Official guidance; checked October 31, 2026; checked 2026-10-31.
