# A worker that leaves must deregister from the next phase

Software engineering · Day42 · 15 minutes

Use Phaser for changing participation without leaving future phases waiting for a worker that has already finished.

## Recall (2 minutes)

<p><a href="../Day30/software-engineering.html">Day30: Read quickly, then validate: StampedLock optimistic reads</a></p><p>A writer acquires the write lock after the optimistic stamp. What does validate return?</p><details><summary>Recall first, then reveal the refresher</summary><p>False. A write acquisition since the stamp invalidates the optimistic read.</p></details><p><a href="../Day2/software-engineering.html">Day2: A queue buys time, not capacity</a></p><p>Backlog 300, arrivals 80/s, service 100/s. Ideal drain time?</p><details><summary>Recall first, then reveal the refresher</summary><p>15 seconds. The drain rate is spare capacity: 100 − 80 = 20/s. 300 / 20 = 15 seconds.</p></details>

## Understand (4 minutes)

Three hikers agree to regroup after every trail section. One hiker is only joining the first section. If the group still counts three people at the second checkpoint, the remaining two wait forever.

A Java Phaser is a reusable checkpoint whose registered party count may change. arriveAndAwaitAdvance() arrives and waits. arriveAndDeregister() arrives and removes that party from future phases.



Reader, validator, and publisher synchronize after phase 0. Reader has no work in phase 1, so it arrives and deregisters. Registered parties fall from three to two. Validator and publisher can then finish phase 1 together.



## Read the visual

The phase ledger exposes registered and unarrived counts. Leaving silently preserves an impossible expectation; deregistration removes it.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a Phaser when iterative or staged work has participants that may join or leave between phases.

**Practical example.** A batch pipeline has reader partitions that finish early while validation and aggregation continue through later rounds.

**How to decide.** Use CountDownLatch for one fixed countdown and CyclicBarrier for a fixed reusable party count. Choose Phaser when changing registration is the important behavior, and define timeout/termination recovery explicitly.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var phaser=new java.util.concurrent.Phaser(3); int phase0=phaser.getPhase();
phaser.arrive(); phaser.arrive();
phaser.arriveAndAwaitAdvance(); int phase1=phaser.getPhase();
phaser.arriveAndDeregister(); int registered=phaser.getRegisteredParties();
```

1. Register three parties for phase 0.

   Changed values: `{"phaser": "java.util.concurrent.Phaser@2b6856dd[phase = 0 parties = 3 arrived = 0]", "phase0": "0"}`

2. Reader and validator arrive; publisher is still unarrived.

   Changed values: `{"phaser": "java.util.concurrent.Phaser@2b6856dd[phase = 0 parties = 3 arrived = 2]"}`

3. Publisher's arrival advances phase 0.

   Changed values: `{"phaser": "java.util.concurrent.Phaser@2b6856dd[phase = 1 parties = 3 arrived = 0]", "phase1": "1"}`

4. Reader exits and future phases expect only two parties.

   Changed values: `{"phaser": "java.util.concurrent.Phaser@2b6856dd[phase = 1 parties = 2 arrived = 0]", "registered": "2"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java replay is single-threaded bookkeeping that calls Phaser methods in a safe order; it does not create real worker races, timeouts, interruption, forceTermination, tiered phasers, ForkJoinPool blocking, or task failure recovery.

## Explore (remaining exploration time)

Toggle whether the reader deregisters. Step through phase 0 and inspect the registered and unarrived counts for phase 1.

Open software-engineering.html for the executable model.

Model limits: The Java replay is single-threaded bookkeeping that calls Phaser methods in a safe order; it does not create real worker races, timeouts, interruption, forceTermination, tiered phasers, ForkJoinPool blocking, or task failure recovery.

## Quiz (4 minutes)

1. Reader is finished but remains registered. Two remaining workers arrive. What happens?
   - Phase waits for the missing third arrival
   - Phaser guesses reader left
   - Party count becomes two automatically

2. Why use arriveAndDeregister rather than arrive alone?
   - It removes the party from future phase counts
   - It cancels every worker
   - It increases the party count

3. When is CountDownLatch simpler?
   - One fixed, one-time countdown
   - Participants change every phase
   - The barrier repeats indefinitely

4. Which staged workflow has workers that naturally leave before the final phase?
5. What timeout or termination policy prevents a failed worker from stalling the rest?

<details><summary>Answer key — attempt first</summary>

1. Phase waits for the missing third arrival. Registration is explicit; abandoning work does not deregister a party.

2. It removes the party from future phase counts. The current arrival is recorded and later phases no longer expect that worker.

3. One fixed, one-time countdown. A latch is clearer when no reusable or dynamic phases are needed.

</details>

## Sources

- [Java 26 Phaser API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/Phaser.html) — Official Java API; checked November 1, 2026; checked 2026-11-01.
- [Java 17 Phaser API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Phaser.html) — Official Java API; checked November 1, 2026; checked 2026-11-01.
