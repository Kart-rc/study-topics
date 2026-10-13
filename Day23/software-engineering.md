# Silence raises suspicion; it does not prove a node is dead

Software engineering · Day23 · 15 minutes

Turn heartbeat delay into an adjustable suspicion score instead of one brittle timeout.

## Recall (2 minutes)

<p><a href="../Day18/software-engineering.html">Day18: Two slots, no waiting room: cap in-flight work with a semaphore</a></p><p>A and B occupy both slots. C calls tryAcquire(). What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>C fails to acquire and should avoid the DB call. tryAcquire returns false when no permit is available. The application must turn that into its chosen busy response; it is not an automatic HTTP response.</p></details><p><a href="../Day20/software-engineering.html">Day20: A clock can move backward: measure elapsed time with a monotonic source</a></p><p>Wall time jumps back 2000 ms during 250 ms of work. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>A negative duration. End wall time can be earlier than start.</p></details>

## Understand (4 minutes)

A friend who usually replies in one minute is concerning after five minutes. A friend who often replies in ten minutes is not. The same silence means different things because history differs.

A phi-accrual detector converts time since the last heartbeat into a suspicion score. The application chooses a threshold. A lower threshold reacts faster but causes more false suspicions.



Node B normally replies around every 1 second. At 1.2 seconds, suspicion is modest. At 4 seconds, it is high. Under a noisy network with wider historical variation, the same 1.2-second pause should look less alarming.



## Read the visual

The suspicion meter changes with both elapsed silence and historical jitter, making the central idea visible: the same delay is not equally surprising in every network.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use adaptive suspicion when cluster heartbeat timing varies and downstream policies need a continuous confidence signal.

**Practical example.** An Akka cluster monitors JVM nodes across a network where occasional pauses are normal.

**How to decide.** Use phi to separate measurement from policy. Do not equate “unreachable” with “permanently failed”; membership removal still needs a coordinated policy.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
double mean=1.0, sd=0.5, elapsed=1.2;
double z=(elapsed-mean)/sd;
double cdf=1.0/(1.0+Math.exp(-1.702*z));
double phi=-Math.log10(Math.max(1e-9,1-cdf));
boolean suspect=phi>=3.0;
```

1. Set learned timing parameters and current silence.

   Changed values: `{"mean": "1.0"}`

2. Approximate the normal CDF for this small teaching trace.

   Changed values: `{"z": "0.3999999999999999", "cdf": "0.6639172257204139"}`

3. Convert tail probability into suspicion and apply policy.

   Changed values: `{"phi": "0.473553746462499", "suspect": "false"}`

[Full runnable example](examples/software-engineering.java).

Limits: Executed on local Java 17 using synthetic timing parameters and a logistic CDF approximation. It did not instantiate Akka or learn heartbeat samples.

## Explore (remaining exploration time)

Change elapsed silence and network variability. Predict whether phi crosses the policy threshold.

Open software-engineering.html for the executable model.

Model limits: This browser uses the documented normal-distribution formula with a fixed mean and standard deviation. Real detectors learn a sample window and add acceptable pause/minimum-deviation controls.

## Quiz (4 minutes)

1. Lowering the phi threshold does what?
   - Slower detection and fewer false suspicions
   - Faster detection and more false suspicions
   - Creates consensus

2. Why can noisy history lower suspicion for the same delay?
   - The delay is less statistically surprising
   - The clock stops
   - Heartbeats become durable

3. What does phi not decide?
   - Suspicion level
   - Permanent membership removal policy
   - Heartbeat timing

4. Which pause in your runtime would create legitimate heartbeat delay?
5. Who should own the policy that turns suspicion into traffic removal?

<details><summary>Answer key — attempt first</summary>

1. Faster detection and more false suspicions. The policy fires on less evidence.

2. The delay is less statistically surprising. Phi is calibrated to the observed arrival distribution.

3. Permanent membership removal policy. Measurement and cluster action are different layers.

</details>

## Sources

- [Akka PhiAccrualFailureDetector API](https://doc.akka.io/api/akka-core/current/akka/remote/PhiAccrualFailureDetector.html) — Akka core current docs; checked 2026-10-13; checked 2026-10-13.
- [JAIST: The phi accrual failure detector](https://dspace.jaist.ac.jp/dspace/handle/10119/4784) — Original 2004 research report; checked 2026-10-13.
