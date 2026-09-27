# Agent termination: done, stalled, or out of budget

GenAI engineering · Day7 · 15 minutes

Turn an open-ended tool loop into an observable contract with evidence-based completion, progress detection, and hard resource bounds.

## Recall (2 minutes)

<p><a href="../Day4/genai-engineering.html">Day4: Agent durability: separate the brain, the hands, and the session</a></p><p>A decoupled sandbox fails after two durable checkpoint events. What can a replacement recover?</p><details><summary>Recall first, then reveal the refresher</summary><p>The session history and two completed checkpoints. The recovery source is the external session log, not the failed sandbox.</p></details><p><a href="../Day6/genai-engineering.html">Day6: Agent sandboxing: make authority smaller than intent</a></p><p>What distinguishes a sandbox boundary from a permission prompt?</p><details><summary>Recall first, then reveal the refresher</summary><p>It enforces what the process can access outside the model. OS and proxy controls constrain capability even when the model proposes the wrong action.</p></details>

## Understand (4 minutes)

An agent saying “done” is a model output, not a completion proof. A harness needs separate loop control: a measurable end state, a check that produces evidence, constraints that must remain true, and a hard turn/time/cost bound. It should distinguish success from impossible, stalled, interrupted, and budget-exhausted outcomes.

Anthropic's current /goal documentation describes a separate evaluator that checks a condition after each turn, recommends measurable evidence and an explicit turn/time clause, and stops repeated no-tool non-progress. At the API layer, stop_reason describes why one model response ended: tool_use means execute a tool, while end_turn means natural response completion—not necessarily that the external task is satisfied.



Original teaching case: A migration agent begins with eight failing contract tests. The contract is: “all eight pass, no unrelated schema file changes, or stop after five turns.” A fresh evaluator reads test evidence after every turn.

turn outcome → tool result → verifier verdict
MET: all required checks pass
STALLED: no measurable progress for two turns
BUDGET_EXHAUSTED: hard bound reached with work remaining

At two repaired tests per turn, the agent proves completion on turn four. At one per turn, it stops after turn five with three failures remaining; the harness records unfinished state instead of converting resource exhaustion into success. Preserve the event trail and last verified state so a later session can resume deliberately.



## Explore (5 minutes)

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
