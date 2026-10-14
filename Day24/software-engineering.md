# An interrupt is a stop request—do not erase it

Software engineering · Day24 · 15 minutes

Preserve Java cancellation by understanding that InterruptedException clears the thread's interrupt flag.

## Recall (2 minutes)

<p><a href="../Day8/software-engineering.html">Day8: Optimistic concurrency: make a lost update fail loudly</a></p><p>Two workers read version 12; worker A commits version 13 before worker B writes. What should B&#x27;s conditional update do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Fail as a conflict so B can reread and recompute. The version mismatch converts the stale decision into an explicit conflict.</p></details><p><a href="../Day15/software-engineering.html">Day15: Stop, drain, then force: graceful shutdown</a></p><p>With 8 seconds of work and 10 seconds of grace, what happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>O42 finishes and the process exits cleanly. Stopping admission first leaves enough time for the in-flight request to finish.</p></details>

## Understand (4 minutes)

An interrupt is like a hotel wake-up call: it asks the sleeper to stop waiting and check what to do next. In Java, blocking calls such as sleep throw InterruptedException and clear the interrupt status. If code catches the exception and does nothing, the outer loop may never learn that shutdown was requested.

If this layer cannot finish the cancellation itself, either rethrow InterruptedException or restore the flag with Thread.currentThread().interrupt().



A worker polls Kafka, batches records, then sleeps for backoff. Deployment shutdown interrupts it. The bad catch logs and retries forever. The fixed catch restores the flag, and the outer loop exits before starting another batch.



## Read the visual

The flag is high when interruption is requested, drops when sleep throws, and rises again only if the catch restores it. The last node shows the application consequence.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use cooperative interruption for executor cancellation, service shutdown and bounded background work.

**Practical example.** A rolling deployment interrupts a worker during retry backoff so it can stop before its termination grace period expires.

**How to decide.** Rethrow when the method contract allows it; otherwise restore the flag and return or let an outer owner decide. Do not use interrupt as a force-kill or assume arbitrary code will stop.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
Thread.currentThread().interrupt(); boolean beforeSleep=Thread.currentThread().isInterrupted();
boolean caught=false;
try { Thread.sleep(1); } catch (InterruptedException e) { caught=true; }; boolean afterCatch=Thread.currentThread().isInterrupted();
Thread.currentThread().interrupt();
boolean restored=Thread.currentThread().isInterrupted();
String action=restored ? "stop" : "continue";
```

1. Set the current thread's interrupt flag.

   Changed values: `{"beforeSleep": "true"}`

2. Sleep detects the flag, throws, and clears it.

   Changed values: `{"caught": "true", "afterCatch": "false"}`

3. Restore the flag so the outer owner chooses stop.

   Changed values: `{"restored": "true", "action": "stop"}`

[Full runnable example](examples/software-engineering.java).

Limits: Executed on the build Java runtime using the current thread; no executor, I/O, Kafka client or shutdown race was involved.

## Explore (remaining exploration time)

Toggle the catch behavior and watch the flag after sleep, after catch, and at the loop boundary.

Open software-engineering.html for the executable model.

Model limits: The browser visual is a state machine, not a Java VM or scheduler. The recorded Java example proves the documented flag changes on this runtime, not application safety under every race.

## Quiz (4 minutes)

1. What happens to interrupt status when sleep throws InterruptedException?
   - It remains set
   - It is cleared
   - The process exits

2. A catch cannot rethrow InterruptedException. What usually preserves cancellation?
   - Ignore it
   - Restore status with Thread.currentThread().interrupt()
   - Start a new thread

3. What does interrupt guarantee?
   - Immediate forceful termination
   - A cooperative signal that code must handle
   - Database rollback

4. Where in your worker should cancellation ownership live?
5. What cleanup must happen before the worker returns?

<details><summary>Answer key — attempt first</summary>

1. It is cleared. The blocking method clears status when it throws.

2. Restore status with Thread.currentThread().interrupt(). Restoring status lets outer code observe the request.

3. A cooperative signal that code must handle. Interruption is cooperative, not a kill switch.

</details>

## Sources

- [Java SE 26 InterruptedException](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/InterruptedException.html) — Java SE 26 API; checked 2026-10-14.
- [Java SE 25 Thread interrupt](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.html#interrupt()) — Java SE 25 API; checked 2026-10-14.
