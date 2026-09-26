# Context compaction: preserve decisions, discard exhaust

GenAI engineering · Day5 · 15 minutes

Design a long-running agent's compaction policy around recoverable decisions, open work, and evidence pointers rather than transcript length.

## Recall (2 minutes)

<p><a href="../Day2/genai-engineering.html">Day2: Grade the outcome, not the victory message</a></p><p>All four fixtures claim success, but only one meets the contract. Claim-only grading produces how many false positives?</p><details><summary>Recall first, then reveal the refresher</summary><p>3. The other three fixtures are incorrectly labeled successful by the weak grader.</p></details><p><a href="../Day4/genai-engineering.html">Day4: Agent durability: separate the brain, the hands, and the session</a></p><p>A decoupled sandbox fails after two durable checkpoint events. What can a replacement recover?</p><details><summary>Recall first, then reveal the refresher</summary><p>The session history and two completed checkpoints. The recovery source is the external session log, not the failed sandbox.</p></details>

## Understand (4 minutes)

An agent context window is working memory, not a durable event store. Keeping every tool result feels safe, but repeated logs, diffs, and search pages consume attention that the next decision needs. Bigger context does not remove relevance dilution.

Compaction summarizes an aging trace into a smaller continuation context. The selection policy is the engineering work: preserve goal and constraints, architectural decisions with rationale, unresolved risks, progress and next actions, plus identifiers that can re-fetch evidence. Raw tool exhaust is usually cheaper to retrieve again than to carry forever.



Original teaching case: A migration agent has a 12,000-token continuation budget. Its trace contains 8,000 tokens of repeated Spark plan output, 3,000 recent conversational tokens, 2,000 tokens of decisions, 1,500 open-task tokens, and 1,000 tokens of file/commit pointers.

A transcript-tail policy keeps the newest plan output and conversation but can evict the decision that partition changes must remain backward compatible. A structured policy emits a compact handoff: objective, invariants, decisions and reasons, unresolved checks, current artifacts, and re-fetchable evidence pointers.

durable log: complete history and artifacts
compacted context: smallest high-signal continuation state
pointer: where evidence can be fetched again

Summaries are lossy. Keep the underlying trace durable, version the compaction prompt, run probes for required facts after compaction, and evaluate on real long-horizon failures. Never treat a fluent summary as proof that critical evidence survived.



## Explore (5 minutes)

Compare transcript-tail and structured policies at 8,000 tokens, then raise the budget. Identify which missing item creates a silent correctness risk rather than an obvious failure.

Open genai-engineering.html for the executable model.

Model limits: A deterministic greedy packing model with hand-authored token costs and importance order. It does not call an LLM, measure attention, summarize text, model overlapping information, validate factual fidelity, or reproduce Anthropic's implementation or performance.

## Quiz (4 minutes)

1. Which item is usually safest to evict from long-running working context?
   - The objective
   - Repeated raw tool output that can be re-fetched
   - An unresolved production risk

2. Why keep evidence pointers in a compact handoff?
   - They let the agent recover detail without carrying every raw token
   - They prove the summary is correct
   - They make durable storage unnecessary

3. What is the key boundary of compaction?
   - A summary can lose a fact whose importance appears later
   - It always expands the context
   - It guarantees deterministic model behavior

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Repeated raw tool output that can be re-fetched. Re-fetchable exhaust is lower-value than the state needed to continue correctly.

2. They let the agent recover detail without carrying every raw token. Pointers support just-in-time retrieval while preserving a tight attention budget.

3. A summary can lose a fact whose importance appears later. Compaction is lossy, so durable traces and post-compaction probes remain necessary.

</details>

## Sources

- [Anthropic Engineering: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Published 2025-09-29; checked 2026-09-25.
