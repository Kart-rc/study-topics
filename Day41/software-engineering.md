# Take completed results in finish order, not submission order

Software engineering · Day41 · 15 minutes

Use ExecutorCompletionService when early completed work should be consumed without waiting behind an earlier slow task.

## Recall (2 minutes)

<p><a href="../Day24/software-engineering.html">Day24: An interrupt is a stop request—do not erase it</a></p><p>What happens to interrupt status when sleep throws InterruptedException?</p><details><summary>Recall first, then reveal the refresher</summary><p>It is cleared. The blocking method clears status when it throws.</p></details><p><a href="../Day28/software-engineering.html">Day28: Two workers wait for children that cannot start</a></p><p>Why can the children not run?</p><details><summary>Recall first, then reveal the refresher</summary><p>All workers are occupied by waiting parents. The children need the same workers that their parents refuse to release.</p></details>

## Understand (4 minutes)

Three restaurant orders were placed A, B, C. B is ready first. Waiting at the counter for A before collecting B lets hot food go cold.

Keeping a list of Futures and calling get() in submission order can block behind slow A even when B and C are done. ExecutorCompletionService places each completed future onto a completion queue. take() returns the next finished task.



A takes 120 ms, B takes 20 ms, and C takes 60 ms. Submission-order reads produce A, B, C after A finishes. Completion-order reads produce B, C, A and let downstream processing start earlier.



## Read the visual

The timeline sorts the same named tasks by finish time, then contrasts that order with the blocked submission-order reader.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use completion order for independent fan-out calls whose results can be processed as each finishes.

**Practical example.** Query three independent shard summaries and stream each ready result into an aggregation buffer.

**How to decide.** Keep submission order when output order is contractual. Use invokeAny for the first acceptable result, or structured-concurrency primitives when cancellation and task lifetime need a stronger scope.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var pool=java.util.concurrent.Executors.newFixedThreadPool(3); var cs=new java.util.concurrent.ExecutorCompletionService<String>(pool);
cs.submit(() -> {Thread.sleep(120); return "A";}); cs.submit(() -> {Thread.sleep(20); return "B";}); cs.submit(() -> {Thread.sleep(60); return "C";});
String first=cs.take().get(); String second=cs.take().get(); String third=cs.take().get();
String order=first+second+third; pool.shutdownNow();
```

1. Wrap an executor with a completion queue.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@6ef888f6[Running, pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0]", "cs": "java.util.concurrent.ExecutorCompletionService@10e92f8f"}`

2. Submit three independent tasks in A, B, C order.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@6ef888f6[Running, pool size = 3, active threads = 3, queued tasks = 0, completed tasks = 0]"}`

3. Take futures in actual completion order.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@6ef888f6[Running, pool size = 3, active threads = 0, queued tasks = 0, completed tasks = 3]", "first": "B", "second": "C", "third": "A"}`

4. The observed order is B, C, A.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@6ef888f6[Shutting down, pool size = 3, active threads = 0, queued tasks = 0, completed tasks = 3]", "order": "BCA"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java replay uses three sleeping tasks and a fixed pool. It does not measure scheduler precision, exceptions, timeouts, cancellation, bounded completion queues, structured concurrency, downstream ordering, or production latency.

## Explore (remaining exploration time)

Change task durations and compare submission-order blocking with the completion queue's visible order.

Open software-engineering.html for the executable model.

Model limits: The Java replay uses three sleeping tasks and a fixed pool. It does not measure scheduler precision, exceptions, timeouts, cancellation, bounded completion queues, structured concurrency, downstream ordering, or production latency.

## Quiz (4 minutes)

1. A is slow while B is complete. What can completionService.take() return?
   - B's future
   - Only A because it was submitted first
   - null in all cases

2. Why not always consume completion order?
   - Some contracts require original ordering
   - It uses no executor
   - It hides exceptions automatically

3. What still needs explicit handling?
   - Exceptions, timeout and cancellation policy
   - How to create threads at all
   - Whether Future has get

4. Which fan-out paths wait on futures in creation order today?
5. Where must output ordering remain stable even if work completes out of order?

<details><summary>Answer key — attempt first</summary>

1. B's future. Completed futures enter a separate completion queue.

2. Some contracts require original ordering. Finish order is wrong when consumer-visible ordering matters.

3. Exceptions, timeout and cancellation policy. Completion order does not define failure or lifetime policy.

</details>

## Sources

- [Java 26 ExecutorCompletionService](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ExecutorCompletionService.html) — Official Java API; checked October 31, 2026; checked 2026-10-31.
- [Java 17 CompletionService](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/CompletionService.html) — Official Java API; checked October 31, 2026; checked 2026-10-31.
