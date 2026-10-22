# Put toil on a budget before it owns the roadmap

Distinguished Engineer · Day32 · 15 minutes

Turn recurring operational work into a visible capacity decision.

## Recall (2 minutes)

<p><a href="../Day25/distinguished-engineer.html">Day25: A 99.9% service cannot make a 99.9% chain</a></p><p>Three independent required services are each 99.95% available. Is the path exactly 99.95%?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; required probabilities compound. All required steps must succeed, so the path estimate is the product.</p></details><p><a href="../Day13/distinguished-engineer.html">Day13: Deal each tenant a hand: shuffle-shard the fleet</a></p><p>Rainbow uses W1/W4 and Rose uses W1/W8. W1 and W4 fail. Why can Rose continue?</p><details><summary>Recall first, then reveal the refresher</summary><p>Rose has a non-overlapping healthy worker, W8. Rose overlaps at W1 but not completely; W8 remains a path if capacity and retry behavior are sound.</p></details>

## Understand (4 minutes)

A team has a 40-hour jar. Every manual replay, access fix, and release ticket takes time from the same jar as reliability engineering. If recurring work grows quietly, roadmap misses look like an execution problem instead of a capacity fact.

Google SRE defines toil as work that is manual, repetitive, automatable, tactical, lacks enduring value, or grows linearly with the service. The leadership move is to measure it, cap it, and fund work that removes the largest recurring source.



A six-person platform group spends 108 hours each week on manual tenant onboarding: 45% of its 240-hour capacity. A 30% local toil budget allows 72 hours. The 36-hour overflow is explicit. Automating onboarding by 24 hours still leaves a 12-hour gap; leaders must remove more toil, reduce commitments, or add sustainable capacity.



## Read the visual

The single capacity jar is rendered as two proportional bars; increasing toil visibly shrinks engineering work and crosses a named budget line.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a toil budget when repeated operational work keeps displacing platform improvements or grows with tenants, pipelines, or services.

**Practical example.** Every new data domain requires four manual IAM, catalog, and topic tickets, so onboarding work scales linearly with adoption.

**How to decide.** Classify work by its attributes, measure hands-on time, set a local target, and rank elimination projects by recurring hours removed and risk. Do not label necessary novel incident learning as toil just because it is unpleasant.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
weekly_capacity = 240
toil_hours = 108
budget_hours = int(weekly_capacity * 0.30)
overflow = max(0, toil_hours - budget_hours)
```

1. Six people provide a simplified 240-hour weekly pool.

   Changed values: `{"weekly_capacity": 240}`

2. Measure recurring hands-on operational time.

   Changed values: `{"toil_hours": 108}`

3. Set a deliberate local 30% cap.

   Changed values: `{"budget_hours": 72}`

4. Make the displaced 36 hours explicit.

   Changed values: `{"overflow": 36}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is a capacity arithmetic model, not a universal staffing prescription. Google's published 50% SRE goal is context, not a mandated target for every team. The model ignores interrupt variance, skill mix, on-call recovery, and project dependencies.

## Explore (remaining exploration time)

Move weekly toil hours. Watch which roadmap capacity disappears and when the chosen budget is exceeded.

Open distinguished-engineer.html for the executable model.

Model limits: This is a capacity arithmetic model, not a universal staffing prescription. Google's published 50% SRE goal is context, not a mandated target for every team. The model ignores interrupt variance, skill mix, on-call recovery, and project dependencies.

## Quiz (4 minutes)

1. What makes manual onboarding likely toil?
   - It repeats, is automatable, and scales with tenants
   - It involves production
   - Someone dislikes it

2. Why publish a toil budget?
   - It turns hidden displacement into an explicit capacity tradeoff
   - It guarantees automation success
   - It eliminates on-call

3. What is a boundary of the 50% figure?
   - It is Google SRE context, not a universal mandate
   - It applies only to Java teams
   - It proves 49% is healthy

4. Which recurring task consumes the most hands-on hours per month, and what evidence supports that estimate?
5. What commitment would you explicitly defer if toil remains above budget next quarter?

<details><summary>Answer key — attempt first</summary>

1. It repeats, is automatable, and scales with tenants. Toil is classified by work characteristics, not taste.

2. It turns hidden displacement into an explicit capacity tradeoff. A budget makes overflow and sacrificed engineering visible.

3. It is Google SRE context, not a universal mandate. Each team needs a context-appropriate target and evidence.

</details>

## Sources

- [Google SRE: Eliminating Toil](https://sre.google/sre-book/eliminating-toil/) — Foundational SRE chapter; checked 2026-10-22.
- [Google SRE production services best practices](https://sre.google/sre-book/service-best-practices/) — Living guidance; checked 2026-10-22.
