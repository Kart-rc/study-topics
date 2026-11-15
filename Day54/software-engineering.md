# updateAndGet may call your function twice—keep the function free of side effects

Software engineering · Day54 · 15 minutes

Use atomic update functions for pure state calculation, not for emails, charges, counters, or audit writes that must occur once.

## Recall (2 minutes)

<p><a href="../Day36/software-engineering.html">Day36: A CompletableFuture timeout can end waiting while work keeps running</a></p><p>Caller times out at 500 ms; worker ignores cancellation. What follows?</p><details><summary>Recall first, then reveal the refresher</summary><p>The caller stops waiting while work may continue. Timeout and work termination are different events.</p></details><p><a href="../Day8/software-engineering.html">Day8: Optimistic concurrency: make a lost update fail loudly</a></p><p>Two workers read version 12; worker A commits version 13 before worker B writes. What should B&#x27;s conditional update do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Fail as a conflict so B can reread and recompute. The version mismatch converts the stale decision into an explicit conflict.</p></details>

## Understand (4 minutes)

A cashier may recalculate a total after another cashier changes the cart. Recalculating is harmless. Charging the card during each calculation is not.

AtomicReference.updateAndGet may apply its function again when contention makes an attempted update fail. The final reference update is atomic. Calls made inside the function are not rolled back. Keep the function pure: same input, calculated output, no external effect.



Two threads update config v1 to v2. Thread A's function sends an email, then loses the compare-and-set race. Java retries A's function. One v2 value commits, but two emails were sent. The fix computes v2 purely, then publishes an idempotent notification after observing the committed transition.



## Read the visual

Function calls, committed value, and external effects use separate counters, making the retry boundary impossible to confuse with exactly-once behavior.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use atomic update functions for small lock-free state transitions where the calculation can safely repeat.

**Practical example.** A service atomically swaps an immutable routing configuration while many readers continue without a lock.

**How to decide.** Keep the update function deterministic and side-effect-free. If the transition must trigger an effect, record or publish that effect outside the retryable function with an idempotency key or durable outbox. Use a lock or transaction when the state and effect must commit together.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int applyCalls=0; int emails=0; String current="v1";
applyCalls++; emails++; String candidate="v2";
boolean contention=true; if(contention){applyCalls++; emails++; candidate="v2";}
current=candidate; String result="value="+current+", calls="+applyCalls+", emails="+emails;
```

1. Create the shared value and visible side-effect counters.

   Changed values: `{"applyCalls": "0", "emails": "0", "current": "v1"}`

2. First function application calculates v2 and improperly sends email.

   Changed values: `{"applyCalls": "1", "emails": "1", "candidate": "v2"}`

3. Force the documented reapplication boundary.

   Changed values: `{"applyCalls": "2", "emails": "2", "contention": "true"}`

4. One value commits even though the effect ran twice.

   Changed values: `{"current": "v2", "result": "value=v2, calls=2, emails=2"}`

[Full runnable example](examples/software-engineering.java).

Limits: The Java and browser models force one synthetic retry. They do not control JVM scheduling, model ABA, prove lock freedom, benchmark contention, publish to an email system, or implement an outbox. Real retry counts are timing-dependent.

## Explore (remaining exploration time)

Change contention and whether the update function sends an email. Predict committed versions versus email count.

Open software-engineering.html for the executable model.

Model limits: The Java and browser models force one synthetic retry. They do not control JVM scheduling, model ABA, prove lock freedom, benchmark contention, publish to an email system, or implement an outbox. Real retry counts are timing-dependent.

## Quiz (4 minutes)

1. Contention makes the update function run twice. How many reference updates commit?
   - One, while unprotected side effects may happen twice
   - Two references commit
   - Zero by definition

2. Why must the function be side-effect-free?
   - Java may reapply it after a failed attempted update
   - AtomicReference never retries
   - Side effects make references mutable

3. What should protect a required one-time notification?
   - A durable idempotent effect path tied to the committed transition
   - A sleep inside the lambda
   - A larger heap

4. Which atomic update lambda in your services currently logs, increments a metric, or calls another system?
5. How would you make the post-commit effect idempotent and observable under retries?

<details><summary>Answer key — attempt first</summary>

1. One, while unprotected side effects may happen twice. The atomic operation commits one value; retryable function calls are a separate count.

2. Java may reapply it after a failed attempted update. A repeatable calculation is safe; a repeated email or charge is usually not.

3. A durable idempotent effect path tied to the committed transition. Move the effect outside the retryable calculation and give it its own delivery guarantee.

</details>

## Sources

- [AtomicReference (Java SE 25)](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/AtomicReference.html) — Oracle Java 25 API; checked November 14, 2026; checked 2026-11-14.
- [Package java.util.concurrent.atomic (Java SE 25)](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/package-summary.html) — Oracle Java 25 API; checked November 14, 2026; checked 2026-11-14.
