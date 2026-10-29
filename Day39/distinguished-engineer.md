# A game day needs a measurable hypothesis and a stop condition

Distinguished Engineer · Day39 · 15 minutes

Design resilience experiments that test one claim while automatically limiting unexpected customer impact.

## Recall (2 minutes)

<p><a href="../Day23/distinguished-engineer.html">Day23: Let the new system observe production before production observes it</a></p><p>Shadow returns $27; legacy returns $25. What sees the customer?</p><details><summary>Recall first, then reveal the refresher</summary><p>$25. The legacy path still owns the response.</p></details><p><a href="../Day27/distinguished-engineer.html">Day27: Standardize the guardrail—not every implementation</a></p><p>What should the shared platform contract standardize?</p><details><summary>Recall first, then reveal the refresher</summary><p>Observable safety and operability outcomes. Common outcomes allow different valid implementations.</p></details>

## Understand (4 minutes)

Do not pull a fire alarm just to see what happens. State what should remain safe, choose the fault, and define the reading that stops the exercise.

A useful game day begins from a measured steady state, forms a hypothesis, injects a bounded fault, watches customer-visible metrics, and stops when a guardrail crosses its threshold. The result is evidence for the architecture and the team's response—not theater.



Hypothesis: removing 20% of EKS workers keeps order success at or above 99%. Stop the experiment if five-minute success falls below 98%. At 98.6%, continue and observe recovery. At 97.8%, stop and restore capacity.



## Read the visual

The experiment path ties a fault to one measurable hypothesis and a separate stop line. Moving the observation shows why 'failed hypothesis' and 'must stop now' are related but not identical decisions.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Run a game day after non-production resilience tests pass and before relying on a failover, autoscaling, or degraded-mode claim in production.

**Practical example.** Verify that one EKS node-group impairment preserves order processing and pages the right team within three minutes.

**How to decide.** Use a tabletop exercise first when production fault injection is unsafe or the human procedure is the main uncertainty. Start narrow, obtain authorization, exclude critical periods, and automate stop conditions.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
baseline_success = 99.4; hypothesis_floor = 99.0
stop_floor = 98.0; observed_success = 98.6
hypothesis_holds = observed_success >= hypothesis_floor
must_stop = observed_success < stop_floor; decision = 'stop-and-restore' if must_stop else 'continue-bounded-observation'
```

1. Record the healthy baseline and promised steady-state floor.

   Changed values: `{"baseline_success": 99.4, "hypothesis_floor": 99.0}`

2. Define the guardrail before injecting the fault.

   Changed values: `{"stop_floor": 98.0, "observed_success": 98.6}`

3. The strict hypothesis is currently false.

   Changed values: `{"hypothesis_holds": false}`

4. The 98.6% result stays above the pre-agreed stop line.

   Changed values: `{"must_stop": false, "decision": "continue-bounded-observation"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This arithmetic model does not inject faults, call AWS FIS, measure a workload, authorize production risk, choose thresholds, restore capacity, or prove resilience. A real experiment requires change controls, owners, observability, rollback, and persisted evidence.

## Explore (remaining exploration time)

Change observed success rate. Watch the hypothesis remain supported or the stop condition terminate the experiment.

Open distinguished-engineer.html for the executable model.

Model limits: This arithmetic model does not inject faults, call AWS FIS, measure a workload, authorize production risk, choose thresholds, restore capacity, or prove resilience. A real experiment requires change controls, owners, observability, rollback, and persisted evidence.

## Quiz (4 minutes)

1. Success falls to 97.8% and the stop threshold is 98%. What next?
   - Terminate the fault and restore the system
   - Continue until total failure
   - Lower the threshold mid-test

2. Why define steady state before the fault?
   - It gives a customer-visible baseline against which to test the hypothesis
   - It guarantees no incident
   - It replaces rollback

3. What does a passed game day not prove?
   - Every untested fault and scale will behave the same way
   - The observed hypothesis held under recorded conditions
   - The response steps were exercised

4. Which resilience claim matters most to test before the next peak period?
5. What customer-visible metric and stop threshold would make that experiment safe enough to authorize?

<details><summary>Answer key — attempt first</summary>

1. Terminate the fault and restore the system. A stop condition is a guardrail, not a suggestion.

2. It gives a customer-visible baseline against which to test the hypothesis. Without a baseline, change has no meaningful comparison.

3. Every untested fault and scale will behave the same way. Evidence is bounded by the scenario and conditions.

</details>

## Sources

- [AWS Well-Architected: test resiliency using chaos engineering](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_testing_resiliency_failure_injection_resiliency.html) — Official guidance; checked October 29, 2026; checked 2026-10-29.
- [AWS Fault Injection Service: planning experiments](https://docs.aws.amazon.com/fis/latest/userguide/getting-started-planning.html) — Official guidance; checked October 29, 2026; checked 2026-10-29.
