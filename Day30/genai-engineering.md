# Show the agent only the tools this run may use

GenAI engineering · Day30 · 15 minutes

Filter the tool catalog by role and run context before the model chooses an action.

## Recall (2 minutes)

<p><a href="../Day24/genai-engineering.html">Day24: A deprecation warning is a migration clock</a></p><p>Should a new MCP server adopt Sampling after the 2026-07-28 deprecation?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; prefer direct provider API. The specification says new implementations should not adopt deprecated features.</p></details><p><a href="../Day12/genai-engineering.html">Day12: Follow one agent run: parent and child spans</a></p><p>The tool span has no parent ID. What is the immediate observability problem?</p><details><summary>Recall first, then reveal the refresher</summary><p>The run appears as multiple roots instead of one tree. Without the link, the trace cannot reliably show that the tool belonged to this agent run.</p></details>

## Understand (4 minutes)

A technician does not carry every master key into every room. The work order determines which keys come out of the cabinet.

An agent tool catalog is also an authority surface. OpenAI Agents SDK tools can be conditionally enabled, and MCP servers can apply static or context-aware filters. Hiding delete_customer from a read-only support run reduces both confusion and opportunity. It does not replace authorization inside the tool.



A support agent has five installed tools. For a read-only ticket, the harness exposes lookup_order and search_docs. For an approved refund case, it may also expose create_refund. The backend still verifies customer, amount, policy, and caller at execution time.



## Read the visual

The rack changes what the model can see before selection. The separate execution rule stays fixed, making defense in depth visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use tool filtering when agents have different roles, environments, tenants, or phases of work and should not see every installed capability.

**Practical example.** A support harness exposes lookup tools during diagnosis and adds a narrowly scoped refund tool only after the workflow reaches an approved refund state.

**How to decide.** Filter before the model call using trusted run context. Keep server-side authorization, argument validation, approval, and audit. If the role logic is unclear, expose the smaller set and fail closed.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
role='reader'
catalog=['lookup_order','search_docs','create_refund','delete_customer']
visible=[t for t in catalog if t in {'lookup_order','search_docs'}]
execution_guard='required even for '+visible[0]
```

1. Trusted run context identifies a read-only support session.

   Changed values: `{"role": "reader"}`

2. The server has more capabilities installed than this run should expose.

   Changed values: `{"catalog": ["lookup_order", "search_docs", "create_refund", "delete_customer"]}`

3. Filter before the model receives the tool list.

   Changed values: `{"visible": ["lookup_order", "search_docs"]}`

4. The handler still verifies authorization when a visible tool runs.

   Changed values: `{"execution_guard": "required even for lookup_order"}`

[Full runnable example](examples/genai-engineering.py).

Limits: This local model has three roles and five tools. It does not call the Agents SDK or MCP, prove security, model prompt injection, handle cached tool lists, or test server-side authorization. A hidden tool is smaller exposure, not a complete access-control system.

## Explore (remaining exploration time)

Change the run role. Watch tools disappear from the model-visible rack while the server-side authorization boundary remains.

Open genai-engineering.html for the executable model.

Model limits: This local model has three roles and five tools. It does not call the Agents SDK or MCP, prove security, model prompt injection, handle cached tool lists, or test server-side authorization. A hidden tool is smaller exposure, not a complete access-control system.

## Quiz (4 minutes)

1. Why hide delete_customer from a read-only run?
   - Reduce authority exposure and selection errors
   - Make backend authorization unnecessary
   - Improve network bandwidth only

2. Where should the filter decision come from?
   - Trusted run context and policy
   - Untrusted tool output
   - The model asking for more power

3. What must remain inside a visible tool?
   - Authorization and argument validation
   - Nothing; visibility is enough
   - Only a friendly description

4. Which agent role in your system currently receives tools it never needs?
5. What trusted state should determine when a high-impact tool becomes visible?

<details><summary>Answer key — attempt first</summary>

1. Reduce authority exposure and selection errors. A smaller catalog narrows what the model can propose.

2. Trusted run context and policy. Authority must not be granted by the content being governed.

3. Authorization and argument validation. Catalog filtering cannot enforce tenant, amount, or resource-level policy by itself.

</details>

## Sources

- [OpenAI Agents SDK tools guide](https://openai.github.io/openai-agents-js/guides/tools/) — Living documentation checked October 20, 2026; checked 2026-10-20.
- [OpenAI Agents SDK MCP tool filtering](https://openai.github.io/openai-agents-js/guides/mcp/#tool-filtering) — Living documentation checked October 20, 2026; checked 2026-10-20.
