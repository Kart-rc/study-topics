# CompletionService returns the fastest finished task—not the first submitted

Software engineering · Day59 · 15 minutes

Consume concurrent Java results in completion order without blocking behind a slow task submitted first.

## Recall (2 minutes)

<p><a href="../Day33/software-engineering.html">Day33: A pooled thread remembers the last tenant unless you clean it</a></p><p>Request A sets east and omits cleanup. Request B runs on the same worker without setting a value. What can get() return?</p><details><summary>Recall first, then reveal the refresher</summary><p>east. The value belongs to the reused worker thread.</p></details><p><a href="../Day37/software-engineering.html">Day37: computeIfAbsent is atomic; the loader must still be short</a></p><p>The mapping function calls a remote service for 800 ms. Main risk?</p><details><summary>Recall first, then reveal the refresher</summary><p>Other attempted updates may block while the atomic computation runs. Atomicity does not make slow work cheap.</p></details>

## Understand (4 minutes)

Three cooks receive tickets in order A, B, C. C finishes first. Reading the ticket stack in submission order makes everyone wait for A; reading the pickup shelf uses work as it finishes.

ExecutorCompletionService runs tasks on an executor and places each completed Future on a completion queue. take() waits for the next completed task. It does not promise submission order. Keep the returned futures if you may need cancellation.



Requests A, B, and C sleep for 90, 40, and 10 milliseconds. They are submitted A then B then C. The completion queue yields C, B, A.



## Read the visual

Submission tickets remain A-B-C while a separate completion shelf visibly fills C-B-A.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a completion service when many independent calls may finish out of order and results can be processed immediately.

**Practical example.** A Java metadata fan-out queries three regions and streams each completed inventory result to an aggregator.

**How to decide.** Use invokeAll when submission-order results and all-task completion are clearer. Use structured concurrency when your supported JDK and lifecycle policy fit; JDK 25's API remains preview.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var pool=java.util.concurrent.Executors.newFixedThreadPool(3); var cs=new java.util.concurrent.ExecutorCompletionService<String>(pool);
cs.submit(() -> {Thread.sleep(90); return "A";}); cs.submit(() -> {Thread.sleep(40); return "B";}); cs.submit(() -> {Thread.sleep(10); return "C";});
var order=new java.util.ArrayList<String>(); for(int i=0;i<3;i++) order.add(cs.take().get());
pool.shutdown(); String result=String.join(",",order);
```

1. Create an executor and its completion queue.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@5c5eefef[Running, pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 0]", "cs": "java.util.concurrent.ExecutorCompletionService@72d1ad2e"}`

2. Submit slow A, medium B, and fast C in that order.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@5c5eefef[Running, pool size = 3, active threads = 3, queued tasks = 0, completed tasks = 0]"}`

3. Take completed futures as they arrive.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@5c5eefef[Running, pool size = 3, active threads = 0, queued tasks = 0, completed tasks = 3]", "order": "[C, B, A]"}`

4. Observe completion order and close the executor.

   Changed values: `{"pool": "java.util.concurrent.ThreadPoolExecutor@5c5eefef[Shutting down, pool size = 3, active threads = 0, queued tasks = 0, completed tasks = 3]", "result": "C,B,A"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java run uses fixed sleeps and three successful tasks. It omits failures, timeouts, cancellation, executor saturation, backpressure, ordering requirements, and distributed side effects.

## Explore (remaining exploration time)

Switch between completion order and submission-order Future.get calls. Predict which result blocks the consumer first.

Open software-engineering.html for the executable model.

Model limits: The Java run uses fixed sleeps and three successful tasks. It omits failures, timeouts, cancellation, executor saturation, backpressure, ordering requirements, and distributed side effects.

## Quiz (4 minutes)

1. A, B, C are submitted in that order but C finishes first. What does take return first?
   - C's completed Future
   - A's Future
   - The executor itself

2. What does CompletionService not do automatically?
   - Cancel remaining tasks after one useful result
   - Queue completed futures
   - Run tasks on its executor

3. When is invokeAll simpler?
   - You need all results and submission-order association
   - You need the earliest completion
   - You have no tasks

4. Where does submission-order waiting currently add tail latency?
5. What cancellation or timeout policy must wrap the completion queue?

<details><summary>Answer key — attempt first</summary>

1. C's completed Future. The queue is ordered by completion.

2. Cancel remaining tasks after one useful result. Cancellation policy remains yours.

3. You need all results and submission-order association. Choose the abstraction that matches consumption semantics.

</details>

## Sources

- [Java SE 21 CompletionService](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletionService.html) — Official Oracle API; checked November 19, 2026; checked 2026-11-19.
- [Java SE 21 ExecutorCompletionService](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorCompletionService.html) — Official Oracle API; checked November 19, 2026; checked 2026-11-19.
