# A turn limit stops the loop; it does not make the loop useful

GenAI engineering · Day34 · 15 minutes

Use max_turns as a hard orchestration budget, then detect progress separately.

## Recall (2 minutes)

<p><a href="../Day26/genai-engineering.html">Day26: Slice the eval before the average hides a dangerous failure</a></p><p>Why can a 95% overall rate still be unsafe?</p><details><summary>Recall first, then reveal the refresher</summary><p>Rare critical cases may all fail. A majority slice can dominate the aggregate.</p></details><p><a href="../Day14/genai-engineering.html">Day14: Break the tool on purpose: fault-inject agent results</a></p><p>The tool returns isError=true with readable text. What should the harness call it?</p><details><summary>Recall first, then reveal the refresher</summary><p>A tool execution failure. MCP uses isError=true for actionable tool execution errors even when explanatory content is present.</p></details>

## Understand (4 minutes)

A taxi meter limits how long you can ride. It does not guarantee the driver is getting closer. Agent turn limits work the same way.

In the OpenAI Agents SDK, one turn is one model invocation, including any tool calls it requests. If the run exceeds max_turns, the runner raises MaxTurnsExceeded unless handled. That bounds model-loop iterations; it is not a completion proof or a complete cost and latency limit.



An agent alternates search_logs and “need more evidence” without producing a final output. With max_turns=4, the fourth model call consumes the budget and the run stops instead of looping forever. A useful harness also records that the evidence set did not change across turns 2–4.



## Read the visual

The numbered turns separate two questions: where useful evidence stopped changing and where the harness forces termination.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Set a turn budget on every autonomous or tool-using run where the model can call tools, hand off, or continue reasoning.

**Practical example.** An incident agent may inspect logs, metrics, and one deployment diff, but must escalate after four model turns if no new evidence appears.

**How to decide.** Choose a budget from task complexity, latency, and cost. Add deadline/tool timeouts, cancellation, repeated-action detection, evidence-progress checks, and a useful exception/escalation path. Never interpret 'did not exceed the cap' as success.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
max_turns = 4
evidence_counts = [1, 2, 2, 2]
progress_deltas = [evidence_counts[i] - evidence_counts[i-1] for i in range(1, len(evidence_counts))]
stopped_without_progress = evidence_counts[-1] == evidence_counts[-2]
```

1. Set the maximum model-invocation budget.

   Changed values: `{"max_turns": 4}`

2. Record how much distinct evidence exists after each turn.

   Changed values: `{"evidence_counts": [1, 2, 2, 2]}`

3. Only the second turn adds evidence; later turns repeat.

   Changed values: `{"progress_deltas": [1, 0, 0]}`

4. The cap stops the run, while a separate signal explains why escalation is needed.

   Changed values: `{"stopped_without_progress": true}`

[Full runnable example](examples/genai-engineering.py).

Limits: This is a local turn counter. It does not run the Agents SDK or a model; model invocations may contain multiple tool calls, and external tool latency/cost can dominate. SDK semantics can evolve, so recheck the cited docs.

## Explore (remaining exploration time)

Set the budget and the turn where progress stops. The model marks productive turns, repeated turns, and the hard stop.

Open genai-engineering.html for the executable model.

Model limits: This is a local turn counter. It does not run the Agents SDK or a model; model invocations may contain multiple tool calls, and external tool latency/cost can dominate. SDK semantics can evolve, so recheck the cited docs.

## Quiz (4 minutes)

1. What counts as one SDK turn?
   - One model invocation, including any tool calls it requests
   - One individual HTTP packet
   - The entire application lifetime

2. What happens when max_turns is exceeded by default?
   - MaxTurnsExceeded is raised
   - The SDK claims success
   - All tools are rolled back

3. What remains outside the turn cap?
   - Proof of progress and complete tool latency/cost control
   - The number of model invocations
   - The ability to stop a loop

4. What turn, wall-clock, and tool-call budgets would you set for an incident-analysis agent?
5. How would you define progress so a looping agent cannot satisfy it by restating the same evidence?

<details><summary>Answer key — attempt first</summary>

1. One model invocation, including any tool calls it requests. The runner defines a turn at the model-invocation boundary.

2. MaxTurnsExceeded is raised. The cap terminates the loop through an exception unless handled.

3. Proof of progress and complete tool latency/cost control. A bounded loop can still waste every allowed turn.

</details>

## Sources

- [OpenAI Agents SDK: running agents](https://openai.github.io/openai-agents-python/running_agents/) — Living documentation; checked October 24, 2026; checked 2026-10-24.
- [OpenAI Agents SDK Runner reference](https://openai.github.io/openai-agents-python/ref/run/) — Living documentation; checked October 24, 2026; checked 2026-10-24.
- [OpenAI Agents SDK run.py source](https://github.com/openai/openai-agents-python/blob/main/src/agents/run.py) — Current source checked October 24, 2026; checked 2026-10-24.
