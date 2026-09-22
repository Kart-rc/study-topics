# Canaries: small exposure, useful evidence

Distinguished Engineer · Day2 · 15 minutes

Design a rollout gate that tests the risky path, compares the right cohorts, and distinguishes rollback of code from repair of data.

## Recall (2 minutes)

<p><a href="../Day1/distinguished-engineer.html">Day1: Turn an SLO into a decision</a></p><p>At 99.9% over 10,000 deliveries, 30 failures consume what budget?</p><details><summary>Recall first, then reveal the refresher</summary><p>300%. The allowance is 10 deliveries. Thirty is three times that allowance.</p></details>

## Understand (4 minutes)

A canary releases a change to a limited portion of production and compares its behavior with a control before wider exposure. The objective is to learn about the change while limiting harm, not simply to deploy to an arbitrary small percentage. Google SRE's canarying chapter.

For a Distinguished Engineer, the hard question is whether the experiment can falsify the risky assumption. A green dashboard from an unrepresentative cohort is weak evidence. Rollout design therefore involves workload selection, measurement, stopping conditions, and clear decision rights—not just a traffic percentage.



Original teaching case: Six teams want a new schema-normalization library. A risky path is handling nested arrays; most requests use flat records. You propose a canary containing nested-array traffic, a control using the current library, and a comparison of rejected-record rate with equivalent input mixes.

In the synthetic calculator, the control's failure rate is 0.1% and the new version's representative-cohort rate is 4%. At 1% exposure, the whole-service rate is only 0.139%. A global 0.2% warning threshold stays green even though the canary is clearly worse. The arithmetic is:

overallRate = exposure × canaryRate
            + (1 − exposure) × controlRate

At 10% exposure, the overall rate reaches 0.49%; the global alarm finally notices, after ten times as much traffic has been exposed. Cohort comparison would have revealed the difference earlier.

Switch to the “easy requests only” cohort. Its modeled failure rate matches control. This is not evidence about the nested-array path, regardless of how long the easy cohort remains green. A small, representative experiment is different from a small, convenient experiment.

Write a decision contract: the library owner investigates cohort regressions; the platform operator can halt expansion; consumer owners validate semantic correctness; the release owner records the decision and evidence. These roles are a proposed practice arrangement, not a description of your organization.

Finally, do not confuse reverting a library with undoing writes it already made. If the canary can corrupt shared data, require isolated output, a safe replay or repair plan, and an exposure boundary at the data layer. A kill switch alone cannot restore lost information.



## Explore (5 minutes)

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
