# The reply happened after the request—even when its wall clock says earlier

Software engineering · Day22 · 15 minutes

Use a hybrid logical clock to preserve causal order without pretending physical clocks are perfectly synchronized.

## Recall (2 minutes)

<p><a href="../Day19/software-engineering.html">Day19: A returned value can hide a changed history: the ABA problem</a></p><p>W1 read A,v0. Current state is A,v2. What should stamped CAS do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Fail because v0 is stale. The stamp exposes the intervening A→B→A history.</p></details><p><a href="../Day7/software-engineering.html">Day7: Deadline propagation: pass the remaining budget</a></p><p>A service spends 140 ms of a 500 ms deadline before a child call. What budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>360 ms. Propagation deducts elapsed time from the original end-to-end budget.</p></details>

## Understand (4 minutes)

Two office clocks disagree. A reply can appear to happen before the request if you sort only by wall time.

A hybrid logical clock stores (physical, logical). It follows the wall clock when possible. When a received event is already ahead, it keeps that physical value and increments the logical counter.



Node A sends at wall time 100 with HLC (100,0). Node B’s clock reads 95. After receiving the message, B replies with (100,1). The reply sorts after the request even though B’s wall clock is behind.



## Read the visual

The two lifelines keep their disagreeing wall clocks visible while the arrows carry HLC values; the counter, not a fabricated wall-clock jump, orders the reply.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use HLC timestamps when you need a compact, roughly wall-time-ordered label that respects observed message causality across nodes.

**Practical example.** Order changes from two regions are tagged so a received update and its reply cannot be reversed by clock skew.

**How to decide.** Use HLC for causality plus approximate time. Use a consensus log for one authoritative total order, and vector clocks when you need to distinguish concurrency precisely.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
record Hlc(long physical, int logical) {}
var request=new Hlc(100,0);
long bWall=95;
long p=Math.max(bWall,request.physical());
int l=(p==request.physical())?request.logical()+1:0;
var reply=new Hlc(p,l);
```

1. Define the timestamp pair.

   Changed values: `{}`

2. Record the request and B wall clock.

   Changed values: `{"request": "Hlc[physical=100, logical=0]"}`

3. Advance B physical time to the larger observed value.

   Changed values: `{}`

4. Break the physical-time tie with the logical counter.

   Changed values: `{"l": "1", "reply": "Hlc[physical=100, logical=1]"}`

[Full runnable example](examples/software-engineering.java).

Limits: Executed on local Java 17 over synthetic timestamps. It did not test a distributed datastore or clock-drift bound.

## Explore (remaining exploration time)

Change B’s wall clock from 95 to 105 and watch whether the physical component or logical counter advances.

Open software-engineering.html for the executable model.

Model limits: This two-node model omits clock bounds, persistence across restart, overflow, concurrent events, and database-specific tie breaking. HLC does not create consensus.

## Quiz (4 minutes)

1. B wall=95 receives (100,0). Its next HLC is?
   - (95,0)
   - (100,1)
   - (101,0)

2. What does HLC guarantee here?
   - Global consensus
   - Observed request sorts before its reply
   - Perfect clocks

3. When is HLC insufficient?
   - One authoritative write order must be agreed by replicas
   - A reply follows a request
   - Approximate wall time is useful

4. Where would HLC state need durable storage across a service restart?
5. Which of your ordering requirements actually needs consensus instead?

<details><summary>Answer key — attempt first</summary>

1. (100,1). The received physical value wins and the logical counter advances.

2. Observed request sorts before its reply. It preserves the happened-before edge without synchronizing clocks.

3. One authoritative write order must be agreed by replicas. Agreement requires a coordination/consensus mechanism.

</details>

## Sources

- [Logical Physical Clocks and Consistent Snapshots in Globally Distributed Databases](https://cse.buffalo.edu/~demirbas/publications/hlc.pdf) — Original paper · 2014; checked 2026-10-12.
