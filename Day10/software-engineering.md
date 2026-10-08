# Stop calling a failing service, then try one small probe

Software engineering · Day10 · 15 minutes

Protect a busy application from repeatedly waiting on a service that is already failing.

## Recall (2 minutes)

<p><a href="../Day6/software-engineering.html">Day6: Hedged requests: duplicate only the stragglers</a></p><p>Why delay a hedge instead of sending two copies immediately?</p><details><summary>Recall first, then reveal the refresher</summary><p>To target stragglers and limit extra load. The delay lets ordinary requests finish without paying for a duplicate.</p></details><p><a href="../Day8/software-engineering.html">Day8: Optimistic concurrency: make a lost update fail loudly</a></p><p>Two workers read version 12; worker A commits version 13 before worker B writes. What should B&#x27;s conditional update do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Fail as a conflict so B can reread and recompute. The version mismatch converts the stale decision into an explicit conflict.</p></details>

## Understand (4 minutes)

Your checkout service calls a delivery-price service. That service is down. Every checkout waits for a timeout. Soon many requests are waiting at once, tying up connections and workers.

A circuit breaker remembers recent failures. After enough failures, it stops forwarding calls for a short time. Checkout gets a quick “temporarily unavailable” response instead of another long wait.

The names come from an electrical switch: a closed circuit carries current. Here it means calls are allowed. “Open” means stop calling.



For this example, choose three consecutive failures and a five-second wait. The first three calls reach the broken service and fail. The fourth is blocked immediately. After five seconds, permit one trial call.

If that trial succeeds, normal calls resume. If it fails, wait again. These numbers are teaching choices, not production recommendations. A real configuration depends on traffic rate and the cost of a wrong decision.

For checkout, a useful response might be “delivery quote unavailable; please try later.” Returning a made-up price would change the business meaning of the operation.



## Read the visual

The state diagram labels transitions between closed, open and half-open. The active state changes with calls and elapsed time. A second path shows whether a call reaches the service or ends at the breaker. Only forwarded calls can succeed or fail at the dependency; blocked calls do not repair the dependency. The countdown shows the earliest probe time.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
String state = "closed"; int failures = 0;
failures += 1;
failures += 1;
failures += 1;
state = failures >= 3 ? "open" : state;
boolean forwardFourthCall = !state.equals("open");
state = "half-open";
boolean probeSucceeded = true;
state = probeSucceeded ? "closed" : "open";
```

1. Closed allows calls to reach the service.

   Changed values: `{"state": "closed", "failures": "0"}`

2. The first forwarded call fails.

   Changed values: `{"failures": "1"}`

3. The second call fails.

   Changed values: `{"failures": "2"}`

4. The third call fails.

   Changed values: `{"failures": "3"}`

5. The chosen threshold opens the breaker.

   Changed values: `{"state": "open"}`

6. The next immediate call is blocked locally.

   Changed values: `{"forwardFourthCall": "false"}`

7. For this trace, the waiting period has now elapsed.

   Changed values: `{"state": "half-open"}`

8. Supply a successful probe result.

   Changed values: `{"probeSucceeded": "true"}`

9. The successful probe allows normal calls again.

   Changed values: `{"state": "closed"}`

[Full runnable example](examples/software-engineering.java).

Limits: This sequential state trace is not a thread-safe circuit-breaker library. It supplies the elapsed wait and probe result explicitly. The interactive lab lets you explore failed probes too.

## Explore (remaining exploration time)

Leave the service unhealthy and call it four times. Compare forwarded and blocked counts. Advance five seconds, make the service healthy, then send the probe. Reset and try a failed probe.

Open software-engineering.html for the executable model.

Model limits: The model uses sequential calls and consecutive failures. It does not model rolling windows, concurrent probes, shared breaker state, slow calls, or real clocks. A breaker still needs request timeouts. It does not make payment retries safe or prove that all service operations recovered.

## Quiz (4 minutes)

1. After three failures open this breaker, what happens to a fourth immediate call?
   - It is blocked without reaching the service
   - It must wait for another network timeout
   - It becomes a successful response

2. Why allow a small probe after waiting?
   - To replay all failed payments
   - To get evidence that the service recovered
   - To disable timeouts

3. What remains necessary after adding a breaker?
   - No other controls
   - Unlimited retries
   - Timeouts and safe rules for retries

4. Why is an immediate unavailable response sometimes better than a long wait?
5. If one probe succeeds but the next hundred calls overload the service, what would you change?

<details><summary>Answer key — attempt first</summary>

1. It is blocked without reaching the service. Open means the local breaker rejects the call. It avoids another remote wait, but it cannot turn a failed operation into a success.

2. To get evidence that the service recovered. A probe tests recovery with limited exposure. It is not permission to replay side effects, and remote calls still need timeouts.

3. Timeouts and safe rules for retries. A closed breaker still forwards requests, which can hang without timeouts. Retrying operations that change state requires separate duplicate protection.

</details>

## Sources

- [Microsoft Azure Architecture Center: Circuit Breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) — Living architecture guidance; checked 2026-09-29.
