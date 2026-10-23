# The model can use a database handle without ever seeing it

GenAI engineering · Day33 · 15 minutes

Separate local run context from text sent to the model.

## Recall (2 minutes)

<p><a href="../Day20/genai-engineering.html">Day20: A tool call is a proposal: validate before the handler</a></p><p>dataset missing. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Validation error before handler. The effect target is ambiguous.</p></details><p><a href="../Day24/genai-engineering.html">Day24: A deprecation warning is a migration clock</a></p><p>Should a new MCP server adopt Sampling after the 2026-07-28 deprecation?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; prefer direct provider API. The specification says new implementations should not adopt deprecated features.</p></details>

## Understand (4 minutes)

A restaurant waiter can ask the kitchen for order 42 without receiving the kitchen's master key. An agent should work the same way.

In the OpenAI Agents SDK, the run context is a local Python object for dependencies and application data. It is not sent to the LLM. Tool code can receive that context and use a database client while the model sees only the tool schema, arguments, and returned result.



The model asks lookup_order(order_id=42). The tool receives a local context containing db_client and tenant east, queries the database, then returns status=shipped. The model never needs the connection object or password.



## Read the visual

The side-by-side packets answer what stays local and what becomes model-visible; the unsafe toggle shows the exact leak path through tool output.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use local run context for dependency injection, authenticated user IDs, loggers, data clients, helper functions, and other values tool code needs but the model does not.

**Practical example.** A support agent calls an order lookup tool whose local context contains a tenant-scoped database client.

**How to decide.** Keep only tool-relevant dependencies in local context and return the minimum result. Do not mistake 'not in the prompt' for a complete security boundary: tool outputs, logs, traces, exceptions, and serialization can still leak data.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
local_context = {'tenant': 'east', 'db_dsn': 'db.internal'}
tool_arguments = {'order_id': 42}
database_row = {'order_id': 42, 'status': 'shipped'}
model_visible_result = {'status': database_row['status']}
```

1. Keep dependencies and identity in application memory.

   Changed values: `{"local_context": {"tenant": "east", "db_dsn": "db.internal"}}`

2. The model supplies only the declared tool argument.

   Changed values: `{"tool_arguments": {"order_id": 42}}`

3. Local tool code queries through its dependency.

   Changed values: `{"database_row": {"order_id": 42, "status": "shipped"}}`

4. Return the minimum useful result, not the local context.

   Changed values: `{"model_visible_result": {"status": "shipped"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: This browser moves synthetic fields and does not run the Agents SDK, an LLM, authentication, a database, tracing, or serialization. The Python replay is a dependency-injection analogy, not an SDK execution.

## Explore (remaining exploration time)

Toggle an unsafe tool response. Watch which values stay in the local context and which cross into model context.

Open genai-engineering.html for the executable model.

Model limits: This browser moves synthetic fields and does not run the Agents SDK, an LLM, authentication, a database, tracing, or serialization. The Python replay is a dependency-injection analogy, not an SDK execution.

## Quiz (4 minutes)

1. What does the SDK send to the LLM from the local context object automatically?
   - Nothing; local context is not sent to the LLM
   - Every attribute
   - Only passwords

2. Why return only order status from the tool?
   - Tool output enters model-visible context
   - It changes the database role
   - It disables traces

3. What remains a security boundary to design separately?
   - Tool authorization, result filtering, logs and traces
   - Python type hints alone
   - The browser color scheme

4. Which dependencies belong in local context for one of your agents, and which identity fields should be immutable?
5. How would you test that tool results, exceptions, logs, and traces never serialize a credential?

<details><summary>Answer key — attempt first</summary>

1. Nothing; local context is not sent to the LLM. The context object is for local code and dependencies.

2. Tool output enters model-visible context. A local secret can still leak if tool code puts it in the result.

3. Tool authorization, result filtering, logs and traces. Local context placement is useful but not complete access control.

</details>

## Sources

- [OpenAI Agents SDK context management](https://openai.github.io/openai-agents-python/context/) — Living documentation; checked October 23, 2026; checked 2026-10-23.
- [OpenAI Agents SDK RunContextWrapper reference](https://openai.github.io/openai-agents-python/ref/run_context/) — Living documentation; checked 2026-10-23.
