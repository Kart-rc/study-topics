# One barrier timeout breaks the gate for every waiter

Software engineering · Day39 · 15 minutes

Handle CyclicBarrier's all-or-none breakage instead of assuming the remaining workers can continue normally.

## Recall (2 minutes)

<p><a href="../Day23/software-engineering.html">Day23: Silence raises suspicion; it does not prove a node is dead</a></p><p>Lowering the phi threshold does what?</p><details><summary>Recall first, then reveal the refresher</summary><p>Faster detection and more false suspicions. The policy fires on less evidence.</p></details><p><a href="../Day27/software-engineering.html">Day27: Retry a poison message three times—then quarantine it</a></p><p>Why cap retries?</p><details><summary>Recall first, then reveal the refresher</summary><p>To prevent one permanent failure from consuming work forever. Permanent failures need quarantine and repair, not infinite retries.</p></details>

## Understand (4 minutes)

Three runners must reach a starting gate before anyone begins lap two. If runner 3 never arrives, runner 1 eventually leaves. The gate is now broken for runner 2 as well.

Java's CyclicBarrier coordinates a fixed number of parties. If one waiter times out or is interrupted, the barrier enters a broken state and the other waiters receive BrokenBarrierException. Recovery needs a coordinated new phase, often a new barrier.



Shard workers A and B finish phase 1. Worker C is stuck. A's 100-ms wait expires. B does not proceed with a partial result; its wait fails because the same barrier is broken.



## Read the visual

The gate shows one generation, all three parties, and the exact timeout that changes the barrier from waiting to broken. The successful and failed paths use the same workers.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a barrier when a fixed set of peers must finish each repeated phase before any enters the next phase.

**Practical example.** Three in-memory simulation shards exchange boundary values after every iteration.

**How to decide.** Use CountDownLatch for a one-time completion signal, Phaser when parties change dynamically, or an external durable coordinator for distributed jobs. Never use an in-process barrier across machines.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var barrier = new java.util.concurrent.CyclicBarrier(3); var pool = java.util.concurrent.Executors.newFixedThreadPool(2);
var a = pool.submit(() -> { try { barrier.await(100, java.util.concurrent.TimeUnit.MILLISECONDS); return "passed"; } catch (java.util.concurrent.TimeoutException e) { return "timed-out"; } catch (Exception e) { return "other"; } });
var b = pool.submit(() -> { try { barrier.await(5, java.util.concurrent.TimeUnit.SECONDS); return "passed"; } catch (java.util.concurrent.BrokenBarrierException e) { return "broken"; } catch (Exception e) { return "other"; } });
String first = a.get(); String second = b.get(); boolean broken = barrier.isBroken(); pool.shutdownNow();
```

1. Create a three-party gate but only two worker threads.

   Changed values: `{"barrier": "java.util.concurrent.CyclicBarrier@479d31f3", "pool": "java.util.concurrent.ThreadPoolExecutor@40ef3420[Running, pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0]"}`

2. A waits briefly for the missing third party.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@40ef3420[Running, pool size = 1, active threads = 1, queued tasks = 0, completed tasks = 0]", "a": "java.util.concurrent.FutureTask@14dd9eb7[Not completed, task = Example$$Lambda$223/0x00007ff9e8154208@42e99e4a]"}`

3. B waits longer, but shares the same generation.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@40ef3420[Running, pool size = 2, active threads = 2, queued tasks = 0, completed tasks = 0]", "b": "java.util.concurrent.FutureTask@1a451d4d[Not completed, task = Example$$Lambda$224/0x00007ff9e8154430@62150f9e]"}`

4. A times out; B observes the broken barrier.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@40ef3420[Shutting down, pool size = 2, active threads = 0, queued tasks = 0, completed tasks = 2]", "a": "java.util.concurrent.FutureTask@14dd9eb7[Completed normally]", "b": "java.util.concurrent.FutureTask@1a451d4d[Completed normally]", "first": "timed-out", "second": "broken", "broken": "true"}`

[Full runnable example](examples/software-engineering.java).

Limits: The recorded Java example uses two waiting threads, one missing party, and a timeout. It does not prove scheduling order, fairness, distributed coordination, recovery correctness, interruption policy, or production timeout values.

## Explore (remaining exploration time)

Toggle whether worker C arrives. Watch all three pass together or the timeout break the phase for everyone.

Open software-engineering.html for the executable model.

Model limits: The recorded Java example uses two waiting threads, one missing party, and a timeout. It does not prove scheduling order, fairness, distributed coordination, recovery correctness, interruption policy, or production timeout values.

## Quiz (4 minutes)

1. A times out while B waits at a three-party barrier. What happens to B?
   - B receives BrokenBarrierException
   - B passes alone
   - B becomes the third party

2. Why not reset immediately from any worker?
   - Workers need another coordination rule to agree that the old generation is over
   - reset adds a party
   - reset guarantees C finished

3. When is Phaser a better fit?
   - Parties register and leave dynamically
   - Exactly one event must count down once
   - Work spans several machines

4. Which fixed-phase workflows could deadlock or continue on partial state today?
5. What rule creates a fresh generation after one worker fails?

<details><summary>Answer key — attempt first</summary>

1. B receives BrokenBarrierException. Barrier failure is all-or-none for the generation.

2. Workers need another coordination rule to agree that the old generation is over. Uncoordinated reset can mix generations.

3. Parties register and leave dynamically. Phaser supports changing party sets.

</details>

## Sources

- [Java 17 CyclicBarrier](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/CyclicBarrier.html) — Official Java API; checked October 29, 2026; checked 2026-10-29.
- [Java 17 Phaser](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Phaser.html) — Official Java API; checked October 29, 2026; checked 2026-10-29.
