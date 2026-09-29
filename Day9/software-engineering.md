# Merkle trees: localize replica drift before repairing it

Software engineering · Day9 · 15 minutes

Use hierarchical hashes to find divergent replica ranges without scanning or transferring every value, while recognizing where hashing stops and repair policy begins.

## Recall (2 minutes)

<p><a href="../Day7/software-engineering.html">Day7: Deadline propagation: pass the remaining budget</a></p><p>A service spends 140 ms of a 500 ms deadline before a child call. What budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>360 ms. Propagation deducts elapsed time from the original end-to-end budget.</p></details><p><a href="../Day2/software-engineering.html">Day2: A queue buys time, not capacity</a></p><p>Backlog 300, arrivals 80/s, service 100/s. Ideal drain time?</p><details><summary>Recall first, then reveal the refresher</summary><p>15 seconds. The drain rate is spare capacity: 100 − 80 = 20/s. 300 / 20 = 15 seconds.</p></details>

## Understand (4 minutes)

Anti-entropy asks a deceptively expensive question: which parts of two replicas differ? Comparing every key and value proves the answer, but it consumes I/O and network even when almost everything matches. A Merkle tree summarizes buckets of data at the leaves, then hashes pairs of child hashes upward to one root. Equal roots mean the summarized contents match under the chosen hash and canonical encoding. Unequal roots tell you to descend only into different branches.

Dynamo used separate Merkle trees for key ranges so replicas could exchange roots, isolate out-of-sync ranges, and transfer only the affected keys. The leverage comes from sparsity: one divergent bucket in 1,024 leaves needs comparison along roughly one logarithmic path rather than inspection of all 1,024 value buckets.

The tree is evidence, not reconciliation. You still need canonical serialization, a stable range map, collision-resistant hashing, version/conflict semantics, tombstone retention, and a repair rate that does not overload production. If partition ownership changes, trees may need rebuilding because their leaf boundaries changed.



Worked example: Two replicas each summarize 1,024 leaf buckets in a balanced binary tree. Exactly one leaf differs. Compare the root, then the two child hashes at each of ten levels. A simple upper bound is about 21 hash comparisons instead of reading 1,024 value buckets.

depth = log2(1024) = 10
one divergent path ≈ 1 + 2 × 10 = 21 hash nodes

With many scattered differences, paths overlap at the top but fan out below. Eventually the comparison can approach the whole tree. At that point a full-range scan or rebuild may be cheaper, so production anti-entropy needs a policy threshold rather than assuming the tree always wins.



## Explore (5 minutes)

Vary the number of leaf buckets and divergent buckets. Predict when hierarchical comparison is dramatically cheaper and when it approaches a full tree walk. Then name the separate rule that decides which version wins.

Open software-engineering.html for the executable model.

Model limits: A balanced binary-tree upper-bound model with evenly distributed, non-overlapping divergent paths. Real Merkle implementations share internal paths, choose branching factors and range boundaries differently, cache hashes, and pay serialization and disk costs. Hash equality is probabilistic and depends on canonical input. The model does not resolve conflicts, preserve tombstones, move partitions, or schedule repair traffic.

## Quiz (4 minutes)

1. Two replicas have equal Merkle roots built from the same canonical range. What is the useful inference?
   - Their summarized contents match with the assurance of the hash
   - Every historical write arrived in the same order
   - No future repair is ever needed

2. Why does a Merkle tree help most when divergence is sparse?
   - Comparison descends only through branches whose hashes differ
   - It eliminates disk I/O in every implementation
   - It makes network partitions impossible

3. What critical decision is outside the tree?
   - Whether two ranges appear different
   - Which conflicting version or tombstone should win during repair
   - How many levels a balanced tree has

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Their summarized contents match with the assurance of the hash. The root summarizes current canonical contents; it says nothing about history or future drift.

2. Comparison descends only through branches whose hashes differ. Shared equal subtrees are pruned from the comparison.

3. Which conflicting version or tombstone should win during repair. Hashes localize differences; application and storage semantics govern reconciliation.

</details>

## Sources

- [Amazon Science: Dynamo—Amazon's Highly Available Key-value Store](https://www.amazon.science/publications/dynamo-amazons-highly-available-key-value-store) — Published at ACM SOSP 2007; checked 2026-09-29.
- [ACM Digital Library: Dynamo—Amazon's Highly Available Key-value Store](https://dl.acm.org/doi/10.1145/1294261.1294281) — Published 2007-10-14; checked 2026-09-29.
- [RFC 9162: Certificate Transparency Version 2, Merkle Tree Hash](https://www.rfc-editor.org/rfc/rfc9162.html#name-merkle-tree-hash) — Published 2021-12; formal tree-hash construction; checked 2026-09-29.
