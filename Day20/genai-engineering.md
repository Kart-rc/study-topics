# A tool call is a proposal: validate before the handler

GenAI engineering · Day20 · 15 minutes

Reject malformed agent arguments before any side effect.

## Recall (2 minutes)

<p><a href="../Day5/genai-engineering.html">Day5: Context compaction: preserve decisions, discard exhaust</a></p><p>Which item is usually safest to evict from long-running working context?</p><details><summary>Recall first, then reveal the refresher</summary><p>Repeated raw tool output that can be re-fetched. Re-fetchable exhaust is lower-value than the state needed to continue correctly.</p></details><p><a href="../Day16/genai-engineering.html">Day16: Script the agent’s world: deterministic tool-loop tests</a></p><p>The application skips refund_order. What should the script harness report?</p><details><summary>Recall first, then reveal the refresher</summary><p>FAIL because expected steps remain or appear out of order. Exact scripted steps expose accidental workflow drift.</p></details>

## Understand (4 minutes)

An agent filling a change form is like a person filling a bank form: plausible text is not an approved instruction. The tool boundary must check structure before the handler runs.

MCP tools advertise an inputSchema. Validation can enforce required fields, types, bounds, and unexpected properties. Authorization and producer approval remain separate gates.



A data-quality tool accepts {dataset, rule_type, threshold}. The agent adds approve:true. A permissive schema lets it reach business code; additionalProperties:false rejects it before registration.

“Valid JSON” is not the same as valid tool input.



## Read the visual

The visual separates required-field validation, extra-field validation, and the later authorization boundary.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this for tools that register rules, deploy code, spend money, or change production state.

**Practical example.** Validate a proposed data-quality rule before invoking the existing authenticated API.

**How to decide.** Schema covers shape and bounds. Still enforce identity, dataset entitlement, tier approval, idempotency, audit, and semantic rules in the trusted service.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
schema={"required":["dataset","rule_type","threshold"],"allow_extra":False}
proposal={"dataset":"orders","rule_type":"freshness","threshold":0.95,"approve":True}
missing=[k for k in schema["required"] if k not in proposal]
extra=[k for k in proposal if k not in schema["required"]]
handler_called=not missing and (schema["allow_extra"] or not extra)
```

1. Define closed shape and extra proposal.

   Changed values: `{"schema": {"required": ["dataset", "rule_type", "threshold"], "allow_extra": false}, "proposal": {"dataset": "orders", "rule_type": "freshness", "threshold": 0.95, "approve": true}}`

2. Find violations.

   Changed values: `{"missing": [], "extra": ["approve"]}`

3. Extra field blocks handler.

   Changed values: `{"handler_called": false}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executed a Python shape check, not conforming JSON Schema or MCP.

## Explore (remaining exploration time)

Toggle strictness and proposal shape. Predict handler reachability.

Open genai-engineering.html for the executable model.

Model limits: The browser performs three hand-coded checks, not JSON Schema or MCP. It does not authenticate, authorize, approve, or call an API.

## Quiz (4 minutes)

1. dataset missing. What happens?
   - Guess
   - Validation error before handler
   - Approve

2. additionalProperties:false does what?
   - Authenticates
   - Rejects undeclared fields
   - Encrypts

3. Schema passes. Still needed?
   - Nothing
   - Authorization and domain approval
   - Prettier logs

4. Which bounds belong in your DQ tool schema?
5. Which tier approval stays outside model control?

<details><summary>Answer key — attempt first</summary>

1. Validation error before handler. The effect target is ambiguous.

2. Rejects undeclared fields. It closes the object shape only.

3. Authorization and domain approval. Valid shape can still be unauthorized.

</details>

## Sources

- [MCP TypeScript SDK: schema libraries](https://ts.sdk.modelcontextprotocol.io/v2/advanced/schema-libraries) — Living docs; checked 2026-10-10; checked 2026-10-10.
- [JSON Schema object keywords](https://json-schema.org/understanding-json-schema/reference/object) — Living reference; checked 2026-10-10; checked 2026-10-10.
