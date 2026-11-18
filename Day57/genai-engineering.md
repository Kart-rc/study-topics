# A task can repeat the same input request—deduplicate its key before asking again

GenAI engineering · Day57 · 15 minutes

Resume a durable MCP task without showing the same approval prompt on every poll or notification.

## Recall (2 minutes)

<p><a href="../Day32/genai-engineering.html">Day32: Hand off only the context the next agent needs</a></p><p>What does a handoff input filter change?</p><details><summary>Recall first, then reveal the refresher</summary><p>The context passed to the next agent. It transforms handoff input data.</p></details><p><a href="../Day36/genai-engineering.html">Day36: Blocking input guardrails prevent side effects; parallel ones may be late</a></p><p>Tool starts at 90 ms; parallel guardrail trips at 120 ms. What is true?</p><details><summary>Recall first, then reveal the refresher</summary><p>The tool may already have started. Parallel mode trades a pre-start guarantee for latency.</p></details>

## Understand (4 minutes)

A restaurant pager may buzz several times for the same table. You should walk to the host once, not place the same order again each time it buzzes.

An MCP task in input_required includes an inputRequests map. The server must use a request key that is unique for that task’s lifetime. A client may observe the same task state through repeated tasks/get polls or notifications/tasks. It should remember which request keys it already presented, so one approval is not shown twice. After tasks/update, keep observing the same task until it reaches a terminal state.



Task t57 asks for approval-1. Two polls return the same pending request before the user responds. A naïve harness opens two approval dialogs. A correct harness stores (t57, approval-1) as presented and shows only one.



## Read the visual

Two identical task observations converge on one presented-key memory cell, making duplicate prompt suppression visible without hiding the required user decision.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use request-key deduplication whenever durable tasks can be polled, subscribed to, retried, or resumed across reconnects.

**Practical example.** A lineage-extraction task pauses before publishing inferred column mappings and requests producer approval.

**How to decide.** Scope the dedupe record by authenticated task and request key, preserve it across reconnects for the task lifetime, and clear it according to task expiry. Never auto-approve because a key was seen before; dedupe presentation, not authorization or response validation.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
observations=[('t57','approval-1'),('t57','approval-1')]
presented=set(); dialogs=0

for pair in observations:
    if pair not in presented:
        dialogs+=1; presented.add(pair)
result={'observations':len(observations),'dialogs':dialogs,'updates_expected':1,'presented':sorted(presented)}
```

1. Receive the same outstanding request in two task observations.

   Changed values: `{"observations": [["t57", "approval-1"], ["t57", "approval-1"]]}`

2. Create client-side presented-key memory.

   Changed values: `{"dialogs": 0}`

3. Present only the first unseen task/request pair.

   Changed values: `{"dialogs": 1, "pair": ["t57", "approval-1"]}`

4. Keep one user prompt and one response update.

   Changed values: `{"result": {"observations": 2, "dialogs": 1, "updates_expected": 1, "presented": [["t57", "approval-1"]]}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The local model counts prompt presentation for one task and one key. It does not implement MCP transport, authentication, task storage, subscriptions, reconnects, partial responses, concurrent devices, expiry, elicitation UI, response validation, or exactly-once delivery.

## Explore (remaining exploration time)

Replay the same input_required state twice with and without a presented-key set. Predict the number of dialogs and updates.

Open genai-engineering.html for the executable model.

Model limits: The local model counts prompt presentation for one task and one key. It does not implement MCP transport, authentication, task storage, subscriptions, reconnects, partial responses, concurrent devices, expiry, elicitation UI, response validation, or exactly-once delivery.

## Quiz (4 minutes)

1. Two polls return input key approval-1 for t57. What should the client do?
   - Present it once and remember the task/key pair
   - Show a new dialog for every poll
   - Treat the task as completed

2. Why must the server keep request keys unique within a task?
   - Clients need a stable identity for matching and deduplicating requests/responses
   - Keys authorize the caller
   - Keys replace task IDs

3. What must deduplication never do?
   - Reuse an old approval as authorization for a different task or request
   - Avoid duplicate dialogs
   - Persist through a reconnect

4. Where will your harness persist presented request keys across reconnects?
5. How will you prevent a seen key from being mistaken for a reusable approval?

<details><summary>Answer key — attempt first</summary>

1. Present it once and remember the task/key pair. The same outstanding request may be observed repeatedly.

2. Clients need a stable identity for matching and deduplicating requests/responses. Stable request identity makes multi-round-trip state coherent.

3. Reuse an old approval as authorization for a different task or request. Deduplication is scoped presentation state, not a blanket consent cache.

</details>

## Sources

- [MCP Tasks Extension: Tasks specification](https://tasks.extensions.modelcontextprotocol.io/specification/2026-07-28/tasks) — Official MCP extension specification; checked November 17, 2026; checked 2026-11-17.
- [MCP Tasks Extension overview](https://tasks.extensions.modelcontextprotocol.io/) — Official MCP extension documentation; checked November 17, 2026; checked 2026-11-17.
