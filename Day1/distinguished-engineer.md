# Turn an SLO into a decision

Distinguished Engineer · Day1 · 15 minutes

A dashboard says “99.5% reliable.” What should the team do with that number? Start by saying what customers were promised and how a missed promise is counted..

## Recall (2 minutes)

<p>No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.</p>

## Understand (4 minutes)

A dashboard says “99.5% reliable.” What should the team do with that number? Start by saying what customers were promised and how a missed promise is counted.

A service-level objective, or SLO, is a target over a stated time window. The error budget is how many failures that target permits. It helps leaders agree when reliability work should take priority. Counting successful retries as extra deliveries would hide the original misses.



Of 10,000 scheduled deliveries, 99.5% must arrive on time and pass checks. That allows 50 bad deliveries. Thirty have failed, so 20 remain. Use the rate of new failures and their cause to decide the next action; this arithmetic alone does not mandate a release freeze.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use an SLO and an agreed error-budget policy when product and engineering leaders need a shared basis for choosing reliability work versus new features. Measure the outcome users depend on.

**Practical example.** A reporting platform promises 99.5% of 10,000 scheduled deliveries will arrive on time and pass checks. Thirty bad deliveries have used 30 of the 50 allowed misses. If a repeated defect is consuming the remaining 20 quickly, fixing it may deserve priority over another feature.

**How to decide.** Agree on the measurement window, owners, and actions before an incident. Inspect failure trends and customer impact before changing release plans. A remaining-budget number alone should not decide a release freeze.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
scheduled = 10000; allowed_bad_fraction = 0.005
budget = round(scheduled * allowed_bad_fraction)
bad = 30
remaining = budget - bad
used_percent = 100 * bad / budget
```

1. Define the denominator and allowed failure fraction.

   Changed values: `{"scheduled": 10000, "allowed_bad_fraction": 0.005}`

2. The window permits 50 bad deliveries.

   Changed values: `{"budget": 50}`

3. Count distinct missed deliveries, not attempts.

   Changed values: `{"bad": 30}`

4. Twenty failures remain within the agreed allowance.

   Changed values: `{"remaining": 20}`

5. Sixty percent of the allowance is consumed.

   Changed values: `{"used_percent": 60.0}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is a decision-support calculation, not an automatic release policy. Window selection, missing telemetry, criticality, and budget burn rate still require agreement.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A service-level indicator measures an aspect of user experience; a service-level objective specifies the desired level over a defined window. The error budget is the permitted amount of failure implied by that objective. Its practical value comes from the decisions teams agree to make when reliability deteriorates. Stakeholders need to agree on the definition, measurement, and policy. <a href="https://sre.google/workbook/implementing-slos/">Google SRE on implementing SLOs</a>.</p><p>A Distinguished Engineer needs to examine where a metric can mislead. An internal job-success rate may look excellent while consumers receive late or incorrect data. Begin with the consumer promise and trace it to the signals and owners required to act.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A platform serves 10,000 scheduled dataset deliveries in a measurement window. A delivery is good only when it arrives by its consumer deadline and passes the agreed contract checks. At 99.5%, the window permits 50 bad deliveries. Thirty have failed so far: 60% of the budget is consumed and 20 remain.</p><p>The denominator matters. Counting every retry as a fresh successful delivery would inflate apparent reliability. Count each scheduled delivery once and define treatment of cancellation, missing telemetry, and upstream exclusions before the incident. Do not blend business-critical feeds with bulk noncritical loads if that hides consumer pain.</p><p>Your role is to make the next decision explicit. Imagine proposing that rapid budget burn triggers a joint reliability review, with the platform lead accountable for remediation and consumer representatives validating impact. This is an illustrative policy to negotiate, not a universal release freeze. A narrow remediation rollout might reduce risk even while the budget is exhausted.</p><p>A useful executive explanation is: “Thirty failed deliveries consumed 60% of our allowance. The common dependency is the catalog. We propose prioritizing its overload fix, with a named owner and a measured recovery condition.”</p>

</details>

## Explore (remaining exploration time)

Change the SLO from 99.5% to 99.9% while keeping 30 bad deliveries. Predict the new budget before moving the control. Draft a three-sentence recommendation: affected user promise, decision and accountable owner, evidence that would allow normal delivery priorities to resume.

Open distinguished-engineer.html for the executable model.

Model limits: The calculator uses a fixed count-based measurement window and synthetic counts. It does not model burn rate across multiple windows, traffic weighting, latency percentiles, partial failures, or financial loss. The policy example is a practice proposal.

## Quiz (4 minutes)

1. At 99.9% over 10,000 deliveries, 30 failures consume what budget?
   - 30%
   - 300%
   - 3%

2. Why count each scheduled delivery once?
   - Retries always fail
   - It eliminates telemetry
   - Retries must not inflate the user-outcome denominator

3. Budget exhausted: automatically stop every change?
   - Apply a pre-agreed policy and assess risk-reducing changes
   - Yes, including repairs
   - Ignore the budget

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 300%. The allowance is 10 deliveries. Thirty is three times that allowance.

2. Retries must not inflate the user-outcome denominator. The measured event must represent the consumer promise, not internal execution attempts.

3. Apply a pre-agreed policy and assess risk-reducing changes. The policy should support sensible risk decisions and reliability repair, with clear authority.

</details>

## Sources

- [Google SRE: Implementing SLOs](https://sre.google/workbook/implementing-slos/) — SRE Workbook, 2018; checked 2026-09-21.
