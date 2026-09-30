# Agent durability: separate the brain, the hands, and the session

GenAI engineering · Day4 · 15 minutes

An agent’s sandbox dies halfway through a repair.

## Recall (2 minutes)

<p><a href="../Day1/genai-engineering.html">Day1: An agent handoff that survives a reset</a></p><p>Session stops after files are written, before checks. Next step?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.</p></details><p><a href="../Day3/genai-engineering.html">Day3: MCP OAuth: bind the token to the server, then mint a new upstream credential</a></p><p>A client presents aud=storage.api to catalog.example. What should strict validation do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject because the token was not issued for the MCP server. The MCP server validates that it is the intended audience; a downstream audience is not interchangeable.</p></details>

## Understand (4 minutes)

An agent’s sandbox dies halfway through a repair. If the work log lived only inside that sandbox, the next session cannot tell which repairs finished.

Separate the decision-maker, the execution environment, and the durable session record. The decision-maker is the model plus harness; the sandbox runs tools; the session record preserves evidence. Replacing one should not erase the others.



Two checkpoints are recorded outside the sandbox. The sandbox is then replaced. Recovery reads checkpoint 2 and knows checkpoint 3 is next—but it must reconcile any uncertain external action before repeating it.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
session_log = ["checkpoint 1 complete", "checkpoint 2 complete"]
sandbox = {"temporary_files": 4}
sandbox = None
sandbox = {"temporary_files": 0}
last_verified = session_log[-1]
next_action = "reconcile, then checkpoint 3"
```

1. Completed checkpoints are recorded outside the sandbox.

   Changed values: `{"session_log": ["checkpoint 1 complete", "checkpoint 2 complete"]}`

2. The execution environment has temporary state.

   Changed values: `{"sandbox": {"temporary_files": 4}}`

3. That environment fails.

   Changed values: `{"sandbox": null}`

4. A fresh environment starts empty.

   Changed values: `{"sandbox": {"temporary_files": 0}}`

5. The external session still knows checkpoint 2 completed.

   Changed values: `{"last_verified": "checkpoint 2 complete"}`

6. Recovery checks uncertain work before continuing.

   Changed values: `{"next_action": "reconcile, then checkpoint 3"}`

[Full runnable example](examples/genai-engineering.py).

Limits: The list represents a durable external log; this in-memory Python list is not itself durable. Logging after an external effect can leave uncertainty, so use idempotency or authoritative outcome reconciliation.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A long-running agent has at least three different concerns: the brain and harness decide what to do; the hands execute tools and code; the session records what happened. Coupling all three inside one container makes that container a stateful pet. If it dies, progress, evidence, and execution environment can disappear together.</p><p>Anthropic's April 2026 Managed Agents write-up describes stable interfaces around these parts: an external append-only session log, a replaceable harness, and replaceable sandboxes/tools reached through an <code>execute(name, input) → string</code> boundary. A new harness can wake from the durable session, while a failed sandbox can be reprovisioned.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> An agent repairs 300 lineage definitions in three checkpoints. In a coupled design, checkpoint state lives only in the same container as the harness and repository. A sandbox failure after checkpoint 2 loses the trustworthy record of completed work; restarting risks both repetition and omission.</p><p>In the decoupled model, each completed checkpoint emits an event to a durable session before the next decision. If the sandbox dies, a new hand is provisioned. If the harness dies, a new brain reads the log. Neither recovery guarantees that a repeated external mutation is safe—tool calls still need idempotency keys or outcome reconciliation.</p><pre>emitEvent(session, checkpointCompleted)
execute(sandbox, nextAction)
on failure:
  wake(session)
  provision(resources)
  reconcile last action before retry</pre><p>The same separation creates a security boundary. Anthropic reports keeping credentials outside the generated-code sandbox and using a proxy/vault for MCP calls. The general design principle is structural: the hand receives the capability needed for the action, not a vault it can inspect.</p>

</details>

## Explore (remaining exploration time)

Complete two checkpoints, then fail the sandbox in coupled mode and resume. Reset and repeat in decoupled mode. Also fail the harness. Explain which event must be durable before an irreversible tool call can be retried safely.

Open genai-engineering.html for the executable model.

Model limits: A three-step state machine, not an agent runtime. It models a perfectly durable session and deterministic checkpoints, but omits concurrent agents, event ordering, partial writes, session corruption, context compaction, tool authentication, sandbox provisioning, duplicate external side effects, compensation, and actual latency. Decoupling improves recoverability; it does not create idempotency.

## Quiz (4 minutes)

1. A decoupled sandbox fails after two durable checkpoint events. What can a replacement recover?
   - Nothing
   - The session history and two completed checkpoints
   - The original process memory

2. Why keep the session separate from the model's context window?
   - Durable history can be re-read or transformed even when a context window is compacted
   - It guarantees every event belongs in every prompt
   - It removes the need for a harness

3. The session shows a tool call started but no result event. Is blind retry safe?
   - Always
   - Only if the model is confident
   - No; reconcile the outcome or use an idempotent operation

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. The session history and two completed checkpoints. The recovery source is the external session log, not the failed sandbox.

2. Durable history can be re-read or transformed even when a context window is compacted. Storage and prompt selection are different concerns; durable events need not all occupy the active context.

3. No; reconcile the outcome or use an idempotent operation. A durable log exposes ambiguity but cannot undo an external side effect or prove it did not happen.

</details>

## Sources

- [Anthropic Engineering: Scaling Managed Agents—Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents) — Published 2026-04-08; checked 2026-09-24.
