# Use an agent as a tool when one manager must keep the conversation

GenAI engineering · Day40 · 15 minutes

Choose manager-style delegation or handoff based on who must own the next turn and the shared conversation state.

## Recall (2 minutes)

<p><a href="../Day29/genai-engineering.html">Day29: Approve this exact tool call—not every future call</a></p><p>A human approved call_A for order 42. Does call_B for order 99 inherit it?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, it is a different call. Call-specific approval covers the inspected pending item.</p></details><p><a href="../Day1/genai-engineering.html">Day1: An agent handoff that survives a reset</a></p><p>Session stops after files are written, before checks. Next step?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.</p></details>

## Understand (4 minutes)

A restaurant host can ask the chef a question and return with the answer, or escort the guest to the chef and leave them together. Both involve a specialist; only one changes who owns the conversation.

With agents as tools, a manager invokes specialists and stays responsible for synthesis and user interaction. With a handoff, the selected specialist becomes the active agent and receives the conversation history. In the OpenAI Agents SDK, a nested tool-agent run does not automatically inherit the parent's conversation state; share an explicit session or continuation strategy only when that is intended.



An incident manager asks a Kafka specialist for lag diagnosis and a Snowflake specialist for warehouse evidence, then returns one combined plan. That is manager style. A support triage agent that transfers a refund conversation to a refund specialist uses a handoff.



## Read the visual

The control owner is the object that moves. Manager style fans out bounded calls and reconverges; handoff moves the next-turn marker to one specialist.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use manager style when one agent must enforce policy, combine several specialist results, or preserve a single user-facing voice. Use a handoff when one specialist should own subsequent turns.

**Practical example.** A platform-incident agent calls Spark and Kafka agents as tools, redacts their outputs, then makes one rollback recommendation.

**How to decide.** Start with one agent and ordinary tools. Add specialists only when instructions or evaluation evidence justify separation. Decide explicitly whether history, application context, approvals, sessions, and tracing cross the boundary.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
request = ['diagnose Kafka lag', 'check warehouse pressure']
tool_results = {'kafka': 'rebalance in progress', 'warehouse': 'queue depth 8'}
manager_output = f"Kafka: {tool_results['kafka']}; Snowflake: {tool_results['warehouse']}"
handoff_owner = 'kafka-specialist'; can_builtin_synthesize_both = False
```

1. The user needs evidence from two specialties.

   Changed values: `{"request": ["diagnose Kafka lag", "check warehouse pressure"]}`

2. Specialists return bounded results to a manager.

   Changed values: `{"tool_results": {"kafka": "rebalance in progress", "warehouse": "queue depth 8"}}`

3. The manager preserves one conversational owner and synthesizes.

   Changed values: `{"manager_output": "Kafka: rebalance in progress; Snowflake: queue depth 8"}`

4. A handoff selects one new active peer; extra orchestration is a separate design.

   Changed values: `{"handoff_owner": "kafka-specialist", "can_builtin_synthesize_both": false}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser model only tracks control ownership and visible messages. It does not run the SDK, a model, tools, sessions, tracing, approvals, retries, token budgets, or security policy. The Python trace is an executed teaching model, not an agent run.

## Explore (remaining exploration time)

Switch between manager and handoff. Add a second specialist request and watch whether one manager can synthesize both or control moves to one peer.

Open genai-engineering.html for the executable model.

Model limits: The browser model only tracks control ownership and visible messages. It does not run the SDK, a model, tools, sessions, tracing, approvals, retries, token budgets, or security policy. The Python trace is an executed teaching model, not an agent run.

## Quiz (4 minutes)

1. Two specialists must contribute to one policy-checked answer. Best default pattern?
   - A manager calls both as tools and synthesizes
   - Handoff to both simultaneously
   - Give every agent the user channel

2. What changes in a handoff?
   - The selected specialist becomes active and receives conversation history
   - Only a Python function runs
   - The previous agent's secrets become public

3. What must not be assumed for an agent used as a tool?
   - Its nested run automatically inherits the parent's session history
   - It can return a result
   - It can have a turn limit

4. Which current agent must remain accountable for final policy and user communication?
5. For each specialist boundary, should session history, application context, approvals, and trace data cross it?

<details><summary>Answer key — attempt first</summary>

1. A manager calls both as tools and synthesizes. The manager retains control and can combine results.

2. The selected specialist becomes active and receives conversation history. Handoffs transfer conversational control.

3. Its nested run automatically inherits the parent's session history. Nested tool-agent state is configured explicitly.

</details>

## Sources

- [OpenAI Agents SDK: Agents and multi-agent patterns](https://openai.github.io/openai-agents-python/agents/) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [OpenAI Agents SDK: Agents as tools](https://openai.github.io/openai-agents-python/tools/#agents-as-tools) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [OpenAI Agents SDK: Handoffs](https://openai.github.io/openai-agents-python/handoffs/) — Official documentation; checked October 30, 2026; checked 2026-10-30.
