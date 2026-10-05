# MCP tool annotations: risk vocabulary, not a security boundary

GenAI engineering · Day8 · 15 minutes

A tool describes itself as read-only.

## Recall (2 minutes)

<p><a href="../Day1/genai-engineering.html">Day1: An agent handoff that survives a reset</a></p><p>Session stops after files are written, before checks. Next step?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.</p></details><p><a href="../Day5/genai-engineering.html">Day5: Context compaction: preserve decisions, discard exhaust</a></p><p>Which item is usually safest to evict from long-running working context?</p><details><summary>Recall first, then reveal the refresher</summary><p>Repeated raw tool output that can be re-fetched. Re-fetchable exhaust is lower-value than the state needed to continue correctly.</p></details>

## Understand (4 minutes)

A tool describes itself as read-only. Should the harness let it do anything it asks? A description is useful information, but it is not an enforcement mechanism.

MCP annotations are hints about expected tool behavior. Their usefulness depends on whether the server is trusted. Actual capabilities and policy must still restrict effects. A read-only hint cannot stop a file write; a sandbox permission can.



The untrusted tool claims to be read-only but proposes a write. The available capability is read only, so the write is blocked. Changing the hint would not grant a new capability.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
hint_read_only = True; trusted_server = False
capabilities = {"read"}
proposed_action = "write"
allowed = proposed_action in capabilities
hint_is_authority = False
```

1. An untrusted server supplies a reassuring hint.

   Changed values: `{"hint_read_only": true, "trusted_server": false}`

2. The execution environment permits only reading.

   Changed values: `{}`

3. The actual proposal requests a different effect.

   Changed values: `{"proposed_action": "write"}`

4. The enforced capability check denies the write.

   Changed values: `{"allowed": false}`

5. Metadata did not create permission.

   Changed values: `{"hint_is_authority": false}`

[Full runnable example](examples/genai-engineering.py).

Limits: This is a permission-set model, not a complete MCP client. Real policy must evaluate identity, tool scope, arguments, data sensitivity, and external destinations.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>MCP tools may advertise four useful behavioral hints: <code>readOnlyHint</code>, <code>destructiveHint</code>, <code>idempotentHint</code>, and <code>openWorldHint</code>. A harness can use trusted metadata to choose a confirmation flow, decide whether a retry is plausible, or mark returned content as crossing a trust boundary.</p><p>The specification's crucial word is <em>hint</em>. Clients must treat annotations as untrusted unless they come from a trusted server. A server can be wrong or malicious; a boolean cannot prevent file deletion or exfiltration. Hard guarantees belong in capabilities, network policy, sandboxing, schema validation, approval gates, idempotency records, and post-call inspection.</p><p>Risk is compositional. Private data, attacker-controlled content, and an external communication path are far more dangerous together than any tool in isolation. Therefore the harness should evaluate the whole execution path and current taint state, not merely trust the annotation on the next call.</p><h3>Original detailed example</h3><p><strong>Worked example:</strong> A tool from a trusted internal server declares <code>readOnlyHint: true</code> and <code>openWorldHint: false</code>; the harness may omit a redundant mutation confirmation while still enforcing read scopes. A new third-party server declares the same flags. The correct posture is pessimistic: treat the hints as informational, apply the server's actual permissions, and require the cautious path.</p><pre>metadata suggests behavior
policy decides permission
runtime constrains effects
evidence verifies outcome</pre><p>For retries, <code>idempotentHint: true</code> can improve UX only when the server is trusted. A harness that must prevent duplicate payments still needs an application idempotency key or durable call ledger.</p>

</details>

## Explore (remaining exploration time)

Toggle server trust, private context, untrusted input, external communication, destructive and idempotent hints, and an enforced idempotency key. Predict the harness decision and whether an automatic retry is justified.

Open genai-engineering.html for the executable model.

Model limits: An illustrative conservative policy, not the MCP specification's mandated authorization algorithm. Trust establishment, per-tool permissions, human approval, data classification, taint propagation, network egress, result validation, and audit requirements are deployment-specific. The model cannot inspect real server behavior, and a trusted server can still contain bugs.

## Quiz (4 minutes)

1. An unknown MCP server marks a tool readOnlyHint=true. What may a secure client conclude?
   - The tool cannot mutate anything
   - The hint is untrusted; enforce permissions and use the cautious path
   - The tool may bypass sandboxing

2. Why keep annotations if they are not enforcement?
   - They provide shared risk vocabulary for routing, warnings, confirmation UX, and cautious retries
   - They replace authorization checks
   - They cryptographically attest implementation behavior

3. What remains unsafe even with idempotentHint=true from a trusted server?
   - A duplicate-sensitive operation without a real idempotency mechanism or ledger
   - A pure local calculation
   - Displaying the tool title

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. The hint is untrusted; enforce permissions and use the cautious path. The specification requires clients to treat annotations from untrusted servers as untrusted.

2. They provide shared risk vocabulary for routing, warnings, confirmation UX, and cautious retries. Trusted hints can improve client behavior without being confused with hard controls.

3. A duplicate-sensitive operation without a real idempotency mechanism or ledger. A hint cannot guarantee that a payment, message, or mutation will be deduplicated.

</details>

## Sources

- [Model Context Protocol specification: Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) — Specification revision 2026-07-28; checked 2026-09-28.
- [MCP Blog: Tool Annotations as Risk Vocabulary—What Hints Can and Can't Do](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/) — Published 2026-03-16; checked 2026-09-28.
