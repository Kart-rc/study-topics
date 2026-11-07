# A ConcurrentHashMap scan is a moving view—not a snapshot

Software engineering · Day47 · 15 minutes

Use weakly consistent traversal safely and know when a stable snapshot is required.

## Recall (2 minutes)

<p><a href="../Day27/software-engineering.html">Day27: Retry a poison message three times—then quarantine it</a></p><p>Why cap retries?</p><details><summary>Recall first, then reveal the refresher</summary><p>To prevent one permanent failure from consuming work forever. Permanent failures need quarantine and repair, not infinite retries.</p></details><p><a href="../Day31/software-engineering.html">Day31: Fast counters with a fuzzy snapshot: LongAdder</a></p><p>Why can LongAdder outperform AtomicLong under heavy write contention?</p><details><summary>Recall first, then reveal the refresher</summary><p>Updates can spread across multiple variables. Striping reduces contention on one hot variable.</p></details>

## Understand (4 minutes)

A stock clerk walks the aisles while cashiers keep selling items. The clerk can finish the walk without locking the store, but the list may mix moments in time.

ConcurrentHashMap views are weakly consistent. Their iterators do not fail just because updates occur, but a traversal is not an atomic snapshot. It may reflect some concurrent changes and not others.



The map starts with A=5 and B=7. While a report traverses, a writer changes A to 4 and adds C=9. The report may show A=5, B=7, C=9: a valid moving view, but not inventory at one instant. That is fine for telemetry; it is unsafe for an exact financial close.



## Read the visual

A time-ordered scan interleaves the writer between entry reads, so the mixed-version report is visible as an execution sequence rather than an abstract warning.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use weakly consistent traversal for monitoring, diagnostics, caches, and approximate aggregate work that must not stop concurrent writers.

**Practical example.** A service exports current per-tenant queue depths while workers add and remove tenants.

**How to decide.** If the consumer needs one instant, copy under an application-level coordination rule or read from a versioned database snapshot. Do not infer snapshot isolation from the absence of ConcurrentModificationException.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
java.util.concurrent.ConcurrentHashMap<String,Integer> m=new java.util.concurrent.ConcurrentHashMap<>(); m.put("A",5); m.put("B",7);
int seenA=m.get("A");
m.put("A",4); m.put("C",9);
int seenB=m.get("B"); int seenC=m.get("C"); String report="A="+seenA+", B="+seenB+", C="+seenC;
```

1. Create the pre-scan state.

   Changed values: `{}`

2. The report sees A before the writer.

   Changed values: `{"seenA": "5"}`

3. A writer changes the live map during the report.

   Changed values: `{}`

4. The report mixes an older A with a newer C.

   Changed values: `{"seenB": "7", "seenC": "9", "report": "A=5, B=7, C=9"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser and Java trace use a scripted interleaving, not real threads or a complete set of legal outcomes. They omit memory-model details, resize behavior, bulk operations, contention, null restrictions, ordering, and snapshot implementation costs.

## Explore (remaining exploration time)

Move the writer before or after each read and watch which versions the report can contain.

Open software-engineering.html for the executable model.

Model limits: The browser and Java trace use a scripted interleaving, not real threads or a complete set of legal outcomes. They omit memory-model details, resize behavior, bulk operations, contention, null restrictions, ordering, and snapshot implementation costs.

## Quiz (4 minutes)

1. What does weakly consistent mean here?
   - Traversal can proceed during writes but is not one atomic snapshot
   - Every update is guaranteed visible
   - Iteration locks every key

2. Why can the report contain old A and new C?
   - Reads occur at different moments while writers continue
   - The map is corrupt
   - Keys are sorted

3. When should you add stronger coordination?
   - When a business invariant requires one stable instant
   - For every metric scrape
   - Only when the map is empty

4. Which current scan in your services is approximate by design?
5. Which downstream decision would be unsafe if the scan mixed versions?

<details><summary>Answer key — attempt first</summary>

1. Traversal can proceed during writes but is not one atomic snapshot. Concurrent progress is allowed; exact point-in-time visibility is not promised.

2. Reads occur at different moments while writers continue. A moving traversal can observe different entries around concurrent updates.

3. When a business invariant requires one stable instant. Exact reconciliation needs snapshot semantics outside this traversal guarantee.

</details>

## Sources

- [ConcurrentHashMap (Java SE 25)](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html) — Official Oracle Java API; checked November 6, 2026; checked 2026-11-06.
- [Iterator (Java SE 25)](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Iterator.html) — Official Oracle Java API; checked November 6, 2026; checked 2026-11-06.
