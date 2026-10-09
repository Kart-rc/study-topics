# Build the exit before calling it a two-way door

Distinguished Engineer · Day19 · 15 minutes

Classify a decision by tested reversibility, not optimism.

## Recall (2 minutes)

<p><a href="../Day10/distinguished-engineer.html">Day10: Replace one route at a time</a></p><p>Only /tracking moves. Who handles /orders in this example?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old system. The routing decision is per capability. Moving tracking does not transfer order-write ownership or require two writers.</p></details><p><a href="../Day4/distinguished-engineer.html">Day4: Static stability: survive first, repair second</a></p><p>Three zones each carry capacity equal to 50% of demand. One fails. What remains?</p><details><summary>Recall first, then reveal the refresher</summary><p>100%. Two surviving zones each contribute 50%, so existing capacity still meets demand.</p></details>

## Understand (4 minutes)

A hotel door looks reversible because it has a handle on both sides. If the return handle is locked, it is really one-way. Technical leaders often call a change reversible while the backup is untested, consumers cannot roll back, or data is destroyed.

A two-way door has limited consequences and a practical route back. A one-way door has major, hard-to-reverse consequences and deserves deeper analysis. Classification changes the decision process; it does not label one choice “good” and the other “bad.”



Consider moving 10% of read traffic to a new query engine. With versioned output, a routing flag, a five-minute rollback, and no destructive writes, the pilot is a two-way door. Sending 100% of writes through a migration that drops the old format is not reversible just because a runbook says “rollback.”

Our visual asks four concrete questions: blast radius, destructive state, rollback path, and whether rollback was tested. A real decision also includes regulatory, customer, financial and organizational consequences.



## Read the visual

A decision diamond branches to experiment or deep review. Control changes alter the branch by changing concrete reversibility evidence.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when deciding how much evidence, review and leadership attention a platform change needs.

**Practical example.** Pilot a new data-quality engine on 10% read-only shadow traffic, with a measured rollback and no producer contract change.

**How to decide.** If reversal is cheap and tested, delegate and learn quickly. If data loss, contract lock-in or broad blast radius makes return hard, treat it as one-way and raise the review bar.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
decision = {"blast": "small", "destructive": False, "rollback_tested": True}
risk = 0
decision["rollback_tested"] = False
risk += 2
decision["destructive"] = True
risk += 3
classification = "deep_review" if risk > 1 else "experiment"
```

1. Start with a bounded, non-destructive pilot and tested exit.

   Changed values: `{"decision": {"blast": "small", "destructive": false, "rollback_tested": true}, "risk": 0}`

2. Removing tested rollback makes reversibility uncertain.

   Changed values: `{"decision": {"blast": "small", "destructive": false, "rollback_tested": false}, "risk": 2}`

3. Destructive state makes the change one-way or not-yet-reversible in this heuristic.

   Changed values: `{"decision": {"blast": "small", "destructive": true, "rollback_tested": false}, "risk": 5, "classification": "deep_review"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executed an original Python decision heuristic. It is not an organizational policy or risk calculation.

## Explore (remaining exploration time)

Start with the safe pilot. Remove the tested rollback, then add destructive writes. Notice when the recommended decision process changes.

Open distinguished-engineer.html for the executable model.

Model limits: The JavaScript score is an original teaching heuristic, not Amazon policy or a risk model. It cannot price legal, security, customer or human impacts.

## Quiz (4 minutes)

1. A pilot has small blast radius, no writes and tested rollback. How should it usually be treated?
   - As a reversible experiment
   - As an irreversible acquisition
   - As risk-free

2. A migration deletes the old representation. What changes?
   - The runbook makes it reversible
   - Destructive state raises the review bar
   - Nothing

3. What is the strongest evidence that a door is two-way?
   - A leader says so
   - Rollback was exercised within the required recovery window
   - The project is small

4. Name the exit mechanism for one platform decision you currently call reversible.
5. What evidence would cause you to reclassify it as one-way?

<details><summary>Answer key — attempt first</summary>

1. As a reversible experiment. The return path is practical, so speed and learning can be appropriate. Reversible does not mean risk-free.

2. Destructive state raises the review bar. A written intent to roll back cannot restore destroyed state. Preserve or reconstruct it before claiming reversibility.

3. Rollback was exercised within the required recovery window. Tested reversal demonstrates the exit under known conditions; labels and project size do not.

</details>

## Sources

- [AWS Executive Insights: Day 1 culture](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/) — Living article; checked 2026-10-09; checked 2026-10-09.
