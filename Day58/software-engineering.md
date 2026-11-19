# await releases the lock so the signaler can enter—sleep does not

Software engineering · Day58 · 15 minutes

Use a Java Condition when a thread must wait for state while allowing another thread to acquire the same lock and make that state true.

## Recall (2 minutes)

<p><a href="../Day38/software-engineering.html">Day38: Release the read lock before asking to write</a></p><p>Thread A holds readLock and calls writeLock.tryLock(). Expected result?</p><details><summary>Recall first, then reveal the refresher</summary><p>It fails; read-to-write upgrade is unsupported. A reader cannot upgrade to writer.</p></details><p><a href="../Day10/software-engineering.html">Day10: Stop calling a failing service, then try one small probe</a></p><p>After three failures open this breaker, what happens to a fourth immediate call?</p><details><summary>Recall first, then reveal the refresher</summary><p>It is blocked without reaching the service. Open means the local breaker rejects the call. It avoids another remote wait, but it cannot turn a failed operation into a success.</p></details>

## Understand (4 minutes)

A customer waiting inside a one-person fitting room blocks the employee who needs to bring the right size. Waiting outside frees the room.

A thread calling Condition.await() while holding the associated lock atomically releases that lock and suspends. Another thread can acquire the lock, change the guarded state, and call signal(). Before await() returns, the waiter re-acquires the lock. By contrast, Thread.sleep() does not release a held lock.

Always test the state in a while loop. A wake-up can be spurious, another waiter can consume the state, or the condition can change before this thread re-acquires the lock.



Worker r58 needs ready=true. It locks, sees false, and awaits. The signaler enters the released lock, sets true, signals, and unlocks. Only then does r58 re-acquire and continue.



## Read the visual

The lock token visibly moves from the waiter to the signaler during await, then back to the waiter before it resumes.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a Condition when threads coordinate around a specific predicate protected by one lock.

**Practical example.** A Java metadata cache waits until a tenant snapshot is loaded while the loader must acquire the same lock to publish it.

**How to decide.** Prefer higher-level queues, futures, or latches when they express the protocol directly. Use Condition for a genuine guarded-state protocol, with timeouts and interruption policy where needed.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
java.util.concurrent.locks.ReentrantLock lock=new java.util.concurrent.locks.ReentrantLock(); var ready=lock.newCondition(); var waiting=new java.util.concurrent.CountDownLatch(1); var state=new java.util.concurrent.atomic.AtomicBoolean(false); var observed=new java.util.concurrent.atomic.AtomicBoolean(false);
Thread worker=Thread.ofPlatform().start(() -> { lock.lock(); try { waiting.countDown(); while(!state.get()) ready.await(); observed.set(true); } catch(InterruptedException e){ Thread.currentThread().interrupt(); } finally { lock.unlock(); } });
waiting.await(); lock.lock(); boolean signalerEntered=true; try { state.set(true); ready.signal(); } finally { lock.unlock(); } worker.join();
String result="signalerEntered="+signalerEntered+", waiterObserved="+observed.get();
```

1. Create one guarded predicate and a condition bound to its lock.

   Changed values: `{"ready": "java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject@35d019a3", "waiting": "java.util.concurrent.CountDownLatch@689604d9[Count = 1]", "state": "false", "observed": "false"}`

2. The worker awaits in a loop; await releases the lock.

   Changed values: `{}`

3. The signaler acquires the released lock, publishes state, and signals.

   Changed values: `{"waiting": "java.util.concurrent.CountDownLatch@689604d9[Count = 0]", "state": "true", "observed": "true", "signalerEntered": "true"}`

4. Confirm both threads completed the guarded-state handoff.

   Changed values: `{"result": "signalerEntered=true, waiterObserved=true"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java run uses one waiter, one signaler, and one predicate. The browser model is illustrative. Neither covers multiple conditions, fairness, missed signals caused by broken protocol, timeout budgeting, interruption recovery, virtual-thread scheduling, or distributed coordination.

## Explore (remaining exploration time)

Switch the waiter between await and sleeping while holding the lock. Predict whether the signaler can publish ready.

Open software-engineering.html for the executable model.

Model limits: The Java run uses one waiter, one signaler, and one predicate. The browser model is illustrative. Neither covers multiple conditions, fairness, missed signals caused by broken protocol, timeout budgeting, interruption recovery, virtual-thread scheduling, or distributed coordination.

## Quiz (4 minutes)

1. r58 calls await while holding the associated lock. What happens?
   - The lock is released while r58 waits, then re-acquired before await returns
   - The lock stays held
   - The condition becomes true automatically

2. Why test ready in a while loop after wake-up?
   - Wake-up does not itself prove the predicate is still true for this waiter
   - Java forbids if statements
   - Signal always wakes every thread

3. When is Condition probably too low-level?
   - A BlockingQueue or future already expresses the handoff
   - The state is protected by a lock
   - A thread can be interrupted

4. Which guarded predicate in your Java services is currently represented by polling or sleep?
5. Could a queue, future, or latch express that protocol more simply than Condition?

<details><summary>Answer key — attempt first</summary>

1. The lock is released while r58 waits, then re-acquired before await returns. Await makes room for the state-changing thread.

2. Wake-up does not itself prove the predicate is still true for this waiter. The predicate, not the signal, is the permission to continue.

3. A BlockingQueue or future already expresses the handoff. Use the clearest correct coordination primitive.

</details>

## Sources

- [Java SE 25 Condition API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/Condition.html) — Official Oracle API; checked November 18, 2026; checked 2026-11-18.
- [Java SE 25 Lock API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/Lock.html) — Official Oracle API; checked November 18, 2026; checked 2026-11-18.
