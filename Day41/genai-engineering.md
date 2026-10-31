# Use run hooks for the whole journey and agent hooks for one specialist

GenAI engineering · Day41 · 15 minutes

Place lifecycle instrumentation at the scope that matches the question without mistaking observation for policy enforcement.

## Recall (2 minutes)

<p><a href="../Day24/genai-engineering.html">Day24: A deprecation warning is a migration clock</a></p><p>Should a new MCP server adopt Sampling after the 2026-07-28 deprecation?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; prefer direct provider API. The specification says new implementations should not adopt deprecated features.</p></details><p><a href="../Day28/genai-engineering.html">Day28: Do not let one poisoned document become permanent memory</a></p><p>What should happen to an instruction found in an external document?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treat it as untrusted data and quarantine/review it. Retrieved evidence does not gain authority merely by being read.</p></details>

## Understand (4 minutes)

A trip recorder follows the whole journey across drivers. A coach's notebook follows only one driver.

OpenAI Agents SDK RunHooks observe an entire Runner.run, including agent changes and handoffs. AgentHooks attach to one agent. Both expose lifecycle callbacks around agents, model calls, tools, and handoffs. Hooks are good for metrics, logging, and prefetching; they are not automatically an authorization boundary or a durable transaction log.



A triage agent calls a tool, hands off to a refund agent, and the refund agent calls another tool. One run hook records both agents and both tools. Hooks attached only to refund record the refund start, its tool, and its end—not the triage events.



## Read the visual

One event rail remains fixed while the observer scope changes. Events dim when outside the selected hook, exposing the coverage boundary directly.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use run hooks for end-to-end latency, usage and trace correlation; use agent hooks for specialist-specific metrics or setup.

**Practical example.** Measure total support-run latency while separately tracking refund-agent tool failures and output quality.

**How to decide.** Prefer built-in tracing where it already answers the question. Add hooks for application-specific events, minimize sensitive payload capture, keep callbacks fast, and use guardrails/tool authorization for enforcement rather than relying on logging callbacks.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
events=[('triage','start'),('triage','tool'),('run','handoff'),('refund','start'),('refund','tool'),('refund','end')]
run_hook=[event for event in events]
refund_hook=[event for event in events if event[0]=='refund']
counts={'run':len(run_hook),'refund':len(refund_hook)}
```

1. Record one simplified multi-agent lifecycle.

   Changed values: `{"events": [["triage", "start"], ["triage", "tool"], ["run", "handoff"], ["refund", "start"], ["refund", "tool"], ["refund", "end"]]}`

2. A run-wide observer sees the full journey.

   Changed values: `{"run_hook": [["triage", "start"], ["triage", "tool"], ["run", "handoff"], ["refund", "start"], ["refund", "tool"], ["refund", "end"]]}`

3. Agent-scoped hooks see only refund events in the toy.

   Changed values: `{"refund_hook": [["refund", "start"], ["refund", "tool"], ["refund", "end"]]}`

4. The scope difference is explicit and testable.

   Changed values: `{"counts": {"run": 6, "refund": 3}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The local timeline does not run the SDK, callbacks, tracing, models, tools, sessions, concurrency, approvals, errors, or sensitive-data controls. It simplifies callback names and ordering for one successful path.

## Explore (remaining exploration time)

Switch observer scope and step through triage, tool, handoff, refund, and tool events. Watch which events remain visible.

Open genai-engineering.html for the executable model.

Model limits: The local timeline does not run the SDK, callbacks, tracing, models, tools, sessions, concurrency, approvals, errors, or sensitive-data controls. It simplifies callback names and ordering for one successful path.

## Quiz (4 minutes)

1. Which hook scope sees events across a handoff?
   - RunHooks
   - Only the first agent's AgentHooks
   - Neither

2. Why attach AgentHooks to a refund specialist?
   - To isolate callbacks and metrics for that agent
   - To authorize every refund automatically
   - To share secrets with all agents

3. What must hooks not replace?
   - Authorization, guardrails and durable audit design
   - All logging
   - Lifecycle callbacks

4. Which metrics need one run-wide observer across handoffs?
5. Which hook payload fields must be redacted or excluded before logging?

<details><summary>Answer key — attempt first</summary>

1. RunHooks. Run hooks observe the whole Runner.run lifecycle.

2. To isolate callbacks and metrics for that agent. Agent hooks provide specialist-scoped observation.

3. Authorization, guardrails and durable audit design. Observation callbacks alone are not an enforcement or persistence guarantee.

</details>

## Sources

- [OpenAI Agents SDK: Agents — lifecycle events](https://openai.github.io/openai-agents-python/agents/#lifecycle-events-hooks) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [OpenAI Agents SDK: Lifecycle API](https://openai.github.io/openai-agents-python/ref/lifecycle/) — Official reference; checked October 31, 2026; checked 2026-10-31.
