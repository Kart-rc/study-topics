# Bloom filters: a cheap no, a cautious maybe

Software engineering · Day17 · 15 minutes

Avoid needless database reads without treating a probabilistic hint as an exact answer.

## Recall (2 minutes)

<p><a href="../Day8/software-engineering.html">Day8: Optimistic concurrency: make a lost update fail loudly</a></p><p>Two workers read version 12; worker A commits version 13 before worker B writes. What should B&#x27;s conditional update do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Fail as a conflict so B can reread and recompute. The version mismatch converts the stale decision into an explicit conflict.</p></details><p><a href="../Day2/software-engineering.html">Day2: A queue buys time, not capacity</a></p><p>Backlog 300, arrivals 80/s, service 100/s. Ideal drain time?</p><details><summary>Recall first, then reveal the refresher</summary><p>15 seconds. The drain rate is spare capacity: 100 − 80 = 20/s. 300 / 20 = 15 seconds.</p></details>

## Understand (4 minutes)

A receptionist keeps a short checklist of initials. If your initials are absent, your name is absent. If they are present, someone else might share them. The receptionist still needs the full guest list.

A Bloom filter is a compact set of bits. Adding an ID turns on positions chosen by hash functions. A lookup checks those positions: one zero means absent from the inserted set; all ones mean possibly present. Different IDs can share positions.



Our eight-bit toy uses x % 8 and (3*x+1) % 8. Inserting 1 and 2 produces [0,1,1,0,1,0,0,1]. Query 9 finds two ones, although it was never inserted: a false positive. Query 3 checks positions 3 and 2. Position 3 is zero, so 3 is absent.

The safe read path is: a negative skips the expensive lookup; a positive goes to the authoritative database. A positive must never mean “discard this payment because it was already processed.”



## Read the visual

The arrows connect the query’s two hash calculations to the exact bit positions they inspect. Labels below each set bit show which inserted ID set it. ID 9 and ID 1 point to the same two bits, even though only ID 1 is in the catalog. ID 3 points to bit 3, which is zero: that single zero stops the lookup. A MAYBE continues to the exact catalog unless the broken shortcut bypasses it.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Most lookups ask for nonexistent keys, and avoiding those reads saves substantial work.

**Practical example.** A metadata service checks object IDs against a large catalog. A complete filter can reject absent IDs cheaply; possible matches still read the catalog.

**How to decide.** Control freshness and completeness. For exact deduplication use an authoritative unique key or transaction. For a small set, an ordinary hash set is simpler.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var bits = new java.util.BitSet(8);
var inserted = java.util.Set.of(1, 2);
for (int id : inserted) { bits.set(id % 8); bits.set((3 * id + 1) % 8); }
int query = 9;
boolean maybe = bits.get(query % 8) && bits.get((3 * query + 1) % 8);
boolean exact = inserted.contains(query);
boolean falsePositive = maybe && !exact;
```

1. Begin with zero bits and an exact reference set.

   Changed values: `{"bits": "{}", "inserted": "[1, 2]"}`

2. Set positions 1, 4, 2, and 7.

   Changed values: `{"bits": "{1, 2, 4, 7}"}`

3. ID 9 collides with ID 1.

   Changed values: `{"query": "9", "maybe": "true"}`

4. The exact lookup rejects 9. The filter did not corrupt the answer.

   Changed values: `{"exact": "false", "falsePositive": "true"}`

[Full runnable example](examples/software-engineering.java).

Limits: Executed Java BitSet example with teaching hashes; no Redis or database process.

## Explore (remaining exploration time)

Follow the two arrows from query 9 to bits 1 and 4. Who switched those bits on? Compare 9 with 1, then try 3. Turn on the broken shortcut to see where a false positive becomes a wrong answer.

Open software-engineering.html for the executable model.

Model limits: The browser executes an eight-bit toy with deliberately weak, correlated hashes. It is not Redis or a false-positive-rate estimator. The no-false-negative property covers inserted items in an intact filter, not records absent from a stale filter.

## Quiz (4 minutes)

1. ID 9 checks two set bits. What should the service do?
   - Return present
   - Read the exact catalog
   - Clear the bits

2. Why may query 3 skip the exact read in this complete toy?
   - One checked bit is zero
   - Both are one
   - The ID is odd

3. A new catalog ID has not reached the filter. Is its negative safe for the catalog?
   - Yes, always
   - Yes, with more hashes
   - No, the filter is incomplete

4. Why is this a read optimization rather than an exact processed-message marker?
5. How would you detect a filter built from an incomplete catalog snapshot?

<details><summary>Answer key — attempt first</summary>

1. Read the exact catalog. Shared bits are not proof. Clearing them can damage other IDs.

2. One checked bit is zero. Every inserted ID sets both positions. One zero rules out membership in that inserted set.

3. No, the filter is incomplete. More hashes cannot repair a missing update.

</details>

## Sources

- [Redis: Bloom filter](https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/) — Living documentation; publication date not stated; checked 2026-10-07.
