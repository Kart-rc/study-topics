# Turn an SLO into a decision

Distinguished Engineer · Day1 · 15 minutes

Connect a measurable user outcome to an error budget and a cross-team decision without turning a dashboard into a scorecard contest.

## Recall (2 minutes)

No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.

## Understand (4 minutes)

A service-level indicator measures an aspect of user experience; a service-level objective specifies the desired level over a defined window. The error budget is the permitted amount of failure implied by that objective. Its practical value comes from the decisions teams agree to make when reliability deteriorates. Stakeholders need to agree on the definition, measurement, and policy. Google SRE on implementing SLOs.A Distinguished Engineer needs to examine where a metric can mislead. An internal job-success rate may look excellent while consumers receive late or incorrect data. Begin with the consumer promise and trace it to the signals and owners required to act.

Original teaching case: A platform serves 10,000 scheduled dataset deliveries in a measurement window. A delivery is good only when it arrives by its consumer deadline and passes the agreed contract checks. At 99.5%, the window permits 50 bad deliveries. Thirty have failed so far: 60% of the budget is consumed and 20 remain.The denominator matters. Counting every retry as a fresh successful delivery would inflate apparent reliability. Count each scheduled delivery once and define treatment of cancellation, missing telemetry, and upstream exclusions before the incident. Do not blend business-critical feeds with bulk noncritical loads if that hides consumer pain.Your role is to make the next decision explicit. Imagine proposing that rapid budget burn triggers a joint reliability review, with the platform lead accountable for remediation and consumer representatives validating impact. This is an illustrative policy to negotiate, not a universal release freeze. A narrow remediation rollout might reduce risk even while the budget is exhausted.A useful executive explanation is: “Thirty failed deliveries consumed 60% of our allowance. The common dependency is the catalog. We propose prioritizing its overload fix, with a named owner and a measured recovery condition.”

## Explore (5 minutes)

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
