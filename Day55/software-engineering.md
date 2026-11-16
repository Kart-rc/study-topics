# A semaphore permit belongs in finally—even when the task throws

Software engineering · Day55 · 15 minutes

Return capacity after every acquired path without creating extra permits when acquisition never succeeded.

## Recall (2 minutes)

<p><a href="../Day31/software-engineering.html">Day31: Fast counters with a fuzzy snapshot: LongAdder</a></p><p>Why can LongAdder outperform AtomicLong under heavy write contention?</p><details><summary>Recall first, then reveal the refresher</summary><p>Updates can spread across multiple variables. Striping reduces contention on one hot variable.</p></details><p><a href="../Day35/software-engineering.html">Day35: The work failure stays primary; close failures become suppressed</a></p><p>The try body and close both throw. Which is propagated?</p><details><summary>Recall first, then reveal the refresher</summary><p>The body exception, with close attached as suppressed. Try-with-resources preserves the work failure as the primary cause.</p></details>

## Understand (4 minutes)

A parking garage with two tickets can admit two cars. If a driver leaves through a broken gate and never returns the ticket, the garage slowly appears full even when spaces are empty.

A Java Semaphore is that ticket counter. acquire() removes a permit; release() adds one. Work can throw after acquisition. Put release in finally, but only after acquisition succeeded. Java does not enforce permit ownership, so an unconditional release after a failed acquire can inflate capacity instead.



The payment client allows two calls. Request A acquires a permit and throws. Without finally, available permits fall from two to one forever. With guarded cleanup, A returns its permit and request C can start.



## Read the visual

The permit counter changes beside a forced failure, exposing both the leak and the exact cleanup that restores capacity.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a semaphore to cap concurrent access to a scarce dependency that lacks its own adequate backpressure.

**Practical example.** A Java service allows at most two concurrent calls to a fragile partner API while a larger executor handles other work.

**How to decide.** Prefer a client or executor with a native concurrency limit when available. If a semaphore is needed, bound waiting, handle interruption, acquire before the try body, and release in finally only when acquired.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int permits=2; boolean acquired=false;
permits--; acquired=true;
boolean failed=true;
if(acquired) permits++; String result="failed="+failed+", permits="+permits;
```

1. Create a two-permit gate and remember whether this path owns one.

   Changed values: `{"permits": "2", "acquired": "false"}`

2. Request A acquires one permit.

   Changed values: `{"permits": "1", "acquired": "true"}`

3. Force the protected operation to fail.

   Changed values: `{"failed": "true"}`

4. Run guarded finally cleanup and report restored capacity.

   Changed values: `{"permits": "2", "result": "failed=true, permits=2"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java and browser models use integer counters and a forced exception. They do not schedule threads, prove fairness, model interruption races, enforce permit ownership, call a partner API, or benchmark throughput.

## Explore (remaining exploration time)

Switch between missing and guarded finally cleanup. Predict the available permit count after request A throws.

Open software-engineering.html for the executable model.

Model limits: The Java and browser models use integer counters and a forced exception. They do not schedule threads, prove fairness, model interruption races, enforce permit ownership, call a partner API, or benchmark throughput.

## Quiz (4 minutes)

1. A acquires one of two permits and throws. No finally runs release. What remains?
   - One available permit; capacity has leaked
   - Two permits because exceptions reset semaphores
   - Three permits

2. Why guard release with an acquired flag?
   - A failed or interrupted acquire must not create a permit it never took
   - Fair semaphores require it syntactically
   - release throws unless called by the owner

3. What does semaphore fairness not guarantee?
   - End-to-end request fairness or freedom from timeouts and downstream overload
   - FIFO selection at documented acquisition points
   - A capacity bound

4. Which semaphore in your services can leak a permit on an exception or early return?
5. Where could unconditional release inflate capacity after interruption?

<details><summary>Answer key — attempt first</summary>

1. One available permit; capacity has leaked. Semaphore state changes only through acquire and release.

2. A failed or interrupted acquire must not create a permit it never took. Semaphore has no ownership check; application convention preserves the count.

3. End-to-end request fairness or freedom from timeouts and downstream overload. A fair semaphore only addresses its own queueing policy and even untimed tryAcquire may barge.

</details>

## Sources

- [Java SE 25: Semaphore](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Semaphore.html) — Oracle Java API specification; checked November 15, 2026; checked 2026-11-15.
- [Java SE 25 Core Libraries Developer Guide](https://docs.oracle.com/en/java/javase/25/core/java-core-libraries-developer-guide.pdf) — Oracle developer guide; 2026 edition; checked November 15, 2026; checked 2026-11-15.
