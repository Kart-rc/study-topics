# Follow one agent run: parent and child spans

GenAI engineering · Day12 · 15 minutes

Trace an agent, model call, and tool call as one tree so a failure points to the responsible step.

## Recall (2 minutes)

<p><a href="../Day9/genai-engineering.html">Day9: Eval leakage: keep a set the prompt never studied</a></p><p>Why can a dev-set score rise without deployment quality improving?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness may have memorized visible cases through targeted prompt and tool changes. Repeatedly fixing known cases optimizes the test surface as well as the underlying behavior.</p></details><p><a href="../Day4/genai-engineering.html">Day4: Agent durability: separate the brain, the hands, and the session</a></p><p>A decoupled sandbox fails after two durable checkpoint events. What can a replacement recover?</p><details><summary>Recall first, then reveal the refresher</summary><p>The session history and two completed checkpoints. The recovery source is the external session log, not the failed sandbox.</p></details>

## Understand (4 minutes)

An order-support agent says “I could not answer.” A single success/failure log does not tell you whether the model chose a bad tool, the tool timed out, or the final model call ignored the tool result.

A trace is the whole journey of one run. A span is one timed step inside it. Give the agent invocation a parent span. Put model and tool operations underneath as child spans. Then the tree preserves order, duration, and error location.

This is harness engineering: the run is observable without trusting the agent’s own summary. The trace does not prove the answer is correct; it tells you where to investigate and supplies data for evaluation.



The root span is invoke_agent order_support. A child chat span asks the model what to do. A child execute_tool order_lookup records a timeout. The root then ends with an error. Because every child has the same trace ID and the correct parent ID, the UI can reconstruct one tree.

agent = start_span("invoke_agent", trace="t-42")
tool  = start_span("execute_tool", parent=agent.id)
tool.error_type = "timeout"

Record low-cardinality error types and operational metadata. Treat prompts, outputs, tool arguments, and customer IDs as sensitive. The OpenTelemetry GenAI agent conventions are still marked Development, so pin the semantic-convention version and expect change.



## Read the visual

Which operation belongs to this agent run? A parent-child tree links chat and tool operations to their agent span. Removing the parent moves the tool to a separate root; an error label then loses its place in the run hierarchy.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
trace_id = "t-42"
spans = []
spans.append({"id": "s1", "name": "invoke_agent", "parent": None, "status": "ERROR"})
spans.append({"id": "s2", "name": "chat", "parent": "s1", "status": "OK"})
spans.append({"id": "s3", "name": "execute_tool", "parent": "s1", "status": "ERROR", "error.type": "timeout"})
failed_span = next(s["name"] for s in spans if s["status"] == "ERROR" and s["parent"] is not None)
```

1. Start one synthetic trace with no spans.

   Changed values: `{"trace_id": "t-42", "spans": []}`

2. Create the agent root span.

   Changed values: `{"spans": [{"id": "s1", "name": "invoke_agent", "parent": null, "status": "ERROR"}]}`

3. The model call is a child and completed normally.

   Changed values: `{"spans": [{"id": "s1", "name": "invoke_agent", "parent": null, "status": "ERROR"}, {"id": "s2", "name": "chat", "parent": "s1", "status": "OK"}]}`

4. The child tool span localizes the operational failure.

   Changed values: `{"spans": [{"id": "s1", "name": "invoke_agent", "parent": null, "status": "ERROR"}, {"id": "s2", "name": "chat", "parent": "s1", "status": "OK"}, {"id": "s3", "name": "execute_tool", "parent": "s1", "status": "ERROR", "error.type": "timeout"}], "failed_span": "execute_tool"}`

[Full runnable example](examples/genai-engineering.py).

Limits: Builds plain dictionaries. It does not use an OpenTelemetry SDK or export real telemetry.

## Explore (remaining exploration time)

Toggle a tool failure and a missing parent link. Predict whether the trace still shows one useful tree.

Open genai-engineering.html for the executable model.

Model limits: A small trace-tree validator. It does not send telemetry, sample traces, redact real content, measure tokens, or implement an OpenTelemetry SDK. A good trace proves observability structure, not answer correctness, deterministic replay, or privacy compliance.

## Quiz (4 minutes)

1. The tool span has no parent ID. What is the immediate observability problem?
   - The tool becomes faster
   - The run appears as multiple roots instead of one tree
   - The model output becomes correct

2. Where should a tool timeout appear?
   - Only in the agent's natural-language reply
   - On the tool span with a low-cardinality error type
   - As a new conversation ID

3. No real conversation identifier exists. What should instrumentation do?
   - Hash the prompt
   - Reuse the trace ID as conversation ID
   - Leave conversation ID absent

4. Explain how the span tree separates a model decision from a tool failure.
5. Which fields would you redact or omit before tracing a production order-support agent?

<details><summary>Answer key — attempt first</summary>

1. The run appears as multiple roots instead of one tree. Without the link, the trace cannot reliably show that the tool belonged to this agent run.

2. On the tool span with a low-cardinality error type. The responsible span should record the error. A trace is operational evidence, not a narration by the model.

3. Leave conversation ID absent. The current conventions say not to invent a UUID, trace ID, or content hash as a fallback conversation ID.

</details>

## Sources

- [OpenTelemetry: Semantic conventions for GenAI agent and framework spans](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md) — Status: Development; living specification; checked 2026-10-02.
