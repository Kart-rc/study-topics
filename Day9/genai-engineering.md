# Eval leakage: keep a set the prompt never studied

GenAI engineering · Day9 · 15 minutes

Separate iteration evidence from decision evidence so prompt, tool, and policy changes do not memorize the benchmark that is supposed to approve them.

## Recall (2 minutes)

<p><a href="../Day7/genai-engineering.html">Day7: Agent termination: done, stalled, or out of budget</a></p><p>The API returns stop_reason=tool_use. What should the harness infer?</p><details><summary>Recall first, then reveal the refresher</summary><p>A tool call must be executed and its result returned. A response-level stop reason drives the next protocol step; it is not a task verdict.</p></details><p><a href="../Day2/genai-engineering.html">Day2: Grade the outcome, not the victory message</a></p><p>All four fixtures claim success, but only one meets the contract. Claim-only grading produces how many false positives?</p><details><summary>Recall first, then reveal the refresher</summary><p>3. The other three fixtures are incorrectly labeled successful by the weak grader.</p></details>

## Understand (4 minutes)

An agent harness improves by examining failures: change the prompt, add a tool constraint, alter retrieval, then rerun cases. That development loop is valuable, but every case the team studies becomes training data for the human-designed system. A score on those same cases measures both general capability and case-specific fixes.

Keep three roles distinct. A development set is visible and diagnostic. A held-out set is representative but untouched until a decision gate. Production monitoring detects drift and rare failures after release. OpenAI's evaluation guidance recommends task-specific data that reflects real distributions, automated scoring where possible, logging, and continuous evaluation. Its deployment-simulation research similarly uses recent de-identified production traffic for representative comparison, while noting that rare tail risks still need targeted evaluation and red teaming.

Harness discipline means versioning prompts, tools, graders, datasets, and environments together; preventing test IDs or reference answers from entering context; limiting holdout peeks; and recording every decision. A held-out number is credible only if selection, leakage, grader reliability, and distribution fit are controlled.



Worked example: A 50-case dev set starts at 70% (35 passes). Each prompt iteration directly fixes two remembered dev cases. After ten iterations, dev reaches 100%, but untouched deployment performance is still 70% if none of the fixes generalize. A separate 200-case holdout would reveal that gap. If the team repeatedly inspects holdout failures and tunes to them, it silently becomes a second dev set.

observed dev = baseline passes + memorized case fixes
credible gate = untouched, representative cases + reliable graders

The conclusion is not “never inspect failures.” It is to budget diagnostic sets explicitly and refresh decision sets after they have influenced design.



## Explore (5 minutes)

Change dev-set size, iterations, and targeted fixes per iteration. Predict the visible dev score and the untouched deployment score. Then turn on holdout peeking and explain why the displayed holdout can inflate without real generalization.

Open genai-engineering.html for the executable model.

Model limits: A deterministic case-memorization model, not an LLM learning curve. It assumes targeted fixes never generalize and baseline performance is identical across representative sets. Real changes may generalize positively or regress other cases; sampling error, nondeterminism, grader error, correlated examples, and production drift matter. Holdout discipline does not replace safety tests for rare or adversarial behavior.

## Quiz (4 minutes)

1. Why can a dev-set score rise without deployment quality improving?
   - The harness may have memorized visible cases through targeted prompt and tool changes
   - Development sets disable model inference
   - Production always has fewer examples

2. What happens after engineers inspect holdout failures and tune to them repeatedly?
   - The set becomes part of the development process and loses its independent-gate role
   - The grader becomes mathematically perfect
   - Distribution shift is eliminated

3. Which boundary remains even with a clean representative holdout?
   - Rare adversarial events may be absent and need targeted tests or red teaming
   - Versioning the prompt is unnecessary
   - Production monitoring can be removed

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. The harness may have memorized visible cases through targeted prompt and tool changes. Repeatedly fixing known cases optimizes the test surface as well as the underlying behavior.

2. The set becomes part of the development process and loses its independent-gate role. Once examples influence design, they are no longer untouched evidence.

3. Rare adversarial events may be absent and need targeted tests or red teaming. Representative traffic estimates common behavior; tail risks require complementary evidence.

</details>

## Sources

- [OpenAI API documentation: Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) — Living official documentation; checked 2026-09-29; checked 2026-09-29.
- [OpenAI Research: Deployment Simulation](https://openai.com/index/deployment-simulation/) — Published 2026; checked 2026-09-29; checked 2026-09-29.
- [OpenAI Cookbook: Evals API—tools evaluation](https://cookbook.openai.com/examples/evaluation/use-cases/tools-evaluation) — Official OpenAI example; living documentation; checked 2026-09-29.
