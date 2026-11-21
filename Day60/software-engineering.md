# A Phaser waits for registered parties—departing tasks must deregister

Software engineering · Day60 · 15 minutes

Coordinate changing Java worker groups without leaving a reusable barrier waiting for a task that has exited.

## Recall (2 minutes)

<p><a href="../Day39/software-engineering.html">Day39: One barrier timeout breaks the gate for every waiter</a></p><p>A times out while B waits at a three-party barrier. What happens to B?</p><details><summary>Recall first, then reveal the refresher</summary><p>B receives BrokenBarrierException. Barrier failure is all-or-none for the generation.</p></details><p><a href="../Day11/software-engineering.html">Day11: Save a few entry tickets: the token bucket</a></p><p>Five requests arrive at time zero. After 0.5 seconds one more arrives. How many total are admitted?</p><details><summary>Recall first, then reveal the refresher</summary><p>4. Three use the initial tickets. Half a second adds one ticket, so the sixth request enters. The two earlier refusals are not automatically queued.</p></details>

## Understand (4 minutes)

A hiking group counts who is still on the trail before leaving each checkpoint. If one hiker goes home but remains on the count sheet, everyone waits forever.

A Java Phaser is a reusable barrier with a party count that can change. arriveAndAwaitAdvance() reaches the checkpoint and waits. A task that will not join later phases should call arriveAndDeregister(); this records arrival now and reduces the party count for future phases.



Workers A, B, and C register for phase 0. C finishes permanently and deregisters. Phase 1 then expects only A and B. If C merely arrives without deregistering, phase 1 still expects three parties and stalls.



## Read the visual

The phase-0 register visibly loses C before the phase-1 gate, changing the number required to advance.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use Phaser when a batch has multiple reusable stages and the number of participating tasks can change.

**Practical example.** Three Kafka partition scanners finish discovery; one empty partition exits while two continue validation and publish stages.

**How to decide.** Use CountDownLatch for a one-shot fixed count and CyclicBarrier for a fixed reusable group. Use Phaser only when dynamic registration is worth its lifecycle complexity.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var p=new java.util.concurrent.Phaser(3);
p.arrive(); p.arrive();
int phase=p.arriveAndDeregister();
String result="phase="+p.getPhase()+",parties="+p.getRegisteredParties()+",returned="+phase;
```

1. Register A, B, and C for phase zero.

   Changed values: `{"p": "java.util.concurrent.Phaser@5ccddd20[phase = 0 parties = 3 arrived = 0]"}`

2. A and B arrive; C is the remaining party.

   Changed values: `{"p": "java.util.concurrent.Phaser@5ccddd20[phase = 0 parties = 3 arrived = 2]"}`

3. C arrives for phase zero and leaves future phases.

   Changed values: `{"p": "java.util.concurrent.Phaser@5ccddd20[phase = 1 parties = 2 arrived = 0]", "phase": "0"}`

4. The phase advances and only A and B remain registered.

   Changed values: `{"result": "phase=1,parties=2,returned=0"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java example is single-threaded state manipulation. It omits real blocking, exceptions, interruption, timeout recovery, forceTermination, tiering, pool starvation, and task identity bookkeeping.

## Explore (remaining exploration time)

Toggle C between deregistering and merely arriving. Predict phase-1 unarrived parties.

Open software-engineering.html for the executable model.

Model limits: The Java example is single-threaded state manipulation. It omits real blocking, exceptions, interruption, timeout recovery, forceTermination, tiering, pool starvation, and task identity bookkeeping.

## Quiz (4 minutes)

1. C will not join another phase. Which call represents that?
   - arriveAndDeregister()
   - arrive() only
   - getPhase()

2. What does arrive() alone do?
   - Records this phase's arrival but leaves the party registered
   - Removes the party forever
   - Terminates every phaser

3. What is the simpler choice for one fixed one-shot group?
   - CountDownLatch
   - Dynamic Phaser registration
   - A busy loop

4. Which worker can legitimately leave the next stage?
5. How will exceptional exits deregister or terminate the barrier?

<details><summary>Answer key — attempt first</summary>

1. arriveAndDeregister(). The party count must shrink for later phases.

2. Records this phase's arrival but leaves the party registered. Registration persists into future phases.

3. CountDownLatch. Prefer the smallest coordination primitive that matches the lifecycle.

</details>

## Sources

- [Java SE 21 Phaser](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Phaser.html) — Official Oracle API; checked November 20, 2026; checked 2026-11-20.
