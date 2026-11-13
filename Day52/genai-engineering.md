# A tool error teaches the model; a protocol error talks to the host

GenAI engineering · Day52 · 15 minutes

Route MCP failures to the audience that can act: model-visible tool results or host-visible JSON-RPC errors.

## Recall (2 minutes)

<p><a href="../Day35/genai-engineering.html">Day35: Choose whether a tool failure becomes context or stops the run</a></p><p>What does the default function-tool error formatter reveal?</p><details><summary>Recall first, then reveal the refresher</summary><p>A fixed generic message, not the exception details. The default is intentionally generic.</p></details><p><a href="../Day7/genai-engineering.html">Day7: Agent termination: done, stalled, or out of budget</a></p><p>The API returns stop_reason=tool_use. What should the harness infer?</p><details><summary>Recall first, then reveal the refresher</summary><p>A tool call must be executed and its result returned. A response-level stop reason drives the next protocol step; it is not a task verdict.</p></details>

## Understand (4 minutes)

If a cashier says “that item is unavailable; choose another,” you can recover. If the card terminal cannot parse the payment message, the store's software—not you—must repair the protocol.

In MCP, a recoverable tool failure is an ordinary tools/call result with isError: true. The model reads its text and can revise the next call. A protocol error is a JSON-RPC error handled by the host application; the model does not see it. Choose by audience, not by how severe the failure feels.



The model calls read-note(id="drafts"), but only welcome exists. Return isError: true with “Known ids: welcome,” so the model can retry. If a host sends malformed parameters to resources/read, return a protocol error such as invalid params so client code handles it.



## Read the visual

A request-type switch routes the same failure toward a model-visible result or a host-visible JSON-RPC error, making the acting audience explicit.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit error channels when building MCP servers or harness adapters that must support model recovery and host diagnostics.

**Practical example.** A data-quality tool cannot find rule set drafts but can tell the model which rule-set handles exist.

**How to decide.** Put actionable domain and transient tool failures in model-visible text with isError. Reserve protocol errors for host-driven resource, prompt, completion, capability, or wire failures. Scrub secrets from both channels.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
known={'welcome':'Read tools.md first.'}; requested='drafts'
note=known.get(requested)
tool_result={'content':'No note drafts. Known ids: welcome','isError':True} if note is None else {'content':note}
result={'wire_has_result':True,'model_sees_error':tool_result.get('isError',False),'can_retry_with':'welcome'}
```

1. Create one known note and a missing model-selected handle.

   Changed values: `{"known": {"welcome": "Read tools.md first."}, "requested": "drafts"}`

2. The tool cannot fulfill the requested domain operation.

   Changed values: `{"note": null}`

3. Return an ordinary model-visible result marked as an error.

   Changed values: `{"tool_result": {"content": "No note drafts. Known ids: welcome", "isError": true}}`

4. The harness can keep the conversation and let the model correct the next call.

   Changed values: `{"result": {"wire_has_result": true, "model_sees_error": true, "can_retry_with": "welcome"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model routes synthetic error objects. It does not start an MCP server, validate JSON-RPC, run the TypeScript SDK, exercise URL elicitation, serialize content blocks, enforce capabilities, redact secrets, retry tools, or prove host UI behavior.

## Explore (remaining exploration time)

Choose the request type and failure. Predict whether the model, host, or neither receives actionable recovery text.

Open genai-engineering.html for the executable model.

Model limits: The model routes synthetic error objects. It does not start an MCP server, validate JSON-RPC, run the TypeScript SDK, exercise URL elicitation, serialize content blocks, enforce capabilities, redact secrets, retry tools, or prove host UI behavior.

## Quiz (4 minutes)

1. read-note cannot find drafts, but welcome exists. What best enables recovery?
   - A tools/call result with isError true and a model-safe hint naming welcome
   - A transport disconnect
   - A success result that hides the miss

2. Why is a resource callback's protocol error different?
   - The host application handles the JSON-RPC error; the model never sees it
   - It always retries automatically
   - It is less serious than a tool error

3. What must an error message avoid?
   - Secrets, internal stack details, or cross-tenant identifiers
   - A concise remediation hint
   - A stable domain code in structured data

4. Which tool failure in your harness currently becomes an opaque protocol exception?
5. What recovery hint can you expose without leaking tenant data or implementation details?

<details><summary>Answer key — attempt first</summary>

1. A tools/call result with isError true and a model-safe hint naming welcome. The model can read an actionable tool error and revise its call.

2. The host application handles the JSON-RPC error; the model never sees it. The request's audience determines the error channel.

3. Secrets, internal stack details, or cross-tenant identifiers. Actionable does not mean exposing sensitive internals.

</details>

## Sources

- [MCP TypeScript SDK: Errors](https://ts.sdk.modelcontextprotocol.io/v2/servers/errors) — Official MCP TypeScript SDK documentation; checked November 12, 2026; checked 2026-11-12.
- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) — Official MCP 2026-07-28 specification; checked November 12, 2026; checked 2026-11-12.
- [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification) — Protocol specification; checked November 12, 2026; checked 2026-11-12.
