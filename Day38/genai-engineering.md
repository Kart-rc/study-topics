# A child agent gets new input, not an isolated application state

GenAI engineering · Day38 · 15 minutes

Keep structured delegation separate from state isolation when an agent is exposed as a tool.

## Recall (2 minutes)

<p><a href="../Day28/genai-engineering.html">Day28: Do not let one poisoned document become permanent memory</a></p><p>What should happen to an instruction found in an external document?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treat it as untrusted data and quarantine/review it. Retrieved evidence does not gain authority merely by being read.</p></details><p><a href="../Day16/genai-engineering.html">Day16: Script the agent’s world: deterministic tool-loop tests</a></p><p>The application skips refund_order. What should the script harness report?</p><details><summary>Recall first, then reveal the refresher</summary><p>FAIL because expected steps remain or appear out of order. Exact scripted steps expose accidental workflow drift.</p></details>

## Understand (4 minutes)

Giving a contractor a separate work order does not automatically give them a separate bank account.

In the OpenAI Agents SDK, a nested Agent.as_tool() run can receive distinct structured tool_input. But official context guidance says it does not receive an isolated copy of application state by default. Mutable local context can therefore be shared across parent, tools and nested runs.



The parent starts with budget 3. A research child receives only {topic: "orders"}, then decrements context.budget. The parent now sees 2. The structured input was narrow; the mutable application object was shared.



## Read the visual

The diagram separates three things that are often conflated: parent conversation input, child tool_input, and the local application object. The copy switch changes only the mutation path.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use local context for dependencies and request-scoped policy that tools need but the model should not see.

**Practical example.** Share a logger and usage budget across an orchestration run while passing a narrow research request to one child agent.

**How to decide.** Share state intentionally for accounting or coordination. Create a scoped copy, immutable view, or capability-limited facade when a child must not mutate parent-owned state. Do not call nested delegation a sandbox.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
app_context = {'budget': 3, 'tenant': 'acme'}
child_context = app_context; tool_input = {'topic': 'orders'}
child_context['budget'] -= 1
same_object = child_context is app_context; parent_budget = app_context['budget']
```

1. Create one mutable application object.

   Changed values: `{"app_context": {"budget": 3, "tenant": "acme"}}`

2. Give the child narrow input but alias the same local context.

   Changed values: `{"child_context": {"budget": 3, "tenant": "acme"}, "tool_input": {"topic": "orders"}}`

3. The child mutates the shared budget.

   Changed values: `{"app_context": {"budget": 2, "tenant": "acme"}, "child_context": {"budget": 2, "tenant": "acme"}}`

4. The parent observes the mutation.

   Changed values: `{"same_object": true, "parent_budget": 2}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser models Python object aliasing. It does not run the Agents SDK, call a model or tool, provide OS/process isolation, serialize RunState, model approvals, or prove concurrency safety. The recorded Python example is local and synthetic.

## Explore (remaining exploration time)

Toggle shared versus copied context and let the child spend one unit. Watch which parent budget changes.

Open genai-engineering.html for the executable model.

Model limits: The browser models Python object aliasing. It does not run the Agents SDK, call a model or tool, provide OS/process isolation, serialize RunState, model approvals, or prove concurrency safety. The recorded Python example is local and synthetic.

## Quiz (4 minutes)

1. The child receives narrow tool_input. Is parent application state isolated?
   - No; nested runs do not get an isolated copy by default
   - Yes, structured input is a sandbox
   - Only when the tool has a description

2. Why share one context intentionally?
   - To coordinate usage accounting or request-scoped dependencies
   - To expose secrets to the model
   - To guarantee thread safety

3. What boundary is required for an untrusted child?
   - A scoped copy/facade plus the actual process or sandbox isolation the threat model needs
   - A new agent name
   - A longer prompt

4. Which objects in your harness are intentionally shared across nested runs?
5. What must be copied, wrapped, or isolated before an untrusted tool-agent receives control?

<details><summary>Answer key — attempt first</summary>

1. No; nested runs do not get an isolated copy by default. Input schema and object isolation are different controls.

2. To coordinate usage accounting or request-scoped dependencies. Some state should be shared, but by design.

3. A scoped copy/facade plus the actual process or sandbox isolation the threat model needs. Delegation alone is not a security boundary.

</details>

## Sources

- [OpenAI Agents SDK: context management](https://openai.github.io/openai-agents-python/context/) — Living official documentation; checked October 28, 2026; checked 2026-10-28.
- [OpenAI Agents SDK: tools and agents-as-tools](https://openai.github.io/openai-agents-python/tools/) — Living official documentation; checked October 28, 2026; checked 2026-10-28.
