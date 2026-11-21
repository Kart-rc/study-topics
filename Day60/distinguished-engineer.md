# A two-way door needs a rollback window—not just a rollback story

Distinguished Engineer · Day60 · 15 minutes

Delegate reversible decisions while making the actual point of irreversibility visible.

## Recall (2 minutes)

<p><a href="../Day39/distinguished-engineer.html">Day39: A game day needs a measurable hypothesis and a stop condition</a></p><p>Success falls to 97.8% and the stop threshold is 98%. What next?</p><details><summary>Recall first, then reveal the refresher</summary><p>Terminate the fault and restore the system. A stop condition is a guardrail, not a suggestion.</p></details><p><a href="../Day11/distinguished-engineer.html">Day11: A backup is a promise until you restore it</a></p><p>The recovery point is 11:50, failure is noon, and service returns at 12:25. Targets are RPO 5 and RTO 30 minutes. Which timing target is missed?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only RPO. The ten-minute data gap misses RPO 5. Twenty-five minutes of downtime meets RTO 30. Finishing sooner does not recreate missing orders.</p></details>

## Understand (4 minutes)

A hotel room key is reversible while checkout is still available. After the building is demolished, “we can go back” is only a sentence.

Two-way-door decisions deserve faster, lower-level ownership because they can be reversed with limited cost. But reversibility decays: data transforms, contracts, user behavior, and deleted infrastructure can close the return path. State the rollback trigger, owner, evidence, and last safe time before delegating.



A team moves consumers from topic v1 to v2. For 48 hours it dual-writes and verifies lag plus counts. Before hour 48, rollback is a routing change. After v1 retention is deleted, the decision becomes materially harder to reverse.



## Read the visual

A migration timeline places the rollback trigger and the 48-hour point before the old path disappears.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit rollback windows for platform migrations and experiments described as reversible.

**Practical example.** An EKS service moves Kafka consumers to a new schema while the old topic and serializer remain available for 48 hours.

**How to decide.** Delegate the two-way door with a named trigger and deadline. Escalate or add preservation controls when the return path depends on expensive restoration, regulatory approval, or irreversible data loss.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rollback_deadline=48; now=24; old_path_retained=True
reversible=(now<=rollback_deadline and old_path_retained)
trigger='count_mismatch_over_0.1_percent'; owner='migration_lead'
result={'reversible':reversible,'hours_left':rollback_deadline-now,'trigger':trigger,'owner':owner}
```

1. State the last safe rollback time and the return-path prerequisite.

   Changed values: `{"rollback_deadline": 48, "now": 24, "old_path_retained": true}`

2. Evaluate actual reversibility, not the label.

   Changed values: `{"reversible": true}`

3. Name the decision signal and accountable operator.

   Changed values: `{"trigger": "count_mismatch_over_0.1_percent", "owner": "migration_lead"}`

4. Publish the remaining decision window with the delegation.

   Changed values: `{"result": {"reversible": true, "hours_left": 24, "trigger": "count_mismatch_over_0.1_percent", "owner": "migration_lead"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model uses one deadline and binary evidence. Real reversibility depends on data retention, legal constraints, schema compatibility, user actions, state divergence, restoration tests, and organizational authority.

## Explore (remaining exploration time)

Move the decision clock from hour 24 to hour 60. Watch the rollback path change from routing to recovery project.

Open distinguished-engineer.html for the executable model.

Model limits: The model uses one deadline and binary evidence. Real reversibility depends on data retention, legal constraints, schema compatibility, user actions, state divergence, restoration tests, and organizational authority.

## Quiz (4 minutes)

1. At hour 24 with v1 retained and verified, what makes rollback credible?
   - A tested route, trigger, owner, and surviving state
   - The phrase two-way door
   - A slide deck

2. What happens after v1 retention is deleted?
   - The decision may become a one-way door or a recovery project
   - Rollback becomes faster
   - Evidence no longer matters

3. Which decision deserves deeper centralized review?
   - An irreversible regulated-data deletion
   - A guarded feature toggle
   - A reversible timeout change

4. Which current 'reversible' decision lacks a tested return path?
5. What event or deadline turns it into a one-way door?

<details><summary>Answer key — attempt first</summary>

1. A tested route, trigger, owner, and surviving state. Reversibility is an executable property.

2. The decision may become a one-way door or a recovery project. The old path and state were part of the return route.

3. An irreversible regulated-data deletion. Impact and reversibility determine decision depth.

</details>

## Sources

- [AWS Well-Architected: evaluate tradeoffs while managing benefits and risks](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_priorities_eval_tradeoffs.html) — Official AWS guidance; checked November 20, 2026; checked 2026-11-20.
- [AWS: Elements of Amazon's Day 1 Culture](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/) — Official AWS Executive Insights; checked November 20, 2026; checked 2026-11-20.
