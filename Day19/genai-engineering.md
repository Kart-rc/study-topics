# Same agent, different sandbox: resource budgets are part of the eval

GenAI engineering · Day19 · 15 minutes

Separate agent failure from infrastructure failure before comparing scores.

## Recall (2 minutes)

<p><a href="../Day10/genai-engineering.html">Day10: Valid tool input can still be the wrong action</a></p><p>A100 / 25 cents passes the schema. Why is it blocked?</p><details><summary>Recall first, then reveal the refresher</summary><p>The amount does not match the requested $25. 25 is a valid positive integer, but it means $0.25. The trusted request is 2500 cents; schema validity does not establish intent.</p></details><p><a href="../Day4/genai-engineering.html">Day4: Agent durability: separate the brain, the hands, and the session</a></p><p>A decoupled sandbox fails after two durable checkpoint events. What can a replacement recover?</p><details><summary>Recall first, then reveal the refresher</summary><p>The session history and two completed checkpoints. The recovery source is the external session log, not the failed sandbox.</p></details>

## Understand (4 minutes)

Two runners take the same obstacle course. One gets ten minutes and the other gets five. Their finish times do not isolate running ability. Agent evaluations are also end-to-end experiments: CPU, memory, time, network and sandbox enforcement can change outcomes.

A fair comparison fixes and records the resource policy. It also labels infrastructure failures separately from incorrect solutions. “8/10 passed” can hide that two trials were killed before the grader observed an answer.



Our synthetic task needs 1.5 GB briefly and produces a correct patch. Under a 1 GB hard ceiling it is killed: infrastructure error. Under a 1 GB guaranteed allocation with a 2 GB ceiling it completes: pass. Giving 8 GB may also change which strategies the agent can afford, so more headroom is not automatically a neutral fix.

This follows Anthropic’s February 2026 finding that infrastructure configuration can materially change agentic benchmark results. Their reported measurements belong to their setup; our browser uses an original one-task calculator.



## Read the visual

One shared 0–8 GB scale compares strategy demand with the ceiling. Outcome labels separate infrastructure completion from capability.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when comparing models, prompts or harness versions on coding tasks that run commands, compile code or install dependencies.

**Practical example.** Run every candidate against the same container image, guaranteed CPU/RAM, hard ceilings, time limit and egress policy; publish infra-error counts separately.

**How to decide.** Calibrate enough headroom to avoid transient platform kills without silently making the task easier. Repeat across times and inspect confidence, not only a leaderboard point estimate.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
task_peak_gb = 1.5
strict_ceiling_gb = 1.0
strict_infra_error = task_peak_gb > strict_ceiling_gb
strict_capability_observed = not strict_infra_error
calibrated_ceiling_gb = 2.0
calibrated_infra_error = task_peak_gb > calibrated_ceiling_gb
calibrated_capability_observed = not calibrated_infra_error
```

1. The correct strategy briefly needs more memory than the strict ceiling.

   Changed values: `{"task_peak_gb": 1.5, "strict_ceiling_gb": 1.0}`

2. The strict sandbox kills the trial; no capability result is observed.

   Changed values: `{"strict_infra_error": true, "strict_capability_observed": false}`

3. A calibrated ceiling lets the same synthetic strategy reach the grader.

   Changed values: `{"calibrated_ceiling_gb": 2.0, "calibrated_infra_error": false, "calibrated_capability_observed": true}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executed threshold arithmetic. No agent, container or benchmark task runs.

## Explore (remaining exploration time)

Hold the agent strategy constant. Change the hard memory ceiling, then change the strategy demand. Explain which outcome is capability and which is infrastructure.

Open genai-engineering.html for the executable model.

Model limits: The browser uses deterministic thresholds, not a container runtime or LLM. It does not model CPU throttling, noisy neighbors, API latency, sampling variance or statistical significance.

## Quiz (4 minutes)

1. A correct strategy is OOM-killed before grading. How should the trial be labeled?
   - Wrong answer only
   - Infrastructure failure; capability not observed
   - Pass

2. Why not make every eval uncapped?
   - Unlimited resources can enable different strategies and change what is measured
   - It is always free
   - It removes sampling variance

3. What must be matched when comparing two agents?
   - Only prompt wording
   - Only model name
   - Task, harness and enforceable resource policy

4. List the resource fields your eval report must publish.
5. How would you calibrate headroom without silently changing task difficulty?

<details><summary>Answer key — attempt first</summary>

1. Infrastructure failure; capability not observed. The sandbox prevented an observable solution. Count and report it separately from a graded wrong answer.

2. Unlimited resources can enable different strategies and change what is measured. A very generous environment can make heavyweight strategies viable. Resource methodology remains part of the experiment.

3. Task, harness and enforceable resource policy. End-to-end agent results depend on the task, scaffold and environment, not just model identity.

</details>

## Sources

- [Anthropic: Quantifying infrastructure noise in agentic coding evals](https://www.anthropic.com/engineering/infrastructure-noise) — 2026-02-05; checked 2026-10-09.
