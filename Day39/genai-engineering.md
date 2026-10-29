# Two agent turns need one owner of session history

GenAI engineering · Day39 · 15 minutes

Coordinate concurrent writers so each agent turn sees the history that its final ordering claims it saw.

## Recall (2 minutes)

<p><a href="../Day23/genai-engineering.html">Day23: Return “input required,” then retry the same tool call</a></p><p>What does the client retry after fulfilling input?</p><details><summary>Recall first, then reveal the refresher</summary><p>The original request with inputResponses and requestState. MRTR continues one logical operation by retrying the original request.</p></details><p><a href="../Day27/genai-engineering.html">Day27: Replay the observation—not the side effect</a></p><p>What should replay do with a refund tool?</p><details><summary>Recall first, then reveal the refresher</summary><p>Stub/block it and record the proposed call. Offline evaluation should not repeat a side effect.</p></details>

## Understand (4 minutes)

A shared notebook can contain both Alice's and Bob's notes while still telling the wrong story if both wrote answers from the same earlier page.

An agent session stores conversation history. The OpenAI Agents SDK serializes reads and mutations through one OpenAI Conversations session instance. Separate instances or external writers still need application-level coordination. Serialize whole turns per session ID when order matters.



Turns A and B both read history version 8. A answers and appends version 9. B then appends an answer generated without A, even though the final ledger places B after A. With a per-session queue, B reads version 10 and its answer matches the visible order.



## Read the visual

The ledger separates final append order from the version each turn actually read. The serialization switch changes B's input version, which is the mechanism a generic two-agent diagram would hide.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Coordinate by session ID when web requests, workers, retries, or channels can start overlapping turns for the same conversation.

**Practical example.** A user submits a chat message from the web while a webhook starts another run against the same support session.

**How to decide.** Allow parallel runs for independent session IDs. For one ordered conversation, use one queue/lock and an idempotent request ID; do not rely on one storage method's internal lock to serialize an entire model-tool turn.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
history_version = 8; a_read = history_version; b_read = history_version
history_version += 1; a_written = history_version
history_version += 1; b_written = history_version
mismatch = b_read != a_written; fix = 'queue whole turns by session_id'
```

1. Two uncoordinated turns read the same prior history.

   Changed values: `{"history_version": 8, "a_read": 8, "b_read": 8}`

2. A appends first and creates version 9.

   Changed values: `{"history_version": 9, "a_written": 9}`

3. B appends second, but its answer was based on version 8.

   Changed values: `{"history_version": 10, "b_written": 10}`

4. The final order claims B followed A; the read version proves otherwise.

   Changed values: `{"mismatch": true, "fix": "queue whole turns by session_id"}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser models ordered history versions, not the Agents SDK, a model, network retries, Redis/SQLite transactions, RunState recovery, idempotency, or distributed locks. The Python replay is synthetic and local.

## Explore (remaining exploration time)

Toggle serialized turns. Watch the version each turn reads and compare it with the final ledger order.

Open genai-engineering.html for the executable model.

Model limits: The browser models ordered history versions, not the Agents SDK, a model, network retries, Redis/SQLite transactions, RunState recovery, idempotency, or distributed locks. The Python replay is synthetic and local.

## Quiz (4 minutes)

1. A and B both read version 8, then the ledger stores A before B. What is wrong?
   - B's answer appears after A but was generated without A's turn
   - The session ID is too short
   - Both answers must be deleted

2. What does one session instance's internal serialization not necessarily cover?
   - The entire model-and-tool turn across separate instances or external writers
   - Its own add_items call
   - Its own close call

3. When can turns safely run in parallel?
   - They belong to independent sessions or ordering is explicitly irrelevant
   - They share one ordered support chat
   - They mutate the same tool budget

4. Which endpoints or workers can start concurrent turns for the same session ID?
5. Where should request idempotency and per-session ordering live in your harness?

<details><summary>Answer key — attempt first</summary>

1. B's answer appears after A but was generated without A's turn. Stored order and observed context disagree.

2. The entire model-and-tool turn across separate instances or external writers. Application coordination owns cross-instance, whole-turn ordering.

3. They belong to independent sessions or ordering is explicitly irrelevant. Parallelism is safest across independent state boundaries.

</details>

## Sources

- [OpenAI Agents SDK: Sessions](https://openai.github.io/openai-agents-python/sessions/) — Living official documentation; checked October 29, 2026; checked 2026-10-29.
- [OpenAI Agents SDK: memory reference](https://openai.github.io/openai-agents-python/ref/memory/) — Official reference: same-instance operations serialized; separate writers need coordination; checked October 29, 2026; checked 2026-10-29.
