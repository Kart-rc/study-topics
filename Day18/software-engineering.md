# Two slots, no waiting room: cap in-flight work with a semaphore

Software engineering · Day18 · 15 minutes

Protect a scarce downstream resource by refusing excess concurrent work.

## Recall (2 minutes)

<p><a href="../Day9/software-engineering.html">Day9: Merkle trees: localize replica drift before repairing it</a></p><p>Two replicas have equal Merkle roots built from the same canonical range. What is the useful inference?</p><details><summary>Recall first, then reveal the refresher</summary><p>Their summarized contents match with the assurance of the hash. The root summarizes current canonical contents; it says nothing about history or future drift.</p></details><p><a href="../Day3/software-engineering.html">Day3: Fencing tokens: stop the worker whose lease already died</a></p><p>A has token 1, B&#x27;s token-2 write was accepted, then A resumes. What should the resource do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject token 1 as stale. The resource has already accepted token 2, so token 1 cannot be current.</p></details>

## Understand (4 minutes)

A small repair shop has two workbenches. Taking a third bicycle does not create a third bench; it creates a pile. A semaphore is a counter of available slots. A request takes one slot before entering the scarce operation and returns it when that operation ends.

Use tryAcquire() when an immediate “busy” result is better than more waiting. The slot covers the downstream operation, not merely the moment the request is accepted. This is a concurrency limit: it does not promise a fixed requests-per-second rate.



Three report requests arrive while no work completes. A and B occupy the two slots. C is refused before touching the database. A then finishes; D can take its slot. If A throws an exception and forgets to return its slot, the service slowly loses capacity even though the database is idle.

// Java pattern; read-only snippet, not executed in-browser
if (!slots.tryAcquire()) return busy();
try { return queryDatabase(); }
finally { slots.release(); }

The recorded example below uses the real Java semaphore, but synthetic request labels and no threads or database. Only release a permit after a successful acquisition; Java does not enforce ownership for you.



## Read the visual

Two physical slots fill with request IDs. A refused request stays outside; a leaked permit becomes visibly unusable capacity.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when concurrent calls exhaust a database connection budget or a slow dependency occupies too many request handlers.

**Practical example.** Give a report endpoint two synthetic permits in this lesson; in production choose a measured budget per dependency and account for all service replicas.

**How to decide.** Use admission control before the expensive work. A queue may be appropriate for durable batch jobs, but bound its size and waiting time separately.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var slots = new java.util.concurrent.Semaphore(2);
boolean a = slots.tryAcquire();
int free = slots.availablePermits();
boolean b = slots.tryAcquire();
boolean c = slots.tryAcquire();
free = slots.availablePermits();
slots.release();
boolean d = slots.tryAcquire();
free = slots.availablePermits();
```

1. A takes the first real Java permit.

   Changed values: `{"slots": "java.util.concurrent.Semaphore@1198b989[Permits = 1]", "a": "true", "free": "1"}`

2. B takes the second; C cannot acquire.

   Changed values: `{"slots": "java.util.concurrent.Semaphore@1198b989[Permits = 0]", "free": "0", "b": "true", "c": "false"}`

3. A completes and returns one permit; D acquires it.

   Changed values: `{"d": "true"}`

[Full runnable example](examples/software-engineering.java).

Limits: Executed Java 17 semaphore calls in one thread. No real dependency, contention or waiting-time measurements.

## Explore (remaining exploration time)

Send A, B and C before completing any request. Predict which reaches the database. Complete one, send D, then try the permit-leak failure.

Open software-engineering.html for the executable model.

Model limits: Actual browser JavaScript models one process with two slots and FIFO completion chosen for illustration. It does not simulate threads, rate limiting, distributed limits or real query latency.

## Quiz (4 minutes)

1. A and B occupy both slots. C calls tryAcquire(). What happens?
   - C waits forever
   - C fails to acquire and should avoid the DB call
   - The semaphore creates a slot

2. Why release in finally after acquiring?
   - To return capacity even when work throws
   - To undo a committed DB transaction
   - To guarantee FIFO admission

3. Ten replicas each have two permits. Is the fleet limited to two calls?
   - Yes
   - Only if requests are fast
   - No; up to twenty modeled concurrent calls

4. Where would you acquire and release a permit around an asynchronous client call?
5. What metrics distinguish full healthy capacity from leaked permits?

<details><summary>Answer key — attempt first</summary>

1. C fails to acquire and should avoid the DB call. tryAcquire returns false when no permit is available. The application must turn that into its chosen busy response; it is not an automatic HTTP response.

2. To return capacity even when work throws. finally handles normal completion and exceptions. It does not roll back database work or establish fairness.

3. No; up to twenty modeled concurrent calls. A local semaphore protects one process. Fleet-wide budgets require sizing or coordination across replicas.

</details>

## Sources

- [Java 17 Semaphore API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Semaphore.html) — Java SE 17 API; living reference; checked 2026-10-08.
