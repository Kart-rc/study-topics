# JDK 24 removed one virtual-thread pinning trap—not every bottleneck

Software engineering · Day48 · 15 minutes

Explain what JEP 491 changed and avoid turning a JVM upgrade into an unlimited-concurrency claim.

## Recall (2 minutes)

<p><a href="../Day33/software-engineering.html">Day33: A pooled thread remembers the last tenant unless you clean it</a></p><p>Request A sets east and omits cleanup. Request B runs on the same worker without setting a value. What can get() return?</p><details><summary>Recall first, then reveal the refresher</summary><p>east. The value belongs to the reused worker thread.</p></details><p><a href="../Day5/software-engineering.html">Day5: Consistent hashing: move a slice, not the whole keyspace</a></p><p>Why does adding a node disrupt modulo sharding broadly?</p><details><summary>Recall first, then reveal the refresher</summary><p>The divisor changes, so many hash remainders change. Placement depends directly on node count, so changing it changes many assignments.</p></details>

## Understand (4 minutes)

A hotel has many guests but only a few elevators. Before JDK 24, a virtual thread blocking inside synchronized could keep its carrier platform thread occupied—like a guest holding an elevator while waiting. JEP 491 changed monitor handling so that this synchronized-block case can unmount and free the carrier.

The change improves scalability; it does not make blocking work free. Native calls, CPU, downstream connection pools, rate limits, and memory remain real constraints.



Two carrier threads serve 1,000 virtual requests. In the old teaching model, two requests sleep inside synchronized blocks and occupy both carriers, so other requests stall. In JDK 24+, those waits can release the carriers. The database still has only 20 connections, so admitting 1,000 queries simply moves the queue.



## Read the visual

Two bottleneck gates are shown in sequence. Switching JDK mode expands the carrier gate but leaves the database gate unchanged, so the model teaches bottleneck movement rather than magic speed.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this distinction when upgrading Java 21 services that use virtual threads around synchronized blocking I/O or when reviewing outdated pinning advice.

**Practical example.** A Spring service enters synchronized cache code and then waits on a remote metadata call.

**How to decide.** Upgrade and remeasure before rewriting locks solely for monitor pinning. Keep explicit concurrency limits at scarce downstream resources, and investigate remaining native or foreign-function pinning with current JFR/JDK evidence.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int carriers=2; int requests=20; int dbPermits=8;
int jdk21Progress=Math.min(carriers,dbPermits);
int jdk24Progress=Math.min(requests,dbPermits);
String result="JDK21="+jdk21Progress+", JDK24="+jdk24Progress;
```

1. Model many virtual requests over two carriers and one downstream pool.

   Changed values: `{"carriers": "2", "requests": "20", "dbPermits": "8"}`

2. Old monitor-pinning model caps progress at carriers.

   Changed values: `{"jdk21Progress": "2"}`

3. After the monitor fix, the database becomes the modeled limit.

   Changed values: `{"jdk24Progress": "8"}`

4. The bottleneck moves; capacity is not created.

   Changed values: `{"result": "JDK21=2, JDK24=8"}`

[Full runnable example](examples/software-engineering.java).

Limits: This is queue arithmetic, not a JVM scheduler benchmark. It omits monitor implementation, native frames, scheduler compensation, JFR events, CPU work, memory, connection-pool behavior, fairness, and application latency distributions.

## Explore (remaining exploration time)

Change the JDK mode, carrier count, and database capacity. Predict whether the bottleneck is carrier pinning or the database permit pool.

Open software-engineering.html for the executable model.

Model limits: This is queue arithmetic, not a JVM scheduler benchmark. It omits monitor implementation, native frames, scheduler compensation, JFR events, CPU work, memory, connection-pool behavior, fairness, and application latency distributions.

## Quiz (4 minutes)

1. What did JEP 491 change?
   - Virtual threads blocking in synchronized constructs can release carrier threads
   - Every blocking call became nonblocking
   - Database pools became unnecessary

2. Why retain downstream permits?
   - Virtual threads do not increase database or API capacity
   - JEP 491 disables semaphores
   - Permits make CPU infinite

3. What should an upgrade decision include?
   - Current-JDK measurements and remaining bottlenecks
   - Only Java 21 folklore
   - Replacing every synchronized block automatically

4. Which service still carries a Java 21-era virtual-thread workaround?
5. What scarce downstream resource becomes the next queue after the upgrade?

<details><summary>Answer key — attempt first</summary>

1. Virtual threads blocking in synchronized constructs can release carrier threads. The targeted change removes monitor-related carrier pinning.

2. Virtual threads do not increase database or API capacity. Concurrency still needs to respect scarce external resources.

3. Current-JDK measurements and remaining bottlenecks. Upgrade evidence may remove the original reason for lock rewrites.

</details>

## Sources

- [JEP 491: Synchronize Virtual Threads without Pinning](https://openjdk.org/jeps/491) — Official OpenJDK enhancement; delivered in JDK 24; checked November 8, 2026; checked 2026-11-08.
- [Oracle JDK 24 significant changes](https://docs.oracle.com/en/java/javase/25/migrate/significant-changes-jdk-24.html) — Official Oracle migration documentation; checked November 8, 2026; checked 2026-11-08.
- [Oracle Java SE 25 virtual threads](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html) — Official Oracle documentation; checked November 8, 2026; checked 2026-11-08.
