# A post-incident action should remove a condition, not repeat a warning

Distinguished Engineer · Day42 · 15 minutes

Turn incident learning into owned system changes that reduce recurrence instead of relying on people to remember one more rule.

## Recall (2 minutes)

<p><a href="../Day30/distinguished-engineer.html">Day30: An operational-readiness review is evidence, residual risk, and owners</a></p><p>The restore checkbox is empty. What should the ORR record?</p><details><summary>Recall first, then reveal the refresher</summary><p>Residual risk, owner, due date, and launch decision. A backup is not restore evidence; unresolved risk must stay visible.</p></details><p><a href="../Day2/distinguished-engineer.html">Day2: Canaries: small exposure, useful evidence</a></p><p>At 1% exposure, canary 4%, control 0.1%, what is the overall failure rate?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.139%. 0.01 × 4% + 0.99 × 0.1% = 0.139%. Aggregation hides a severe cohort regression.</p></details>

## Understand (4 minutes)

A sign saying “remember to lock the door” depends on memory every night. A door that locks itself removes the repeated decision.

Post-incident actions vary in strength. Training and runbooks help response. Detection shortens impact. Automated checks and safer interfaces prevent the same condition from crossing the boundary. Strong actions are specific, owned, tracked, and verified with evidence.



A deployment published a table without its required tenant filter. “Remind engineers to check filters” leaves the unsafe route open. A contract test that blocks publication when the filter is absent turns the lesson into an enforced condition. A safe publication API that always attaches the policy removes the footgun further.



## Read the visual

The same missing-policy change travels through actions of increasing strength. Only the gate and safe API remove the unsafe branch before publication.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this action-strength review after incidents, near misses, audit findings, and repeated manual mistakes.

**Practical example.** A public data product was deployed without the row-access policy expected by its contract.

**How to decide.** Choose the strongest feasible action near the failure boundary. Keep training for judgment-heavy cases, but do not use training as the only response to a deterministic condition a system can check. Assign an owner, due date, and verification signal.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
incident={'condition':'missing tenant policy','effect':'unfiltered publish'}
weak={'action':'remind','unsafe_path_open':True}
gate={'action':'contract test','unsafe_path_open':False}
evidence={'test_rejects_missing_policy':True,'owner':'platform','due':'tracked'}
```

1. Name the condition, not a person.

   Changed values: `{"incident": {"condition": "missing tenant policy", "effect": "unfiltered publish"}}`

2. A reminder leaves the path available.

   Changed values: `{"weak": {"action": "remind", "unsafe_path_open": true}}`

3. An automated check blocks the known condition.

   Changed values: `{"gate": {"action": "contract test", "unsafe_path_open": false}}`

4. Define proof, ownership, and follow-through.

   Changed values: `{"evidence": {"test_rejects_missing_policy": true, "owner": "platform", "due": "tracked"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The action ladder is a teaching heuristic, not a probability model or compliance framework. Automation can encode the wrong rule, introduce outages, or move risk elsewhere. Human judgment, rollout, exception handling, and outcome measurement remain necessary.

## Explore (remaining exploration time)

Choose a corrective action and watch the next deployment path retain or remove the unsafe branch.

Open distinguished-engineer.html for the executable model.

Model limits: The action ladder is a teaching heuristic, not a probability model or compliance framework. Automation can encode the wrong rule, introduce outages, or move risk elsewhere. Human judgment, rollout, exception handling, and outcome measurement remain necessary.

## Quiz (4 minutes)

1. A deterministic contract can detect a missing row policy. Strongest direct action?
   - Block publication when the policy is absent
   - Send another reminder
   - Rename the incident channel

2. Why keep an owner and verification signal after automation?
   - The control can be late, wrong, bypassed, or ineffective
   - Automation proves mastery
   - Owners make incidents impossible

3. When can training remain the primary action?
   - The situation requires context-sensitive judgment that cannot be safely encoded
   - The same machine-checkable omission repeats weekly
   - No owner wants the engineering work

4. Which open incident action currently asks people to remember a deterministic rule?
5. What measurable evidence will prove its replacement control works and is not bypassed?

<details><summary>Answer key — attempt first</summary>

1. Block publication when the policy is absent. The gate acts at the failure boundary before exposure.

2. The control can be late, wrong, bypassed, or ineffective. A corrective action must be delivered and shown to change the intended outcome.

3. The situation requires context-sensitive judgment that cannot be safely encoded. Training fits judgment; deterministic repeatable conditions deserve stronger controls.

</details>

## Sources

- [Google SRE Workbook: Postmortem Culture — Learning from Failure](https://sre.google/workbook/postmortem-culture/) — Foundational Google SRE guidance; checked November 1, 2026; checked 2026-11-01.
- [AWS Well-Architected OPS11-BP02: Perform post-incident analysis](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_evolve_ops_perform_rca_process.html) — Official AWS guidance; checked November 1, 2026; checked 2026-11-01.
