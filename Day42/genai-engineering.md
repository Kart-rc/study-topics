# Decide whether a tool result needs another model turn

GenAI engineering · Day42 · 15 minutes

Use tool-use behavior to stop on a trusted final tool result or deliberately send evidence back to the model for synthesis.

## Recall (2 minutes)

<p><a href="../Day30/genai-engineering.html">Day30: Show the agent only the tools this run may use</a></p><p>Why hide delete_customer from a read-only run?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reduce authority exposure and selection errors. A smaller catalog narrows what the model can propose.</p></details><p><a href="../Day2/genai-engineering.html">Day2: Grade the outcome, not the victory message</a></p><p>All four fixtures claim success, but only one meets the contract. Claim-only grading produces how many false positives?</p><details><summary>Recall first, then reveal the refresher</summary><p>3. The other three fixtures are incorrectly labeled successful by the weak grader.</p></details>

## Understand (4 minutes)

A cashier can hand you a printed receipt directly. A mechanic's diagnostic report usually needs someone to explain the next step.

The OpenAI Agents SDK defaults to run_llm_again: tools run, then their results return to the model for a final response. stop_on_first_tool treats the first function-tool output as the final result. StopAtTools can stop only for named tools. A custom function can decide from all tool results.



An order-status tool returns a stable customer-ready object. Stopping avoids an extra model turn that might paraphrase the status. A search tool returns evidence fragments; those should go back to the model for synthesis and citations.



## Read the visual

The event rail branches after the function tool: either the runner returns exact tool bytes or the result takes a second model turn.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Choose behavior when function-tool output may already be the exact final contract or still needs reasoning and presentation.

**Practical example.** Return a signed receipt object directly, but synthesize multiple policy-search results into a grounded explanation.

**How to decide.** Stop only when the tool output is safe, complete, typed, and suitable as the final answer. Run the model again when results need combination, explanation, redaction, or uncertainty handling. Hosted tools are processed by the model rather than this FunctionTool control.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
tool_result={'kind':'receipt','status':'shipped','signature':'sig-42'}
behavior='stop_on_first_tool'
final_output=tool_result if behavior=='stop_on_first_tool' else 'model synthesis'
model_turns=1 if behavior=='stop_on_first_tool' else 2
```

1. Create a complete, typed final tool result.

   Changed values: `{"tool_result": {"kind": "receipt", "status": "shipped", "signature": "sig-42"}}`

2. Choose direct finalization for this function tool.

   Changed values: `{"behavior": "stop_on_first_tool"}`

3. The runner returns the tool output without another model turn.

   Changed values: `{"final_output": {"kind": "receipt", "status": "shipped", "signature": "sig-42"}}`

4. Record the control-flow consequence.

   Changed values: `{"model_turns": 1}`

[Full runnable example](examples/genai-engineering.py).

Limits: The local event rail does not run the Agents SDK, a model, tools, schemas, streaming, hosted tools, approvals, guardrails, or errors. The SDK sketch is unexecuted and only covers FunctionTool result routing.

## Explore (remaining exploration time)

Switch between a receipt and evidence tool, then choose direct stop or another model turn. Watch which component owns the final bytes.

Open genai-engineering.html for the executable model.

Model limits: The local event rail does not run the Agents SDK, a model, tools, schemas, streaming, hosted tools, approvals, guardrails, or errors. The SDK sketch is unexecuted and only covers FunctionTool result routing.

## Quiz (4 minutes)

1. A function tool returns the exact signed receipt contract. Which behavior avoids another model rewrite?
   - stop_on_first_tool
   - run_llm_again
   - Remove the tool

2. Why send three search fragments back to the model?
   - They need synthesis into a useful grounded response
   - The tool output is already a receipt
   - Stopping runs more models

3. What is a dangerous stop boundary?
   - A tool returns raw internal data not safe for the user
   - A typed final receipt is validated
   - A named tool has a documented final schema

4. Which existing tool outputs are already safe and complete final contracts?
5. Which tool results require redaction or synthesis before a user may see them?

<details><summary>Answer key — attempt first</summary>

1. stop_on_first_tool. The first tool output becomes the final result.

2. They need synthesis into a useful grounded response. Evidence fragments are intermediate material, not a complete answer.

3. A tool returns raw internal data not safe for the user. Direct stop bypasses any later model-based presentation or redaction step.

</details>

## Sources

- [OpenAI Agents SDK: Agents — tool use behavior](https://openai.github.io/openai-agents-python/agents/#tool-use-behavior) — Official documentation; checked November 1, 2026; checked 2026-11-01.
- [OpenAI Agents SDK: Agent reference](https://openai.github.io/openai-agents-python/ref/agent/) — Official API reference; checked November 1, 2026; checked 2026-11-01.
