# Cancelling the CompletableFuture does not interrupt its worker

Software engineering · Day52 · 15 minutes

Separate a CompletableFuture's cancelled state from the lifecycle of work already running underneath it.

## Recall (2 minutes)

<p><a href="../Day35/software-engineering.html">Day35: The work failure stays primary; close failures become suppressed</a></p><p>The try body and close both throw. Which is propagated?</p><details><summary>Recall first, then reveal the refresher</summary><p>The body exception, with close attached as suppressed. Try-with-resources preserves the work failure as the primary cause.</p></details><p><a href="../Day7/software-engineering.html">Day7: Deadline propagation: pass the remaining budget</a></p><p>A service spends 140 ms of a 500 ms deadline before a child call. What budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>360 ms. Propagation deducts elapsed time from the original end-to-end budget.</p></details>

## Understand (4 minutes)

Crossing a delivery off your tracking app does not stop the van already driving down the road.

CompletableFuture.cancel(true) completes that future exceptionally with CancellationException. For this implementation, the mayInterruptIfRunning argument has no effect because interruption does not control the processing. If you need the underlying work to stop, design cooperative cancellation or own the executor task explicitly.

// Java 25 API behavior; illustrative snippet
boolean changed = future.cancel(true);
// future is cancelled; worker shutdown is a separate concern



Request r-52 starts a three-step report. The caller cancels the future after step one. Observers of the future receive cancellation, but the worker can still write steps two and three unless the operation checks a separate stop signal or the owner cancels a task type that supports interruption.



## Read the visual

Two parallel lanes show the future becoming cancelled while the worker lane continues unless a separate cooperative check stops it.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this distinction when timeouts, client disconnects, or hedging cancel a CompletableFuture whose work may update state or consume scarce capacity.

**Practical example.** An API timeout cancels its response future while a report query continues using a database connection.

**How to decide.** For pure computations, tolerate harmless late completion when bounded. For expensive or side-effecting work, pass a cooperative cancellation token, enforce downstream deadlines, or keep the underlying Future/handle. Do not assume cancel(true) proves the effect stopped.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int totalSteps=3; int completedSteps=1;
boolean futureCancelled=true; boolean mayInterruptIfRunning=true;
boolean implementationUsesInterrupts=false; completedSteps=implementationUsesInterrupts ? completedSteps : totalSteps;
String result="futureCancelled="+futureCancelled+", workerSteps="+completedSteps;
```

1. Model one completed worker step.

   Changed values: `{"totalSteps": "3", "completedSteps": "1"}`

2. Record the visible CompletableFuture cancellation request.

   Changed values: `{"futureCancelled": "true", "mayInterruptIfRunning": "true"}`

3. Apply the documented CompletableFuture boundary: the flag does not control processing.

   Changed values: `{"completedSteps": "3", "implementationUsesInterrupts": "false"}`

4. Observe cancelled future state and independently completed work.

   Changed values: `{"result": "futureCancelled=true, workerSteps=3"}`

[Full runnable example](examples/software-engineering.java).

Limits: The recorded Java example models documented CompletableFuture state transitions with integers; it does not launch a real executor task, deliver interrupts, model races, propagate deadlines, close database calls, or prove that any specific library cooperates with cancellation.

## Explore (remaining exploration time)

Cancel the visible future and toggle whether the worker checks a stop flag. Predict which steps still execute.

Open software-engineering.html for the executable model.

Model limits: The recorded Java example models documented CompletableFuture state transitions with integers; it does not launch a real executor task, deliver interrupts, model races, propagate deadlines, close database calls, or prove that any specific library cooperates with cancellation.

## Quiz (4 minutes)

1. cancel(true) returns true for r-52. What is proven?
   - The CompletableFuture moved to a cancelled exceptional state
   - The database query was interrupted
   - Every side effect rolled back

2. Why add cooperative cancellation?
   - The operation can check a shared stop condition at safe boundaries
   - It makes every blocking library interruptible
   - It converts cancellation into a transaction

3. What is the boundary for side effects?
   - Effects committed before or after visible cancellation need their own consistency design
   - Cancellation automatically compensates them
   - The future stores a database transaction

4. Which CompletableFuture in your services can outlive the request that created it?
5. What downstream deadline or cancellation handle would actually bound its resource use?

<details><summary>Answer key — attempt first</summary>

1. The CompletableFuture moved to a cancelled exceptional state. The method changes the future's state; it does not prove underlying work stopped.

2. The operation can check a shared stop condition at safe boundaries. The worker needs its own mechanism to observe and honor the request.

3. Effects committed before or after visible cancellation need their own consistency design. Future lifecycle and business-effect lifecycle are separate.

</details>

## Sources

- [CompletableFuture — Java SE 25 API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletableFuture.html) — Official Java SE 25 API; checked November 12, 2026; checked 2026-11-12.
- [Future — Java SE 25 API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Future.html) — Official Java SE 25 API; checked November 12, 2026; checked 2026-11-12.
