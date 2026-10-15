# A 99.9% service cannot make a 99.9% chain

Distinguished Engineer · Day25 · 15 minutes

Compose dependency reliability and allocate an end-to-end SLO budget instead of giving every component the user target.

## Recall (2 minutes)

<p><a href="../Day21/distinguished-engineer.html">Day21: An architecture rule that cannot fail the build is only advice</a></p><p>Build is green but PII is public. Senior response?</p><details><summary>Recall first, then reveal the refresher</summary><p>Add an executable pre-deploy rule at the boundary. The missing mechanism is enforcement, not awareness.</p></details><p><a href="../Day9/distinguished-engineer.html">Day9: Rollback safety: old code must survive new state</a></p><p>Why can a successful binary rollback still fail?</p><details><summary>Recall first, then reveal the refresher</summary><p>New code may already have written durable state the old code cannot read. Deployment state and durable data evolve on different timelines.</p></details>

## Understand (4 minutes)

A trip with two 99%-reliable flights succeeds only when both flights succeed. The chance is roughly 99% × 99% = 98.01%. A request that needs several services behaves the same way when their failures are independent.

The user journey owns the SLO. Component objectives are budget allocations, not copies of the end-to-end number.



Checkout requires Orders, Payments and Inventory. At 99.95% each, the independent-path estimate is 0.9995³ = 99.8501%, below a 99.9% checkout target. The design needs stronger components, redundancy, or a degraded path that removes a hard dependency.



## Read the visual

The horizontal bar uses one consistent 0–100% scale. Adding a required dependency shortens the success portion even when every component keeps the same availability.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use end-to-end SLO composition when one user action synchronously depends on several services, queues or data stores.

**Practical example.** Checkout calls Orders, Payments and Inventory before returning success.

**How to decide.** Model the critical path, measure the actual journey, and allocate component budgets according to leverage. Do not multiply blindly when failures are correlated or fallbacks change the path.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
component=0.9995
count=3
path_success=component**count
path_failure=1-path_success
meets_999=path_success>=0.999
```

1. Model three independent required services.

   Changed values: `{"component": 0.9995, "count": 3}`

2. All three must succeed, so probabilities multiply.

   Changed values: `{"path_success": 0.9985007498750001}`

3. Convert the path estimate into a user-visible failure budget.

   Changed values: `{"path_failure": 0.0014992501249998513}`

4. Compare the composed estimate with the 99.9% journey target.

   Changed values: `{"meets_999": false}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The calculator assumes identical independent availability and a serial all-required path. Real incidents are correlated, latency matters, traffic weights differ, and fallbacks can change the graph. Measure the user SLI; use this only as a planning check.

## Explore (remaining exploration time)

Change dependency count and component availability. Predict the end-to-end estimate and remaining error budget.

Open distinguished-engineer.html for the executable model.

Model limits: The calculator assumes identical independent availability and a serial all-required path. Real incidents are correlated, latency matters, traffic weights differ, and fallbacks can change the graph. Measure the user SLI; use this only as a planning check.

## Quiz (4 minutes)

1. Three independent required services are each 99.95% available. Is the path exactly 99.95%?
   - Yes
   - No; required probabilities compound
   - Only during deploys

2. Best source of truth for the checkout SLO?
   - Average component uptime
   - The measured checkout user journey
   - The most reliable dependency

3. When is multiplication misleading?
   - Failures are correlated or a fallback changes the path
   - All steps are independent
   - There is one dependency

4. Which dependency would receive the tightest budget in your current critical path, and why?
5. What evidence would tell you failures are correlated rather than independent?

<details><summary>Answer key — attempt first</summary>

1. No; required probabilities compound. All required steps must succeed, so the path estimate is the product.

2. The measured checkout user journey. The SLI must describe what users experience.

3. Failures are correlated or a fallback changes the path. Shared failure domains and conditional paths violate the simple model.

</details>

## Sources

- [Google SRE Workbook: Implementing SLOs](https://sre.google/workbook/implementing-slos/) — Foundation; checked 2026-10-15.
- [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) — Foundation; checked 2026-10-15.
- [Google SRE Workbook: Error Budget Policy](https://sre.google/workbook/error-budget-policy/) — Foundation; checked 2026-10-15.
