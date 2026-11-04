# allOf waits for every future—even after one has already failed

Software engineering · Day44 · 15 minutes

Use CompletableFuture.allOf as a completion barrier without mistaking it for fail-fast cancellation or a result collector.

## Recall (2 minutes)

<p><a href="../Day31/software-engineering.html">Day31: Fast counters with a fuzzy snapshot: LongAdder</a></p><p>Why can LongAdder outperform AtomicLong under heavy write contention?</p><details><summary>Recall first, then reveal the refresher</summary><p>Updates can spread across multiple variables. Striping reduces contention on one hot variable.</p></details><p><a href="../Day3/software-engineering.html">Day3: Fencing tokens: stop the worker whose lease already died</a></p><p>A has token 1, B&#x27;s token-2 write was accepted, then A resumes. What should the resource do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject token 1 as stale. The resource has already accepted token 2, so token 1 cannot be current.</p></details>

## Understand (4 minutes)

Three couriers carry parts of one report. If one courier reports a failure at noon, the coordinator still waits for the other two to report back before declaring the group complete.

CompletableFuture.allOf returns a new future that completes when every supplied future completes. If any child completed exceptionally, the aggregate completes exceptionally. The aggregate does not contain the child values; inspect them individually. It also does not promise to stop the other computations.



Inventory succeeds, payment fails, and shipping is still running. The payment failure does not make allOf done yet. When shipping completes, the aggregate becomes done and exceptional. Inventory and shipping results still exist in their own futures.



## Read the visual

The timeline separates an early known failure from aggregate completion, showing the unfinished sibling as the reason allOf is not yet done.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use allOf when independent asynchronous work must all reach a terminal state before a final step, report, or cleanup decision.

**Practical example.** A backend loads inventory, payment risk, and shipping quotes in parallel before assembling an order view.

**How to decide.** Use it as a barrier, not a cancellation policy. Add explicit fail-fast signaling and cooperative cancellation when continued sibling work is wasteful or unsafe. Inspect child futures when individual results or errors matter.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var inventory = new java.util.concurrent.CompletableFuture<String>(); var payment = new java.util.concurrent.CompletableFuture<String>(); var shipping = new java.util.concurrent.CompletableFuture<String>();
var all = java.util.concurrent.CompletableFuture.allOf(inventory, payment, shipping); inventory.complete("in-stock"); payment.completeExceptionally(new RuntimeException("declined"));
boolean doneAfterFailure = all.isDone(); shipping.complete("overnight");
boolean doneAfterAll = all.isDone(); boolean aggregateExceptional = all.isCompletedExceptionally(); String inventoryValue = inventory.join(); String shippingValue = shipping.join();
```

1. Create three independently completable futures.

   Changed values: `{"inventory": "java.util.concurrent.CompletableFuture@1fe20588[Not completed]", "payment": "java.util.concurrent.CompletableFuture@6ce139a4[Not completed]", "shipping": "java.util.concurrent.CompletableFuture@6973bf95[Not completed]"}`

2. One succeeds and one fails, but shipping is still incomplete.

   Changed values: `{"inventory": "java.util.concurrent.CompletableFuture@1fe20588[Completed normally]", "payment": "java.util.concurrent.CompletableFuture@6ce139a4[Completed exceptionally: java.lang.RuntimeException: declined]", "shipping": "java.util.concurrent.CompletableFuture@6973bf95[Not completed, 1 dependents]", "all": "java.util.concurrent.CompletableFuture@63a65a25[Not completed]"}`

3. Observe that the aggregate was not done after the early failure, then finish shipping.

   Changed values: `{"shipping": "java.util.concurrent.CompletableFuture@6973bf95[Completed normally]", "all": "java.util.concurrent.CompletableFuture@63a65a25[Completed exceptionally: java.util.concurrent.CompletionException: java.lang.RuntimeException: declined]", "doneAfterFailure": "false"}`

4. The aggregate is now exceptional while successful child values remain readable.

   Changed values: `{"doneAfterAll": "true", "aggregateExceptional": "true", "inventoryValue": "in-stock", "shippingValue": "overnight"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java replay uses manually completed futures for deterministic ordering. It proves allOf completion semantics, not executor scheduling, interruption, network cancellation, exception selection among multiple failures, timeouts, structured concurrency, or resource cleanup.

## Explore (remaining exploration time)

Move the failure and slow completion across three futures. Predict when the aggregate becomes done and which child values remain available.

Open software-engineering.html for the executable model.

Model limits: The Java replay uses manually completed futures for deterministic ordering. It proves allOf completion semantics, not executor scheduling, interruption, network cancellation, exception selection among multiple failures, timeouts, structured concurrency, or resource cleanup.

## Quiz (4 minutes)

1. Payment fails while shipping is incomplete. Is allOf done?
   - No; it waits for shipping to complete too
   - Yes; it always fails fast
   - Yes; it cancels shipping

2. Where are successful child values found?
   - In the individual futures
   - Inside the Void result of allOf
   - In the first exception

3. When is allOf alone insufficient?
   - When you require fail-fast cancellation and cleanup
   - When every independent result may finish
   - When the final step should wait for all terminal states

4. Which parallel calls in your services should finish for evidence even after one sibling fails?
5. Where would explicit cancellation and cleanup live if the remaining work should stop?

<details><summary>Answer key — attempt first</summary>

1. No; it waits for shipping to complete too. The returned future completes only after all supplied futures complete.

2. In the individual futures. allOf is a Void barrier; child results remain on the children.

3. When you require fail-fast cancellation and cleanup. Cancellation and cleanup need an explicit design; allOf only aggregates completion.

</details>

## Sources

- [Java SE 26 CompletableFuture.allOf](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/CompletableFuture.html#allOf(java.util.concurrent.CompletableFuture...)) — Official Java API; checked November 3, 2026; checked 2026-11-03.
