# Valid tool input can still be the wrong action

GenAI engineering · Day10 · 15 minutes

Check an AI-generated action against the request and permission before the tool runs.

## Recall (2 minutes)

<p><a href="../Day6/genai-engineering.html">Day6: Agent sandboxing: make authority smaller than intent</a></p><p>What distinguishes a sandbox boundary from a permission prompt?</p><details><summary>Recall first, then reveal the refresher</summary><p>It enforces what the process can access outside the model. OS and proxy controls constrain capability even when the model proposes the wrong action.</p></details><p><a href="../Day8/genai-engineering.html">Day8: MCP tool annotations: risk vocabulary, not a security boundary</a></p><p>An unknown MCP server marks a tool readOnlyHint=true. What may a secure client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The hint is untrusted; enforce permissions and use the cautious path. The specification requires clients to treat annotations from untrusted servers as untrusted.</p></details>

## Understand (4 minutes)

A user asks an assistant to refund $25 on order A100. The refund tool accepts order_id and amount_cents. The assistant sends 25 as the amount. The JSON is valid, but the tool would refund only 25 cents.

A schema checks the shape of input: field names, types, and allowed ranges. It can require an integer greater than zero. That still does not tell it whether 25 cents matches the user's request.

The harness is the code around the model that checks and runs actions. It should compare the proposed action with trusted request details and current permissions before calling the tool.

Proposal: A100, amount_cents = 25↓ Check three different questions

ShapeIs it a positive integer?IntentIs it the requested $25?PermissionMay this user refund A100?Execute only when all three pass.



The trusted request in this toy example is fixed: A100, $25, or 2,500 cents. The authorized account owns A100, which has 5,000 refundable cents.

Proposal A100/25 passes the integer check and account check, but fails the request match. A100/2500 passes all three. B200/2500 has the right amount but the wrong order and no permission.

Use clear parameter names and examples in the tool description: amount_cents: 2500 means $25. Descriptions help the model propose good inputs. Checks still enforce the rules.



## Explore (5 minutes)

Try the four proposals. Read which gate fails and why. Run the safe proposal once. Observe that checking alone changes no balance. Try running it again to see the simple duplicate-action guard.

Open genai-engineering.html for the executable model.

Model limits: The model uses fixed trusted intent and permissions, not natural-language understanding or real authorization. It sends no network requests or money. Production code must validate against trusted identity and current state atomically where needed, manage approval policies, and use persistent idempotency keys for retryable side effects. JSON validity alone does not provide those controls.

## Quiz (4 minutes)

1. A100 / 25 cents passes the schema. Why is it blocked?
   - JSON cannot contain 25
   - The amount does not match the requested $25
   - All refunds are forbidden

2. Why keep checks outside the model?
   - Trusted code must enforce action rules before execution
   - A clear prompt guarantees every action
   - Tool names automatically enforce permissions

3. What is missing from this browser-only duplicate guard?
   - A longer tool description
   - More JSON fields with no checks
   - Persistent protection across crashes and retries

4. Explain to a teammate why amount_cents is better than amount, and why the better name is still insufficient.
5. If permissions change after validation but before execution, where should the final check happen?

<details><summary>Answer key — attempt first</summary>

1. The amount does not match the requested $25. 25 is a valid positive integer, but it means $0.25. The trusted request is 2500 cents; schema validity does not establish intent.

2. Trusted code must enforce action rules before execution. Descriptions guide proposals. The surrounding code checks trusted intent, identity, and state. A prompt or name is not an authorization boundary.

3. Persistent protection across crashes and retries. The toy done flag disappears on reload. A real retryable side effect needs a durable idempotency strategy at the system performing it.

</details>

## Sources

- [Anthropic: Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) — Published 2025-09-11; checked 2026-09-29.
- [JSON Schema: Numeric types](https://json-schema.org/understanding-json-schema/reference/numeric) — Living specification guide; checked 2026-09-29.
