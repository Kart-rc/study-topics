# Read two, write two: why quorums overlap

Software engineering · Day13 · 15 minutes

Use three replicas to see why R + W > N creates an overlap—and why overlap alone is not serializability.

## Recall (2 minutes)

<p><a href="../Day8/software-engineering.html">Day8: Optimistic concurrency: make a lost update fail loudly</a></p><p>Two workers read version 12; worker A commits version 13 before worker B writes. What should B&#x27;s conditional update do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Fail as a conflict so B can reread and recompute. The version mismatch converts the stale decision into an explicit conflict.</p></details><p><a href="../Day10/software-engineering.html">Day10: Stop calling a failing service, then try one small probe</a></p><p>After three failures open this breaker, what happens to a fourth immediate call?</p><details><summary>Recall first, then reveal the refresher</summary><p>It is blocked without reaching the service. Open means the local breaker rejects the call. It avoids another remote wait, but it cannot turn a failed operation into a success.</p></details>

## Understand (4 minutes)

Three teammates each keep a copy of a shopping cart. A write updates two teammates. A later read asks two teammates. Can the read completely miss the write?

If there are N=3 replicas, a successful write waits for W=2, and a read waits for R=2, the read set and write set must share at least one replica. Four seats cannot fit into three chairs without overlap.

AWrite ✓

BWrite ✓ · Read ✓

CRead ✓

Write {A,B} ∩ Read {B,C} = {B}

The rule is R + W > N. It guarantees set intersection for strict quorums over the same replica set. The read still needs version comparison and reconciliation to choose the right value.



O42's cart changes from one mug to two. The write reaches A and B. A read asks B and C. B has the new version, C has the old version. The coordinator can see both and choose or reconcile them using version metadata.

overlap = set(write_replicas) & set(read_replicas)
latest_is_reachable = bool(overlap)

If R=1 and the read asks only C, it may see the old cart. If replicas accept concurrent writes, overlap does not erase the conflict. Dynamo used vector clocks and returned causally unrelated versions for reconciliation.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
replicas = ["A", "B", "C"]
N, W, R = 3, 2, 2
write_responders = ["A", "B"]
read_responders = ["B", "C"]
overlap = sorted(set(write_responders) & set(read_responders))
latest_is_reachable = len(overlap) > 0
unsafe_read = ["C"]
unsafe_overlap = sorted(set(write_responders) & set(unsafe_read))
```

1. Use the common three-replica, read-two, write-two example.

   Changed values: `{"replicas": ["A", "B", "C"], "N": 3, "W": 2, "R": 2}`

2. The write and read each use two replicas.

   Changed values: `{"write_responders": ["A", "B"], "read_responders": ["B", "C"]}`

3. B is in both sets, so at least one write participant is reachable to the read.

   Changed values: `{"overlap": ["B"], "latest_is_reachable": true}`

4. A one-replica read can land entirely outside the successful write set.

   Changed values: `{"unsafe_read": ["C"], "unsafe_overlap": []}`

[Full runnable example](examples/software-engineering.py).

Limits: Executes set intersection. It does not implement Dynamo vector clocks, reconciliation, sloppy quorum membership, or distributed timing.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Dynamo's original paper notes that R and W also determine latency: a coordinator waits for the slowest required responder. The common (3,2,2) choice is a tradeoff, not a universal default.</p>

</details>

## Explore (remaining exploration time)

Choose R and W. The lab places the write at the left and the read at the right to test the worst separation.

Open software-engineering.html for the executable model.

Model limits: A strict three-node set model. It omits latency, failed nodes, sloppy quorums, hinted handoff, concurrent versions, read repair, anti-entropy, and consistency levels of specific databases. R + W > N gives intersection, not automatic linearizability or conflict resolution.

## Quiz (4 minutes)

1. With N=3, W=2, and R=2, what is guaranteed for strict quorums?
   - Every read has zero latency
   - The read and write responder sets intersect
   - Concurrent writes cannot happen

2. With W=2, a read uses only C (R=1). What can happen?
   - It may miss the latest write to A and B
   - It must see the new value
   - It changes N to 2

3. Why is quorum overlap not the same as linearizability?
   - Intersection provides a candidate copy, but version ordering and concurrent-write reconciliation still matter
   - Quorums never use replicas
   - R and W control only network encryption

4. Explain R + W > N using the three chairs in the visual.
5. How does sloppy quorum membership weaken the simple same-set argument?

<details><summary>Answer key — attempt first</summary>

1. The read and write responder sets intersect. Because 2 + 2 > 3, the two sets cannot be disjoint.

2. It may miss the latest write to A and B. R + W equals N, so a worst-placed one-replica read can be disjoint from the write.

3. Intersection provides a candidate copy, but version ordering and concurrent-write reconciliation still matter. A shared replica is evidence, not a complete rule for ordering every concurrent operation.

</details>

## Sources

- [Dynamo: Amazon's Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) — SOSP 2007; 2007-10-14 to 2007-10-17; checked 2026-10-03.
