# When the pool is full, CallerRunsPolicy makes the producer do the work

Software engineering · Day43 · 15 minutes

Use a bounded executor rejection policy as visible backpressure without confusing it with guaranteed admission or safe latency.

## Recall (2 minutes)

<p><a href="../Day25/software-engineering.html">Day25: One lock order breaks the deadlock cycle</a></p><p>T1 holds 7 and waits for 9; T2 holds 9 and waits for 7. What exists?</p><details><summary>Recall first, then reveal the refresher</summary><p>A wait-for cycle. Each transaction waits for a resource held by the other.</p></details><p><a href="../Day29/software-engineering.html">Day29: The urgent thread waits while ordinary work runs</a></p><p>Who causes H to wait directly?</p><details><summary>Recall first, then reveal the refresher</summary><p>L, because L owns the lock. H blocks on the lock held by L.</p></details>

## Understand (4 minutes)

A small kitchen has one cook and one waiting shelf. When both are occupied, the cashier cooks the next order instead of accepting more tickets. The cashier slows down, so new orders arrive less quickly.

A bounded ThreadPoolExecutor rejects when its workers and queue are full. CallerRunsPolicy runs that task on the thread that called execute, unless the executor is shut down. This feedback slows that producer.



One worker runs task A and one queue slot holds task B. The request thread submits task C. C cannot enter the pool, so the request thread runs C synchronously. That is backpressure, but it can be dangerous if the caller is an event loop, holds a lock, or has a tight latency budget.



## Read the visual

The visual shows the third task moving back to the submitting thread only after the worker and queue are both occupied.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this policy when work must not disappear, the producer is allowed to slow down, and a bounded queue protects memory.

**Practical example.** A batch coordinator submits CPU work to a small pool and can safely spend time completing overflow work itself.

**How to decide.** Prefer explicit rejection or upstream rate limiting when the caller must stay responsive. Never use CallerRunsPolicy blindly on event-loop, UI, or lock-holding threads; after shutdown it discards instead of running.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var gate=new java.util.concurrent.CountDownLatch(1); var ranBy=new java.util.concurrent.atomic.AtomicReference<String>("not-run");
var pool=new java.util.concurrent.ThreadPoolExecutor(1,1,0L,java.util.concurrent.TimeUnit.MILLISECONDS,new java.util.concurrent.ArrayBlockingQueue<Runnable>(1),new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy()); pool.execute(() -> {try{gate.await();}catch(InterruptedException e){Thread.currentThread().interrupt();}}); Thread.sleep(50);
pool.execute(() -> {}); String caller=Thread.currentThread().getName();
pool.execute(() -> ranBy.set(Thread.currentThread().getName())); boolean backpressure=caller.equals(ranBy.get()); gate.countDown(); pool.shutdown(); pool.awaitTermination(2,java.util.concurrent.TimeUnit.SECONDS);
```

1. Create a gate for the worker and a place to record the overflow thread.

   Changed values: `{"gate": "java.util.concurrent.CountDownLatch@7e0b85f9[Count = 1]", "ranBy": "not-run"}`

2. Occupy the only worker.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@1725dc0f[Running, pool size = 1, active threads = 1, queued tasks = 0, completed tasks = 0]"}`

3. Fill the only queue slot and record the submitting thread.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@1725dc0f[Running, pool size = 1, active threads = 1, queued tasks = 1, completed tasks = 0]", "caller": "main"}`

4. The overflow task runs on the caller, then the pool drains.

   Changed values: `{"gate": "java.util.concurrent.CountDownLatch@7e0b85f9[Count = 0]", "ranBy": "main", "pool": "java.util.concurrent.ThreadPoolExecutor@1725dc0f[Terminated, pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 2]", "backpressure": "true"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java replay executes a real bounded executor and observes the overflow task's thread. The browser model simplifies timing and does not cover fairness, exceptions, cancellation, queue wait, nested dependencies, shutdown races, or production sizing.

## Explore (remaining exploration time)

Fill the worker and queue, then switch the caller type. Predict whether task C slows a safe batch producer or blocks a latency-sensitive event loop.

Open software-engineering.html for the executable model.

Model limits: The Java replay executes a real bounded executor and observes the overflow task's thread. The browser model simplifies timing and does not cover fairness, exceptions, cancellation, queue wait, nested dependencies, shutdown races, or production sizing.

## Quiz (4 minutes)

1. The worker and bounded queue are full. Who runs the next task with CallerRunsPolicy?
   - The thread calling execute
   - A new unbounded worker
   - No thread; it always throws

2. Why can this create backpressure?
   - The producer spends time doing work instead of submitting more
   - The queue becomes unbounded
   - It increases maximumPoolSize

3. Which caller makes this policy especially risky?
   - A single-threaded event loop
   - A batch producer allowed to slow
   - A dedicated bulk loader with a latency budget

4. Which producers in your platform are allowed to slow down by running overflow work?
5. What metric distinguishes healthy backpressure from an event-loop or request-thread incident?

<details><summary>Answer key — attempt first</summary>

1. The thread calling execute. The caller executes the rejected task while the executor is running.

2. The producer spends time doing work instead of submitting more. Synchronous overflow work reduces that caller's submission rate.

3. A single-threaded event loop. Blocking the event loop delays unrelated work and can amplify the incident.

</details>

## Sources

- [Java 26 ThreadPoolExecutor API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html) — Official Java API; checked November 2, 2026; checked 2026-11-02.
- [Java 26 CallerRunsPolicy API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.CallerRunsPolicy.html) — Official Java API; checked November 2, 2026; checked 2026-11-02.
