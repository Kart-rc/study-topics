# Blocking input guardrails prevent side effects; parallel ones may be late

GenAI engineering · Day36 · 15 minutes

Choose guardrail execution mode from the cost of letting the agent start before validation finishes.

## Recall (2 minutes)

<p><a href="../Day27/genai-engineering.html">Day27: Replay the observation—not the side effect</a></p><p>What should replay do with a refund tool?</p><details><summary>Recall first, then reveal the refresher</summary><p>Stub/block it and record the proposed call. Offline evaluation should not repeat a side effect.</p></details><p><a href="../Day15/genai-engineering.html">Day15: The document can inform, not authorize: gate agent actions</a></p><p>The user asked only for a summary. The email says to send a token. What should authorize the send?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; the trusted user request did not allow it. External content may inform the answer but cannot expand the user&#x27;s allowed actions.</p></details>

## Understand (4 minutes)

A venue can check a ticket before opening the gate, or check while the guest walks toward the stage. The second is faster, but a rejected guest may already have crossed a boundary.

OpenAI Agents SDK input guardrails run in parallel by default. A triggered parallel guardrail cancels the run, but the agent may already have spent tokens or called tools. Set run_in_parallel=False when the agent must not start first.



A refund agent receives “refund order O-42.” A fast policy classifier needs 120 ms; the model emits a payment tool call in 90 ms. Parallel validation is too late for the side effect. Blocking validation holds the run until the policy passes.



## Read the visual

The race line answers whether validation completed before the first tool boundary. Blocking mode removes the race instead of merely making the classifier faster.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use blocking input guardrails when rejected input must not consume sensitive tools, money, credentials, or irreversible actions.

**Practical example.** A refund workflow must validate tenant, amount, and policy before the model can call the payment tool.

**How to decide.** Use parallel mode for low-side-effect classification where latency matters. Use blocking mode for cost control or side-effect prevention, and still place tool guardrails at each tool boundary.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
guardrail_ms = 120
tool_start_ms = 90
parallel_side_effect_risk = tool_start_ms < guardrail_ms
blocking_starts_agent = False; decision = 'block first' if parallel_side_effect_risk else 'parallel acceptable'
```

1. The policy check completes at 120 ms.

   Changed values: `{"guardrail_ms": 120}`

2. The model can request the tool earlier.

   Changed values: `{"tool_start_ms": 90}`

3. Parallel execution exposes a race.

   Changed values: `{"parallel_side_effect_risk": true}`

4. Choose the mode from the side-effect boundary.

   Changed values: `{"blocking_starts_agent": false, "decision": "block first"}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser compares two timestamps. It does not execute the SDK, model, classifier, cancellation, approvals, handoffs, MCP, tool guardrails, or payment systems. Timing is nondeterministic in real runs; blocking semantics, not a guessed race margin, provide the guarantee.

## Explore (remaining exploration time)

Change validation and tool-call latency. The race shows whether a parallel guardrail trips before or after the tool starts.

Open genai-engineering.html for the executable model.

Model limits: The browser compares two timestamps. It does not execute the SDK, model, classifier, cancellation, approvals, handoffs, MCP, tool guardrails, or payment systems. Timing is nondeterministic in real runs; blocking semantics, not a guessed race margin, provide the guarantee.

## Quiz (4 minutes)

1. Tool starts at 90 ms; parallel guardrail trips at 120 ms. What is true?
   - The tool may already have started
   - The side effect is impossible
   - Output guardrails ran first

2. When use blocking mode?
   - When rejected input must not start model/tool work
   - Only for output formatting
   - To enable parallel tools

3. Why add tool guardrails too?
   - Agent input guardrails run only at the first-agent boundary, not before every tool call
   - They replace authorization
   - They make every tool reversible

4. Which agent inputs must be rejected before any model or tool work starts?
5. Where should a separate tool guardrail enforce authorization even after input validation passes? 

<details><summary>Answer key — attempt first</summary>

1. The tool may already have started. Parallel mode trades a pre-start guarantee for latency.

2. When rejected input must not start model/tool work. Blocking mode finishes validation first.

3. Agent input guardrails run only at the first-agent boundary, not before every tool call. Validate at the boundary that owns the side effect.

</details>

## Sources

- [OpenAI Agents SDK guardrails](https://openai.github.io/openai-agents-python/guardrails/) — Living official documentation; checked October 26, 2026; checked 2026-10-26.
- [OpenAI Agents SDK guardrail reference](https://openai.github.io/openai-agents-python/ref/guardrail/) — Living official API reference; checked October 26, 2026; checked 2026-10-26.
