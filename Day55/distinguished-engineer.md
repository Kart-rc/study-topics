# A red error budget must stop something—or it is only a chart

Distinguished Engineer · Day55 · 15 minutes

Turn reliability evidence into a pre-agreed action with an owner, threshold, and exit condition.

## Recall (2 minutes)

<p><a href="../Day31/distinguished-engineer.html">Day31: The failover button must survive the outage</a></p><p>Why pre-provision routing controls before an outage?</p><details><summary>Recall first, then reveal the refresher</summary><p>Incident-time switching should not depend on resource creation. Configuration is a control-plane activity that may be unavailable during disruption.</p></details><p><a href="../Day35/distinguished-engineer.html">Day35: An ADR is evidence, not a forever rule</a></p><p>A recorded capacity assumption becomes false. First response?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reopen the decision with current evidence. The changed context is decision input.</p></details>

## Understand (4 minutes)

A fuel gauge is useful because the driver already knows what to do near empty. A red light with no decision attached is decoration.

An error budget is the allowed unreliability implied by an SLO. Senior technical leadership makes it a control loop: define the window and measurement, agree which launch or change actions happen at thresholds, name the decision owner, and define how normal delivery resumes. The policy is negotiated before the stressful moment.



The orders API has a 99.9% four-week SLO and one million eligible requests, so its budget is 1,000 failed requests. At 800 failures, the platform has consumed 80%. A dashboard turns red. The useful policy also pauses risky launches, keeps security fixes flowing, assigns the service owner, and resumes after evidence shows the burn is back within policy.



## Read the visual

A fixed budget, live consumption, and explicit decision occupy separate stages, so a metric cannot masquerade as policy.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use an error-budget policy when feature delivery and reliability work repeatedly compete and teams need an evidence-based tie-breaker.

**Practical example.** A shared ingestion platform must decide whether to launch a new connector while recent failures have consumed 80% of its four-week budget.

**How to decide.** Adopt the policy only after product and engineering agree on the SLO, eligible events, exceptions, actions, owner, and recovery rule. A simpler incident threshold is enough for a young service that lacks a credible SLI.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
eligible=1_000_000; slo=0.999
budget=round(eligible*(1-slo))
failed=800; consumed=failed/budget
result={'budget':budget,'consumed_pct':round(consumed*100),'action':'pause_risky_launches' if consumed>=0.8 else 'normal_policy','owner':'service_owner'}
```

1. Define the four-week population and objective.

   Changed values: `{"eligible": 1000000, "slo": 0.999}`

2. Calculate 1,000 allowed failures.

   Changed values: `{"budget": 1000}`

3. Observe 80% consumption.

   Changed values: `{"failed": 800, "consumed": 0.8}`

4. Invoke the agreed decision, not merely a color.

   Changed values: `{"result": {"budget": 1000, "consumed_pct": 80, "action": "pause_risky_launches", "owner": "service_owner"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model uses one availability SLO and a toy policy threshold. It does not choose a valid SLI, account for low traffic, multi-window burn rates, latency objectives, severity, security exceptions, contractual obligations, or organizational incentives.

## Explore (remaining exploration time)

Move consumed budget across the policy threshold. Predict the action, owner, and condition for resuming launches.

Open distinguished-engineer.html for the executable model.

Model limits: The model uses one availability SLO and a toy policy threshold. It does not choose a valid SLI, account for low traffic, multi-window burn rates, latency objectives, severity, security exceptions, contractual obligations, or organizational incentives.

## Quiz (4 minutes)

1. The dashboard shows 80% budget consumed. What makes it governance?
   - A pre-agreed action, owner, exception rule, and recovery condition
   - The color red
   - A larger monitor

2. Why negotiate the policy before an incident?
   - Teams can resolve product-versus-reliability incentives before urgency distorts the choice
   - The metric becomes perfectly accurate
   - Incidents stop occurring

3. When is an error-budget policy premature?
   - When the service lacks a credible user-centered SLI and enough data to support the decision
   - Whenever reliability matters
   - Whenever there are multiple teams

4. Which current reliability dashboard has no agreed action when it turns red?
5. Who can authorize an exception, and what evidence makes the exception expire?

<details><summary>Answer key — attempt first</summary>

1. A pre-agreed action, owner, exception rule, and recovery condition. Evidence becomes governance only when it changes a decision predictably.

2. Teams can resolve product-versus-reliability incentives before urgency distorts the choice. Precommitment reduces case-by-case bargaining during pressure.

3. When the service lacks a credible user-centered SLI and enough data to support the decision. A sophisticated policy cannot rescue a meaningless measurement.

</details>

## Sources

- [Google SRE Workbook: Example Error Budget Policy](https://sre.google/workbook/error-budget-policy/) — Google SRE foundation; checked November 15, 2026; checked 2026-11-15.
- [Google SRE Workbook: Implementing SLOs](https://sre.google/workbook/implementing-slos/) — Google SRE foundation; checked November 15, 2026; checked 2026-11-15.
