# A bare list is valid in modern MCP—but an object envelope crosses older clients

GenAI engineering · Day54 · 15 minutes

Negotiate structured-output shape by protocol revision instead of assuming every MCP client accepts the newest JSON roots.

## Recall (2 minutes)

<p><a href="../Day36/genai-engineering.html">Day36: Blocking input guardrails prevent side effects; parallel ones may be late</a></p><p>Tool starts at 90 ms; parallel guardrail trips at 120 ms. What is true?</p><details><summary>Recall first, then reveal the refresher</summary><p>The tool may already have started. Parallel mode trades a pre-start guarantee for latency.</p></details><p><a href="../Day8/genai-engineering.html">Day8: MCP tool annotations: risk vocabulary, not a security boundary</a></p><p>An unknown MCP server marks a tool readOnlyHint=true. What may a secure client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The hint is untrusted; enforce permissions and use the cautious path. The specification requires clients to treat annotations from untrusted servers as untrusted.</p></details>

## Understand (4 minutes)

A new mail slot accepts envelopes, boxes, and tubes. An older slot accepts only envelopes. The same contents may need different wrapping.

MCP revision 2026-07-28 allows an outputSchema and structuredContent rooted at any JSON value. Earlier supported revisions expected structured content to be an object. A harness serving both can keep an object envelope such as {"alerts":[...]}, or negotiate and adapt the wire shape deliberately.



Tool list_alerts naturally returns ["a54","a55"]. A modern client accepts the array against an array output schema. A legacy path rejects that structured root. Wrapping it as {"alerts":["a54","a55"]} keeps one interoperable contract, at the cost of an envelope.



## Read the visual

A revision gate sits before the root shape, showing exactly when a bare list passes and why an object envelope works across both eras.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a compatibility adapter when one MCP server or gateway serves clients that negotiate different protocol revisions.

**Practical example.** An enterprise host upgrades to the 2026-07-28 SDK while a desktop integration still speaks a 2025-era revision.

**How to decide.** Prefer one object envelope when cross-version simplicity matters. If bare scalar/list roots materially improve the contract, negotiate per request, validate against the matching schema, and test both eras. Do not infer protocol support from SDK version alone.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
alerts=['a54','a55']; negotiated='2025-11-25'
bare_allowed=negotiated>='2026-07-28'
wire=alerts if bare_allowed else {'alerts':alerts}
result={'negotiated':negotiated,'wire':wire,'accepted':isinstance(wire,dict)}
```

1. Create a natural list result for a legacy request.

   Changed values: `{"alerts": ["a54", "a55"], "negotiated": "2025-11-25"}`

2. Apply the toy revision boundary.

   Changed values: `{"bare_allowed": false}`

3. Adapt the root to an object envelope for the legacy path.

   Changed values: `{"wire": {"alerts": ["a54", "a55"]}}`

4. Record the actual shape rather than hiding compatibility behavior.

   Changed values: `{"result": {"negotiated": "2025-11-25", "wire": {"alerts": ["a54", "a55"]}, "accepted": true}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model is a revision/shape decision table. It does not open an MCP transport, run discovery, negotiate headers, validate full JSON Schema, model SDK auto-wrapping, deliver text content, or prove compatibility with a specific host.

## Explore (remaining exploration time)

Change protocol revision and result shape. Predict whether the structured result is accepted and what the model sees.

Open genai-engineering.html for the executable model.

Model limits: The model is a revision/shape decision table. It does not open an MCP transport, run discovery, negotiate headers, validate full JSON Schema, model SDK auto-wrapping, deliver text content, or prove compatibility with a specific host.

## Quiz (4 minutes)

1. A 2025-11-25 client receives bare array structuredContent. What is the safe assumption?
   - The legacy path may reject it; use an object envelope or adapter
   - Every client accepts any JSON root
   - Drop output validation

2. Why keep {alerts:[...]} across both revisions?
   - It is an object-shaped compatibility contract
   - Objects cannot be validated
   - It encrypts alert IDs

3. When may a bare list be reasonable?
   - When the request negotiated 2026-07-28, the schema declares an array, and both paths are tested
   - When the server hopes the client is modern
   - When no output schema exists but strict typing is claimed

4. Which clients in your harness negotiate older MCP revisions, and how is that evidence captured?
5. Would one object envelope or a per-revision adapter create the smaller long-term compatibility surface?

<details><summary>Answer key — attempt first</summary>

1. The legacy path may reject it; use an object envelope or adapter. Non-object structured roots are a modern-revision capability, not a timeless guarantee.

2. It is an object-shaped compatibility contract. One envelope avoids per-era root changes when the extra wrapper is acceptable.

3. When the request negotiated 2026-07-28, the schema declares an array, and both paths are tested. Protocol evidence, matching schema, and compatibility tests make the choice deliberate.

</details>

## Sources

- [MCP 2026-07-28 specification release](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Official MCP blog; published July 28, 2026; checked November 14, 2026; checked 2026-11-14.
- [MCP 2026-07-28 release candidate: structured output changes](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) — Official MCP blog; published July 28, 2026; checked November 14, 2026; checked 2026-11-14.
- [MCP TypeScript SDK v2 migration: 2026-07-28 support](https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28) — Official MCP TypeScript SDK documentation; checked November 14, 2026; checked 2026-11-14.
