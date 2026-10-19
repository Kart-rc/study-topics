# Approve this exact tool call—not every future call

GenAI engineering · Day29 · 15 minutes

Bind human approval to the inspected call and revalidate immediately before execution.

## Recall (2 minutes)

<p><a href="../Day18/genai-engineering.html">Day18: Reset the world between trials: isolate agent evaluations</a></p><p>B does nothing but inherits A’s correct report. What does the naive grader say?</p><details><summary>Recall first, then reveal the refresher</summary><p>Pass. An existence/content-only grader sees the old correct file and passes. It has no provenance information.</p></details><p><a href="../Day22/genai-engineering.html">Day22: A valid tool call can still return the wrong shape</a></p><p>Tool promises {order_id,status} but returns {id,state}. What should the client do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject/mark the result invalid. A schema mismatch is contract evidence, not a prompt for guessing.</p></details>

## Understand (4 minutes)

A manager signs a purchase order for 10 laptops. That signature should not authorize a later order for 100 servers just because both use the “buy” system.

An agent approval should name the tool call the person inspected: tool, parsed arguments, call identity, and relevant policy context. Resume the same paused run state. Before execution, re-run input guardrails because conditions may have changed while the human was deciding.



The agent proposes cancelOrder({orderId:42}). The UI displays order 42 and stores approval for call call_A. A later proposal cancelOrder({orderId:99}) has call call_B. It needs a new decision. A sticky “always approve this tool” choice is broader and should be rare, explicit, and policy-bounded.



## Read the visual

The receipt sits between proposal and side effect. Changing either call identity or arguments breaks the match visibly, so “approved tool” cannot be confused with “approved action.”

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use call-specific approval for tools that spend money, delete data, change access, message people, or otherwise create hard-to-reverse effects.

**Practical example.** A support agent may cancel one customer order after a human reviews the exact order ID and reason.

**How to decide.** Render parsed arguments and impact, approve/reject the pending item on the same run state, then revalidate authorization and policy just before execution. Avoid sticky approval for arguments whose risk varies.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
proposal={'call_id':'call_A','tool':'cancelOrder','args':{'orderId':42}}
approved_call_id='call_A'
later={'call_id':'call_B','tool':'cancelOrder','args':{'orderId':99}}
may_execute=later['call_id']==approved_call_id
```

1. Capture the exact pending action the reviewer sees.

   Changed values: `{"proposal": {"call_id": "call_A", "tool": "cancelOrder", "args": {"orderId": 42}}}`

2. Store a decision for this call, not the tool name globally.

   Changed values: `{"approved_call_id": "call_A"}`

3. A later model turn proposes a different effect.

   Changed values: `{"later": {"call_id": "call_B", "tool": "cancelOrder", "args": {"orderId": 99}}}`

4. The later call fails closed and needs its own review.

   Changed values: `{"may_execute": false}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser uses a simple call-ID and argument fingerprint. It does not run the OpenAI Agents SDK, authenticate the reviewer, protect serialized state, prevent UI spoofing, or solve concurrent state changes. Cryptographic hashing alone does not establish authorization; execution-side checks remain required.

## Explore (remaining exploration time)

Approve call A, then change the proposed order. The receipt stays bound to A and the new call remains blocked.

Open genai-engineering.html for the executable model.

Model limits: The browser uses a simple call-ID and argument fingerprint. It does not run the OpenAI Agents SDK, authenticate the reviewer, protect serialized state, prevent UI spoofing, or solve concurrent state changes. Cryptographic hashing alone does not establish authorization; execution-side checks remain required.

## Quiz (4 minutes)

1. A human approved call_A for order 42. Does call_B for order 99 inherit it?
   - Yes, same tool name
   - No, it is a different call
   - Only if the model asks twice

2. Why run an input guardrail again after approval?
   - Risk or authorization may have changed while paused
   - To hide the arguments
   - To create a new user

3. When is sticky always-approve safest?
   - For every destructive tool
   - Only under explicit narrow policy where later calls have equivalent bounded risk
   - Whenever the user is offline

4. Which tool in your harness has the widest gap between harmless and dangerous arguments?
5. What state must be rechecked immediately before an approved action executes?

<details><summary>Answer key — attempt first</summary>

1. No, it is a different call. Call-specific approval covers the inspected pending item.

2. Risk or authorization may have changed while paused. Execution-time validation closes the stale-decision window.

3. Only under explicit narrow policy where later calls have equivalent bounded risk. A tool name alone rarely captures argument-specific impact.

</details>

## Sources

- [OpenAI Agents SDK human-in-the-loop guide](https://openai.github.io/openai-agents-js/guides/human-in-the-loop/) — Living documentation checked October 19, 2026; checked 2026-10-19.
- [OpenAI Agents SDK guardrails guide](https://openai.github.io/openai-agents-js/guides/guardrails/) — Living documentation checked October 19, 2026; checked 2026-10-19.
- [OpenAI Agents SDK context management](https://openai.github.io/openai-agents-js/guides/context/) — Living documentation checked October 19, 2026; checked 2026-10-19.
