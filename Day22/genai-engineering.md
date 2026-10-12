# A valid tool call can still return the wrong shape

GenAI engineering · Day22 · 15 minutes

Validate MCP structured output against the declared output schema before a model reasons over it.

## Recall (2 minutes)

<p><a href="../Day19/genai-engineering.html">Day19: Same agent, different sandbox: resource budgets are part of the eval</a></p><p>A correct strategy is OOM-killed before grading. How should the trial be labeled?</p><details><summary>Recall first, then reveal the refresher</summary><p>Infrastructure failure; capability not observed. The sandbox prevented an observable solution. Count and report it separately from a graded wrong answer.</p></details><p><a href="../Day7/genai-engineering.html">Day7: Agent termination: done, stalled, or out of budget</a></p><p>The API returns stop_reason=tool_use. What should the harness infer?</p><details><summary>Recall first, then reveal the refresher</summary><p>A tool call must be executed and its result returned. A response-level stop reason drives the next protocol step; it is not a task verdict.</p></details>

## Understand (4 minutes)

A vending machine can accept a valid button press and still dispense the wrong product. Validating tool input is only half the boundary.

An MCP tool may declare an outputSchema. The server must return matching structured content; the client should validate it before passing the result to an LLM.



get_order promises {order_id, status}. The handler returns {id, state}. Both objects look plausible to a person, but the contract failed. Treat the result as an error, keep the raw evidence for debugging, and do not invite the model to guess field meanings.



## Read the visual

The declared and returned key cards sit side by side; the third card shows the harness decision, separating RPC success from contract success.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use result validation for tools whose output feeds model decisions, workflow branching, side effects, or audit records.

**Practical example.** An order-support agent calls a tool before deciding whether a refund is allowed.

**How to decide.** Reject schema mismatches at the harness boundary. Add semantic checks for valid-but-impossible values; JSON Schema does not prove business truth.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
required={"order_id","status"}
result={"id":"o-9","state":"shipped"}
missing=sorted(required-result.keys())
decision="PASS_TO_MODEL" if not missing else "REJECT_RESULT"
```

1. Record the promised keys and the drifted result.

   Changed values: `{"result": {"id": "o-9", "state": "shipped"}}`

2. Compute the missing contract fields.

   Changed values: `{"missing": ["order_id", "status"]}`

3. Gate model-visible output on validation.

   Changed values: `{"decision": "REJECT_RESULT"}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executed local Python set arithmetic. It did not implement JSON Schema, call an MCP server, or send data to a model.

## Explore (remaining exploration time)

Switch between the promised and drifted result. Observe that the tool invocation succeeds but the harness gate changes.

Open genai-engineering.html for the executable model.

Model limits: The browser checks only two required field names. Production validation must implement the full negotiated JSON Schema dialect, size limits, untrusted text handling, logging controls, and server identity.

## Quiz (4 minutes)

1. Tool promises {order_id,status} but returns {id,state}. What should the client do?
   - Let the model infer aliases
   - Reject/mark the result invalid
   - Rename fields silently

2. Who must conform when outputSchema is present?
   - Only the user
   - The server result
   - Only the model

3. What does schema validation not prove?
   - Required fields exist
   - The business value is true and authorized
   - The shape matches

4. Which tool result currently reaches your model without structural validation?
5. What semantic rule must run after schema validation for that tool?

<details><summary>Answer key — attempt first</summary>

1. Reject/mark the result invalid. A schema mismatch is contract evidence, not a prompt for guessing.

2. The server result. The specification makes conformance a server obligation.

3. The business value is true and authorized. Syntax and structure are not semantic truth or authorization.

</details>

## Sources

- [MCP 2026-07-28: tools and output schemas](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) — Specification dated 2026-07-28; checked 2026-10-12.
- [MCP TypeScript SDK: calling tools](https://ts.sdk.modelcontextprotocol.io/v2/clients/calling) — Current v2 client documentation; checked 2026-10-12.
