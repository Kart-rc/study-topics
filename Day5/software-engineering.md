# Consistent hashing: move a slice, not the whole keyspace

Software engineering · Day5 · 15 minutes

Adding a cache node can unexpectedly move most keys and make many caches cold at once.

## Recall (2 minutes)

<p><a href="../Day2/software-engineering.html">Day2: A queue buys time, not capacity</a></p><p>Backlog 300, arrivals 80/s, service 100/s. Ideal drain time?</p><details><summary>Recall first, then reveal the refresher</summary><p>15 seconds. The drain rate is spare capacity: 100 − 80 = 20/s. 300 / 20 = 15 seconds.</p></details><p><a href="../Day4/software-engineering.html">Day4: Protobuf evolution: the field number is the contract</a></p><p>A V2 producer adds tag 3. What does a V1 binary parser do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treats tag 3 as an unknown field. Adding a field is binary wire-safe; old code does not recognize its application meaning.</p></details>

## Understand (4 minutes)

Adding a cache node can unexpectedly move most keys and make many caches cold at once. A placement rule should make expansion less disruptive.

Consistent hashing places nodes on a fixed ring. A key belongs to the next node clockwise. Adding a node changes ownership only for the interval it takes over. Real systems often assign several positions per node to improve balance.



With node positions 20, 50, and 80, keys 25 and 45 belong to B. Add D at 40: key 25 moves to D, while key 45 stays with B. A key beyond 80 wraps around to A.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var ring = new java.util.TreeMap<Integer, String>();
ring.put(20, "A"); ring.put(50, "B"); ring.put(80, "C");
String owner25Before = ring.ceilingEntry(25).getValue();
ring.put(40, "D");
String owner25After = ring.ceilingEntry(25).getValue();
String owner45After = ring.ceilingEntry(45).getValue();
String owner90 = ring.firstEntry().getValue();
```

1. A sorted map represents clockwise ring positions.

   Changed values: `{"ring": "{}"}`

2. Three nodes occupy fixed positions.

   Changed values: `{"ring": "{20=A, 50=B, 80=C}"}`

3. Key 25 initially belongs to B.

   Changed values: `{"owner25Before": "B"}`

4. The new node is inserted without moving old positions.

   Changed values: `{"ring": "{20=A, 40=D, 50=B, 80=C}"}`

5. D now owns key 25.

   Changed values: `{"owner25After": "D"}`

6. Key 45 stays with B.

   Changed values: `{"owner45After": "B"}`

7. Key 90 has no higher position, so it wraps to A.

   Changed values: `{"owner90": "A"}`

[Full runnable example](examples/software-engineering.java).

Limits: Positions are assigned numbers, not actual hashes. This single-point ring omits replicas, virtual nodes, membership agreement, and hot-key handling.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Naive modulo sharding maps <code>hash(key) % nodeCount</code>. It is simple and balanced, but changing the divisor changes the answer for many keys. Adding one cache node can therefore invalidate most placement decisions at once.</p><p>Consistent hashing maps keys and nodes into a fixed circular hash space. A key belongs to the first node clockwise from its position. Adding a node changes ownership only for the arc between that node and its predecessor. Amazon's Dynamo paper used consistent hashing for incremental scale and added virtual nodes to improve balance and represent heterogeneous capacity.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A schema-registry cache has three nodes. Adding a fourth with modulo sharding changes the divisor from three to four, so keys scatter to different owners. The warm-cache event becomes a fleet-wide cold-cache event.</p><p>On a ring, A, B, and C keep their positions. D takes only keys in D's newly claimed clockwise interval. The rest retain their owner. Operationally, the mechanism converts a global reshuffle into bounded movement—but the hottest individual keys can still overload their owners.</p><pre>position = hash(key) on a fixed ring
owner = first node clockwise from position
add D → only predecessor-to-D arc changes owner</pre><p>Production systems rarely stop at one point per host: virtual nodes smooth random imbalance, replicas span failure domains, and membership changes need an agreed view. Consistent hashing minimizes movement; it does not provide consensus, replication, or load fairness by itself.</p>

</details>

## Explore (remaining exploration time)

Start with three nodes, then add D. Compare ring and modulo remapping. Add E and explain why a low movement count can coexist with a bad hotspot.

Open software-engineering.html for the executable model.

Model limits: Sixty synthetic keys, a 64-slot ring, fixed node positions, one owner per key, and a tiny deterministic hash. It omits virtual nodes, replicas, weighted capacity, failure domains, membership consensus, concurrent changes, streaming migration, skewed access popularity, and cryptographic hash quality.

## Quiz (4 minutes)

1. Why does adding a node disrupt modulo sharding broadly?
   - The divisor changes, so many hash remainders change
   - The hash function stops returning values
   - Every key becomes duplicated

2. On a fixed consistent-hash ring, which keys move to a new node?
   - Every key
   - Keys in the arc newly claimed by that node
   - Only keys with empty values

3. What problem do virtual nodes help with but do not eliminate?
   - Balancing ownership and heterogeneous capacity
   - Consensus on membership
   - Semantic hot keys

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. The divisor changes, so many hash remainders change. Placement depends directly on node count, so changing it changes many assignments.

2. Keys in the arc newly claimed by that node. The new node interrupts one ownership interval; other clockwise successors remain the same.

3. Balancing ownership and heterogeneous capacity. Multiple tokens smooth partition ownership; they do not make popular keys cold or establish agreement.

</details>

## Sources

- [Dynamo: Amazon's Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) — SOSP; published 2007-10-14; checked 2026-09-25.
