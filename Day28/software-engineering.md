# Two workers wait for children that cannot start

Software engineering · Day28 · 15 minutes

Recognize thread-pool starvation caused by blocking on work submitted to the same full pool.

## Recall (2 minutes)

<p><a href="../Day23/software-engineering.html">Day23: Silence raises suspicion; it does not prove a node is dead</a></p><p>Lowering the phi threshold does what?</p><details><summary>Recall first, then reveal the refresher</summary><p>Faster detection and more false suspicions. The policy fires on less evidence.</p></details><p><a href="../Day11/software-engineering.html">Day11: Save a few entry tickets: the token bucket</a></p><p>Five requests arrive at time zero. After 0.5 seconds one more arrives. How many total are admitted?</p><details><summary>Recall first, then reveal the refresher</summary><p>4. Three use the initial tickets. Half a second adds one ticket, so the sixth request enters. The two earlier refusals are not automatically queued.</p></details>

## Understand (4 minutes)

Imagine two cooks in a two-cook kitchen. Each cook starts a meal, asks another cook to prepare a side dish, then stands still waiting. Both cooks are occupied, so neither side dish can start. Nothing is locked, but progress stops.

A fixed thread pool can starve the same way: parent tasks occupy every worker, submit child tasks to the same executor, and block on Future.get().



Pool size = 2. Parent A and Parent B are running. Each queues one child and waits. Active workers stay at 2, queued children become 2, completed tasks stay at 0. Fix the dependency shape: compose asynchronously, give blocking children a separate appropriately bounded executor, or use structured concurrency whose lifetime is explicit.



## Read the visual

The board makes capacity a conserved quantity: when both worker slots contain waiting parents, the queued children have nowhere to run.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Look for this when requests hang while CPU is low, the executor is fully active, and queued work grows.

**Practical example.** Two batch coordinators in a two-thread pool each submit a partition read to that same pool and immediately call get().

**How to decide.** Do not size away a dependency cycle. Remove the blocking wait or put child work on a separate bounded resource with an explicit ownership model.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
pool_size=2
parents_running=2
children_queued=parents_running
free_workers=pool_size-parents_running
progress=children_queued>0 and free_workers>0
```

1. Create a bounded two-worker pool model.

   Changed values: `{"pool_size": 2}`

2. Both workers begin parent tasks.

   Changed values: `{"parents_running": 2}`

3. Each parent submits one child to the same pool.

   Changed values: `{"children_queued": 2}`

4. No worker remains to start a child.

   Changed values: `{"free_workers": 0, "progress": false}`

[Full runnable example](examples/software-engineering.py).

Limits: The model assumes a fixed pool, unbounded queue, and blocking parents. ForkJoinPool, virtual threads, rejection policies, timeouts, external I/O limits, and structured concurrency have different behavior and still require bounded-resource reasoning.

## Explore (remaining exploration time)

Move from one parent to two parents. The occupancy board shows the exact point at which children lose every path to a worker.

Open software-engineering.html for the executable model.

Model limits: The model assumes a fixed pool, unbounded queue, and blocking parents. ForkJoinPool, virtual threads, rejection policies, timeouts, external I/O limits, and structured concurrency have different behavior and still require bounded-resource reasoning.

## Quiz (4 minutes)

1. Why can the children not run?
   - All workers are occupied by waiting parents
   - The queue is empty
   - Future.get creates threads

2. Best structural fix?
   - Add threads forever
   - Remove the blocking dependency or isolate it on a bounded executor
   - Retry the parents

3. What signal makes this likely?
   - Low CPU, full active pool, growing queue
   - High CPU and empty queue
   - Zero submitted work

4. Where does your code submit nested work and then block on it?
5. Which metric would distinguish starvation from CPU saturation?

<details><summary>Answer key — attempt first</summary>

1. All workers are occupied by waiting parents. The children need the same workers that their parents refuse to release.

2. Remove the blocking dependency or isolate it on a bounded executor. Changing the dependency shape removes the starvation cycle.

3. Low CPU, full active pool, growing queue. Occupied-but-waiting workers plus queued children is the tell.

</details>

## Sources

- [Java ThreadPoolExecutor](https://docs.oracle.com/en/java/javase/27/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html) — Java SE 27; checked 2026-10-18.
- [Java ExecutorService](https://docs.oracle.com/en/java/javase/27/docs/api/java.base/java/util/concurrent/ExecutorService.html) — Java SE 27; checked 2026-10-18.
- [Java structured concurrency guide](https://docs.oracle.com/en/java/javase/27/core/structured-concurrency.html) — Java SE 27; checked 2026-10-18.
