# thenApply wraps the next future; thenCompose follows it

Software engineering · Day49 · 15 minutes

Choose the CompletionStage operator that keeps an asynchronous Java pipeline flat.

## Recall (2 minutes)

<p><a href="../Day28/software-engineering.html">Day28: Two workers wait for children that cannot start</a></p><p>Why can the children not run?</p><details><summary>Recall first, then reveal the refresher</summary><p>All workers are occupied by waiting parents. The children need the same workers that their parents refuse to release.</p></details><p><a href="../Day32/software-engineering.html">Day32: Readers keep a snapshot; writers pay for a copy</a></p><p>An iterator exists before fraud is added. What does it see?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only billing and audit. The iterator keeps its creation-time array snapshot.</p></details>

## Understand (4 minutes)

Imagine opening a delivery box and finding another sealed box inside. thenApply transforms a value. If that transform itself returns a future, the result is a future containing another future.

thenCompose is the flat-map form: it waits for the returned stage and completes with that stage's value. Use it when step two is asynchronous and depends on step one.



findCustomer() returns CompletionStage<Customer>. loadOrders(customer) also returns a stage. thenApply(this::loadOrders) produces CompletionStage<CompletionStage<Orders>>; thenCompose(this::loadOrders) produces CompletionStage<Orders>. Neither operator supplies a timeout, retry, cancellation policy, or executor capacity.



## Read the visual

The diagram renders the result as one or two asynchronous envelopes, so the type shape is visible instead of hidden behind method names.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use thenCompose when one asynchronous Java operation needs the value from an earlier stage and itself returns a CompletionStage.

**Practical example.** Load an account, then call an asynchronous order service for that account.

**How to decide.** Use thenApply for a synchronous mapping such as formatting a name. Use thenCompose for an async dependency. Use thenCombine when independent stages can run in parallel.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
String customer = "customer-42";
java.util.concurrent.CompletableFuture<java.util.concurrent.CompletableFuture<String>> nested = java.util.concurrent.CompletableFuture.completedFuture(customer).thenApply(id -> java.util.concurrent.CompletableFuture.completedFuture("order-7")); boolean innerStageRequired = nested.join() instanceof java.util.concurrent.CompletionStage;
java.util.concurrent.CompletableFuture<String> flat = java.util.concurrent.CompletableFuture.completedFuture(customer).thenCompose(id -> java.util.concurrent.CompletableFuture.completedFuture("order-7")); String order = flat.join();
String result = "nested needs inner stage=" + innerStageRequired + "; flat value=" + order;
```

1. Start with the value produced by the first asynchronous stage.

   Changed values: `{"customer": "customer-42"}`

2. thenApply keeps the returned future as a nested value.

   Changed values: `{"innerStageRequired": "true"}`

3. thenCompose follows the returned future and exposes its value.

   Changed values: `{"order": "order-7"}`

4. Both can finish, but only the composed pipeline has one stage layer.

   Changed values: `{"result": "nested needs inner stage=true; flat value=order-7"}`

[Full runnable example](examples/software-engineering.java).

Limits: The executable Java example uses already-completed futures, so it proves type/flattening behavior but not scheduling. The browser omits executor choice, latency, exceptional completion, cancellation, timeouts, retries, backpressure, and context propagation.

## Explore (remaining exploration time)

Switch between synchronous and asynchronous second steps. Predict the resulting type before revealing the boxes.

Open software-engineering.html for the executable model.

Model limits: The executable Java example uses already-completed futures, so it proves type/flattening behavior but not scheduling. The browser omits executor choice, latency, exceptional completion, cancellation, timeouts, retries, backpressure, and context propagation.

## Quiz (4 minutes)

1. loadOrders returns CompletionStage<Order>. What does thenApply(loadOrders) produce?
   - A nested CompletionStage<CompletionStage<Order>>
   - A flat CompletionStage<Order>
   - An Order immediately

2. Why choose thenCompose?
   - It flattens the dependent asynchronous stage
   - It runs independent work in parallel
   - It adds a retry policy

3. What is still missing from a correct composition?
   - Timeout, failure, cancellation, and capacity policy
   - A second join in every caller
   - A shared mutable list

4. Where does your Java code currently return a future from inside thenApply?
5. What timeout and failure policy should wrap the resulting flat pipeline?

<details><summary>Answer key — attempt first</summary>

1. A nested CompletionStage<CompletionStage<Order>>. thenApply maps to whatever value the function returns, including another stage.

2. It flattens the dependent asynchronous stage. Compose completes with the value of the stage returned by the function.

3. Timeout, failure, cancellation, and capacity policy. Flattening fixes shape, not operational behavior.

</details>

## Sources

- [Java SE 25 CompletionStage](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletionStage.html) — Official Java SE 25 API; compose is the flat-map form; checked 2026-11-09.
- [Java SE 25 CompletableFuture](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletableFuture.html) — Official Java SE 25 API; checked 2026-11-09.
