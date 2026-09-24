# Agent durability: separate the brain, the hands, and the session

GenAI engineering · Day4 · 15 minutes

Recover a long-running agent after harness or sandbox failure without making either runtime the sole owner of progress or credentials.

## Recall (2 minutes)

<p><a href="../Day1/genai-engineering.html">Day1: An agent handoff that survives a reset</a></p><p>Session stops after files are written, before checks. Next step?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.</p></details><p><a href="../Day3/genai-engineering.html">Day3: MCP OAuth: bind the token to the server, then mint a new upstream credential</a></p><p>A client presents aud=storage.api to catalog.example. What should strict validation do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject because the token was not issued for the MCP server. The MCP server validates that it is the intended audience; a downstream audience is not interchangeable.</p></details>

## Understand (4 minutes)

A long-running agent has at least three different concerns: the brain and harness decide what to do; the hands execute tools and code; the session records what happened. Coupling all three inside one container makes that container a stateful pet. If it dies, progress, evidence, and execution environment can disappear together.

Anthropic's April 2026 Managed Agents write-up describes stable interfaces around these parts: an external append-only session log, a replaceable harness, and replaceable sandboxes/tools reached through an execute(name, input) → string boundary. A new harness can wake from the durable session, while a failed sandbox can be reprovisioned.



Original teaching case: An agent repairs 300 lineage definitions in three checkpoints. In a coupled design, checkpoint state lives only in the same container as the harness and repository. A sandbox failure after checkpoint 2 loses the trustworthy record of completed work; restarting risks both repetition and omission.

In the decoupled model, each completed checkpoint emits an event to a durable session before the next decision. If the sandbox dies, a new hand is provisioned. If the harness dies, a new brain reads the log. Neither recovery guarantees that a repeated external mutation is safe—tool calls still need idempotency keys or outcome reconciliation.

emitEvent(session, checkpointCompleted)
execute(sandbox, nextAction)
on failure:
  wake(session)
  provision(resources)
  reconcile last action before retry

The same separation creates a security boundary. Anthropic reports keeping credentials outside the generated-code sandbox and using a proxy/vault for MCP calls. The general design principle is structural: the hand receives the capability needed for the action, not a vault it can inspect.



## Explore (5 minutes)

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
