# Agent reliability: one success is not repeatable success

GenAI engineering · Day17 · 15 minutes

Read repeated-trial evaluations without hiding failures behind the best attempt.

## Recall (2 minutes)

<p><a href="../Day8/genai-engineering.html">Day8: MCP tool annotations: risk vocabulary, not a security boundary</a></p><p>An unknown MCP server marks a tool readOnlyHint=true. What may a secure client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The hint is untrusted; enforce permissions and use the cautious path. The specification requires clients to treat annotations from untrusted servers as untrusted.</p></details><p><a href="../Day2/genai-engineering.html">Day2: Grade the outcome, not the victory message</a></p><p>All four fixtures claim success, but only one meets the contract. Claim-only grading produces how many false positives?</p><details><summary>Recall first, then reveal the refresher</summary><p>3. The other three fixtures are incorrectly labeled successful by the weak grader.</p></details>

## Understand (4 minutes)

A driver reaches your house once in three attempts. That proves the route is possible. It does not prove tomorrow’s delivery will work. Agents also vary across attempts.

Look across one task’s row before counting tasks. “Any” asks whether that row contains a success. “All” asks whether it contains a failure. One failure knocks the task out of the all-success count, even when two attempts succeeded.

Read one row two ways: Task ATry 1Try 2Try 3Any?All?PassPassFailYes: ≥1 passNo: 1 failSame evidence, different question. Task A counts once toward “any”; zero times toward “all.” It never counts twice just because two trials passed.Across many tasks, summarize the fraction that succeeded at least once in k attempts (pass@k) or in every attempt (pass^k). The second asks for consistency. Do not present the first as if it answered the second.



Our four synthetic tasks each have three clean trials: A = PPF, B = PFP, C = PPP, D = FFF. Three pass at least once: an observed 3/4 = 75%. Only C passes every trial: 1/4 = 25%. Individual trials have 7 passes out of 12. Those denominators answer different questions.

Reset files, database fixtures, and tool state before each trial. Otherwise a previous attempt may leave the answer behind or exhaust a resource. The harness must preserve comparability, not merely call the model again.



## Read the visual

The visual reads each task horizontally, converting its three pass/fail cells into two answers: Any and All. Then it counts those answers vertically, displaying four labeled task blocks for each denominator. In the mixed fixture, A/B/C count for Any; only C counts for All. Changing A’s third cell from Fail to Pass leaves Any at 3/4 and increases All to 2/4. The separate 7/12 trial total counts cells instead of task rows. This makes the denominator difference and the hidden intermittent failures visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** An agent passes a demo but users see intermittent failures, or a model change needs a reliability comparison.

**Practical example.** Run a pipeline-repair agent repeatedly on isolated incident fixtures. Grade the resulting pipeline, then report consistency and failure categories for each task.

**How to decide.** At-least-once success suits cases where a human can select a verified solution. For unattended work, inspect repeatability and side effects. Neither a tiny dataset nor its average proves production safety.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
trials = [[1,1,0], [1,0,1], [1,1,1], [0,0,0]]
any_pass = [any(row) for row in trials]
all_pass = [all(row) for row in trials]
observed_any = sum(any_pass) / len(trials)
observed_all = sum(all_pass) / len(trials)
individual_passes = sum(sum(row) for row in trials)
trial_count = sum(len(row) for row in trials)
```

1. Each row is one task with three trial outcomes.

   Changed values: `{"trials": [[1, 1, 0], [1, 0, 1], [1, 1, 1], [0, 0, 0]]}`

2. Keep the failures while classifying tasks two ways.

   Changed values: `{"any_pass": [true, true, true, false], "all_pass": [false, false, true, false]}`

3. The same data yields 75% and 25%.

   Changed values: `{"observed_any": 0.75, "observed_all": 0.25}`

4. Seven of twelve individual trials pass: a different denominator.

   Changed values: `{"individual_passes": 7, "trial_count": 12}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executed Python aggregation of synthetic results, not an agent benchmark or statistical confidence estimate.

## Explore (remaining exploration time)

First read across Task A, then down the two result columns. Predict what happens if its failed third trial becomes a pass. Click “Change A’s third trial,” and watch which count moves. Then choose the repaired fixture: why can all-success rise while any-success stays at 75%?

Open genai-engineering.html for the executable model.

Model limits: JavaScript counts fixed synthetic outcomes; it calls no model and predicts no production probability. These observed fractions use one k-trial group per task, not the combinatorial pass@k estimator for sampling k attempts from a larger n.

## Quiz (4 minutes)

1. For PPF, PFP, PPP, FFF, how many tasks pass every trial?
   - Three
   - One
   - Four

2. After A and B become PPP, what changes?
   - Any-success stays 75%; all-success becomes 75%
   - Both become 100%
   - Neither changes

3. Why reset tool state?
   - To guarantee independent outputs
   - To make all tasks pass
   - To prevent leftovers changing the task

4. Which measure matters for an unattended repair agent, and what failures would you inspect?
5. Why is 75% on four tasks not a forecast for every real incident?

<details><summary>Answer key — attempt first</summary>

1. One. Only PPP meets every-trial success. Three have at least one success.

2. Any-success stays 75%; all-success becomes 75%. D still fails. Removing intermittent failures improves consistency.

3. To prevent leftovers changing the task. Isolation removes contamination; it cannot guarantee independence or success.

</details>

## Sources

- [Anthropic: demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Published 2026-01-09; checked 2026-10-07.
