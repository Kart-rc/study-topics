# Match decision process to reversal cost

Distinguished Engineer · Day37 · 15 minutes

Use a light, local experiment for reversible choices and deeper review for choices whose rollback is slow or harmful.

## Recall (2 minutes)

<p><a href="../Day22/distinguished-engineer.html">Day22: The service is green; the business is not recovered yet</a></p><p>Pipeline is green; customer rows remain wrong. Status?</p><details><summary>Recall first, then reveal the refresher</summary><p>Technical service restored; business recovery open. Availability and durable business state are different outcomes.</p></details><p><a href="../Day26/distinguished-engineer.html">Day26: Show unit cost before you charge teams</a></p><p>Why pair cost with successful TB?</p><details><summary>Recall first, then reveal the refresher</summary><p>To connect spend with useful output. A unit metric shows efficiency as workload volume changes.</p></details>

## Understand (4 minutes)

Choosing a movable whiteboard does not need the same committee as cutting a load-bearing wall. The first is easy to undo; the second is not.

Amazon describes reversible choices as two-way doors and difficult-to-reverse choices as one-way doors. The engineering move is to make reversibility concrete: rollback time, customer blast radius, data migration cost, and contract commitments.



Changing an internal dashboard color behind a flag is a two-way door. Repartitioning 10 PB while deleting the old layout, changing a public event schema without dual-read support, or selecting an irreversible vendor data format moves toward a one-way door.



## Read the visual

The decision door is driven by rollback time, affected teams, and whether the old path still exists. It shows why a supposedly reversible change becomes one-way when the rollback artifact is removed.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a reversibility check when architecture reviews, standards, migrations, or platform choices are either moving too slowly or moving with hidden lock-in.

**Practical example.** A team wants a six-week review for a feature-flagged library trial but only a short meeting for a destructive table migration.

**How to decide.** Write the rollback path first. Delegate reversible experiments with guardrails and evidence. Add review depth, staged migration, and explicit ownership as rollback time, irreversible data change, or cross-team blast radius grows.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rollback_hours = 2
teams_affected = 2; old_path_kept = True
hard_to_reverse = rollback_hours > 24 or teams_affected > 5 or not old_path_kept
process = 'methodical review' if hard_to_reverse else 'local guarded experiment'
```

1. State the time needed to restore the old behavior.

   Changed values: `{"rollback_hours": 2}`

2. Add blast radius and rollback-path evidence.

   Changed values: `{"teams_affected": 2, "old_path_kept": true}`

3. Apply a declared teaching threshold.

   Changed values: `{"hard_to_reverse": false}`

4. Match process weight to reversal cost.

   Changed values: `{"process": "local guarded experiment"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is a judgment aid, not an organizational approval policy. It does not price legal, regulatory, vendor, security, or reputation risk; decide thresholds locally and keep emergency authority explicit.

## Explore (remaining exploration time)

Change rollback time, blast radius, and whether old data remains. Watch the decision move between team experiment, architecture review, and executive risk acceptance.

Open distinguished-engineer.html for the executable model.

Model limits: This is a judgment aid, not an organizational approval policy. It does not price legal, regulatory, vendor, security, or reputation risk; decide thresholds locally and keep emergency authority explicit.

## Quiz (4 minutes)

1. A change is flag-protected and rolls back in five minutes for one team. Default process?
   - A local guarded experiment with evidence
   - Executive review by default
   - Irreversible migration

2. What makes a data migration less reversible?
   - Deleting the old representation before validation and rollback windows close
   - Writing an ADR
   - Using a dashboard

3. Why classify reversibility explicitly?
   - To spend review depth where a wrong choice is hardest to undo
   - To avoid all architecture review
   - To guarantee the decision is correct

4. Name one current review that is too heavy for its reversal cost and one that is too light.
5. What evidence would make your highest-risk migration genuinely reversible for another week?

<details><summary>Answer key — attempt first</summary>

1. A local guarded experiment with evidence. Reversible choices should not inherit one-way-door ceremony.

2. Deleting the old representation before validation and rollback windows close. The rollback path must survive long enough to be real.

3. To spend review depth where a wrong choice is hardest to undo. The model improves decision-process fit, not certainty.

</details>

## Sources

- [Amazon 2016 Letter to Shareholders](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders) — Published April 2017; foundational decision framework; checked 2026-10-27.
- [Amazon CEO on two-way and one-way doors](https://www.aboutamazon.com/news/workplace/amazon-ceo-andy-jassy-on-asking-why) — Official Amazon explanation; checked October 27, 2026; checked 2026-10-27.
