# LongAdder is a fast metric—not an atomic checkpoint

Software engineering · Day53 · 15 minutes

Use LongAdder for high-contention statistics while keeping exact business decisions on a transactional or synchronized value.

## Recall (2 minutes)

<p><a href="../Day30/software-engineering.html">Day30: Read quickly, then validate: StampedLock optimistic reads</a></p><p>A writer acquires the write lock after the optimistic stamp. What does validate return?</p><details><summary>Recall first, then reveal the refresher</summary><p>False. A write acquisition since the stamp invalidates the optimistic read.</p></details><p><a href="../Day34/software-engineering.html">Day34: If a map key changes, the entry does not move</a></p><p>A key&#x27;s tenant field affects equals/hashCode and changes after put. What is specified?</p><details><summary>Recall first, then reveal the refresher</summary><p>Map behavior is unspecified. The Java Map contract warns against equality-affecting key mutation.</p></details>

## Understand (4 minutes)

A stadium has several turnstiles counting visitors. Adding each turnstile's number is fast enough for a live attendance screen. But while you walk from one counter to the next, more people enter. Your total is useful telemetry, not a frozen photograph.

LongAdder spreads contended updates across internal variables and combines them in sum(). Java documents that the returned value is not an atomic snapshot. That trade improves update throughput for statistics. It makes the value unsuitable as the sole proof for billing, quota enforcement, or a one-time transition.



Two request-counter cells hold 40 and 35. The dashboard reads both as 75. Five requests arrive in the second cell during the read, so live cells total 80. The displayed value can catch up on the next scrape; a quota decision cannot assume 75 is exact.



## Read the visual

Two counter cells update independently while a separate read path combines them, revealing the gap between a live metric and an atomic checkpoint.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use LongAdder for frequently updated counters such as requests, bytes, and cache hits when an eventually current total is acceptable.

**Practical example.** Hundreds of API threads increment a per-endpoint telemetry counter while Prometheus scrapes once every 15 seconds.

**How to decide.** Choose LongAdder for statistics under contention. Choose AtomicLong, a lock, or a transactional datastore when a read must coordinate with an exact state transition.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int left=40; int right=35;
int readLeft=left; int readRight=right;
right+=5; int liveTotal=left+right;
int reported=readLeft+readRight; String result="reported="+reported+", live="+liveTotal;
```

1. Represent two internal counter cells.

   Changed values: `{"left": "40", "right": "35"}`

2. Read both cells for one synthetic sum.

   Changed values: `{"readLeft": "40", "readRight": "35"}`

3. Let five updates arrive before the read is used.

   Changed values: `{"right": "40", "liveTotal": "80"}`

4. Compare the non-atomic read with current cell contents.

   Changed values: `{"reported": "75", "result": "reported=75, live=80"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java replay uses two integers to expose one possible interleaving. It does not inspect LongAdder's private cells, launch threads, reproduce scheduler behavior, benchmark contention, or claim that a particular concurrent update must be omitted.

## Explore (remaining exploration time)

Move an update before, during, or after the synthetic sum. Predict whether this particular read includes it.

Open software-engineering.html for the executable model.

Model limits: The Java replay uses two integers to expose one possible interleaving. It does not inspect LongAdder's private cells, launch threads, reproduce scheduler behavior, benchmark contention, or claim that a particular concurrent update must be omitted.

## Quiz (4 minutes)

1. A LongAdder scrape returns 75 while updates are concurrent. What is guaranteed?
   - It is a combined current-looking statistic, not an atomic snapshot
   - Exactly 75 requests existed at one instant
   - All updater threads paused

2. Why can LongAdder outperform one AtomicLong under contention?
   - Updates can be spread across multiple variables
   - It skips recording increments
   - It uses a database transaction

3. Which use is outside the safe boundary?
   - Charge a customer exactly when the value crosses 10,000
   - Expose approximate requests per second
   - Count cache hits for telemetry

4. Which counter in your platform drives a business decision even though it is collected as telemetry?
5. What exact state store or synchronization boundary should own that decision instead?

<details><summary>Answer key — attempt first</summary>

1. It is a combined current-looking statistic, not an atomic snapshot. sum() can omit concurrent updates and is intended for statistics rather than fine-grained synchronization.

2. Updates can be spread across multiple variables. Spreading updates reduces contention on one shared location, at some space and snapshot cost.

3. Charge a customer exactly when the value crosses 10,000. An exact one-time business transition needs coordinated state, not an approximate concurrent sum.

</details>

## Sources

- [LongAdder — Java SE 25 API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html) — Official Java SE 25 API; checked November 13, 2026; checked 2026-11-13.
- [java.util.concurrent.atomic package — Java SE 25](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/package-summary.html) — Official Java SE 25 API; checked November 13, 2026; checked 2026-11-13.
