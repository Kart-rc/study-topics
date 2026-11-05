# A CountDownLatch counts arrivals—not successful results

Software engineering · Day45 · 15 minutes

Use a latch to wait for a fixed set of completions while tracking success and failure separately.

## Recall (2 minutes)

<p><a href="../Day26/software-engineering.html">Day26: A savepoint can undo the optional step—not the whole order</a></p><p>After an optional PostgreSQL statement errors, what enables the transaction to continue?</p><details><summary>Recall first, then reveal the refresher</summary><p>ROLLBACK TO the earlier savepoint. Rolling back to the savepoint restores the transaction state before the optional step.</p></details><p><a href="../Day30/software-engineering.html">Day30: Read quickly, then validate: StampedLock optimistic reads</a></p><p>A writer acquires the write lock after the optimistic stamp. What does validate return?</p><details><summary>Recall first, then reveal the refresher</summary><p>False. A write acquisition since the stamp invalidates the optimistic read.</p></details>

## Understand (4 minutes)

Three movers must report back before the truck leaves. The dispatcher can count three reports, but that count does not say all three deliveries succeeded.

A CountDownLatch releases waiters when its count reaches zero. Calling countDown() in finally prevents a failed worker from trapping the coordinator forever. The latch records arrival only; a separate result or exception record decides success.



Shard A warms successfully. Shard B fails authentication. Shard C warms successfully. All three workers count down, so await returns. Startup must still remain blocked because B is FAILED. Also, the latch is one-shot; it cannot be reset for the next refresh cycle.



## Read the visual

The latch count reaches zero in a separate column from the success verdict, making the central trap visible: completion and correctness are different facts.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a CountDownLatch when a known, fixed number of one-time operations must all finish before a coordinator proceeds.

**Practical example.** A Java service waits for three independent cache warmers to report completion before evaluating readiness.

**How to decide.** Use a latch only for one-shot arrival. Store outcomes separately, use a timeout, and choose CyclicBarrier/Phaser or structured task coordination when participants repeat or change.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var latch = new java.util.concurrent.CountDownLatch(3); int remaining = 3; String shardA = "PENDING"; String shardB = "PENDING"; String shardC = "PENDING";
shardA = "READY"; latch.countDown(); remaining = (int) latch.getCount();
shardB = "FAILED"; latch.countDown(); remaining = (int) latch.getCount();
shardC = "READY"; latch.countDown(); remaining = (int) latch.getCount();
boolean allArrived = latch.await(1, java.util.concurrent.TimeUnit.MILLISECONDS); boolean startupAllowed = allArrived && shardA.equals("READY") && shardB.equals("READY") && shardC.equals("READY");
```

1. Create a real Java latch for three one-time completions.

   Changed values: `{"latch": "java.util.concurrent.CountDownLatch@75329a49[Count = 3]", "remaining": "3", "shardA": "PENDING", "shardB": "PENDING", "shardC": "PENDING"}`

2. Shard A succeeds and reports completion; two reports remain.

   Changed values: `{"latch": "java.util.concurrent.CountDownLatch@75329a49[Count = 2]", "remaining": "2", "shardA": "READY"}`

3. Shard B fails but still reports completion from its finally block.

   Changed values: `{"latch": "java.util.concurrent.CountDownLatch@75329a49[Count = 1]", "remaining": "1", "shardB": "FAILED"}`

4. The last report opens the latch even though one outcome is failed.

   Changed values: `{"latch": "java.util.concurrent.CountDownLatch@75329a49[Count = 0]", "remaining": "0", "shardC": "READY"}`

5. Await proves arrival. Readiness also checks every outcome.

   Changed values: `{"allArrived": "true", "startupAllowed": "false"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser model is sequential and deterministic. It does not create threads, model memory visibility beyond the API guarantee, interrupts, executor rejection, late workers, retries, cancellation, repeated phases, or production readiness checks.

## Explore (remaining exploration time)

Change shard B from failed to ready and change the number of reports. Watch the gate and the readiness decision remain separate.

Open software-engineering.html for the executable model.

Model limits: The browser model is sequential and deterministic. It does not create threads, model memory visibility beyond the API guarantee, interrupts, executor rejection, late workers, retries, cancellation, repeated phases, or production readiness checks.

## Quiz (4 minutes)

1. All three workers call countDown, but one failed. What does await report?
   - The latch opened; success still needs separate evidence
   - The failure keeps the latch above zero
   - The latch resets itself

2. Why put countDown in finally?
   - Every worker reports completion even when its work throws
   - It converts failure into success
   - It resets the latch

3. What is the boundary for a second warm-up cycle?
   - The latch is one-shot and cannot be reset
   - The count becomes three automatically
   - Calling await adds participants

4. Which one-time startup or migration gate in your services needs separate outcome tracking?
5. What repeated or dynamic workflow would make CountDownLatch the wrong primitive?

<details><summary>Answer key — attempt first</summary>

1. The latch opened; success still needs separate evidence. CountDownLatch tracks count, not the meaning of each completion.

2. Every worker reports completion even when its work throws. The coordinator should not wait forever merely because a worker ended exceptionally.

3. The latch is one-shot and cannot be reset. The Java API documents CountDownLatch as one-shot; use a reusable coordination primitive when phases repeat.

</details>

## Sources

- [Java SE 26 CountDownLatch](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/CountDownLatch.html) — Official Java API; checked November 4, 2026; checked 2026-11-04.
