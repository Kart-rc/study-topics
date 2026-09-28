# MCP tool annotations: risk vocabulary, not a security boundary

GenAI engineering · Day8 · 15 minutes

Use tool annotations to improve routing and confirmation UX while keeping authorization, sandboxing, taint tracking, and idempotency enforcement deterministic.

## Recall (2 minutes)

<p><a href="../Day1/genai-engineering.html">Day1: An agent handoff that survives a reset</a></p><p>Session stops after files are written, before checks. Next step?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.</p></details><p><a href="../Day5/genai-engineering.html">Day5: Context compaction: preserve decisions, discard exhaust</a></p><p>Which item is usually safest to evict from long-running working context?</p><details><summary>Recall first, then reveal the refresher</summary><p>Repeated raw tool output that can be re-fetched. Re-fetchable exhaust is lower-value than the state needed to continue correctly.</p></details>

## Understand (4 minutes)

MCP tools may advertise four useful behavioral hints: readOnlyHint, destructiveHint, idempotentHint, and openWorldHint. A harness can use trusted metadata to choose a confirmation flow, decide whether a retry is plausible, or mark returned content as crossing a trust boundary.

The specification's crucial word is hint. Clients must treat annotations as untrusted unless they come from a trusted server. A server can be wrong or malicious; a boolean cannot prevent file deletion or exfiltration. Hard guarantees belong in capabilities, network policy, sandboxing, schema validation, approval gates, idempotency records, and post-call inspection.

Risk is compositional. Private data, attacker-controlled content, and an external communication path are far more dangerous together than any tool in isolation. Therefore the harness should evaluate the whole execution path and current taint state, not merely trust the annotation on the next call.



Worked example: A tool from a trusted internal server declares readOnlyHint: true and openWorldHint: false; the harness may omit a redundant mutation confirmation while still enforcing read scopes. A new third-party server declares the same flags. The correct posture is pessimistic: treat the hints as informational, apply the server's actual permissions, and require the cautious path.

metadata suggests behavior
policy decides permission
runtime constrains effects
evidence verifies outcome

For retries, idempotentHint: true can improve UX only when the server is trusted. A harness that must prevent duplicate payments still needs an application idempotency key or durable call ledger.



## Explore (5 minutes)

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
