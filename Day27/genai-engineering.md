# Replay the observation—not the side effect

GenAI engineering · Day27 · 15 minutes

Debug and evaluate an agent with recorded tool results while blocking dangerous actions.

## Recall (2 minutes)

<p><a href="../Day10/genai-engineering.html">Day10: Valid tool input can still be the wrong action</a></p><p>A100 / 25 cents passes the schema. Why is it blocked?</p><details><summary>Recall first, then reveal the refresher</summary><p>The amount does not match the requested $25. 25 is a valid positive integer, but it means $0.25. The trusted request is 2500 cents; schema validity does not establish intent.</p></details><p><a href="../Day17/genai-engineering.html">Day17: Agent reliability: one success is not repeatable success</a></p><p>For PPF, PFP, PPP, FFF, how many tasks pass every trial?</p><details><summary>Recall first, then reveal the refresher</summary><p>One. Only PPP meets every-trial success. Three have at least one success.</p></details>

## Understand (4 minutes)

A flight simulator replays conditions without crashing a real airplane. An agent harness should do the same. Record the tool request and observation, then let a candidate agent reason against the recording. Do not rerun a refund, email, deployment, or deletion just to reproduce the trace.



A support agent calls lookup_order(42) and receives {status: delivered, paid: true}. It then proposes refund(42). Offline replay returns the recorded lookup result, but the refund tool is replaced by a blocker that records “would refund” without moving money.



## Read the visual

The observation lane is identical in both modes; only the action boundary changes. That makes the lesson’s key claim visible: replay evidence is useful precisely because the harness does not repeat the consequence.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use recorded replay for regression tests and incident analysis when tool calls are costly, nondeterministic, rate-limited, private, or side-effecting.

**Practical example.** Compare a new support-agent prompt on a production-shaped order trace without issuing a second refund.

**How to decide.** Record enough context to reproduce the decision, redact sensitive values, version the harness, replay read observations, and stub all side effects by default.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
trace={'request':'lookup_order(42)','observation':{'status':'delivered','paid':True}}
mode='replay'
proposed_action='refund(42)'
side_effects_allowed=(mode=='live')
result='executed' if side_effects_allowed else 'blocked-and-recorded'
```

1. Capture the read tool request and its observation.

   Changed values: `{"trace": {"request": "lookup_order(42)", "observation": {"status": "delivered", "paid": true}}}`

2. Run the candidate against the captured condition.

   Changed values: `{"mode": "replay", "proposed_action": "refund(42)"}`

3. Make the dangerous boundary explicit.

   Changed values: `{"side_effects_allowed": false}`

4. Replay records the intent without moving money.

   Changed values: `{"result": "blocked-and-recorded"}`

[Full runnable example](examples/genai-engineering.py).

Limits: This local model is not an OpenAI or OpenTelemetry runtime. Real traces may contain secrets and personal data; apply redaction, access control, retention, consent, sampling, schema/version checks, and freshness rules. A stale recording cannot prove live-system behavior.

## Explore (remaining exploration time)

Switch between live and replay mode. Watch the same observation feed the agent while the side-effect boundary changes.

Open genai-engineering.html for the executable model.

Model limits: This local model is not an OpenAI or OpenTelemetry runtime. Real traces may contain secrets and personal data; apply redaction, access control, retention, consent, sampling, schema/version checks, and freshness rules. A stale recording cannot prove live-system behavior.

## Quiz (4 minutes)

1. What should replay do with a refund tool?
   - Execute it again
   - Stub/block it and record the proposed call
   - Delete the trace

2. What can a recorded observation prove?
   - How the candidate behaves on that captured condition
   - That production is unchanged forever
   - That no redaction is needed

3. What belongs in the harness version?
   - Trace schema, tool stubs, policies, and graders
   - Only the agent name
   - No configuration

4. Which production trace fields must be redacted before they enter an eval dataset?
5. Which tools in your agent require a hard replay stub rather than a sandbox implementation?

<details><summary>Answer key — attempt first</summary>

1. Stub/block it and record the proposed call. Offline evaluation should not repeat a side effect.

2. How the candidate behaves on that captured condition. Replay tests a known condition, not current live state.

3. Trace schema, tool stubs, policies, and graders. Reproducibility depends on the environment around the model.

</details>

## Sources

- [OpenTelemetry GenAI agent spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/) — Development semantic conventions; checked 2026-10-17.
- [OpenAI Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/) — Living SDK documentation; checked 2026-10-17.
- [OpenAI evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices) — Living documentation; checked 2026-10-17.
