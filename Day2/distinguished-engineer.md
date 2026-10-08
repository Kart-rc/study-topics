# Canaries: small exposure, useful evidence

Distinguished Engineer · Day2 · 15 minutes

A new library fails on nested arrays but works on simple records.

## Recall (2 minutes)

<p><a href="../Day1/distinguished-engineer.html">Day1: Turn an SLO into a decision</a></p><p>At 99.9% over 10,000 deliveries, 30 failures consume what budget?</p><details><summary>Recall first, then reveal the refresher</summary><p>300%. The allowance is 10 deliveries. Thirty is three times that allowance.</p></details>

## Understand (4 minutes)

A new library fails on nested arrays but works on simple records. Sending it only easy traffic can make a dangerous release look healthy.

A canary is a small release used to gather evidence before wider rollout. Compare its results with a control serving a similar mix of requests. The whole-service average can hide a severe failure in a small canary.

Watch the visual: How can the total look healthy while the canary fails?



At 1% exposure, a canary failing 4% of its requests is mixed with a control failing 0.1%. The overall rate is only 0.139%, below a 0.2% warning threshold. Comparing the two groups reveals the problem sooner.



## Read the visual

Control and canary failure rates use the same 0–4% scale. A separate traffic-share strip shows how little the canary contributes to the global average. At 1% exposure, a 4% canary failure rate mixes into only 0.139% overall. Easy-only traffic removes the failing path from the test; it does not fix it.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
exposure = 0.01; canary_rate = 0.04; control_rate = 0.001
overall = exposure * canary_rate + (1 - exposure) * control_rate
overall_percent = round(100 * overall, 3)
global_alarm = overall > 0.002
canary_worse = canary_rate > control_rate
```

1. Rates are fractions, not percentages.

   Changed values: `{"exposure": 0.01, "canary_rate": 0.04, "control_rate": 0.001}`

2. Weight each group by its traffic share.

   Changed values: `{"overall": 0.00139}`

3. The whole-service rate is 0.139%.

   Changed values: `{"overall_percent": 0.139}`

4. The global 0.2% threshold stays quiet.

   Changed values: `{"global_alarm": false}`

5. The cohort comparison shows the regression.

   Changed values: `{"canary_worse": true}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is weighted arithmetic with synthetic rates. It does not establish statistical confidence or a safe sample size. Representative inputs, observation time, and harmful writes require separate controls.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A canary releases a change to a limited portion of production and compares its behavior with a control before wider exposure. The objective is to learn about the change while limiting harm, not simply to deploy to an arbitrary small percentage. <a href="https://sre.google/workbook/canarying-releases/">Google SRE's canarying chapter</a>.</p><p>For a Distinguished Engineer, the hard question is whether the experiment can falsify the risky assumption. A green dashboard from an unrepresentative cohort is weak evidence. Rollout design therefore involves workload selection, measurement, stopping conditions, and clear decision rights—not just a traffic percentage.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> Six teams want a new schema-normalization library. A risky path is handling nested arrays; most requests use flat records. You propose a canary containing nested-array traffic, a control using the current library, and a comparison of rejected-record rate with equivalent input mixes.</p><p>In the synthetic calculator, the control's failure rate is 0.1% and the new version's representative-cohort rate is 4%. At 1% exposure, the whole-service rate is only 0.139%. A global 0.2% warning threshold stays green even though the canary is clearly worse. The arithmetic is:</p><pre>overallRate = exposure × canaryRate
            + (1 − exposure) × controlRate</pre><p>At 10% exposure, the overall rate reaches 0.49%; the global alarm finally notices, after ten times as much traffic has been exposed. Cohort comparison would have revealed the difference earlier.</p><p>Switch to the “easy requests only” cohort. Its modeled failure rate matches control. This is not evidence about the nested-array path, regardless of how long the easy cohort remains green. A small, representative experiment is different from a small, convenient experiment.</p><p>Write a decision contract: the library owner investigates cohort regressions; the platform operator can halt expansion; consumer owners validate semantic correctness; the release owner records the decision and evidence. These roles are a proposed practice arrangement, not a description of your organization.</p><p>Finally, do not confuse reverting a library with undoing writes it already made. If the canary can corrupt shared data, require isolated output, a safe replay or repair plan, and an exposure boundary at the data layer. A kill switch alone cannot restore lost information.</p>

</details>

## Explore (remaining exploration time)

Compare 1% and 10% exposure with representative traffic. Then select easy-only traffic. Explain what each green result actually establishes. Draft a three-sentence rollout gate naming a cohort, halt condition, and owner; include one stateful side effect that rollback would not undo.

Open distinguished-engineer.html for the executable model.

Model limits: Synthetic expected rates, not sampled observations or production measurements. The calculator has no confidence intervals, seasonality, cohort imbalance correction, delayed defects or shared-dependency effects. Its warning thresholds are illustrative only and must not be used as an automatic production gate.

## Quiz (4 minutes)

1. At 1% exposure, canary 4%, control 0.1%, what is the overall failure rate?
   - 4%
   - 0.139%
   - 0.041%

2. Why include the risky data shape in a canary?
   - A convenient cohort may not test the failure hypothesis
   - To maximize the number of affected users
   - To avoid a control group

3. Reverting the new library restores the previous code. What may remain?
   - Nothing; all effects are reversed
   - Only a dashboard color
   - Previously corrupted or incompatible data requiring repair

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 0.139%. 0.01 × 4% + 0.99 × 0.1% = 0.139%. Aggregation hides a severe cohort regression.

2. A convenient cohort may not test the failure hypothesis. You need evidence about the path being changed, with a controlled exposure and comparable baseline.

3. Previously corrupted or incompatible data requiring repair. Rollback changes future execution; persistent side effects may need a separate recovery procedure.

</details>

## Sources

- [Google SRE Workbook: Canarying Releases](https://sre.google/workbook/canarying-releases/) — SRE Workbook, 2018; checked 2026-09-22.
