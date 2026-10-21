# Fast counters with a fuzzy snapshot: LongAdder

Software engineering · Day31 · 15 minutes

Use striped counters for high-write statistics, not exact coordination.

## Recall (2 minutes)

<p><a href="../Day19/software-engineering.html">Day19: A returned value can hide a changed history: the ABA problem</a></p><p>W1 read A,v0. Current state is A,v2. What should stamped CAS do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Fail because v0 is stale. The stamp exposes the intervening A→B→A history.</p></details><p><a href="../Day23/software-engineering.html">Day23: Silence raises suspicion; it does not prove a node is dead</a></p><p>Lowering the phi threshold does what?</p><details><summary>Recall first, then reveal the refresher</summary><p>Faster detection and more false suspicions. The policy fires on less evidence.</p></details>

## Understand (4 minutes)

Picture four cashiers each keeping a small click counter. They avoid fighting over one shared clicker. To show a dashboard total, someone adds the four counters. That is fast for writers, but the total can be slightly out of date while cashiers are still clicking.

LongAdder follows this shape: under contention it can grow multiple variables, then sum() combines them. Oracle recommends it for statistics under high update contention, not fine-grained synchronization control.



Three request threads update separate cells: 12, 9, and 11. A dashboard begins summing them. While it moves from cell 2 to cell 3, another request increments cell 1. The dashboard can report 32 even though the final total is 33. For a metric this is often fine; for debiting an account it is not.



## Read the visual

The striped cells show the optimization and its price at once: writers touch different cells, while the reader must walk across values that can keep changing.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use LongAdder for hot counters such as requests, cache hits, and event totals where writers are frequent and a momentarily approximate read is acceptable.

**Practical example.** A Kafka gateway counts accepted requests per route for a monitoring scrape while thousands of threads increment concurrently.

**How to decide.** Choose AtomicLong or a lock/transaction when a read must participate in an exact invariant. Choose LongAdder when update throughput matters more than an atomic snapshot.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var requests = new java.util.concurrent.atomic.LongAdder();
requests.increment(); requests.increment();
requests.add(3);
var observed = requests.sum();
```

1. Create the real Java counter.

   Changed values: `{"requests": "0"}`

2. Two increments update the counter.

   Changed values: `{"requests": "2"}`

3. Add three more events.

   Changed values: `{"requests": "5"}`

4. Read the combined total after these single-threaded statements.

   Changed values: `{"observed": "5"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser uses four fixed cells and one interleaving. A real LongAdder grows cells dynamically and scheduling is nondeterministic. The Java replay proves basic increments and sum only; it does not reproduce a race or benchmark throughput.

## Explore (remaining exploration time)

Move the read cursor across striped cells, then inject an update behind it. Watch why the sum is useful but not an atomic snapshot.

Open software-engineering.html for the executable model.

Model limits: The browser uses four fixed cells and one interleaving. A real LongAdder grows cells dynamically and scheduling is nondeterministic. The Java replay proves basic increments and sum only; it does not reproduce a race or benchmark throughput.

## Quiz (4 minutes)

1. Why can LongAdder outperform AtomicLong under heavy write contention?
   - Updates can spread across multiple variables
   - It removes all memory costs
   - It stores values on disk

2. Which use best fits LongAdder?
   - Request-count telemetry
   - Bank balance transfer invariant
   - Unique sequence allocation

3. What must a reader assume about sum() during concurrent updates?
   - It is not an atomic snapshot
   - It locks every writer
   - It resets automatically

4. What production metric could tolerate this snapshot behavior, and what alert logic would need extra smoothing?
5. Name an invariant where a fuzzy sum would be unsafe and choose a stronger primitive.

<details><summary>Answer key — attempt first</summary>

1. Updates can spread across multiple variables. Striping reduces contention on one hot variable.

2. Request-count telemetry. Telemetry tolerates a non-atomic snapshot; coordination usually does not.

3. It is not an atomic snapshot. Cells can change while the total is being combined.

</details>

## Sources

- [Java 26 LongAdder API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html) — Java SE 26; checked 2026-10-21.
- [Java 26 AtomicLong API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/atomic/AtomicLong.html) — Java SE 26; checked 2026-10-21.
