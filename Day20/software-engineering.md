# A clock can move backward: measure elapsed time with a monotonic source

Software engineering · Day20 · 15 minutes

Use a monotonic clock for durations and a wall clock for human timestamps.

## Recall (2 minutes)

<p><a href="../Day5/software-engineering.html">Day5: Consistent hashing: move a slice, not the whole keyspace</a></p><p>Why does adding a node disrupt modulo sharding broadly?</p><details><summary>Recall first, then reveal the refresher</summary><p>The divisor changes, so many hash remainders change. Placement depends directly on node count, so changing it changes many assignments.</p></details><p><a href="../Day16/software-engineering.html">Day16: Both saw a safe world: snapshot-isolation write skew</a></p><p>Under the toy Repeatable Read run, what is the final schedule?</p><details><summary>Recall first, then reveal the refresher</summary><p>Both doctors are off call. Each transaction changes a different row, so the shared invariant can fail.</p></details>

## Understand (4 minutes)

A kitchen timer measures how long the cake baked. A wall clock tells when dinner started. Correcting the wall clock should not make the timer say “minus two seconds.”

A wall clock maps to calendar time and may jump. A monotonic clock moves in one direction and is intended for elapsed comparisons.



A request starts at 12:00:00.000. During 250 ms of work, the wall clock is corrected backward by two seconds. Wall subtraction says −1750 ms; monotonic subtraction still says 250 ms.

long start = System.nanoTime();work();long elapsed = System.nanoTime() - start;



## Read the visual

The correction arrow changes the wall timeline while monotonic elapsed time stays 250 ms.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this for deadlines, retry backoff, cache-expiry checks, latency metrics, and local lease intervals.

**Practical example.** A Java service enforces a 500 ms local deadline even if time synchronization adjusts the wall clock.

**How to decide.** Use wall time for audit timestamps. Use monotonic time for local duration; its origin is arbitrary and it is not comparable across machines or restarts.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var startWall=12000000L; var startMono=1000000000L;
var endWall=11998250L; var endMono=1250000000L;
var wallElapsed=endWall-startWall; var monoElapsed=(endMono-startMono)/1000000L;
```

1. Capture synthetic starts.

   Changed values: `{"startWall": "12000000", "startMono": "1000000000"}`

2. Wall time moves back while monotonic advances.

   Changed values: `{"endWall": "11998250", "endMono": "1250000000"}`

3. Compute both durations in milliseconds.

   Changed values: `{"wallElapsed": "-1750", "monoElapsed": "250"}`

[Full runnable example](examples/software-engineering.java).

Limits: Executed Java 17 arithmetic with synthetic readings; it did not alter the host clock.

## Explore (remaining exploration time)

Toggle source and a backward correction. Predict the duration.

Open software-engineering.html for the executable model.

Model limits: The browser uses fixed values; it omits clock resolution, scheduler pauses, VM suspension, and distributed uncertainty.

## Quiz (4 minutes)

1. Wall time jumps back 2000 ms during 250 ms of work. Result?
   - 250 ms
   - A negative duration
   - A global order

2. Java source for elapsed time?
   - System.nanoTime()
   - System.getenv()
   - LocalDate.now()

3. What does nanoTime not provide?
   - Local duration
   - A calendar timestamp comparable across machines
   - A local nondecreasing source

4. Name one elapsed-time and one calendar-time use.
5. Why can a persisted monotonic reading fail after restart?

<details><summary>Answer key — attempt first</summary>

1. A negative duration. End wall time can be earlier than start.

2. System.nanoTime(). nanoTime is documented for elapsed timing.

3. A calendar timestamp comparable across machines. Its origin is arbitrary.

</details>

## Sources

- [Java System.nanoTime](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/System.html) — Java SE 25 API; checked 2026-10-10; checked 2026-10-10.
