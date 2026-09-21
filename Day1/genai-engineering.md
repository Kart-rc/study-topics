# An agent handoff that survives a reset

GenAI engineering · Day1 · 15 minutes

Design a durable handoff that separates an agent’s claim of completion from evidence that the work actually passed.

## Recall (2 minutes)

No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.

## Understand (4 minutes)

A language model’s active context is temporary. A harness is the surrounding execution system: it provides tools, selects work, records state, and decides how to continue. Anthropic describes an initial setup phase followed by sessions that make bounded progress, inspect previous artifacts, and leave a clean handoff. Its experiment highlights premature completion and insufficient end-to-end checking as recurring failure modes. Read the original engineering report.For your own design, treat the handoff as a small operational record. It should let another session determine what is verified, what is uncertain, and which action is safe next. A confident paragraph is weaker than a result tied to an exact artifact and check.

Original teaching case: An agent is generating these study pages. It writes five HTML files, then loses its context before checking the buttons. A note saying “Day complete” creates a false starting point for the next session. A useful record instead says “files written; browser validation pending; generation number 1; repository head X.”Use an explicit progression: planned → written → verified. The transition to verified requires observed checks. Commit the lesson files and their manifest together, so readers do not see a manifest referring to absent pages. Before a retry, inspect the repository for the same date and day number; reuse or repair it rather than allocating another day blindly.This does not make all side effects exactly once. A crash after a remote write but before a local acknowledgment leaves uncertainty. Recovery needs to inspect authoritative remote state. A repository commit identifier, request identity, and non-forced update help resolve that ambiguity.Design question: what is the smallest record that makes recovery deterministic? For this case: destination, generation key, file list, verified checks, source references, and the next unresolved action.

## Explore (5 minutes)

Write an artifact, reset the session, and inspect whether it is considered verified. Repeat after verification. Explain why the durable state must not simply copy whatever the model says. Name a remote action whose outcome you would inspect before retrying.

Open genai-engineering.html for the executable model.

Model limits: This is an executable in-memory state machine. “New session” clears only working memory while retaining the simulated durable record; reloading the whole page resets the model. Verification is simulated, not a real code test or an LLM call.

## Quiz (4 minutes)

1. Session stops after files are written, before checks. Next step?
   - Assume complete
   - Inspect artifacts and run missing checks
   - Allocate a duplicate day

2. Why tie evidence to a commit or artifact version?
   - A passing check of old content does not validate changed content
   - To make notes longer
   - To eliminate all failures

3. Remote write succeeded but acknowledgment was lost. Retry immediately?
   - Always
   - Delete remote content
   - Inspect remote state using the operation identity first

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.

2. A passing check of old content does not validate changed content. Evidence only establishes something about the artifact that was checked.

3. Inspect remote state using the operation identity first. The outcome is uncertain. Inspect authoritative state to avoid repeating a completed action.

</details>

## Sources

- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — 2025-11-26; checked 2026-09-21.
