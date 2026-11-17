# invokeAny returns the first success—not the first task to finish

Software engineering · Day56 · 15 minutes

Race equivalent providers without letting an early failure hide a later successful answer.

## Recall (2 minutes)

<p><a href="../Day37/software-engineering.html">Day37: computeIfAbsent is atomic; the loader must still be short</a></p><p>The mapping function calls a remote service for 800 ms. Main risk?</p><details><summary>Recall first, then reveal the refresher</summary><p>Other attempted updates may block while the atomic computation runs. Atomicity does not make slow work cheap.</p></details><p><a href="../Day9/software-engineering.html">Day9: Merkle trees: localize replica drift before repairing it</a></p><p>Two replicas have equal Merkle roots built from the same canonical range. What is the useful inference?</p><details><summary>Recall first, then reveal the refresher</summary><p>Their summarized contents match with the assurance of the hash. The root summarizes current canonical contents; it says nothing about history or future drift.</p></details>

## Understand (4 minutes)

Three couriers race to deliver the same parcel. The first courier may call to say the van broke down. That is not the first delivery.

ExecutorService.invokeAny runs a collection of callables and returns one result that completed successfully. An early exception does not win. If none succeeds, it throws ExecutionException; the timed overload can throw TimeoutException. On return, unfinished tasks are cancelled, but cancellation is an attempt—not proof that external work stopped.



Replica A fails at 10 ms. Replica B returns order-56 at 30 ms. Replica C is still running. invokeAny returns B’s value and cancels C. A custom “first completion” race would incorrectly surface A’s failure.



## Read the visual

A completion timeline keeps the first failure visible while the return arrow advances to the first success.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use invokeAny when several equivalent computations or replicas may produce one acceptable answer and first success is the contract.

**Practical example.** A Java service races two read replicas for the same immutable catalog record during a regional degradation.

**How to decide.** Use it only for equivalent, safe-to-duplicate operations. Keep a shared deadline, make losers cancellation-aware, and do not race side effects such as payments. Use CompletionService when you need custom acceptance or evidence from multiple results.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
String[] names={"A","B","C"}; String[] values={"fail","order-56","order-56"};
String failures=names[0];
int winnerIndex=1; String winner=names[winnerIndex]; String value=values[winnerIndex];
String cancelRequested=names[2]; String result="winner="+winner+", value="+value+", failures="+failures+", cancel="+cancelRequested;
```

1. Script completion order for three equivalent reads.

   Changed values: `{}`

2. Record the early failure without returning it.

   Changed values: `{"failures": "A"}`

3. Select the first successful completion.

   Changed values: `{"winnerIndex": "1", "winner": "B", "value": "order-56"}`

4. Return B and request cancellation of the unfinished task.

   Changed values: `{"cancelRequested": "C", "result": "winner=B, value=order-56, failures=A, cancel=C"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java and browser models use a scripted completion order. They do not create real threads, model scheduling, network calls, interrupt handling, timeout clocks, executor saturation, or guarantee cancellation of external effects.

## Explore (remaining exploration time)

Change the first completion from failure to success. Predict the returned value and loser state.

Open software-engineering.html for the executable model.

Model limits: The Java and browser models use a scripted completion order. They do not create real threads, model scheduling, network calls, interrupt handling, timeout clocks, executor saturation, or guarantee cancellation of external effects.

## Quiz (4 minutes)

1. A fails before B succeeds. What does invokeAny return?
   - B's successful value
   - A's exception immediately
   - A list of both outcomes

2. What if every callable fails?
   - ExecutionException
   - null
   - The last task's value

3. Why avoid racing payment calls?
   - Loser cancellation may not undo an external side effect
   - invokeAny is too slow
   - Callables cannot use HTTP

4. Which read operation in your platform is safe to duplicate across equivalent replicas?
5. What external work could continue after loser cancellation?

<details><summary>Answer key — attempt first</summary>

1. B's successful value. The method waits for one successful completion.

2. ExecutionException. No successful result exists.

3. Loser cancellation may not undo an external side effect. Duplicate side effects outlive the local cancellation contract.

</details>

## Sources

- [Java SE 25: ExecutorService.invokeAny](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ExecutorService.html) — Oracle Java API specification; checked November 16, 2026; checked 2026-11-16.
