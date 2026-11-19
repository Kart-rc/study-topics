# Technical debt is the delay it repeats—not the age of the file

Distinguished Engineer · Day58 · 15 minutes

Prioritize debt by measurable recurring drag and risk rather than by how old or aesthetically awkward the code looks.

## Recall (2 minutes)

<p><a href="../Day38/distinguished-engineer.html">Day38: A risk acceptance needs an owner, a trigger, and an expiry</a></p><p>R-42 is only 20 days old, but the service becomes public. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reassess immediately because the evidence trigger changed. Expiry is the latest review, not protection from material change.</p></details><p><a href="../Day10/distinguished-engineer.html">Day10: Replace one route at a time</a></p><p>Only /tracking moves. Who handles /orders in this example?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old system. The routing decision is per capability. Moving tracking does not transfer order-write ownership or require two writers.</p></details>

## Understand (4 minutes)

An old delivery van that starts every morning may be less urgent than a new loading dock that makes six crews wait two hours every week.

“Technical debt” becomes actionable when it names a recurring cost or risk: release delay, incident work, change failure, cognitive load, or blocked capability. Code age is not that evidence. A Distinguished Engineer makes the cost visible, estimates the repair, names uncertainty, and checks whether the saved drag actually appears afterward.



A shared schema validator adds two engineer-hours to each of six weekly releases: twelve hours of recurring drag. A bounded repair costs eight hours. If the estimate holds, the time payback is under one week. That does not automatically make it top priority; compare security, reliability, opportunity cost, and confidence.



## Read the visual

A repeated-drag bar and repair-cost bar share one hour scale, making the payback assumption visible and challengeable.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a debt investment case when teams agree something hurts but cannot compare it with product or reliability work.

**Practical example.** Forty producer teams wait for a manual contract-validation step before data-pipeline releases.

**How to decide.** Measure frequency, delay, affected teams, failure risk, and repair cost. Prefer a small reversible repair with an observable before/after metric. Do not manufacture precise dollars from weak assumptions.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
releases_per_week=6; drag_hours_each=2; repair_hours=8
weekly_drag=releases_per_week*drag_hours_each
payback_weeks=repair_hours/weekly_drag
result={'weekly_drag_hours':weekly_drag,'repair_hours':repair_hours,'payback_weeks':round(payback_weeks,2),'decision':'candidate-investment-not-automatic-priority'}
```

1. State the frequency, repeated drag, and bounded repair estimate.

   Changed values: `{"releases_per_week": 6, "drag_hours_each": 2, "repair_hours": 8}`

2. Calculate twelve recurring engineer-hours per week.

   Changed values: `{"weekly_drag": 12}`

3. Estimate the simple time payback.

   Changed values: `{"payback_weeks": 0.6666666666666666}`

4. Keep the output as decision evidence, not an automatic verdict.

   Changed values: `{"result": {"weekly_drag_hours": 12, "repair_hours": 8, "payback_weeks": 0.67, "decision": "candidate-investment-not-automatic-priority"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The calculator treats hours as interchangeable and assumes the repair removes all drag. It omits coordination, risk reduction, opportunity cost, maintenance, partial adoption, discounting, and confidence intervals. It supports a conversation, not automatic prioritization.

## Explore (remaining exploration time)

Change weekly release frequency while keeping two hours of drag and an eight-hour repair. Predict the payback and whether uncertainty changes the decision.

Open distinguished-engineer.html for the executable model.

Model limits: The calculator treats hours as interchangeable and assumes the repair removes all drag. It omits coordination, risk reduction, opportunity cost, maintenance, partial adoption, discounting, and confidence intervals. It supports a conversation, not automatic prioritization.

## Quiz (4 minutes)

1. Six releases each lose two hours; repair costs eight. What is the simple time payback?
   - About 0.67 week
   - Six weeks
   - Age of the file decides

2. Why measure recurring drag?
   - It makes the investment comparable and testable
   - It proves every old system is bad
   - It removes uncertainty

3. What can invalidate the estimate?
   - The repair removes only part of the drag or adoption stays low
   - The code is old
   - The team uses Git

4. Which debt item in your portfolio has the clearest recurring delay or risk denominator?
5. What before/after metric would prove the repair created the expected value?

<details><summary>Answer key — attempt first</summary>

1. About 0.67 week. Eight divided by twelve weekly hours is about 0.67.

2. It makes the investment comparable and testable. The causal cost matters more than the label.

3. The repair removes only part of the drag or adoption stays low. Payback depends on realized savings.

</details>

## Sources

- [DORA: Code maintainability](https://dora.dev/capabilities/code-maintainability/) — DORA research-derived capability guidance; checked November 18, 2026; checked 2026-11-18.
- [DORA software delivery performance metrics](https://dora.dev/guides/dora-metrics/) — Official DORA guide; checked November 18, 2026; checked 2026-11-18.
- [Google SRE: Engagement model](https://sre.google/workbook/engagement-model/) — Google SRE Workbook guidance on allocating engineering time to reliability and debt; checked November 18, 2026; checked 2026-11-18.
