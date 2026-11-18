# Interrupt the lock wait before the request owns the lock

Software engineering · Day57 · 15 minutes

Let cancellation stop a Java request that is blocked waiting for a lock, without running protected work or unlocking a lock it never acquired.

## Recall (2 minutes)

<p><a href="../Day32/software-engineering.html">Day32: Readers keep a snapshot; writers pay for a copy</a></p><p>An iterator exists before fraud is added. What does it see?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only billing and audit. The iterator keeps its creation-time array snapshot.</p></details><p><a href="../Day36/software-engineering.html">Day36: A CompletableFuture timeout can end waiting while work keeps running</a></p><p>Caller times out at 500 ms; worker ignores cancellation. What follows?</p><details><summary>Recall first, then reveal the refresher</summary><p>The caller stops waiting while work may continue. Timeout and work termination are different events.</p></details>

## Understand (4 minutes)

A customer waiting outside a closed service desk should be able to leave when their ride arrives. They should not have to enter the desk, receive a ticket, and then leave.

ReentrantLock.lockInterruptibly() waits for the lock unless the thread is interrupted. If interruption wins, it throws InterruptedException and the thread never owns the lock. That makes cancellation useful while waiting. Keep ownership explicit: unlock only after acquisition, normally in finally. Plain lock() does not abort its wait because of interruption.



The main thread holds the account lock. Request r57 waits. Its deadline expires, so the service interrupts it before releasing the lock. With lockInterruptibly(), r57 reports interrupted-before-owning and never enters the protected section.



## Read the visual

A lock-ownership timeline separates waiting, interruption, ownership, and protected work so the unlock boundary is visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use interruptible lock acquisition when queued work has deadlines, cancellation, or shutdown signals and waiting after cancellation wastes capacity.

**Practical example.** A Java metadata service serializes one tenant’s catalog mutation while HTTP request cancellation should abandon a waiter that no longer has a client.

**How to decide.** Use it only when the caller has a meaningful interrupt policy and cleanup path. For bounded waits, consider timed tryLock. For short uncontended critical sections without cancellation, plain lock may be simpler.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
java.util.concurrent.locks.ReentrantLock lock=new java.util.concurrent.locks.ReentrantLock(); java.util.concurrent.CountDownLatch waiting=new java.util.concurrent.CountDownLatch(1); java.util.concurrent.atomic.AtomicBoolean entered=new java.util.concurrent.atomic.AtomicBoolean(false); java.util.concurrent.atomic.AtomicReference<String> outcome=new java.util.concurrent.atomic.AtomicReference<>("waiting"); lock.lock();
Thread worker=Thread.ofPlatform().start(() -> { waiting.countDown(); try { lock.lockInterruptibly(); try { entered.set(true); } finally { lock.unlock(); } } catch(InterruptedException e) { outcome.set("interrupted-before-owning"); } });
waiting.await(); while(worker.getState()!=Thread.State.WAITING){ Thread.onSpinWait(); } worker.interrupt(); worker.join(); lock.unlock();
String result="outcome="+outcome.get()+", entered="+entered.get();
```

1. Let the main thread own the lock and create observable worker state.

   Changed values: `{}`

2. Start r57 and wait interruptibly for the held lock.

   Changed values: `{}`

3. Wait until r57 is actually blocked on the held lock, cancel it, prove it exits, then release the holder.

   Changed values: `{}`

4. Prove the cancelled request never entered the critical section.

   Changed values: `{"result": "outcome=interrupted-before-owning, entered=false"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java example uses one real waiting thread and one interrupt. The browser is a teaching state machine. Neither models fairness, spurious application cancellation, nested locks, virtual-thread pinning, distributed locks, transaction rollback, HTTP disconnect propagation, or production scheduler races.

## Explore (remaining exploration time)

Switch between interruptible and plain waiting. Predict whether the cancelled request enters after the holder releases.

Open software-engineering.html for the executable model.

Model limits: The Java example uses one real waiting thread and one interrupt. The browser is a teaching state machine. Neither models fairness, spurious application cancellation, nested locks, virtual-thread pinning, distributed locks, transaction rollback, HTTP disconnect propagation, or production scheduler races.

## Quiz (4 minutes)

1. r57 is interrupted while another thread owns the lock. What happens with lockInterruptibly?
   - InterruptedException is thrown before r57 owns the lock
   - r57 immediately owns the lock
   - The holder is interrupted

2. Why guard unlock with an acquired flag or a post-acquisition try/finally?
   - A thread must not unlock a lock it never acquired
   - It makes the lock fair
   - It converts the lock into a semaphore

3. What remains outside this guarantee?
   - Whether external effects already started elsewhere can be cancelled
   - Whether interruption aborts the lock wait
   - Whether the method can throw

4. Which Java request path should stop waiting when its client or deadline is gone?
5. How will the code prove ownership before unlocking or starting side effects?

<details><summary>Answer key — attempt first</summary>

1. InterruptedException is thrown before r57 owns the lock. The wait is an explicit interruption point.

2. A thread must not unlock a lock it never acquired. Cancellation may exit before ownership begins.

3. Whether external effects already started elsewhere can be cancelled. Interrupting a local waiter does not roll back external systems.

</details>

## Sources

- [Java SE 25: ReentrantLock](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html) — Oracle Java API specification; checked November 17, 2026; checked 2026-11-17.
