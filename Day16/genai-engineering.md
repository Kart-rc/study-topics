# Script the agent’s world: deterministic tool-loop tests

GenAI engineering · Day16 · 15 minutes

Test the orchestration around an agent with fixed model steps, then keep model quality and provider behavior in separate evaluations.

## Recall (2 minutes)

<p><a href="../Day7/genai-engineering.html">Day7: Agent termination: done, stalled, or out of budget</a></p><p>The API returns stop_reason=tool_use. What should the harness infer?</p><details><summary>Recall first, then reveal the refresher</summary><p>A tool call must be executed and its result returned. A response-level stop reason drives the next protocol step; it is not a task verdict.</p></details><p><a href="../Day1/genai-engineering.html">Day1: An agent handoff that survives a reset</a></p><p>Session stops after files are written, before checks. Next step?</p><details><summary>Recall first, then reveal the refresher</summary><p>Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.</p></details>

## Understand (4 minutes)

A travel rehearsal does not wait for a real storm. It injects a known cancellation and checks whether the team follows the playbook.

An agent harness can do the same. Instead of asking a live model what to do, give the runner a fixed script: call lookup_order, then call refund_order, then return the final message.


Visual question: At which script position does observed behavior diverge?



The OpenAI Agents SDK documents in-memory, provider-neutral test utilities such as ScriptedModel. They make no model request and record normalized interactions owned by the SDK.

Our tiny executable queue uses the same testing idea. Each application action must match the next expected step. If a refactor returns after the lookup and silently skips the refund, assert_complete() fails because one tool call and the final response remain unused.



## Read the visual

At which script position does observed behavior diverge? Read the aligned expected and actual rows from top to bottom. Matching operations connect straight across; the first mismatch breaks the script. A later matching final message does not repair the skipped or wrong tool call.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use deterministic tool-loop tests in CI when changing tool names, argument handling, branching, or the runner that coordinates an agent. They are useful when you need a repeatable regression test without a live model call.

**Practical example.** A refund assistant must look up order O42, request its refund, then return a message. After a refactor, it says “Refund started” immediately after lookup. The scripted test fails because the refund step was skipped, even though the final sentence sounds correct.

**How to decide.** Use the test to check orchestration that your code owns. Also run model evaluations for planning quality and integration tests for real payment behavior; a scripted success cannot prove either.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
expected = ['lookup_order', 'refund_order', 'assistant_message']
actual = []
actual.append('lookup_order')
order = {'id': 'O42', 'paid': True}
if order['paid']:
    actual.append('refund_order')
    refund = {'order': 'O42', 'status': 'started'}
actual.append('assistant_message')
assert_complete = actual == expected
```

1. Write the exact orchestration contract before running the application.

   Changed values: `{"expected": ["lookup_order", "refund_order", "assistant_message"], "actual": []}`

2. The first fixed model step asks for the lookup tool.

   Changed values: `{"actual": ["lookup_order"], "order": {"id": "O42", "paid": true}}`

3. The application executes the next expected tool using a synthetic result.

   Changed values: `{"actual": ["lookup_order", "refund_order"], "refund": {"order": "O42", "status": "started"}}`

4. Exact completion proves the whole scripted tool loop was consumed.

   Changed values: `{"actual": ["lookup_order", "refund_order", "assistant_message"], "assert_complete": true}`

[Full runnable example](examples/genai-engineering.py).

Limits: This standard-library queue teaches the documented testing boundary; it is not the OpenAI Agents SDK implementation and makes no model, tool, tracing, or network call.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>The official SDK testing guide says its deterministic utilities run in memory and make no model, sandbox-provider, or Realtime API requests. It also states the boundary explicitly: use real provider adapters or integration environments for behavior owned by an external model, protocol, or sandbox provider. That separation keeps fast harness tests truthful.</p>

</details>

## Explore (remaining exploration time)

Choose a correct flow, a skipped refund, or an unexpected tool. Predict which exact harness assertion fails.

Open genai-engineering.html for the executable model.

Model limits: A scripted model tests deterministic orchestration: tool wiring, handoffs, guardrails, retry paths, and call shape. It does not prove that a live model will choose the right plan, that a provider will serialize requests correctly, or that a real tool is safe. Cover those boundaries with model evaluations, provider-adapter tests, integration tests, and production traces.

## Quiz (4 minutes)

1. The application skips refund_order. What should the script harness report?
   - FAIL because expected steps remain or appear out of order
   - PASS because the final text sounds good
   - Call a live model to decide

2. What does a scripted model test best?
   - Application-owned orchestration and tool-loop behavior
   - The live model’s production judgment
   - Cloud network latency

3. What remains outside this test?
   - Model quality and real provider/tool integration
   - Whether the queue is empty
   - The names of expected calls

4. Which agent failure paths should be scripted before a production release, and why?
5. Why is exact scripted testing dangerous if it is mistaken for a model-quality evaluation?

<details><summary>Answer key — attempt first</summary>

1. FAIL because expected steps remain or appear out of order. Exact scripted steps expose accidental workflow drift.

2. Application-owned orchestration and tool-loop behavior. The official utilities isolate behavior owned by the application and SDK.

3. Model quality and real provider/tool integration. Use separate eval and integration layers for external behavior.

</details>

## Sources

- [OpenAI Agents SDK: Testing](https://openai.github.io/openai-agents-python/testing/) — Living official documentation; deterministic provider-neutral testing utilities; checked 2026-10-06.
- [OpenAI Agents SDK: Tracing](https://openai.github.io/openai-agents-python/tracing/) — Living official documentation; production trace structure and processors; checked 2026-10-06.
