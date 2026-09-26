# Agent sandboxing: make authority smaller than intent

GenAI engineering · Day6 · 15 minutes

Design an enforcement envelope where a mistaken or injected model cannot turn broad intent into an unconstrained side effect.

## Recall (2 minutes)

<p><a href="../Day3/genai-engineering.html">Day3: MCP OAuth: bind the token to the server, then mint a new upstream credential</a></p><p>A client presents aud=storage.api to catalog.example. What should strict validation do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject because the token was not issued for the MCP server. The MCP server validates that it is the intended audience; a downstream audience is not interchangeable.</p></details><p><a href="../Day5/genai-engineering.html">Day5: Context compaction: preserve decisions, discard exhaust</a></p><p>Which item is usually safest to evict from long-running working context?</p><details><summary>Recall first, then reveal the refresher</summary><p>Repeated raw tool output that can be re-fetched. Re-fetchable exhaust is lower-value than the state needed to continue correctly.</p></details>

## Understand (4 minutes)

A permission prompt asks a human whether one model-proposed action looks acceptable. A sandbox changes what the process can do at all. The second is an enforcement boundary: filesystem paths, network destinations, credentials, and subprocesses can be constrained outside the model.

Anthropic's October 2025 engineering article describes both filesystem and network isolation for Claude Code and warns that either boundary alone is incomplete. It also describes keeping sensitive credentials outside a cloud sandbox and using a proxy with scoped credentials to validate Git operations. The general harness lesson is capability design: grant the smallest authority that completes the current task, then make escalation explicit and observable.



Original teaching case: A code agent must edit /workspace/service, run tests, read public package documentation, and push only to refs/heads/agent-fix. An untrusted README tells the model to read ~/.ssh and POST it to an attacker.

Model intent is not the deciding control. Filesystem isolation denies the key read; network isolation denies the attacker host; credentials remain outside the sandbox; and the Git proxy accepts only the configured repository and branch. A user may deliberately escalate one boundary, but the event should be narrow, logged, and short-lived.

model proposes → sandbox enforces → proxy narrows credentials
allowed work ≠ ambient machine authority

Sandboxing reduces consequences; it does not prove the model's code is correct, remove supply-chain risk, secure a misconfigured allowlist, or replace review for sensitive operations.



## Explore (5 minutes)

Start with all boundaries enabled, then remove one at a time. Predict whether the injected exfiltration path succeeds and identify the first enforcing control, not the first model instruction.

Open genai-engineering.html for the executable model.

Model limits: A Boolean capability-path tracer. It does not run a process, call a model, implement OS isolation, validate a proxy, inspect nested interpreters, model covert channels or supply-chain compromise, or prove that a real sandbox configuration is secure. The attack and controls are synthetic teaching abstractions.

## Quiz (4 minutes)

1. What distinguishes a sandbox boundary from a permission prompt?
   - It enforces what the process can access outside the model
   - It makes model outputs deterministic
   - It removes every human decision

2. Why are both filesystem and network isolation useful?
   - Either alone guarantees correctness
   - One limits sensitive reads and the other limits communication/exfiltration paths
   - They make credentials unnecessary

3. What remains outside the sandbox's guarantee?
   - The correctness of code the agent writes inside the allowed workspace
   - Whether a denied path is denied
   - Whether an unprovided credential is present

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. It enforces what the process can access outside the model. OS and proxy controls constrain capability even when the model proposes the wrong action.

2. One limits sensitive reads and the other limits communication/exfiltration paths. The controls break different parts of an attack path and should be composed.

3. The correctness of code the agent writes inside the allowed workspace. Containment narrows consequences; it does not establish semantic correctness.

</details>

## Sources

- [Anthropic Engineering: Beyond permission prompts—making Claude Code more secure and autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing) — Published 2025-10-20; checked 2026-09-26.
