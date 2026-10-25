# Choose whether a tool failure becomes context or stops the run

GenAI engineering · Day35 · 15 minutes

Use failure_error_function to return an approved model-visible error—or set it to None when the harness must fail fast.

## Recall (2 minutes)

<p><a href="../Day21/genai-engineering.html">Day21: Freeze the tool catalog: schema drift can impersonate model drift</a></p><p>Same prompt/model, different tool hash, lower score. First conclusion?</p><details><summary>Recall first, then reveal the refresher</summary><p>Comparison is confounded. The harness changed with the measured outcome.</p></details><p><a href="../Day25/genai-engineering.html">Day25: Compare candidates on the same cases</a></p><p>Why run A and B on the same cases?</p><details><summary>Recall first, then reveal the refresher</summary><p>To remove case-mix difficulty as an explanation. Pairing controls which scenario each candidate sees.</p></details>

## Understand (4 minutes)

A restaurant waiter can tell the guest “the kitchen is out of salmon; choose again,” or can close the restaurant because the freezer alarm indicates unsafe food. Both are failures, but only one should become a recoverable conversation.

OpenAI Agents SDK function tools can turn a tool exception into a model-visible string. The default is generic and does not expose the exception. A custom handler can return approved details. Passing None propagates the exception instead.



A catalog lookup times out. The tool returns {code: TEMPORARY, retry_after_s: 5}; the agent may retry once or ask the user. A policy-evaluation tool fails closed: its exception propagates and the run stops, because asking the model to improvise would weaken authorization.



## Read the visual

The fork shows failure handling as an information and control decision: safe context returns to the model, while critical uncertainty returns control to the caller.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use model-visible failures for bounded, recoverable outcomes the model can safely act on. Use fail-fast for invariant violations, authorization uncertainty, corrupted state, and failures requiring operator intervention.

**Practical example.** A metadata search timeout is recoverable; inability to verify a production-deploy approval is not.

**How to decide.** Classify errors before exposing them, return only application-approved details, bound retries, and trace the original exception privately. Never place secrets, stack traces, tokens, or internal topology in model-visible text.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
failure = {'kind': 'timeout', 'retryable': True}
policy = 'model_visible' if failure['retryable'] else 'fail_fast'
model_message = {'code': 'TEMPORARY', 'retry_after_s': 5} if policy == 'model_visible' else None
run_continues = model_message is not None
```

1. Classify the tool failure.

   Changed values: `{"failure": {"kind": "timeout", "retryable": true}}`

2. Choose recovery only for the retryable class.

   Changed values: `{"policy": "model_visible"}`

3. Return a small approved envelope, not the raw exception.

   Changed values: `{"model_message": {"code": "TEMPORARY", "retry_after_s": 5}}`

4. The harness either supplies context or stops.

   Changed values: `{"run_continues": true}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser is a policy table, not the Agents SDK. It does not execute tools, retries, callbacks, MCP servers, approvals, tracing, timeouts, cancellation, or nested agents. The Python replay is a local policy example.

## Explore (remaining exploration time)

Select the failure class and policy. The visual shows whether the model receives a safe recovery instruction or the harness terminates.

Open genai-engineering.html for the executable model.

Model limits: The browser is a policy table, not the Agents SDK. It does not execute tools, retries, callbacks, MCP servers, approvals, tracing, timeouts, cancellation, or nested agents. The Python replay is a local policy example.

## Quiz (4 minutes)

1. What does the default function-tool error formatter reveal?
   - A fixed generic message, not the exception details
   - The full stack trace
   - Every environment variable

2. When should failure_error_function be None?
   - When the exception must propagate and stop normal recovery
   - Whenever a timeout occurs
   - To expose secrets

3. What may enter model history or traces?
   - Only application-approved error details
   - Raw credentials
   - Unreviewed stack traces

4. Which of your agent tools may return a recoverable model-visible error, and which must fail closed?
5. What fields belong in a safe error envelope, and what evidence stays only in private traces?

<details><summary>Answer key — attempt first</summary>

1. A fixed generic message, not the exception details. The default is intentionally generic.

2. When the exception must propagate and stop normal recovery. None selects fail-fast propagation.

3. Only application-approved error details. Model-visible errors are part of the harness's information boundary.

</details>

## Sources

- [OpenAI Agents SDK: function-tool error handling](https://openai.github.io/openai-agents-python/tools/#handling-errors-in-function-tools) — Living documentation; checked October 25, 2026; checked 2026-10-25.
- [OpenAI Agents SDK tool reference](https://openai.github.io/openai-agents-python/ref/tool/) — Living API reference; checked October 25, 2026; checked 2026-10-25.
- [OpenAI Agents SDK runner error configuration](https://openai.github.io/openai-agents-python/ref/run/) — Living API reference; checked October 25, 2026; checked 2026-10-25.
