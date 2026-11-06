# An unbounded executor queue can make maximumPoolSize irrelevant

Software engineering · Day46 · 15 minutes

Predict whether a Java ThreadPoolExecutor creates a thread, queues work, or rejects it from its core size and queue policy.

## Recall (2 minutes)

<p><a href="../Day32/software-engineering.html">Day32: Readers keep a snapshot; writers pay for a copy</a></p><p>An iterator exists before fraud is added. What does it see?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only billing and audit. The iterator keeps its creation-time array snapshot.</p></details><p><a href="../Day4/software-engineering.html">Day4: Protobuf evolution: the field number is the contract</a></p><p>A V2 producer adds tag 3. What does a V1 binary parser do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treats tag 3 as an unknown field. Adding a field is binary wire-safe; old code does not recognize its application meaning.</p></details>

## Understand (4 minutes)

A restaurant has two cooks, space for an unlimited stack of tickets, and a sign saying “up to eight cooks.” The manager never hires cook three because the ticket stack is never full.

ThreadPoolExecutor adds threads beyond corePoolSize only when the work queue cannot accept the task. An unbounded queue always accepts it, so the pool stays at the core size and maximumPoolSize does not help with the backlog.



Core size is 2, maximum size is 8, and ten slow requests arrive together. With an unbounded queue, two run and eight wait. With a bounded queue of two, two run, two queue, and later submissions can create up to six more workers before rejection policy applies.



## Read the visual

The same core and maximum sizes feed two different queue shapes, revealing why the queue-full decision—not the max number by itself—controls worker growth.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this reasoning when a Java service shows rising queue delay even though maximumPoolSize looks generous.

**Practical example.** A Kafka enrichment service has core=2, max=8, and an unbounded LinkedBlockingQueue; lag rises while the pool never exceeds two workers.

**How to decide.** Choose an unbounded queue only when smoothed bursts cannot outrun service capacity for long. Use a bounded queue, explicit rejection/backpressure, and load tests when latency and memory need hard limits.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int core = 2; int max = 8; int submitted = 10; boolean unbounded = true;
int running = Math.min(core, submitted); int remaining = submitted - running;
int queued = unbounded ? remaining : Math.min(2, remaining); boolean queueFull = !unbounded && queued == 2;
int extraWorkers = queueFull ? Math.min(max - core, remaining - queued) : 0; running += extraWorkers; String result = running + " running, " + queued + " queued";
```

1. Configure the teaching pool and simultaneous burst.

   Changed values: `{"core": "2", "max": "8", "submitted": "10", "unbounded": "true"}`

2. The first two tasks occupy core workers.

   Changed values: `{"running": "2", "remaining": "8"}`

3. The unbounded queue accepts every remaining task and never reports full.

   Changed values: `{"queued": "8", "queueFull": "false"}`

4. No full-queue signal means no non-core workers are created.

   Changed values: `{"extraWorkers": "0", "result": "2 running, 8 queued"}`

[Full runnable example](examples/software-engineering.java).

Limits: The model assumes all tasks arrive before any finish and one task per worker. It omits task duration variance, keep-alive, prestarting, priorities, memory use, rejection handlers, shutdown, interrupts, virtual threads, and actual scheduling.

## Explore (remaining exploration time)

Switch the queue between unbounded and capacity two, then increase submitted work. Watch the same max-pool setting lead to different worker and queue counts.

Open software-engineering.html for the executable model.

Model limits: The model assumes all tasks arrive before any finish and one task per worker. It omits task duration variance, keep-alive, prestarting, priorities, memory use, rejection handlers, shutdown, interrupts, virtual threads, and actual scheduling.

## Quiz (4 minutes)

1. Core=2, max=8, and an unbounded queue receive ten simultaneous tasks. How many workers start?
   - Two; the other eight queue
   - Eight; max always wins
   - Ten

2. Why can a bounded queue grow the pool beyond core?
   - A full queue makes the executor try another worker before rejection
   - It changes Java syntax
   - It makes tasks faster

3. What limit still needs design?
   - Queue memory, waiting time, and rejection/backpressure
   - Only the variable name
   - The maximum value alone

4. Which production executor has a max size that its queue policy prevents it from reaching?
5. What queue-delay and rejection signals will define safe backpressure?

<details><summary>Answer key — attempt first</summary>

1. Two; the other eight queue. The unbounded queue accepts work after the two core workers are busy.

2. A full queue makes the executor try another worker before rejection. The documented admission sequence checks the queue before adding non-core workers.

3. Queue memory, waiting time, and rejection/backpressure. A finite maximum does not bound an unbounded backlog.

</details>

## Sources

- [Java SE 26 ThreadPoolExecutor](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html) — Official Java API; checked November 5, 2026; checked 2026-11-05.
