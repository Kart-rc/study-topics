# If-None-Match: * makes the first PUT win instead of overwriting it

APIs & Microservices · Day58 · 15 minutes

Use an HTTP precondition for create-only writes so concurrent clients cannot silently replace an existing representation.

## Recall (2 minutes)

<p><a href="../Day38/apis-microservices.html">Day38: A streaming write may wait until the receiver reads</a></p><p>Receiver window holds two messages; sender offers three. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>The third may wait until receiver capacity returns. Flow control applies backpressure to the faster sender.</p></details><p><a href="../Day26/apis-microservices.html">Day26: Budget GraphQL breadth before nested lists multiply</a></p><p>10 repos × 10 issues × 10 comments produces how many comment nodes?</p><details><summary>Recall first, then reveal the refresher</summary><p>1000. Nested list widths multiply.</p></details>

## Understand (4 minutes)

Two people reach for the last empty locker. The rule must be checked while the locker is claimed, not five minutes earlier when both saw it empty.

If-None-Match: * asks the origin server to perform the method only when the target has no current representation. For an unsafe method such as PUT, if the resource already exists, the server does not perform the write and returns 412 Precondition Failed. This closes the check-then-write race at the resource boundary.



Clients A and B both try to create /orders/o58. A's conditional PUT creates it and returns 201. B's identical precondition is evaluated after A; the resource now exists, so B receives 412 and A's representation remains.



## Read the visual

Two clients converge on one resource; the second path visibly branches to 412 before storage changes, while the unsafe path overwrites the owner.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a conditional create when the client chooses a stable resource URI and overwriting an existing representation would be unsafe.

**Practical example.** An ingestion control plane creates one immutable run manifest at <code>/runs/r58</code> despite two retrying callers.

**How to decide.** Use server-side uniqueness or a transaction underneath the HTTP precondition. For server-assigned IDs, POST plus an idempotency key may fit better. Define authorization and conflict response separately.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
store={}; requests=[('A','If-None-Match: *'),('B','If-None-Match: *')]
store['/orders/o58']='A'; status_a=201
status_b=412 if '/orders/o58' in store else 201
result={'A':status_a,'B':status_b,'stored_owner':store['/orders/o58'],'overwritten':False}
```

1. Start with one empty resource and two create-only requests.

   Changed values: `{"store": {}, "requests": [["A", "If-None-Match: *"], ["B", "If-None-Match: *"]]}`

2. A creates the first representation.

   Changed values: `{"store": {"/orders/o58": "A"}, "status_a": 201}`

3. Evaluate B's precondition against the current representation.

   Changed values: `{"status_b": 412}`

4. Keep A's representation and reject the competing create.

   Changed values: `{"result": {"A": 201, "B": 412, "stored_owner": "A", "overwritten": false}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model has one in-memory key and sequentializes two requests. It does not implement caches, weak/strong tag comparison, replicas, proxy behavior, authorization, idempotency-key storage, database isolation, retries after lost responses, or multi-resource transactions.

## Explore (remaining exploration time)

Switch between a conditional and unconditional second PUT. Predict the status and stored owner.

Open apis-microservices.html for the executable model.

Model limits: The model has one in-memory key and sequentializes two requests. It does not implement caches, weak/strong tag comparison, replicas, proxy behavior, authorization, idempotency-key storage, database isolation, retries after lost responses, or multi-resource transactions.

## Quiz (4 minutes)

1. A creates /orders/o58 first. What happens to B's PUT with If-None-Match: *?
   - The write is not performed and B receives 412
   - B overwrites A
   - The server must return 304

2. Why is a prior GET not enough?
   - Both clients can observe absence before either writes
   - GET always creates the resource
   - ETags are passwords

3. What does the header not replace?
   - Authorization and an atomic uniqueness check in storage
   - The resource URI
   - HTTP status codes

4. Which create endpoint in your platform lets the client choose a stable URI?
5. Would conditional PUT or POST with an idempotency key better match its retry contract?

<details><summary>Answer key — attempt first</summary>

1. The write is not performed and B receives 412. For non-GET/HEAD methods, a false precondition produces 412.

2. Both clients can observe absence before either writes. The condition must be evaluated with the write.

3. Authorization and an atomic uniqueness check in storage. HTTP semantics still need a correct origin implementation.

</details>

## Sources

- [RFC 9110: If-None-Match](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-none-match) — IETF Internet Standard; published June 2022; checked November 18, 2026; checked 2026-11-18.
- [RFC 9110: 412 Precondition Failed](https://www.rfc-editor.org/rfc/rfc9110.html#name-412-precondition-failed) — IETF Internet Standard; published June 2022; checked November 18, 2026; checked 2026-11-18.
