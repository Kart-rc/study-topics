# Readers keep a snapshot; writers pay for a copy

Software engineering · Day32 · 15 minutes

Use CopyOnWriteArrayList only when reads vastly outnumber writes.

## Recall (2 minutes)

<p><a href="../Day25/software-engineering.html">Day25: One lock order breaks the deadlock cycle</a></p><p>T1 holds 7 and waits for 9; T2 holds 9 and waits for 7. What exists?</p><details><summary>Recall first, then reveal the refresher</summary><p>A wait-for cycle. Each transaction waits for a resource held by the other.</p></details><p><a href="../Day13/software-engineering.html">Day13: Read two, write two: why quorums overlap</a></p><p>With N=3, W=2, and R=2, what is guaranteed for strict quorums?</p><details><summary>Recall first, then reveal the refresher</summary><p>The read and write responder sets intersect. Because 2 + 2 &gt; 3, the two sets cannot be disjoint.</p></details>

## Understand (4 minutes)

A museum prints a visitor map each morning. Visitors can keep reading that map even while staff prepare tomorrow's version. Readers never see half-edited ink; the staff pays the cost of printing a new map.

CopyOnWriteArrayList works that way. A mutation copies the backing array. An iterator keeps the array reference it captured, so later additions do not appear in that iterator.



A listener list starts as [billing, audit]. Request A creates an iterator. Another thread adds fraud, producing a new array. Request A still calls only billing and audit. A new request sees all three listeners.



## Read the visual

Two arrays are shown at once because that is the core mechanism: the old iterator stays attached to A while a writer publishes B.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use it for small listener, route, or configuration lists that are traversed constantly and changed rarely.

**Practical example.** A Java service invokes two event listeners on every Kafka record but updates the listener set only during a rare configuration change.

**How to decide.** Choose it when traversal dominates and stale snapshot iteration is acceptable. Use another concurrent structure or explicit immutable snapshot publication when writes, list size, or freshness requirements make copying expensive.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var listeners = new java.util.concurrent.CopyOnWriteArrayList<String>(java.util.List.of("billing", "audit"));
var oldIterator = listeners.iterator();
listeners.add("fraud");
var currentCount = listeners.size(); var oldCount = 0; while (oldIterator.hasNext()) { oldIterator.next(); oldCount++; }
```

1. Create the read-mostly listener list.

   Changed values: `{"listeners": "[billing, audit]"}`

2. The iterator captures the current backing-array snapshot.

   Changed values: `{"oldIterator": "java.util.concurrent.CopyOnWriteArrayList$COWIterator@2928854b"}`

3. The write publishes a copied array containing three values.

   Changed values: `{"listeners": "[billing, audit, fraud]"}`

4. The current list has three values while the old snapshot still has two.

   Changed values: `{"currentCount": "3", "oldCount": "2"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser models array identities and snapshot visibility. The Java replay runs single-threaded. Neither measures allocation, contention, GC cost, or timing, and it does not prove correctness for mutable elements stored inside the list.

## Explore (remaining exploration time)

Create an iterator, then add a listener. Compare the old iterator's snapshot with a newly created iterator.

Open software-engineering.html for the executable model.

Model limits: The browser models array identities and snapshot visibility. The Java replay runs single-threaded. Neither measures allocation, contention, GC cost, or timing, and it does not prove correctness for mutable elements stored inside the list.

## Quiz (4 minutes)

1. An iterator exists before fraud is added. What does it see?
   - Only billing and audit
   - All three listeners
   - A ConcurrentModificationException

2. Why can traversal avoid synchronization?
   - The captured array is not mutated
   - All writes are ignored
   - Elements become immutable

3. When is this structure a poor fit?
   - Large or frequently mutated lists
   - Tiny read-mostly lists
   - Snapshot-tolerant listener registries

4. What listener freshness guarantee does your service actually need?
5. How would you measure whether copy allocation is material at production list sizes?

<details><summary>Answer key — attempt first</summary>

1. Only billing and audit. The iterator keeps its creation-time array snapshot.

2. The captured array is not mutated. Writers publish a fresh backing array.

3. Large or frequently mutated lists. Every mutation copies the backing array.

</details>

## Sources

- [Java 26 CopyOnWriteArrayList API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/CopyOnWriteArrayList.html) — Java SE 26; checked 2026-10-22.
