# Stop starting six migrations; finish two

Distinguished Engineer · Day29 · 15 minutes

Use a portfolio work-in-progress limit to turn scattered effort into completed evidence.

## Recall (2 minutes)

<p><a href="../Day18/distinguished-engineer.html">Day18: Keep the reason, not just the verdict: architecture decision records</a></p><p>The requirement changes to 15 minutes. What follows immediately?</p><details><summary>Recall first, then reveal the refresher</summary><p>Start a review; ADR-8 is not accepted yet. An assumption change is evidence for review. It neither evaluates alternatives nor accepts a replacement.</p></details><p><a href="../Day22/distinguished-engineer.html">Day22: The service is green; the business is not recovered yet</a></p><p>Pipeline is green; customer rows remain wrong. Status?</p><details><summary>Recall first, then reveal the refresher</summary><p>Technical service restored; business recovery open. Availability and durable business state are different outcomes.</p></details>

## Understand (4 minutes)

Six half-built bridges do not move any traffic. A platform portfolio can look busy the same way: six migrations are “in progress,” but every team waits for reviews, security decisions, or scarce platform engineers.

A work-in-progress (WIP) limit caps how many initiatives may actively consume the constrained team. New work waits until one item is finished or explicitly stopped. The purpose is flow and learning—not keeping people idle.



Two platform engineers can complete two small migrations every two weeks. Starting six at once spreads attention across all six; after two weeks, each is roughly one-third complete and no decommission evidence exists. With WIP=2, two finish, produce cost and risk evidence, then the next two start.



## Read the visual

The board answers “what actually finishes?” rather than “how many initiatives are active.” Moving the limit changes the distribution of waiting, partial, and evidence-producing work.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a portfolio WIP limit when many “priority” migrations compete for the same reviewers, platform team, or release windows and completion dates keep slipping.

**Practical example.** Six Kafka-to-managed-stream migrations share two platform specialists and one security review lane.

**How to decide.** Find the real constraint, set a visible limit at that point, define “done,” and force an explicit start/stop choice. Do not hide urgent incidents or make the number a productivity target.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
items=6
capacity_per_box=2
wip_limit=2
completed=min(items,capacity_per_box)
evidence_ready=completed
remaining=items-completed
```

1. Model six equal migrations and capacity for two completions.

   Changed values: `{"items": 6, "capacity_per_box": 2}`

2. Admit only two migrations into active work.

   Changed values: `{"wip_limit": 2}`

3. The active pair reaches done in one timebox.

   Changed values: `{"completed": 2}`

4. Completion creates two evidence points for the next decision.

   Changed values: `{"evidence_ready": 2, "remaining": 4}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This arithmetic model assumes equal-sized work, one bottleneck, no blocked dependencies, and two units of capacity per timebox. Real portfolios need item slicing, variability, expedite policies, and outcome measures. A WIP limit reveals tradeoffs; it does not choose strategy for you.

## Explore (remaining exploration time)

Choose the WIP limit. The board shows completed migrations after two timeboxes and how many remain merely started.

Open distinguished-engineer.html for the executable model.

Model limits: This arithmetic model assumes equal-sized work, one bottleneck, no blocked dependencies, and two units of capacity per timebox. Real portfolios need item slicing, variability, expedite policies, and outcome measures. A WIP limit reveals tradeoffs; it does not choose strategy for you.

## Quiz (4 minutes)

1. What is the primary purpose of a WIP limit?
   - Keep everyone maximally busy
   - Improve flow and finish evidence
   - Ban all urgent work

2. Six equal items share capacity for two. With WIP=6 in this toy, what finishes in one box?
   - Six
   - Two
   - None

3. What must accompany a WIP limit?
   - A clear definition of done and visible constraint
   - More hidden projects
   - Individual utilization targets

4. Which team or approval lane is the true constraint across your current portfolio?
5. What two initiatives would you stop starting so one important migration can finish?

<details><summary>Answer key — attempt first</summary>

1. Improve flow and finish evidence. Finishing creates feedback and frees the bottleneck.

2. None. Capacity is spread across all six, so none crosses the finish line.

3. A clear definition of done and visible constraint. The policy needs a completion boundary and the bottleneck it protects.

</details>

## Sources

- [DORA value stream mapping guide](https://dora.dev/guides/value-stream-management/) — Updated November 13, 2024; checked 2026-10-19.
- [Google Cloud DevOps capabilities: work in process limits](https://docs.cloud.google.com/architecture/devops) — Living documentation; checked 2026-10-19.
- [DORA continuous delivery capability](https://dora.dev/capabilities/continuous-delivery/) — Living documentation; checked 2026-10-19.
