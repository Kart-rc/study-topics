# Approval allows a tool call; an idempotency key prevents duplicate effects

GenAI engineering · Day37 · 15 minutes

Carry one stable logical-action key through retries so an approved side effect is applied once at the destination.

## Recall (2 minutes)

<p><a href="../Day22/genai-engineering.html">Day22: A valid tool call can still return the wrong shape</a></p><p>Tool promises {order_id,status} but returns {id,state}. What should the client do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject/mark the result invalid. A schema mismatch is contract evidence, not a prompt for guessing.</p></details><p><a href="../Day26/genai-engineering.html">Day26: Slice the eval before the average hides a dangerous failure</a></p><p>Why can a 95% overall rate still be unsafe?</p><details><summary>Recall first, then reveal the refresher</summary><p>Rare critical cases may all fail. A majority slice can dominate the aggregate.</p></details>

## Understand (4 minutes)

A manager signs one payment form. A courier delivers the same signed form twice after a network retry. The signature authorizes the payment; it does not tell the bank whether this is a duplicate delivery.

Human approval and idempotency solve different problems. Approval answers “may this exact action run?” A stable idempotency key lets the destination atomically recognize repeated delivery of the same logical action.



An agent proposes refund order O-42 for $25. The human approves those exact arguments. The harness sends key refund:O-42:v1. A timeout causes the same request to be retried with the same key and parameters. The refund service returns the stored result instead of issuing a second refund.



## Read the visual

The four independent gates show that approval, argument binding, stable retry identity, and destination deduplication are separate. Turning off only key reuse keeps authorization green while exposing a duplicate-effect risk.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use stable action keys for approved payments, refunds, ticket creation, email sends, infrastructure mutations, and any tool that can be retried after an ambiguous timeout.

**Practical example.** A refund tool times out after the payment processor committed the refund but before the agent received the response.

**How to decide.** Bind approval to exact arguments, derive or persist one logical-action key, reuse both across retries, and let the destination atomically store the first outcome. If the destination has no idempotency contract, treat ambiguous timeouts as reconciliation work, not safe automatic retry.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
seen = []; effects = []
key = 'refund:O-42:v1'; amount = 25
seen.append(key); effects.append({'order': 'O-42', 'amount': amount})
retry_applied = False if key in seen else True; outcome = 'stored result, no second refund'
```

1. Create a tiny destination-side idempotency record.

   Changed values: `{"seen": [], "effects": []}`

2. Bind one stable key to one logical refund.

   Changed values: `{"key": "refund:O-42:v1", "amount": 25}`

3. The first delivery records key and effect together in the teaching model.

   Changed values: `{"seen": ["refund:O-42:v1"], "effects": [{"order": "O-42", "amount": 25}]}`

4. The retry finds the same key and returns the prior outcome.

   Changed values: `{"retry_applied": false, "outcome": "stored result, no second refund"}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser models a set of seen keys. It does not run an agent, authenticate a user, persist approvals, define key-retention windows, prevent malicious key reuse, reconcile partial external effects, or prove a destination implements atomic idempotency.

## Explore (remaining exploration time)

Choose whether the retry reuses the key and whether parameters changed. Watch authorization and duplicate-effect protection fail independently.

Open genai-engineering.html for the executable model.

Model limits: The browser models a set of seen keys. It does not run an agent, authenticate a user, persist approvals, define key-retention windows, prevent malicious key reuse, reconcile partial external effects, or prove a destination implements atomic idempotency.

## Quiz (4 minutes)

1. The approved refund times out after the processor may have committed. Safe retry?
   - Only with the same approved arguments and a destination-enforced stable idempotency key
   - Yes, approval guarantees exactly once
   - Yes, if the agent apologizes

2. Retry changes $25 to $30 but keeps the old key. What now?
   - Reject and seek a new approval/logical action
   - Execute because the key exists
   - Assume parameters do not matter

3. Destination has no idempotency support after an ambiguous timeout. Best boundary?
   - Stop automatic replay and reconcile the external state
   - Generate random keys until one works
   - Repeat the approval text

4. Which agent tools can cross an ambiguous timeout after committing a side effect?
5. Where will the stable key and first result be stored atomically, and how long must that record live?

<details><summary>Answer key — attempt first</summary>

1. Only with the same approved arguments and a destination-enforced stable idempotency key. Approval is permission; the destination key handles duplicate delivery.

2. Reject and seek a new approval/logical action. The key must remain bound to the same logical action and parameters.

3. Stop automatic replay and reconcile the external state. Without atomic destination deduplication, the effect is uncertain.

</details>

## Sources

- [OpenAI Agents SDK: human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) — Living official documentation; checked October 27, 2026; checked 2026-10-27.
- [OpenAI Agents SDK: tools](https://openai.github.io/openai-agents-python/tools/) — Living official documentation; checked October 27, 2026; checked 2026-10-27.
