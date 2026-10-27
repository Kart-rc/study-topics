# computeIfAbsent is atomic; the loader must still be short

Software engineering · Day37 · 15 minutes

Use ConcurrentHashMap.computeIfAbsent for small atomic initialization without turning a map bin into a slow remote-call queue.

## Recall (2 minutes)

<p><a href="../Day22/software-engineering.html">Day22: The reply happened after the request—even when its wall clock says earlier</a></p><p>B wall=95 receives (100,0). Its next HLC is?</p><details><summary>Recall first, then reveal the refresher</summary><p>(100,1). The received physical value wins and the logical counter advances.</p></details><p><a href="../Day26/software-engineering.html">Day26: A savepoint can undo the optional step—not the whole order</a></p><p>After an optional PostgreSQL statement errors, what enables the transaction to continue?</p><details><summary>Recall first, then reveal the refresher</summary><p>ROLLBACK TO the earlier savepoint. Rolling back to the savepoint restores the transaction state before the optional step.</p></details>

## Understand (4 minutes)

A coat-check clerk can assign one hook number atomically. If the clerk leaves the desk for an eight-second phone call while holding the assignment book, other updates may wait.

ConcurrentHashMap.computeIfAbsent performs the invocation atomically for an absent key. Oracle documents that some attempted updates may block while the function runs, so the mapping function should be short and simple and must not update the same map.



Two requests miss tenant acme at the same time. A fast mapping creates an empty PolicyHolder; asynchronous refresh fills it later. A slow mapping that calls a policy service for 800 ms can make unrelated updates contend and makes failure handling live inside an atomic map operation.



## Read the visual

The single-key lane shows why an atomic function can become a queue. The waiting updater changes state when the mapping crosses the declared short-work threshold or performs remote I/O.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use computeIfAbsent for cheap construction such as a local holder, counter, lock, or memoized value with bounded computation.

**Practical example.** Create one per-tenant circuit-breaker holder atomically, then let the holder manage remote refresh outside the map computation.

**How to decide.** Keep the mapping pure, short, and non-recursive. For slow I/O, store a promise/holder deliberately or use a cache library with explicit loading, expiry, failure, and refresh behavior.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var cache = new java.util.concurrent.ConcurrentHashMap<String,String>();
String value = cache.computeIfAbsent("acme", key -> "policy-holder-v1");
boolean secondCallHits = cache.computeIfAbsent("acme", key -> "other") == value;
String outcome = secondCallHits ? "one holder" : "unexpected";
```

1. Create a thread-safe map.

   Changed values: `{"cache": "{}"}`

2. Atomically install one small local value.

   Changed values: `{"cache": "{acme=policy-holder-v1}", "value": "policy-holder-v1"}`

3. The second call observes the existing mapping.

   Changed values: `{"secondCallHits": "true"}`

4. Record the local result; this does not benchmark contention.

   Changed values: `{"outcome": "one holder"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser uses a deterministic wait arithmetic model. It does not run threads, model ConcurrentHashMap bin structure, scheduler timing, exceptions, null returns, cache eviction, stampedes after failure, visibility beyond documented map guarantees, or prove throughput. The Java replay only executes one local map initialization.

## Explore (remaining exploration time)

Change loader duration and whether it performs remote I/O. Watch the single absent-key lane become a waiting line.

Open software-engineering.html for the executable model.

Model limits: The browser uses a deterministic wait arithmetic model. It does not run threads, model ConcurrentHashMap bin structure, scheduler timing, exceptions, null returns, cache eviction, stampedes after failure, visibility beyond documented map guarantees, or prove throughput. The Java replay only executes one local map initialization.

## Quiz (4 minutes)

1. The mapping function calls a remote service for 800 ms. Main risk?
   - Other attempted updates may block while the atomic computation runs
   - The value is inserted twice by definition
   - ConcurrentHashMap becomes a HashMap

2. Why create a small holder in the mapping function?
   - It keeps atomic initialization short while moving lifecycle work elsewhere
   - It disables concurrency
   - It guarantees cache eviction

3. What must the mapping function avoid?
   - Recursive updates to the same map
   - Returning a local object
   - Reading its key

4. Which computeIfAbsent functions in your services perform I/O, logging, or recursive cache access?
5. Design a holder or explicit loader that keeps publication short without hiding refresh failures.

<details><summary>Answer key — attempt first</summary>

1. Other attempted updates may block while the atomic computation runs. Atomicity does not make slow work cheap.

2. It keeps atomic initialization short while moving lifecycle work elsewhere. Separate map publication from remote loading policy.

3. Recursive updates to the same map. The documented contract forbids modifying the map during computation.

</details>

## Sources

- [Java SE 17 ConcurrentHashMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html) — Official Java 17 API; checked 2026-10-27.
- [Java SE 17 Map](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html) — Official Java 17 API; checked 2026-10-27.
