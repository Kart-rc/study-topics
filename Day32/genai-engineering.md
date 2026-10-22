# Hand off only the context the next agent needs

GenAI engineering · Day32 · 15 minutes

Filter agent handoff history without pretending it is an authorization boundary.

## Recall (2 minutes)

<p><a href="../Day25/genai-engineering.html">Day25: Compare candidates on the same cases</a></p><p>Why run A and B on the same cases?</p><details><summary>Recall first, then reveal the refresher</summary><p>To remove case-mix difficulty as an explanation. Pairing controls which scenario each candidate sees.</p></details><p><a href="../Day13/genai-engineering.html">Day13: Same logic, new surface: metamorphic tests for an LLM</a></p><p>The identifier is renamed consistently everywhere. What should happen to the entailment label?</p><details><summary>Recall first, then reveal the refresher</summary><p>It should stay the same. A consistent symbol rename preserves the logical structure, so the relation requires the same judgment.</p></details>

## Understand (4 minutes)

A hospital referral should carry the diagnosis and relevant tests, not every hallway conversation. An agent handoff has the same design choice: the next specialist can receive the full conversation, or a filtered version.

In the OpenAI Agents SDK, a handoff input filter transforms HandoffInputData. It can remove tool chatter or summarize prior history. That changes context quality and privacy exposure; it does not grant or revoke tool authority.



A triage agent collects an order number, a customer email, two tool results, and a refund reason. The refund specialist needs the order number and reason. The filter drops tool-call plumbing and redacts the email before the handoff. The specialist's tool permissions are configured separately.



## Read the visual

The handoff visual shows the full parcel and the filtered parcel simultaneously, making the transfer boundary and unchanged authority explicit.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a handoff filter when a specialist needs a narrower, cleaner, or redacted history than the originating agent accumulated.

**Practical example.** A support triage agent delegates a refund decision while keeping payment lookup internals and unrelated conversation out of the specialist context.

**How to decide.** Define the minimum fields needed for the next task, preserve auditability of what was transferred, and test omissions. Use separate tool and authorization controls; context filtering alone is not least privilege.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
history = ['order=42', 'email=ada@example.com', 'tool raw JSON', 'reason=late']
needed_prefixes = ('order=', 'reason=')
transferred = [item for item in history if item.startswith(needed_prefixes)]
transferred_count = len(transferred)
```

1. Start with synthetic accumulated context.

   Changed values: `{"history": ["order=42", "email=ada@example.com", "tool raw JSON", "reason=late"]}`

2. Declare the specialist's minimum required fields.

   Changed values: `{"needed_prefixes": ["order=", "reason="]}`

3. Filter before crossing the handoff boundary.

   Changed values: `{"transferred": ["order=42", "reason=late"]}`

4. Only two task-relevant items remain.

   Changed values: `{"transferred_count": 2}`

[Full runnable example](examples/genai-engineering.py).

Limits: This browser moves synthetic cards. It does not run an agent, summarize with a model, enforce tool permissions, protect server-managed conversations, or prove privacy. Official docs note server-managed conversations do not support handoff input filters through RunConfig.

## Explore (remaining exploration time)

Toggle full and filtered transfer. Inspect exactly which context items cross the handoff boundary.

Open genai-engineering.html for the executable model.

Model limits: This browser moves synthetic cards. It does not run an agent, summarize with a model, enforce tool permissions, protect server-managed conversations, or prove privacy. Official docs note server-managed conversations do not support handoff input filters through RunConfig.

## Quiz (4 minutes)

1. What does a handoff input filter change?
   - The context passed to the next agent
   - The next agent's IAM role
   - The source database

2. Why preserve order ID and reason?
   - They are necessary for the specialist's task
   - Every prior field is required
   - They grant refund authority

3. What must remain separate?
   - Tool authorization and action approval
   - History selection
   - Redaction tests

4. Which exact fields would your specialist agent fail without?
5. How would you audit that a summary did not invent or omit a decision-critical fact?

<details><summary>Answer key — attempt first</summary>

1. The context passed to the next agent. It transforms handoff input data.

2. They are necessary for the specialist's task. Minimum useful context keeps task-critical facts.

3. Tool authorization and action approval. A smaller prompt is not an authorization boundary.

</details>

## Sources

- [OpenAI Agents SDK handoffs](https://openai.github.io/openai-agents-python/handoffs/) — Living documentation; checked 2026-10-22.
- [Agents SDK handoff filters reference](https://openai.github.io/openai-agents-python/ref/extensions/handoff_filters/) — Living documentation; checked 2026-10-22.
- [Agents SDK RunConfig reference](https://openai.github.io/openai-agents-python/ref/run_config/) — Living documentation; checked 2026-10-22.
