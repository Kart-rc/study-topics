# request(10) grants ten signals—it does not create ten storage slots

Software engineering · Day50 · 15 minutes

Separate reactive-stream demand from publisher buffer capacity.

## Recall (2 minutes)

<p><a href="../Day34/software-engineering.html">Day34: If a map key changes, the entry does not move</a></p><p>A key&#x27;s tenant field affects equals/hashCode and changes after put. What is specified?</p><details><summary>Recall first, then reveal the refresher</summary><p>Map behavior is unspecified. The Java Map contract warns against equality-affecting key mutation.</p></details><p><a href="../Day6/software-engineering.html">Day6: Hedged requests: duplicate only the stragglers</a></p><p>Why delay a hedge instead of sending two copies immediately?</p><details><summary>Recall first, then reveal the refresher</summary><p>To target stragglers and limit extra load. The delay lets ordinary requests finish without paying for a duplicate.</p></details>

## Understand (4 minutes)

A deli ticket says the counter may hand you ten sandwiches. It does not say your bag can hold ten.

In Java Flow, Subscription.request(n) adds demand: the publisher must not send more onNext signals than requested. Buffer capacity is a separate implementation resource. Safe systems bound both outstanding demand and queued items.



A subscriber requests 10 records but processes 3 per tick. With a publisher buffer of 4, a burst can fill the queue before all ten requested records are delivered. Replenishing demand only after processing keeps the outstanding window bounded.



## Read the visual

One demand counter feeds a separately bounded processing-plus-buffer path; unmet demand remains visibly outside storage.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use bounded demand when a Java subscriber consumes events slower than a producer can offer them.

**Practical example.** A Kafka-adjacent enrichment stage asks for four records, processes two, then asks for two more.

**How to decide.** Choose a demand window from downstream capacity and latency. Configure publisher buffers separately; use a simple blocking queue when a full reactive protocol adds no value.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int requested = 10;
int bufferCapacity = 4; int processedImmediately = 3;
int delivered = Math.min(requested, bufferCapacity + processedImmediately); int queued = Math.max(0, delivered - processedImmediately);
int notDelivered = requested - delivered; String result = "delivered=" + delivered + ", queued=" + queued + ", notDelivered=" + notDelivered;
```

1. Grant demand for up to ten onNext signals.

   Changed values: `{"requested": "10"}`

2. Set independent storage and processing resources.

   Changed values: `{"bufferCapacity": "4", "processedImmediately": "3"}`

3. Bound delivery by the current processing-plus-buffer path.

   Changed values: `{"delivered": "7", "queued": "4"}`

4. Demand can remain unmet without implying extra storage.

   Changed values: `{"notDelivered": "3", "result": "delivered=7, queued=4, notDelivered=3"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java trace is synchronous arithmetic, not a real Publisher. It omits threading, SubmissionPublisher lag/drop handlers, reentrant requests, cancellation, errors, multiple subscribers, memory visibility, and Reactive Streams rule verification.

## Explore (remaining exploration time)

Change demand, buffer capacity, and processing rate. Predict delivered, queued, and rejected items.

Open software-engineering.html for the executable model.

Model limits: The Java trace is synchronous arithmetic, not a real Publisher. It omits threading, SubmissionPublisher lag/drop handlers, reentrant requests, cancellation, errors, multiple subscribers, memory visibility, and Reactive Streams rule verification.

## Quiz (4 minutes)

1. A subscriber requests 10 and the publisher buffer is 4. What did request create?
   - Demand for up to ten signals, not ten buffer slots
   - A ten-slot queue
   - Ten worker threads

2. Why replenish after processing?
   - To keep outstanding demand tied to downstream progress
   - To bypass onSubscribe
   - To guarantee zero latency

3. What must a real test add?
   - Concurrency, cancellation, error, and actual publisher buffer behavior
   - A larger font
   - A SQL role

4. Where does your current reactive pipeline bound demand?
5. Which queue or publisher buffer is actually consuming memory?

<details><summary>Answer key — attempt first</summary>

1. Demand for up to ten signals, not ten buffer slots. Demand and storage capacity are different controls.

2. To keep outstanding demand tied to downstream progress. Replenishment closes the feedback loop.

3. Concurrency, cancellation, error, and actual publisher buffer behavior. The toy arithmetic does not implement the protocol.

</details>

## Sources

- [Java SE 25 Flow API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Flow.html) — Official Java SE 25 API; checked November 10, 2026; checked 2026-11-10.
- [Reactive Streams specification](https://github.com/reactive-streams/reactive-streams-jvm) — Official specification repository; checked 2026-11-10.
