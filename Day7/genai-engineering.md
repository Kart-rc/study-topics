# Agent termination: done, stalled, or out of budget

GenAI engineering · Day7 · 15 minutes

An agent reaches its turn limit with tests still failing.

## Recall (2 minutes)

<p><a href="../Day4/genai-engineering.html">Day4: Agent durability: separate the brain, the hands, and the session</a></p><p>A decoupled sandbox fails after two durable checkpoint events. What can a replacement recover?</p><details><summary>Recall first, then reveal the refresher</summary><p>The session history and two completed checkpoints. The recovery source is the external session log, not the failed sandbox.</p></details><p><a href="../Day6/genai-engineering.html">Day6: Agent sandboxing: make authority smaller than intent</a></p><p>What distinguishes a sandbox boundary from a permission prompt?</p><details><summary>Recall first, then reveal the refresher</summary><p>It enforces what the process can access outside the model. OS and proxy controls constrain capability even when the model proposes the wrong action.</p></details>

## Understand (4 minutes)

An agent reaches its turn limit with tests still failing. “Stopped” should not be recorded as “finished.”

A harness needs separate end states: the task is verified, progress has stalled, or the resource budget is exhausted. Determine completion from observed task evidence. Preserve the last checked state so another session can resume deliberately.



Eight tests initially fail. Fixing one each turn leaves three after five turns, so the result is budget exhausted. Fixing two per turn would reach zero on turn four. The model below executes the slower case.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
remaining_failures = 8; turn = 0; max_turns = 5
remaining_failures -= 1; turn += 1
remaining_failures -= 1; turn += 1
remaining_failures -= 1; turn += 1
remaining_failures -= 1; turn += 1
remaining_failures -= 1; turn += 1
status = "MET" if remaining_failures == 0 else "BUDGET_EXHAUSTED" if turn >= max_turns else "CONTINUE"
```

1. Set the task state and resource bound.

   Changed values: `{"remaining_failures": 8, "turn": 0, "max_turns": 5}`

2. One failure is repaired on turn one.

   Changed values: `{"remaining_failures": 7, "turn": 1}`

3. Turn two leaves six failures.

   Changed values: `{"remaining_failures": 6, "turn": 2}`

4. Turn three leaves five.

   Changed values: `{"remaining_failures": 5, "turn": 3}`

5. Turn four leaves four.

   Changed values: `{"remaining_failures": 4, "turn": 4}`

6. Turn five leaves three.

   Changed values: `{"remaining_failures": 3, "turn": 5}`

7. The harness reports unfinished work honestly.

   Changed values: `{"status": "BUDGET_EXHAUSTED"}`

[Full runnable example](examples/genai-engineering.py).

Limits: This assumes supplied test counts are trustworthy and each turn repairs exactly one. A real verifier must also check unrelated changes, stale results, and progress criteria.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>An agent saying “done” is a model output, not a completion proof. A harness needs separate loop control: a measurable end state, a check that produces evidence, constraints that must remain true, and a hard turn/time/cost bound. It should distinguish success from impossible, stalled, interrupted, and budget-exhausted outcomes.</p><p>Anthropic's current <code>/goal</code> documentation describes a separate evaluator that checks a condition after each turn, recommends measurable evidence and an explicit turn/time clause, and stops repeated no-tool non-progress. At the API layer, <code>stop_reason</code> describes why one model response ended: <code>tool_use</code> means execute a tool, while <code>end_turn</code> means natural response completion—not necessarily that the external task is satisfied.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A migration agent begins with eight failing contract tests. The contract is: “all eight pass, no unrelated schema file changes, or stop after five turns.” A fresh evaluator reads test evidence after every turn.</p><pre>turn outcome → tool result → verifier verdict
MET: all required checks pass
STALLED: no measurable progress for two turns
BUDGET_EXHAUSTED: hard bound reached with work remaining</pre><p>At two repaired tests per turn, the agent proves completion on turn four. At one per turn, it stops after turn five with three failures remaining; the harness records unfinished state instead of converting resource exhaustion into success. Preserve the event trail and last verified state so a later session can resume deliberately.</p>

</details>

## Explore (remaining exploration time)

Predict the outcome at two fixes per turn, then lower progress to one and zero. Disable the evaluator and explain why a fluent first-turn answer is weaker evidence than a test exit code.

Open genai-engineering.html for the executable model.

Model limits: A deterministic counter of failing checks with a synthetic token charge per turn. It does not call a model or tool, judge semantic correctness, inspect files, enforce unchanged constraints, model flaky tests, recover from context overflow, price real tokens, or reproduce Claude Code's evaluator implementation.

## Quiz (4 minutes)

1. The API returns stop_reason=tool_use. What should the harness infer?
   - The whole task is complete
   - A tool call must be executed and its result returned
   - The goal is impossible

2. Why use an evaluator separate from the working agent?
   - To check surfaced evidence against the completion condition instead of trusting self-report
   - To guarantee the tests are well designed
   - To remove resource bounds

3. What boundary remains even after every named test passes?
   - The test suite may omit an important requirement
   - The harness cannot record a pass
   - A hard turn budget becomes infinite

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. A tool call must be executed and its result returned. A response-level stop reason drives the next protocol step; it is not a task verdict.

2. To check surfaced evidence against the completion condition instead of trusting self-report. Independent checking reduces the incentive and ambiguity of self-declared completion.

3. The test suite may omit an important requirement. Evidence is only as complete as the checks and constraints in the contract.

</details>

## Sources

- [Claude Code Docs: Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) — Living product documentation; publication date not stated; checked 2026-09-27.
- [Claude Platform Docs: Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons) — Living API documentation; publication date not stated; checked 2026-09-27.
