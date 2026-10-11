# Publish one configuration snapshot, not three changing fields

Software engineering · Day21 · 15 minutes

Let every request observe one complete configuration version instead of an impossible mixture.

## Recall (2 minutes)

<p><a href="../Day6/software-engineering.html">Day6: Hedged requests: duplicate only the stragglers</a></p><p>Why delay a hedge instead of sending two copies immediately?</p><details><summary>Recall first, then reveal the refresher</summary><p>To target stragglers and limit extra load. The delay lets ordinary requests finish without paying for a duplicate.</p></details><p><a href="../Day13/software-engineering.html">Day13: Read two, write two: why quorums overlap</a></p><p>With N=3, W=2, and R=2, what is guaranteed for strict quorums?</p><details><summary>Recall first, then reveal the refresher</summary><p>The read and write responder sets intersect. Because 2 + 2 &gt; 3, the two sets cannot be disjoint.</p></details>

## Understand (4 minutes)

Imagine replacing a restaurant menu one page at a time while customers are ordering. A reader can combine prices from the old menu with rules from the new one.

Build a complete immutable configuration, then publish one reference to it. Each request reads that reference once. The formal mechanism is an atomic snapshot publication.



Version 1 is {timeout:1000, retries:2, route:A}. Version 2 is {timeout:400, retries:0, route:B}. Three separate field writes can expose {1000,0,B}, a version that never existed. One AtomicReference<Config> yields either v1 or v2.



## Read the visual

The three field boxes can show a tuple that never existed. Snapshot mode restricts the visual to exactly v1 or v2.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when many request threads read related configuration fields while a control-plane thread refreshes them.

**Practical example.** Publish routing, timeout, and retry policy together in a Java service after validating the full update.

**How to decide.** Use an immutable snapshot for coherent read-mostly state. Use locks or a database transaction when readers must coordinate mutations, not only observe a version.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
record Config(int timeoutMs, int retries, String route) {}
var config=new java.util.concurrent.atomic.AtomicReference<>(new Config(1000,2,"A"));
var before=config.get();
config.set(new Config(400,0,"B"));
var after=config.get();
```

1. Create and publish v1.

   Changed values: `{}`

2. One reader captures v1 once.

   Changed values: `{"before": "Config[timeoutMs=1000, retries=2, route=A]"}`

3. Publish v2 with one atomic reference write.

   Changed values: `{"after": "Config[timeoutMs=400, retries=0, route=B]"}`

[Full runnable example](examples/software-engineering.java).

Limits: Executed on local Java 17. It demonstrates reference publication, not a race detector or a distributed configuration service.

## Explore (remaining exploration time)

Switch from separate fields to one snapshot and move the reader between update steps. Find the impossible mixed version.

Open software-engineering.html for the executable model.

Model limits: The browser fixes one interleaving. Atomic publication does not validate configuration, coordinate external systems, or make mutable objects inside the snapshot safe.

## Quiz (4 minutes)

1. Reader sees {1000,0,B}. What does that prove?
   - It saw one valid version
   - It combined separately published fields
   - AtomicReference is broken

2. What should a request do with the AtomicReference?
   - Call get once and use that Config
   - Call get before every field
   - Mutate the Config

3. What remains outside this pattern?
   - Safe publication
   - Cross-system atomic rollout
   - Reading one version

4. Which fields in your service must change as one version?
5. What mutable object would accidentally weaken an “immutable” snapshot?

<details><summary>Answer key — attempt first</summary>

1. It combined separately published fields. That tuple exists in neither v1 nor v2.

2. Call get once and use that Config. One read pins one coherent version for that decision.

3. Cross-system atomic rollout. The snapshot is local process state, not a distributed transaction.

</details>

## Sources

- [Java SE 25 AtomicReference](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/AtomicReference.html) — Java SE 25 API; checked 2026-10-11.
- [Java SE 25 concurrent package memory consistency](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html) — Java SE 25 API; checked 2026-10-11.
