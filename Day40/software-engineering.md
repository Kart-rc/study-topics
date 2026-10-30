# Cancelled scheduled tasks can stay in the queue for hours

Software engineering · Day40 · 15 minutes

Remove cancelled delayed tasks promptly when retaining them would turn churn into a memory problem.

## Recall (2 minutes)

<p><a href="../Day29/software-engineering.html">Day29: The urgent thread waits while ordinary work runs</a></p><p>Who causes H to wait directly?</p><details><summary>Recall first, then reveal the refresher</summary><p>L, because L owns the lock. H blocks on the lock held by L.</p></details><p><a href="../Day1/software-engineering.html">Day1: When retries multiply an outage</a></p><p>Four layers each allow two total attempts. Worst-case leaf calls?</p><details><summary>Recall first, then reveal the refresher</summary><p>16. The nested multiplication is 2⁴ = 16.</p></details>

## Understand (4 minutes)

Canceling a hotel reservation should free the room card from the front desk's future-arrivals tray. A crossed-out card left there for six months still occupies space.

By default, a cancelled task in ScheduledThreadPoolExecutor can remain in its work queue until its delay elapses. The task will not run, but its queue node—and objects reachable from it—can remain retained. setRemoveOnCancelPolicy(true) removes a task from the queue when cancellation succeeds.



A service schedules three one-hour retry timers, then cancels all three when the request completes. Default policy: queue size remains 3. Remove-on-cancel policy: queue size becomes 0 immediately.



## Read the visual

The queue is the mechanism: cancellation crosses out tasks, while the policy decides whether their nodes remain. The count changes directly rather than showing a generic thread diagram.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Enable prompt removal when a long-lived scheduler creates and cancels many long-delay tasks, and retention is more costly than post-cancel inspection.

**Practical example.** Each API request schedules a 24-hour expiry task but usually cancels it after a two-second successful response.

**How to decide.** Measure cancellation churn and retained heap first. If delayed tasks are few or inspection matters, the default may be acceptable. Also bound captured task state; policy does not make an unbounded live schedule safe.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var kept = new java.util.concurrent.ScheduledThreadPoolExecutor(1); var a = new java.util.ArrayList<java.util.concurrent.ScheduledFuture<?>>();
for (int i=0;i<3;i++) a.add(kept.schedule(() -> {}, 1, java.util.concurrent.TimeUnit.HOURS)); for (var f:a) f.cancel(false); int defaultQueue = kept.getQueue().size();
var removed = new java.util.concurrent.ScheduledThreadPoolExecutor(1); removed.setRemoveOnCancelPolicy(true); var b = new java.util.ArrayList<java.util.concurrent.ScheduledFuture<?>>();
for (int i=0;i<3;i++) b.add(removed.schedule(() -> {}, 1, java.util.concurrent.TimeUnit.HOURS)); for (var f:b) f.cancel(false); int removeQueue = removed.getQueue().size(); kept.shutdownNow(); removed.shutdownNow();
```

1. Create the default scheduler and a place to keep handles.

   Changed values: `{"kept": "java.util.concurrent.ScheduledThreadPoolExecutor@795cd85e[Running, pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0]", "a": "[]"}`

2. Cancel three long-delay tasks; their queue nodes remain by default.

   Changed values: `{"kept": "java.util.concurrent.ScheduledThreadPoolExecutor@795cd85e[Running, pool size = 1, active threads = 0, queued tasks = 3, completed tasks = 0]", "a": "[java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask@32eff876[Cancelled], java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask@8dbdac1[Cancelled], java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask@6e20b53a[Cancelled]]", "defaultQueue": "3"}`

3. Create a scheduler that removes successfully cancelled tasks.

   Changed values: `{"removed": "java.util.concurrent.ScheduledThreadPoolExecutor@71809907[Running, pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0]", "b": "[]"}`

4. The second queue becomes empty immediately.

   Changed values: `{"kept": "java.util.concurrent.ScheduledThreadPoolExecutor@795cd85e[Shutting down, pool size = 1, active threads = 0, queued tasks = 0, completed tasks = 0]", "removed": "java.util.concurrent.ScheduledThreadPoolExecutor@71809907[Terminated, pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0]", "b": "[java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask@158da8e[Cancelled], java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask@74e52303[Cancelled], java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask@47af7f3d[Cancelled]]", "removeQueue": "0"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java replay uses three tasks with one-hour delays and inspects queue size immediately. It does not measure retained bytes, GC roots, race timing, executor shutdown policies, periodic tasks, production throughput, or every JDK implementation.

## Explore (remaining exploration time)

Change the number of one-hour timers and cancel them. Compare the queue under the default and remove-on-cancel policies.

Open software-engineering.html for the executable model.

Model limits: The Java replay uses three tasks with one-hour delays and inspects queue size immediately. It does not measure retained bytes, GC roots, race timing, executor shutdown policies, periodic tasks, production throughput, or every JDK implementation.

## Quiz (4 minutes)

1. A one-day task is cancelled under the default policy. Can its queue node remain?
   - Yes, until the delay elapses
   - No, cancellation always removes it immediately
   - Only if it already ran

2. Why enable remove-on-cancel?
   - To reduce retention from cancelled delayed tasks
   - To make tasks execute twice
   - To increase maximumPoolSize

3. What limit remains after enabling it?
   - Live scheduled tasks can still grow without bound
   - All periodic tasks overlap
   - Cancellation becomes transactional

4. Which services create the most long-delay timers and how often are they cancelled?
5. What heap or queue metric would prove retention is operationally meaningful?

<details><summary>Answer key — attempt first</summary>

1. Yes, until the delay elapses. Default cancellation prevents execution but does not guarantee prompt queue removal.

2. To reduce retention from cancelled delayed tasks. Prompt removal releases queue nodes and reachable state sooner.

3. Live scheduled tasks can still grow without bound. The policy only changes cancelled-task removal.

</details>

## Sources

- [Java 26 ScheduledThreadPoolExecutor](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ScheduledThreadPoolExecutor.html) — Official Java API; checked October 30, 2026; checked 2026-10-30.
- [Java 17 ScheduledThreadPoolExecutor](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ScheduledThreadPoolExecutor.html) — Official Java API; checked October 30, 2026; checked 2026-10-30.
