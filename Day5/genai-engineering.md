# Context compaction: preserve decisions, discard exhaust

GenAI engineering · Day5 · 15 minutes

A long agent transcript contains thousands of repeated log lines.

## Recall (2 minutes)

<p><a href="../Day2/genai-engineering.html">Day2: Grade the outcome, not the victory message</a></p><p>All four fixtures claim success, but only one meets the contract. Claim-only grading produces how many false positives?</p><details><summary>Recall first, then reveal the refresher</summary><p>3. The other three fixtures are incorrectly labeled successful by the weak grader.</p></details><p><a href="../Day4/genai-engineering.html">Day4: Agent durability: separate the brain, the hands, and the session</a></p><p>A decoupled sandbox fails after two durable checkpoint events. What can a replacement recover?</p><details><summary>Recall first, then reveal the refresher</summary><p>The session history and two completed checkpoints. The recovery source is the external session log, not the failed sandbox.</p></details>

## Understand (4 minutes)

A long agent transcript contains thousands of repeated log lines. Keeping only the newest text can remove an important earlier decision.

Context compaction replaces bulky conversation history with a smaller continuation record. Keep the goal, rules, decisions, open checks, and evidence locations. Keep the full evidence separately so a short summary does not become the only source of truth.



The important rule is “preserve old partition readers.” The toy handoff retains that rule and a pointer to the full trace while dropping repeated plan output. A simple probe then checks that the rule survived.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
record = {"rule": "preserve old partition readers", "open_check": "replay old data", "log_pointer": "trace-42", "noise": "repeated plan output"}
handoff = {key: record[key] for key in ["rule", "open_check", "log_pointer"]}
record = None
rule_survives = handoff["rule"] == "preserve old partition readers"
next_step = handoff["open_check"]
```

1. The original record mixes essential facts and disposable repetition.

   Changed values: `{"record": {"rule": "preserve old partition readers", "open_check": "replay old data", "log_pointer": "trace-42", "noise": "repeated plan output"}}`

2. Select the continuation facts deliberately.

   Changed values: `{"handoff": {"rule": "preserve old partition readers", "open_check": "replay old data", "log_pointer": "trace-42"}}`

3. The active context no longer holds the original record.

   Changed values: `{"record": null}`

4. Probe a required fact after compaction.

   Changed values: `{"rule_survives": true}`

5. The next action remains explicit.

   Changed values: `{"next_step": "replay old data"}`

[Full runnable example](examples/genai-engineering.py).

Limits: This exact dictionary selection is not an LLM summarizer. Real summaries can omit or distort facts; keep durable evidence and evaluate required-fact retention.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>An agent context window is working memory, not a durable event store. Keeping every tool result feels safe, but repeated logs, diffs, and search pages consume attention that the next decision needs. Bigger context does not remove relevance dilution.</p><p>Compaction summarizes an aging trace into a smaller continuation context. The selection policy is the engineering work: preserve goal and constraints, architectural decisions with rationale, unresolved risks, progress and next actions, plus identifiers that can re-fetch evidence. Raw tool exhaust is usually cheaper to retrieve again than to carry forever.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A migration agent has a 12,000-token continuation budget. Its trace contains 8,000 tokens of repeated Spark plan output, 3,000 recent conversational tokens, 2,000 tokens of decisions, 1,500 open-task tokens, and 1,000 tokens of file/commit pointers.</p><p>A transcript-tail policy keeps the newest plan output and conversation but can evict the decision that partition changes must remain backward compatible. A structured policy emits a compact handoff: objective, invariants, decisions and reasons, unresolved checks, current artifacts, and re-fetchable evidence pointers.</p><pre>durable log: complete history and artifacts
compacted context: smallest high-signal continuation state
pointer: where evidence can be fetched again</pre><p>Summaries are lossy. Keep the underlying trace durable, version the compaction prompt, run probes for required facts after compaction, and evaluate on real long-horizon failures. Never treat a fluent summary as proof that critical evidence survived.</p>

</details>

## Explore (remaining exploration time)

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
