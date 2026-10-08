# One clock across the call chain: gRPC deadlines

APIs & Microservices · Day15 · 15 minutes

Propagate a caller's remaining time so downstream services stop work after the result is no longer useful.

## Recall (2 minutes)

<p><a href="../Day12/apis-microservices.html">Day12: Do not erase a newer edit: ETag and If-Match</a></p><p>Alice has advanced the resource to v2. Bob sends If-Match v1. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Server does not perform the update and may return 412. The condition is false. RFC 9110 says the origin server must not perform the requested method; 412 can report the failed precondition.</p></details><p><a href="../Day14/apis-microservices.html">Day14: One author query, not three: GraphQL request batching</a></p><p>Three posts have author IDs u1, u2, u1. How many author keys should the request batch fetch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Two unique keys: u1 and u2. The request cache deduplicates the repeated u1 lookup, and the batch fetches u1 and u2 together.</p></details>

## Understand (4 minutes)

A restaurant promises your meal in ten minutes. The kitchen should receive the time still left, not a fresh ten-minute promise after the waiter spent six minutes taking the order.


A gRPC deadline is the time after which the client no longer wants the response. When one service calls another, it should pass the remaining budget.


Visual question: Which child work happens after the client has stopped waiting?



The client gives GetOrder 500 ms. The profile service spends 120 ms, then calls inventory. Inventory needs 450 ms.


Propagated: inventory receives 380 ms and is cancelled when the budget expires.
Not propagated: inventory runs 450 ms. The full chain takes 570 ms, even though the client stopped waiting at 500 ms.
Context child = parent.withDeadline(parent.deadline());
inventory.getStock(child, request);


gRPC implementations may propagate automatically or require configuration. Server application code must stop its own long-running work when cancellation is observed.



## Read the visual

Which child work happens after the client has stopped waiting? Both service bars share one clock. The first service consumes 120 ms; inventory starts there. The red deadline stays at 500 ms. Without propagation, the inventory bar can extend beyond it: that red portion is wasted for this client.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use deadline propagation when a request crosses several services and a late answer is no longer useful to the caller. It helps prevent downstream work from consuming resources after the caller has stopped waiting.

**Practical example.** GetOrder has 500 ms. After the profile service uses 120 ms, inventory gets only the remaining 380 ms. Giving inventory a fresh budget lets its 450 ms operation continue past the customer's limit. The same problem appears when a data-quality API calls metadata and policy services.

**How to decide.** Choose budgets from measured latency and stop work when cancellation arrives. For long-running processing, return a durable job identifier and expose job status. A deadline does not undo a payment or database change already committed.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
client_deadline_ms = 500
profile_elapsed_ms = 120
remaining_ms = client_deadline_ms - profile_elapsed_ms
inventory_needed_ms = 450
inventory_ran_ms = min(inventory_needed_ms, remaining_ms)
status = 'OK' if inventory_needed_ms <= remaining_ms else 'DEADLINE_EXCEEDED'
wasted_after_deadline_ms = 0
```

1. Start one end-to-end clock and account for work already spent.

   Changed values: `{"client_deadline_ms": 500, "profile_elapsed_ms": 120}`

2. The inventory call inherits 380 ms, not a fresh 500 ms.

   Changed values: `{"remaining_ms": 380}`

3. The child can run only until the propagated budget expires.

   Changed values: `{"inventory_needed_ms": 450, "inventory_ran_ms": 380}`

4. The caller times out, while cooperative cancellation prevents work beyond the deadline in this toy.

   Changed values: `{"status": "DEADLINE_EXCEEDED", "wasted_after_deadline_ms": 0}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executes deterministic timing arithmetic. It does not open a gRPC channel, measure network time, or interrupt real work.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Budget downstream calls after local validation and queueing, reserve time for cleanup and a useful error response, and avoid retry policies that can exceed the parent deadline. Emit the original deadline, remaining budget at each hop, cancellation cause, and work stopped so traces reveal budget leaks.</p>

</details>

## Explore (remaining exploration time)

Toggle propagation and change inventory time. Watch the remaining budget, client outcome, and wasted downstream work.

Open apis-microservices.html for the executable model.

Model limits: The model has one synchronous child call and exact times. Real RPCs include network latency, queueing, retries, streaming, clock handling, cancellation races, cleanup, and language-specific APIs. A deadline bounds waiting; it does not roll back a completed external side effect.

## Quiz (4 minutes)

1. After 120 ms of a 500 ms deadline, what budget should the child receive?
   - A fresh 500 ms
   - 380 ms remaining
   - No deadline by default

2. Why can work continue after a deadline?
   - The server handler must cooperate with cancellation and stop spawned work
   - gRPC reverses every side effect
   - The client always waits forever

3. What is outside this model?
   - One subtraction
   - Retries, streams, races, cleanup, and irreversible side effects
   - A 500 ms caller budget

4. Explain the exact 70 ms of wasted work when propagation is off and inventory needs 450 ms.
5. How would you choose and observe deadlines for a three-hop production call chain?

<details><summary>Answer key — attempt first</summary>

1. 380 ms remaining. The original end-to-end promise has 380 ms left.

2. The server handler must cooperate with cancellation and stop spawned work. gRPC signals cancellation, but application code must cease long-running processing.

3. Retries, streams, races, cleanup, and irreversible side effects. A deadline limits interest and resource use; it is not transaction rollback.

</details>

## Sources

- [gRPC guide: Deadlines](https://grpc.io/docs/guides/deadlines/) — Living guide; default behavior, propagation, and elapsed-time deduction; checked 2026-10-05.
- [gRPC guide: Cancellation](https://grpc.io/docs/guides/cancellation/) — Living guide; cancellation propagation and application cooperation; checked 2026-10-05.
