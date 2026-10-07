# Stop, drain, then force: graceful shutdown

Software engineering · Day15 · 15 minutes

Shut down a service without accepting work that cannot finish inside the termination window.

## Recall (2 minutes)

<p><a href="../Day6/software-engineering.html">Day6: Hedged requests: duplicate only the stragglers</a></p><p>Why delay a hedge instead of sending two copies immediately?</p><details><summary>Recall first, then reveal the refresher</summary><p>To target stragglers and limit extra load. The delay lets ordinary requests finish without paying for a duplicate.</p></details><p><a href="../Day10/software-engineering.html">Day10: Stop calling a failing service, then try one small probe</a></p><p>After three failures open this breaker, what happens to a fourth immediate call?</p><details><summary>Recall first, then reveal the refresher</summary><p>It is blocked without reaching the service. Open means the local breaker rejects the call. It avoids another remote wait, but it cannot turn a failed operation into a success.</p></details>

## Understand (4 minutes)

A shop closes its front door before counting the customers still inside. It lets those customers finish, but it also has a final closing time.


A service should do the same:


1 · StopReject new requests


2 · DrainLet O42 finish


3 · ForceCancel after the limit


No new work → bounded wait → known recovery path


Java's ExecutorService.shutdown() rejects new tasks but lets submitted tasks run. awaitTermination waits for a bound. Kubernetes normally sends a termination signal and later force-kills remaining processes when the grace period ends.



Order O42 has eight seconds of database work left. The Pod has a ten-second grace period.


Mark the instance unready and stop accepting new requests.Wait while O42 finishes at second eight.Exit cleanly before second ten.
pool.shutdown();              // no new tasks
if (!pool.awaitTermination(10, SECONDS))
    pool.shutdownNow();       // best-effort cancel


If the grace period is only five seconds, the process is forced out with three seconds of work left. The operation needs an idempotency key or durable job record so a retry is safe.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use graceful shutdown whenever deployments, scaling, or maintenance can stop a service while requests or background tasks are still running. It is especially useful when abrupt termination causes failed requests or repeated business effects.

**Practical example.** An EKS rollout replaces the Pod handling order O42. Stop new arrivals, then let its remaining eight seconds of database work finish within the ten-second grace period. With only five seconds available, the retry needs a durable record or idempotency key to avoid repeating the effect.

**How to decide.** Set the wait from measured drain times and test cancellation. For work lasting minutes or hours, use durable jobs and checkpoints instead of making every rollout wait indefinitely.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int workSecondsRemaining = 8;
int graceSeconds = 10;
boolean acceptingNew = true;
acceptingNew = false;
int drainedSeconds = Math.min(workSecondsRemaining, graceSeconds);
workSecondsRemaining -= drainedSeconds;
boolean completed = workSecondsRemaining == 0;
boolean forceKilled = !completed;
String recovery = completed ? "none" : "retry-idempotently";
```

1. O42 needs eight more seconds and the platform allows ten.

   Changed values: `{"workSecondsRemaining": "8", "graceSeconds": "10", "acceptingNew": "true"}`

2. Close admission, then spend the grace period only on work already accepted.

   Changed values: `{"acceptingNew": "false", "drainedSeconds": "8"}`

3. O42 finishes because the grace period covers all eight seconds.

   Changed values: `{"workSecondsRemaining": "0", "completed": "true"}`

4. No force is needed in the successful path. The failure path has an explicit recovery rule.

   Changed values: `{"forceKilled": "false", "recovery": "none"}`

[Full runnable example](examples/software-engineering.java).

Limits: Runs a four-variable Java lifecycle model. It does not start an HTTP server, ExecutorService, container, or Kubernetes Pod.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Choose the termination grace period from observed high-percentile drain time, not guesswork. Expose shutdown phase, in-flight count, forced cancellations, and time-to-zero. A readiness transition prevents new regular traffic, but long-lived streams and external load balancers may need protocol-specific draining.</p>

</details>

## Explore (remaining exploration time)

Change the grace period around O42's eight-second runtime. Watch when the request completes and when the process is forced out.

Open software-engineering.html for the executable model.

Model limits: The model treats one task as perfectly measurable. Real services must coordinate load-balancer draining, keep-alive connections, background jobs, database transactions, message acknowledgements, and interrupt handling. shutdownNow is best effort; code that ignores interruption may keep running until the platform kills it.

## Quiz (4 minutes)

1. With 8 seconds of work and 10 seconds of grace, what happens?
   - O42 finishes and the process exits cleanly
   - New requests keep arriving
   - The process is killed immediately

2. Why stop accepting before waiting?
   - To avoid adding work while the drain clock is running
   - To make every task faster
   - Because awaitTermination accepts more work

3. What can shutdownNow guarantee?
   - Every task is safely rolled back
   - A best-effort interruption attempt; tasks must cooperate
   - The Kubernetes grace period doubles

4. Describe the exact state of O42 when the grace period is five seconds.
5. What metric and log fields would prove that a deployment is dropping in-flight work?

<details><summary>Answer key — attempt first</summary>

1. O42 finishes and the process exits cleanly. Stopping admission first leaves enough time for the in-flight request to finish.

2. To avoid adding work while the drain clock is running. A drain converges only when no new work enters the instance.

3. A best-effort interruption attempt; tasks must cooperate. Java documents shutdownNow as best effort, commonly via interruption.

</details>

## Sources

- [Java SE 25 ExecutorService](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ExecutorService.html) — Java 25 API; two-phase shutdown and interrupt limits; checked 2026-10-05.
- [Kubernetes Pod lifecycle: termination flow](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) — Living documentation; TERM, grace period, endpoint readiness, and forced stop; checked 2026-10-05.
