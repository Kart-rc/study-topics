# Release the read lock before asking to write

Software engineering · Day38 · 15 minutes

Avoid a read-to-write upgrade that cannot succeed; release, acquire the write lock, then recheck the condition.

## Recall (2 minutes)

<p><a href="../Day28/software-engineering.html">Day28: Two workers wait for children that cannot start</a></p><p>Why can the children not run?</p><details><summary>Recall first, then reveal the refresher</summary><p>All workers are occupied by waiting parents. The children need the same workers that their parents refuse to release.</p></details><p><a href="../Day16/software-engineering.html">Day16: Both saw a safe world: snapshot-isolation write skew</a></p><p>Under the toy Repeatable Read run, what is the final schedule?</p><details><summary>Recall first, then reveal the refresher</summary><p>Both doctors are off call. Each transaction changes a different row, so the shared invariant can fail.</p></details>

## Understand (4 minutes)

You are reading a library book at a shared table. You cannot reserve the whole table while still claiming only a reader's seat, because other readers may be doing the same thing.

With Java's ReentrantReadWriteLock, a writer may acquire the read lock and downgrade safely. A reader cannot upgrade to the write lock. Release the read lock, acquire the write lock, and recheck because another writer may have changed the state in between.



Thread A reads configuration version 7 and decides it is stale. tryLock() on the write lock returns false while A holds the read lock. A releases read, takes write, then checks the version again before publishing version 8.



## Read the visual

The lock-state sequence answers why an upgrade stalls and where another writer can intervene. The version slider makes the recheck necessary instead of ceremonial.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a read-write lock when reads are frequent, writes are shorter and less frequent, and measurement shows concurrent readers help.

**Practical example.** Many request threads read a routing snapshot while one refresh thread occasionally replaces it.

**How to decide.** Prefer an immutable snapshot or simpler mutex unless profiling justifies the extra policy. Never design a read-to-write upgrade; release, acquire write, and revalidate.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var lock = new java.util.concurrent.locks.ReentrantReadWriteLock();
lock.readLock().lock(); boolean upgraded = lock.writeLock().tryLock();
lock.readLock().unlock(); boolean acquiredAfterRelease = lock.writeLock().tryLock();
String outcome = acquiredAfterRelease ? "release-read-then-recheck" : "blocked"; lock.writeLock().unlock();
```

1. Create one read-write lock.

   Changed values: `{"lock": "java.util.concurrent.locks.ReentrantReadWriteLock@45dd4eda[Write locks = 0, Read locks = 0]"}`

2. The current thread holds read; the write upgrade fails.

   Changed values: `{"lock": "java.util.concurrent.locks.ReentrantReadWriteLock@45dd4eda[Write locks = 0, Read locks = 1]", "upgraded": "false"}`

3. Release read, then acquire write.

   Changed values: `{"lock": "java.util.concurrent.locks.ReentrantReadWriteLock@45dd4eda[Write locks = 1, Read locks = 0]", "acquiredAfterRelease": "true"}`

4. Record the safe pattern and release write.

   Changed values: `{"lock": "java.util.concurrent.locks.ReentrantReadWriteLock@45dd4eda[Write locks = 0, Read locks = 0]", "outcome": "release-read-then-recheck"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java replay uses one thread and tryLock; it proves the documented upgrade result in this runtime, not fairness, contention throughput, starvation, scheduler order, memory costs, or application correctness.

## Explore (remaining exploration time)

Toggle whether the reader releases before requesting write. Watch the lock state and the mandatory recheck.

Open software-engineering.html for the executable model.

Model limits: The Java replay uses one thread and tryLock; it proves the documented upgrade result in this runtime, not fairness, contention throughput, starvation, scheduler order, memory costs, or application correctness.

## Quiz (4 minutes)

1. Thread A holds readLock and calls writeLock.tryLock(). Expected result?
   - It fails; read-to-write upgrade is unsupported
   - It always succeeds
   - It silently drops the read lock

2. Why recheck after releasing read and acquiring write?
   - Another writer may have changed the protected state in the gap
   - The JVM forgets the key
   - Read locks do not see memory

3. When should you prefer a simple mutex?
   - Profiling does not show enough read concurrency to justify the policy complexity
   - There are multiple readers
   - The data is immutable

4. Where does your code attempt a lock upgrade or perform I/O while holding a write lock?
5. Could an immutable snapshot remove the lock from the read path?

<details><summary>Answer key — attempt first</summary>

1. It fails; read-to-write upgrade is unsupported. A reader cannot upgrade to writer.

2. Another writer may have changed the protected state in the gap. The condition that justified writing may no longer hold.

3. Profiling does not show enough read concurrency to justify the policy complexity. Read-write locks are a measured optimization, not a default.

</details>

## Sources

- [Java 17 ReentrantReadWriteLock](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/locks/ReentrantReadWriteLock.html) — Official Java API; checked October 28, 2026; checked 2026-10-28.
- [Java 17 ReadWriteLock](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/locks/ReadWriteLock.html) — Official Java API; checked October 28, 2026; checked 2026-10-28.
