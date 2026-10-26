# A CompletableFuture timeout can end waiting while work keeps running

Software engineering · Day36 · 15 minutes

Separate a caller's patience budget from cancellation of the underlying side effect.

## Recall (2 minutes)

<p><a href="../Day27/software-engineering.html">Day27: Retry a poison message three times—then quarantine it</a></p><p>Why cap retries?</p><details><summary>Recall first, then reveal the refresher</summary><p>To prevent one permanent failure from consuming work forever. Permanent failures need quarantine and repair, not infinite retries.</p></details><p><a href="../Day15/software-engineering.html">Day15: Stop, drain, then force: graceful shutdown</a></p><p>With 8 seconds of work and 10 seconds of grace, what happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>O42 finishes and the process exits cleanly. Stopping admission first leaves enough time for the in-flight request to finish.</p></details>

## Understand (4 minutes)

A customer hangs up after two minutes. The kitchen may still be cooking the meal. A timeout tells the caller to stop waiting; it does not prove the worker stopped.

CompletableFuture.orTimeout completes the future exceptionally when the deadline wins. CompletableFuture does not directly control the computation that completes it, so cancellation is exceptional completion, not guaranteed interruption of that work.



An order-pricing task needs 800 ms, but the API budget is 500 ms. The caller sees a timeout at 500 ms. Without a cooperative cancellation signal, the worker can still charge CPU or call a downstream service at 800 ms.



## Read the visual

The split timeline answers whether the caller and worker share a lifecycle. The red worker card after a caller timeout makes continued resource use visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit timeout and cancellation design around remote calls, executor tasks, fan-out requests, and expensive computations.

**Practical example.** A pricing fan-out exceeds the HTTP deadline but its supplier call continues and consumes a scarce connection.

**How to decide.** Set the caller deadline, then decide separately whether work is safe to continue, must receive a cooperative cancellation token, or needs idempotent side effects.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int workMs = 800;
int timeoutMs = 500;
boolean callerTimedOut = timeoutMs < workMs;
boolean workerStillRunning = callerTimedOut; String outcome = callerTimedOut ? "caller timed out; worker may continue" : "result returned";
```

1. The synthetic worker needs 800 ms.

   Changed values: `{"workMs": "800"}`

2. The caller's patience budget is shorter.

   Changed values: `{"timeoutMs": "500"}`

3. The caller deadline wins.

   Changed values: `{"callerTimedOut": "true"}`

4. Record the separate worker risk.

   Changed values: `{"workerStillRunning": "true", "outcome": "caller timed out; worker may continue"}`

[Full runnable example](examples/software-engineering.java).

Limits: The model uses milliseconds and booleans. It does not schedule threads, prove interruption, model ForkJoinPool, transport cancellation, memory visibility, executor rejection, race timing, or idempotency. The Java replay executes only the decision arithmetic.

## Explore (remaining exploration time)

Change the caller deadline and whether the worker cooperates. Watch caller state and worker state diverge.

Open software-engineering.html for the executable model.

Model limits: The model uses milliseconds and booleans. It does not schedule threads, prove interruption, model ForkJoinPool, transport cancellation, memory visibility, executor rejection, race timing, or idempotency. The Java replay executes only the decision arithmetic.

## Quiz (4 minutes)

1. Caller times out at 500 ms; worker ignores cancellation. What follows?
   - The caller stops waiting while work may continue
   - The JVM kills the thread
   - The side effect is rolled back

2. Why add cooperative cancellation?
   - To give underlying work a checked stop condition
   - To hide all exceptions
   - To increase the deadline

3. What must still protect a remote write?
   - Idempotency and server-side deadlines where supported
   - Only orTimeout
   - A larger thread pool

4. Which async tasks in your services can outlive the request that created them?
5. What cancellation and idempotency contract protects the most expensive one?

<details><summary>Answer key — attempt first</summary>

1. The caller stops waiting while work may continue. Timeout and work termination are different events.

2. To give underlying work a checked stop condition. The task must participate in stopping.

3. Idempotency and server-side deadlines where supported. Client timeout alone does not undo an external effect.

</details>

## Sources

- [Java 17 CompletableFuture](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/CompletableFuture.html) — Official API; checked October 26, 2026; checked 2026-10-26.
- [Java 17 Future](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Future.html) — Official API; checked October 26, 2026; checked 2026-10-26.
