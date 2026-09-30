# Merkle trees: localize replica drift before repairing it

Software engineering · Day9 · 15 minutes

Two replicas should hold the same data.

## Recall (2 minutes)

<p><a href="../Day7/software-engineering.html">Day7: Deadline propagation: pass the remaining budget</a></p><p>A service spends 140 ms of a 500 ms deadline before a child call. What budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>360 ms. Propagation deducts elapsed time from the original end-to-end budget.</p></details><p><a href="../Day2/software-engineering.html">Day2: A queue buys time, not capacity</a></p><p>Backlog 300, arrivals 80/s, service 100/s. Ideal drain time?</p><details><summary>Recall first, then reveal the refresher</summary><p>15 seconds. The drain rate is spare capacity: 100 − 80 = 20/s. 300 / 20 = 15 seconds.</p></details>

## Understand (4 minutes)

Two replicas should hold the same data. Reading and comparing every value is expensive when only a small part differs.

A Merkle tree combines data fingerprints into larger fingerprints. Compare the roots first. If they differ, compare child fingerprints and follow the branches that differ. Matching fingerprints let you skip unchanged ranges, under the hash and encoding assumptions.



The left half contains A and B in both replicas. The right half contains C and D in one, C and X in the other. The root differs, the left child matches, and the right child identifies where to investigate. Finding the difference is separate from deciding how to repair it.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
String leftA = hash("A|B");
String leftB = hash("A|B");
String rightA = hash("C|D");
String rightB = hash("C|X");
boolean rootsMatch = hash(leftA + rightA).equals(hash(leftB + rightB));
boolean skipLeft = leftA.equals(leftB);
String inspectNext = rightA.equals(rightB) ? "none" : "right branch";
```

1. Fingerprint the first replica’s left half.

   Changed values: `{"leftA": "cfb6e8834699f9737eb031728d563a451274f04eab5efd8b7d1bdd2a6b82ba00"}`

2. The second replica has the same left data.

   Changed values: `{"leftB": "cfb6e8834699f9737eb031728d563a451274f04eab5efd8b7d1bdd2a6b82ba00"}`

3. The first replica has D in its right half.

   Changed values: `{"rightA": "f5512816b9398385b9b39fee4135e23373d773efd1b519947bcc831af6738ac2"}`

4. The second replica differs at X.

   Changed values: `{"rightB": "405cf0c42090c009c2e27598633cec8cd1542eeefa840692a63ecc3e4bb6e9cc"}`

5. The overall fingerprints differ.

   Changed values: `{"rootsMatch": "false"}`

6. The matching left branch can be skipped.

   Changed values: `{"skipLeft": "true"}`

7. The mismatch points to the right branch.

   Changed values: `{"inspectNext": "right branch"}`

[Full runnable example](examples/software-engineering.java).

Limits: The full example file defines hash with SHA-256. Fixed synthetic strings use a simple encoding; real trees need unambiguous serialization, stable ranges, and deletion/version semantics. Hash agreement is not a conflict-resolution policy.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Anti-entropy asks a deceptively expensive question: which parts of two replicas differ? Comparing every key and value proves the answer, but it consumes I/O and network even when almost everything matches. A Merkle tree summarizes buckets of data at the leaves, then hashes pairs of child hashes upward to one root. Equal roots mean the summarized contents match under the chosen hash and canonical encoding. Unequal roots tell you to descend only into different branches.</p><p>Dynamo used separate Merkle trees for key ranges so replicas could exchange roots, isolate out-of-sync ranges, and transfer only the affected keys. The leverage comes from sparsity: one divergent bucket in 1,024 leaves needs comparison along roughly one logarithmic path rather than inspection of all 1,024 value buckets.</p><p>The tree is evidence, not reconciliation. You still need canonical serialization, a stable range map, collision-resistant hashing, version/conflict semantics, tombstone retention, and a repair rate that does not overload production. If partition ownership changes, trees may need rebuilding because their leaf boundaries changed.</p><h3>Original detailed example</h3><p><strong>Worked example:</strong> Two replicas each summarize 1,024 leaf buckets in a balanced binary tree. Exactly one leaf differs. Compare the root, then the two child hashes at each of ten levels. A simple upper bound is about 21 hash comparisons instead of reading 1,024 value buckets.</p><pre>depth = log2(1024) = 10
one divergent path ≈ 1 + 2 × 10 = 21 hash nodes</pre><p>With many scattered differences, paths overlap at the top but fan out below. Eventually the comparison can approach the whole tree. At that point a full-range scan or rebuild may be cheaper, so production anti-entropy needs a policy threshold rather than assuming the tree always wins.</p>

</details>

## Explore (remaining exploration time)

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
