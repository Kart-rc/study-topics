# A streaming write may wait until the receiver reads

APIs & Microservices · Day38 · 15 minutes

Use gRPC flow control to bound in-flight streaming data without mistaking write acceptance for network delivery.

## Recall (2 minutes)

<p><a href="../Day28/apis-microservices.html">Day28: OpenAPI oneOf means exactly one schema</a></p><p>A payload matches both branches. Does oneOf accept it?</p><details><summary>Recall first, then reveal the refresher</summary><p>No. oneOf requires exactly one valid branch.</p></details><p><a href="../Day16/apis-microservices.html">Day16: One error shape, stable meaning: RFC 9457 Problem Details</a></p><p>Which field should machine logic use as the primary problem identifier?</p><details><summary>Recall first, then reveal the refresher</summary><p>The type URI. RFC 9457 defines type as the primary problem identifier; detail is human-readable.</p></details>

## Understand (4 minutes)

A warehouse stops loading boxes when the receiving dock is full. More boxes can move only after the receiver clears space.

gRPC flow control protects a streaming receiver from a faster sender. A write can wait, and handing a value to the framework does not prove that bytes already crossed the network. Unary RPCs do not use this streaming mechanism.



The receiver advertises room for two 1-unit messages. The sender offers m1, m2, and m3. The first two enter the window. m3 waits until the application reads one message and capacity is acknowledged.



## Read the visual

The receiver window makes backpressure visible: offered messages split into admitted and blocked sets, and one receiver read releases one credit. It is a state transition, not a decorative request arrow.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use streaming RPCs and their flow control when either side sends a sequence whose production rate can exceed consumption rate.

**Practical example.** A metadata service streams table-lineage updates to a slower catalog indexer.

**How to decide.** Use unary RPC for one request/response. For streaming, keep reading while writing, bound application queues too, propagate deadlines/cancellation, and avoid manual flow control unless the language API and workload justify it.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
receiver_window = 2; messages = ['m1', 'm2', 'm3']
admitted = messages[:receiver_window]; blocked = messages[receiver_window:]
receiver_reads = admitted.pop(0); receiver_window += 1
admitted.append(blocked.pop(0)); outcome = {'delivered_to_app': receiver_reads, 'in_flight': admitted, 'blocked': blocked}
```

1. The receiver has two units of capacity.

   Changed values: `{"receiver_window": 2, "messages": ["m1", "m2", "m3"]}`

2. Two messages enter; m3 waits.

   Changed values: `{"admitted": ["m1", "m2"], "blocked": ["m3"]}`

3. Reading m1 returns one unit of capacity.

   Changed values: `{"receiver_window": 3, "admitted": ["m2"], "receiver_reads": "m1"}`

4. m3 can now enter the window.

   Changed values: `{"admitted": ["m2", "m3"], "blocked": [], "outcome": {"delivered_to_app": "m1", "in_flight": ["m2", "m3"], "blocked": []}}`

[Full runnable example](examples/apis-microservices.py).

Limits: This local credit model is not an HTTP/2 or gRPC implementation. It omits byte-sized windows, compression, batching, language-specific APIs, OS buffers, deadlines, cancellation, network failure, fairness and manual-flow-control races.

## Explore (remaining exploration time)

Change receiver capacity and message count. Watch which messages enter the window and which remain blocked.

Open apis-microservices.html for the executable model.

Model limits: This local credit model is not an HTTP/2 or gRPC implementation. It omits byte-sized windows, compression, batching, language-specific APIs, OS buffers, deadlines, cancellation, network failure, fairness and manual-flow-control races.

## Quiz (4 minutes)

1. Receiver window holds two messages; sender offers three. What happens?
   - The third may wait until receiver capacity returns
   - All three are guaranteed on the wire
   - The RPC becomes unary

2. A write call returns. What is not proven?
   - That the message already crossed the network and was consumed
   - That the framework accepted the value
   - That the stream exists

3. How can manual synchronous flow control deadlock?
   - Both sides write heavily and neither reads to return capacity
   - Both sides use unique IDs
   - The receiver has a deadline

4. Which streaming handlers can produce faster than downstream consumers read?
5. Where are application-level queues bounded in addition to transport flow control?

<details><summary>Answer key — attempt first</summary>

1. The third may wait until receiver capacity returns. Flow control applies backpressure to the faster sender.

2. That the message already crossed the network and was consumed. Framework buffering and transport delivery are later stages.

3. Both sides write heavily and neither reads to return capacity. Progress requires reads as well as writes.

</details>

## Sources

- [gRPC flow control guide](https://grpc.io/docs/guides/flow-control/) — Living official documentation; checked October 28, 2026; checked 2026-10-28.
- [gRPC core concepts: streaming RPCs](https://grpc.io/docs/what-is-grpc/core-concepts/) — Living official documentation; checked October 28, 2026; checked 2026-10-28.
