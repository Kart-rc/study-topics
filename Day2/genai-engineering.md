# Grade the outcome, not the victory message

GenAI engineering · Day2 · 15 minutes

Write an agent success predicate that checks the requested result and authorization, then expose false positives in a naive grader.

## Recall (2 minutes)

<p><a href="../Day1/genai-engineering.html">Day1: An agent handoff that survives a reset</a></p><p>Session stops after files are written, before checks. Next step?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.</p></details>

## Understand (4 minutes)

An agent can produce a persuasive completion message while leaving the environment wrong. An evaluation needs a task, one or more trials, and grading logic. Checking final state is different from checking the transcript. Deterministic assertions suit exact outcomes; calibrated model or human grading may be needed for more subjective quality. Anthropic's evaluation guide.

The design goal is not to force one preferred sequence of tool calls. It is to accept valid ways of satisfying the task while rejecting incorrect outcomes and policy violations. Explicitly required approvals remain part of correctness, even when the requested mutation itself succeeds.



Original teaching case: An incident assistant may quarantine one synthetic dataset only after approval. The task requires exactly one quarantine marker on dataset demo-orders, no changes to another dataset, and an approval record. The assistant's sentence “quarantine completed” establishes none of these facts.

Four local fixtures all contain a success claim. One has no marker. One has the correct marker and approval. One modifies two datasets. One makes the right mutation without approval. A claim-only grader reports 4/4. The actual task contract passes only the second fixture, or 1/4. That difference is a grader defect, not a model improvement.

A compact illustrative predicate is:

pass = approvalRecorded
   and modifiedDatasets == ["demo-orders"]
   and quarantineMarkerCount == 1

Keep these fixtures immutable, reset the environment between trials, and record the task and artifact versions alongside results. Otherwise a leftover marker from yesterday can make today's agent look successful. Test the grader against a known-correct fixture and deliberately wrong fixtures before comparing models.

Do not stop at this four-case demonstration. A complete suite for the proposed assistant also needs denied-approval behavior, unavailable tools, stale evidence, unexpected data shapes, and recovery after an uncertain write. A safe refusal can be the correct outcome when permission is absent, but that must be a separate task contract: our current four fixtures all falsely claim completion.

Use exact checks for exact state and a separate rubric for explanation quality. Averaging a beautiful explanation with an unauthorized write into a passing score would erase an important boundary. Day1's durable progress record should point to evidence produced by a trustworthy grader, not merely another agent's confident assertion.



## Explore (5 minutes)

Toggle between claim-only and contract grading. Predict which fixtures pass before inspecting the results. Define one false-positive and one false-negative test for a real read-only RCA assistant. Explain which checks could be deterministic and which require expert judgment.

Open genai-engineering.html for the executable model.

Model limits: Four deterministic synthetic fixtures; no LLM is called and no real dataset is modified. This illustrates grader validity, not agent accuracy, benchmark performance, or statistical reliability. The simplified authorization boolean does not implement an authentication or approval system.

## Quiz (4 minutes)

1. All four fixtures claim success, but only one meets the contract. Claim-only grading produces how many false positives?
   - 0
   - 1
   - 3

2. Why verify grader behavior against known-good and known-bad fixtures?
   - To distinguish grader defects from agent failures
   - To eliminate the need for real tasks
   - To guarantee future performance

3. The agent makes the correct mutation without required approval. Should a polished explanation compensate?
   - Yes, average the scores
   - No; authorization is a required boundary
   - Only if it sounds confident

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 3. The other three fixtures are incorrectly labeled successful by the weak grader.

2. To distinguish grader defects from agent failures. A wrong grader makes model comparisons misleading. Test the measurement instrument first.

3. No; authorization is a required boundary. A mandatory approval condition is not interchangeable with prose quality.

</details>

## Sources

- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — 2026-01-09; checked 2026-09-22.
