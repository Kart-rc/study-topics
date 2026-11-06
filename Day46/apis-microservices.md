# GraphQL serializes top-level mutation fields—not the whole distributed transaction

APIs & Microservices · Day46 · 15 minutes

Use mutation ordering correctly without mistaking serial resolver execution for atomicity or rollback.

## Recall (2 minutes)

<p><a href="../Day32/apis-microservices.html">Day32: Wait for ready, but never wait past the deadline</a></p><p>Ready at 3s, deadline at 5s, Wait-for-Ready enabled. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>The RPC sends with about 2s remaining. The call waits, but the original deadline keeps counting.</p></details><p><a href="../Day20/apis-microservices.html">Day20: Stop routing before the next RPC: gRPC health Watch</a></p><p>B NOT_SERVING with health enabled?</p><details><summary>Recall first, then reveal the refresher</summary><p>Avoid B. Health changes eligibility.</p></details>

## Understand (4 minutes)

A cashier handles “reserve item” before “charge card.” Doing those actions in order prevents them from starting together, but it does not erase the reservation if the charge fails.

The GraphQL specification executes the top-level fields of a mutation serially, in textual order. Other fields should be side-effect-free and may execute normally. Serial order is an execution rule, not a cross-service transaction.



A mutation calls reserveInventory and then chargeCard. Reservation succeeds; charging fails. The response can contain the reservation result and an error for charging. Inventory remains reserved unless the API explicitly releases it, makes the operation idempotent, or coordinates a durable workflow.



## Read the visual

A two-step mutation timeline stops at the failed second field while the first field's effect remains visible, separating ordering from atomic rollback.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use multiple top-level mutation fields when their textual order is meaningful and each field has a clear independently observable result.

**Practical example.** An internal operations API reserves stock before attempting a payment, with an explicit release action on payment failure.

**How to decide.** Prefer one purpose-built mutation when the business operation needs one invariant and one idempotency key. Use serial top-level fields only when partial success is acceptable and compensation, retries, and authorization are designed explicitly.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
events=[]; reservation=None; payment=None
reservation='RES-9'; events.append('inventory reserved')
payment='FAILED'; events.append('payment failed')
needs_compensation=reservation is not None and payment=='FAILED'; automatic_rollback=False
```

1. Begin the two top-level mutation fields with no effects.

   Changed values: `{"events": [], "reservation": null, "payment": null}`

2. The first top-level field completes before the second begins.

   Changed values: `{"events": ["inventory reserved"], "reservation": "RES-9"}`

3. The second field fails after the reservation already exists.

   Changed values: `{"events": ["inventory reserved", "payment failed"], "payment": "FAILED"}`

4. The API must explicitly release or otherwise reconcile the reservation.

   Changed values: `{"needs_compensation": true, "automatic_rollback": false}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model is sequential Python, not a GraphQL executor. It omits null propagation, aliases, fragments, transport retries, resolver concurrency below the top level, authorization, database transactions, federation, and actual compensation failure.

## Explore (remaining exploration time)

Fail the second mutation field and inspect what remains. Then switch to a single orchestrated field and compare the visible contract—not an assumed distributed transaction.

Open apis-microservices.html for the executable model.

Model limits: The model is sequential Python, not a GraphQL executor. It omits null propagation, aliases, fragments, transport retries, resolver concurrency below the top level, authorization, database transactions, federation, and actual compensation failure.

## Quiz (4 minutes)

1. reserveInventory succeeds and chargeCard fails. What does serial execution guarantee?
   - Charge started after reserve finished; the reservation is not automatically undone
   - Both effects roll back
   - Charge ran in parallel

2. Why might one purpose-built mutation be clearer?
   - It can expose one business invariant and idempotency contract
   - It forces every database to be atomic
   - It removes authorization

3. What must be designed for retries?
   - Idempotency and compensation for already completed effects
   - Only field order
   - A larger response

4. Which existing mutation exposes multiple side effects that callers may wrongly assume are atomic?
5. Would one orchestrated mutation, a saga, or explicit compensation make its retry contract clearer?

<details><summary>Answer key — attempt first</summary>

1. Charge started after reserve finished; the reservation is not automatically undone. Serial top-level execution orders the resolvers but does not create a distributed transaction.

2. It can expose one business invariant and idempotency contract. A business operation can own coordination and partial-failure semantics explicitly.

3. Idempotency and compensation for already completed effects. A retried request can repeat the first effect unless it has a stable identity and safe recovery path.

</details>

## Sources

- [GraphQL Specification September 2025: executing the root selection set](https://spec.graphql.org/September2025/#sec-Executing-the-Root-Selection-Set) — Official GraphQL specification; published September 2025; checked November 5, 2026; checked 2026-11-05.
