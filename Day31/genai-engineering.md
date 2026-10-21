# Keep the span, drop the prompt

GenAI engineering · Day31 · 15 minutes

Preserve trace topology and timing while excluding sensitive model inputs and outputs.

## Recall (2 minutes)

<p><a href="../Day19/genai-engineering.html">Day19: Same agent, different sandbox: resource budgets are part of the eval</a></p><p>A correct strategy is OOM-killed before grading. How should the trial be labeled?</p><details><summary>Recall first, then reveal the refresher</summary><p>Infrastructure failure; capability not observed. The sandbox prevented an observable solution. Count and report it separately from a graded wrong answer.</p></details><p><a href="../Day23/genai-engineering.html">Day23: Return “input required,” then retry the same tool call</a></p><p>What does the client retry after fulfilling input?</p><details><summary>Recall first, then reveal the refresher</summary><p>The original request with inputResponses and requestState. MRTR continues one logical operation by retrying the original request.</p></details>

## Understand (4 minutes)

A parcel tracker can show that a package visited three hubs, how long each step took, and where it failed without printing the letter inside the package. Agent traces can do the same.

The OpenAI Agents SDK creates traces and spans for runs, model generations, tools, handoffs, and guardrails. Sensitive payload capture is a separate choice. Setting trace_include_sensitive_data=False keeps the trace structure while excluding potentially sensitive model and tool inputs and outputs.



A support agent calls lookup_order, then a model generates a reply. The trace still shows the parent run, the tool span, the model span, durations, and an error. The customer email and full order record are redacted. Operators can diagnose where time went without copying payloads into the tracing backend.



## Read the visual

The same three-span tree is shown twice conceptually: payloads change from visible to excluded, while the shape and timings stay fixed. That makes the privacy trade-off inspectable.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use payload exclusion when trace topology, latency, and failure type are valuable but prompts, tool arguments, or model outputs may contain customer or regulated data.

**Practical example.** A production support agent handles order and payment records while SREs need span timing and failure location.

**How to decide.** Start from data minimization. Disable sensitive capture or add a custom redacting processor before export. If policy forbids tracing entirely, do not treat redaction as permission to trace.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
trace = {'run_ms': 820, 'tool_ms': 120, 'model_ms': 650, 'prompt': 'customer email'}
sensitive_fields = {'prompt'}
exported = {k: v for k, v in trace.items() if k not in sensitive_fields}
topology_kept = all(k in exported for k in ['run_ms', 'tool_ms', 'model_ms'])
```

1. Start with a synthetic trace that mixes operational and payload fields.

   Changed values: `{"trace": {"run_ms": 820, "tool_ms": 120, "model_ms": 650, "prompt": "customer email"}}`

2. Classify the field that must not leave the process.

   Changed values: `{}`

3. Remove sensitive data before export.

   Changed values: `{"exported": {"run_ms": 820, "tool_ms": 120, "model_ms": 650}}`

4. Keep the values needed to diagnose timing.

   Changed values: `{"topology_kept": true}`

[Full runnable example](examples/genai-engineering.py).

Limits: This browser renders a synthetic trace and does not run the Agents SDK, export telemetry, prove redaction completeness, classify secrets, model custom processors, or satisfy zero-data-retention policy.

## Explore (remaining exploration time)

Switch payload capture off. Watch the trace tree and timings remain while sensitive values disappear.

Open genai-engineering.html for the executable model.

Model limits: This browser renders a synthetic trace and does not run the Agents SDK, export telemetry, prove redaction completeness, classify secrets, model custom processors, or satisfy zero-data-retention policy.

## Quiz (4 minutes)

1. What remains useful when sensitive trace data is excluded?
   - Span relationships, durations, and status
   - Full prompt text
   - Raw customer records

2. Where should custom redaction happen?
   - Before export to the tracing backend
   - After every analyst downloads the trace
   - Only in the UI

3. What is the boundary of payload exclusion?
   - It is not permission to trace where policy forbids tracing
   - It guarantees every custom processor is safe
   - It makes authorization unnecessary

4. Which trace fields are necessary for your incident questions, and which are merely convenient?
5. How would you test that a custom tool payload is redacted before a third-party exporter receives it?

<details><summary>Answer key — attempt first</summary>

1. Span relationships, durations, and status. Operational shape can remain even when payload content is withheld.

2. Before export to the tracing backend. Sensitive material should be removed before it crosses the export boundary.

3. It is not permission to trace where policy forbids tracing. Governance and trace availability still apply.

</details>

## Sources

- [OpenAI Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/) — Living documentation; checked 2026-10-21.
- [Agents SDK RunConfig reference](https://openai.github.io/openai-agents-python/ref/run/) — Living documentation; checked 2026-10-21.
