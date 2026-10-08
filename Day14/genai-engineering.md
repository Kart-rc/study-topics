# Break the tool on purpose: fault-inject agent results

GenAI engineering · Day14 · 15 minutes

Test whether an agent harness stops safely when a tool times out, reports an error, or returns the wrong shape.

## Recall (2 minutes)

<p><a href="../Day5/genai-engineering.html">Day5: Context compaction: preserve decisions, discard exhaust</a></p><p>Which item is usually safest to evict from long-running working context?</p><details><summary>Recall first, then reveal the refresher</summary><p>Repeated raw tool output that can be re-fetched. Re-fetchable exhaust is lower-value than the state needed to continue correctly.</p></details><p><a href="../Day9/genai-engineering.html">Day9: Eval leakage: keep a set the prompt never studied</a></p><p>Why can a dev-set score rise without deployment quality improving?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness may have memorized visible cases through targeted prompt and tool changes. Repeatedly fixing known cases optimizes the test surface as well as the underlying behavior.</p></details>

## Understand (4 minutes)

A cashier does not treat every paper from the card terminal as “payment approved.” The paper might say declined, be blank, or never arrive.

An agent harness needs the same discipline for tools. Before giving a result to the model, check four things: the call finished before its deadline, the protocol completed, isError is false, and structured data matches the declared schema.

Visual question: At which gate does the injected result stop?



The shipping tool should return {shipment_id, eta_days}.

A valid result reaches the model: S7 arrives in 2 days.An isError: true result becomes a tool failure the model may handle.A missing eta_days field fails schema validation.A timeout ends at the harness deadline; it is not an empty success.result = call_with_timeout(tool, 2.0)
if result.is_error: raise ToolFailure(...)
validate(result.structured_content, schema)

The test should assert the final outcome and the tool trace: no shipment promise was sent after a failed contract.



## Read the visual

At which gate does the injected result stop? A result travels downward only through checks it passes. The highlighted exit names the first failure; later checks cannot turn that failure into a success.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
result = {'done': True, 'isError': False, 'structuredContent': {'shipment_id': 'S7', 'eta_days': 2}}
deadline_ok = result['done']
execution_ok = not result['isError']
data = result['structuredContent']
schema_ok = isinstance(data.get('shipment_id'), str) and isinstance(data.get('eta_days'), int)
decision = 'use result' if deadline_ok and execution_ok and schema_ok else 'safe failure'
```

1. Start with one concrete tool result.

   Changed values: `{"result": {"done": true, "isError": false, "structuredContent": {"shipment_id": "S7", "eta_days": 2}}}`

2. Separate transport completion from the tool’s own success signal.

   Changed values: `{"deadline_ok": true, "execution_ok": true}`

3. Validate the fields before the agent can use them.

   Changed values: `{"data": {"shipment_id": "S7", "eta_days": 2}, "schema_ok": true}`

4. Only the fully validated result crosses the harness gate.

   Changed values: `{"decision": "use result"}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executes dictionary and type checks in Python. It does not call an MCP server, enforce wall-clock cancellation, or judge whether a valid-looking ETA is true.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Build a fault matrix for each high-impact tool: timeout, protocol error, execution error, malformed structured content, semantically impossible value, duplicated success, and success after cancellation. Assert both the user outcome and the absence of forbidden side effects.</p>

</details>

## Explore (remaining exploration time)

Choose a tool behavior. Predict whether the harness passes data to the model, asks for recovery, or stops at the deadline.

Open genai-engineering.html for the executable model.

Model limits: This lab models result handling, not transport, cancellation, retries, side-effect idempotence, authentication, or prompt-injection defenses. A schema proves shape, not that the ETA is truthful.

## Quiz (4 minutes)

1. The tool returns isError=true with readable text. What should the harness call it?
   - A successful answer because content exists
   - A tool execution failure
   - A schema version

2. Why inject a missing eta_days field in tests?
   - To prove the harness rejects a shape that violates the contract
   - To make the model more creative
   - To test DNS independence

3. What can output-schema validation not prove?
   - That eta_days is present and an integer
   - That the claimed ETA is factually correct
   - That shipment_id is a string

4. Describe the safe user-visible result when the shipping tool times out.
5. If retrying the tool can buy a second label, what extra control is required?

<details><summary>Answer key — attempt first</summary>

1. A tool execution failure. MCP uses isError=true for actionable tool execution errors even when explanatory content is present.

2. To prove the harness rejects a shape that violates the contract. The harness should detect malformed structured content before the model relies on it.

3. That the claimed ETA is factually correct. Schema validation checks representation. Semantic truth needs other evidence and controls.

</details>

## Sources

- [Model Context Protocol draft: Tools, structured content and error handling](https://modelcontextprotocol.io/specification/draft/server/tools) — Current draft checked 2026-10-04; not a finalized protocol version; checked 2026-10-04.
- [Model Context Protocol 2025-06-18: Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) — Stable specification dated 2025-06-18; foundation for isError and structuredContent; checked 2026-10-04.
