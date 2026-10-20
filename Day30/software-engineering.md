# Read quickly, then validate: StampedLock optimistic reads

Software engineering · Day30 · 15 minutes

Use an optimistic read only when you can discard a torn snapshot and retry under a real read lock.

## Recall (2 minutes)

<p><a href="../Day24/software-engineering.html">Day24: An interrupt is a stop request—do not erase it</a></p><p>What happens to interrupt status when sleep throws InterruptedException?</p><details><summary>Recall first, then reveal the refresher</summary><p>It is cleared. The blocking method clears status when it throws.</p></details><p><a href="../Day12/software-engineering.html">Day12: One fetch, many callers: request coalescing</a></p><p>A and B request MUG together; C requests PLATE. How many loads start?</p><details><summary>Recall first, then reveal the refresher</summary><p>Two. One MUG leader and one PLATE leader run. Only callers with the same key share work.</p></details>

## Understand (4 minutes)

You glance at a departure board while a worker is changing two fields. The destination may be old while the time is new. A fast glance is useful only if you check that no writer changed the board while you read it.

StampedLock.tryOptimisticRead() gives a stamp without blocking a writer. Read fields into local variables, then call validate(stamp). If validation fails, take a read lock and read the whole snapshot again.



A routing point starts at x=10. The reader takes an optimistic stamp and sees 10. A writer changes x to 11 before validation. Validation is false, so the reader must discard 10 and reread 11 under a read lock. Publishing the first value before validation is the bug.



## Read the visual

The visual separates provisional from published state. A failed stamp does not “fix” the value; it forces a second, protected read.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use optimistic reads for small, read-heavy snapshots where writes are rare and a cheap retry is possible.

**Practical example.** A request router frequently reads an immutable-looking pair of capacity fields while a controller updates them occasionally.

**How to decide.** Prefer an ordinary read lock when the invariant is complex, reads have side effects, validation failures are common, or the code cannot keep provisional values private.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var lock = new java.util.concurrent.locks.StampedLock(); int x = 10;
long stamp = lock.tryOptimisticRead(); int observed = x;
long ws = lock.writeLock(); x = 11; lock.unlockWrite(ws);
boolean valid = lock.validate(stamp); int safe = valid ? observed : x;
```

1. Create the lock and initial value.

   Changed values: `{"lock": "java.util.concurrent.locks.StampedLock@4f638935[Unlocked]", "x": "10"}`

2. Read a provisional value without excluding a writer.

   Changed values: `{"observed": "10"}`

3. A writer changes the value before validation.

   Changed values: `{"x": "11"}`

4. Validation fails, so the reader discards 10 and uses the reread value.

   Changed values: `{"valid": "false", "safe": "11"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser models one integer and one intervening write. Real StampedLock reads can observe inconsistent multi-field state, stamps are not ownership tokens, the lock is not reentrant, and starvation/fairness are not guaranteed.

## Explore (remaining exploration time)

Toggle whether a write lands between the optimistic read and validation. Watch the provisional value either commit or get discarded.

Open software-engineering.html for the executable model.

Model limits: The browser models one integer and one intervening write. Real StampedLock reads can observe inconsistent multi-field state, stamps are not ownership tokens, the lock is not reentrant, and starvation/fairness are not guaranteed.

## Quiz (4 minutes)

1. A writer acquires the write lock after the optimistic stamp. What does validate return?
   - False
   - True forever
   - A new value

2. Why copy fields into locals before validation?
   - They are provisional and must not escape until validated
   - It upgrades the stamp automatically
   - It makes the lock reentrant

3. When is an ordinary read lock simpler?
   - When invariants are complex or validation often fails
   - Only when there are no writers
   - Never

4. Which read path in your services could keep provisional values private until validation?
5. What metric would show that failed optimistic reads are making this slower than a normal read lock?

<details><summary>Answer key — attempt first</summary>

1. False. A write acquisition since the stamp invalidates the optimistic read.

2. They are provisional and must not escape until validated. The optimistic snapshot may be inconsistent and must remain discardable.

3. When invariants are complex or validation often fails. Frequent retries or complex consistency checks erase the optimistic path’s benefit.

</details>

## Sources

- [Java SE 24 StampedLock API](https://docs.oracle.com/en/java/javase/24/docs/api/java.base/java/util/concurrent/locks/StampedLock.html) — Java SE 24 API; checked 2026-10-20.
- [OpenJDK StampedLock source](https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/concurrent/locks/StampedLock.java) — Current source; checked 2026-10-20.
