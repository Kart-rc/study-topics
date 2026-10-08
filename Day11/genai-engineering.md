# Keep the reusable part first: prompt-cache boundaries

GenAI engineering · Day11 · 15 minutes

Build an agent harness that reuses stable prompt work without confusing a cache hit with a correct answer.

## Recall (2 minutes)

<p><a href="../Day3/genai-engineering.html">Day3: MCP OAuth: bind the token to the server, then mint a new upstream credential</a></p><p>A client presents aud=storage.api to catalog.example. What should strict validation do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject because the token was not issued for the MCP server. The MCP server validates that it is the intended audience; a downstream audience is not interchangeable.</p></details><p><a href="../Day7/genai-engineering.html">Day7: Agent termination: done, stalled, or out of budget</a></p><p>The API returns stop_reason=tool_use. What should the harness infer?</p><details><summary>Recall first, then reveal the refresher</summary><p>A tool call must be executed and its result returned. A response-level stop reason drives the next protocol step; it is not a task verdict.</p></details>

## Understand (4 minutes)

Your support agent reads the same long policy for every order question. Only the order ID changes. You want the model service to reuse work on the unchanged beginning of the request, then process the new question.

That reusable beginning is a prefix. An explicit cache boundary marks where it ends. In Claude’s documented scheme, a matching stored prefix can be read again. Content before that boundary must match exactly. Content after it can change.

A common harness mistake is to insert “current time” at the start. The time changes on every call, so the prefix changes too. Another mistake is marking the new user question as the boundary when only the policy should be reused. Put stable content first and the varying request after its boundary.



The walkthrough uses the small stand-in policy:v1. Request one writes that prefix. Request two asks about order 8 instead of order 7 and hits the same prefix. Request three puts a timestamp before the boundary and misses.

Real prompts must meet the provider’s model-specific cache-size rules; this tiny string would not establish a real cache hit. The lab intentionally removes token thresholds and billing so you can see just the matching rule. Changing to policy v2 should miss: stale instructions are not a useful optimization.

In a harness, log the policy version and actual cache-read usage counters. Keep authorization, tool-result validation and outcome evaluation in place. A cache hit says something about reused input processing. It says nothing about whether the generated answer is true or an action is allowed.



## Read the visual

Which changed bytes invalidate reusable input work? Requests are split at the cache boundary. The saved-prefix list is compared with the new prefix, while time and order details after the boundary do not determine a hit. The diagram shows input reuse, never a cached answer.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
cache = {}
prefix = "policy:v1"
suffix = "order:7"
hit = prefix in cache
cache[prefix] = "processed-prefix-placeholder"
suffix = "order:8"
hit = prefix in cache
prefix = "t3|policy:v1"
hit = prefix in cache
```

1. Start with stable instructions before the boundary and a new question after it.

   Changed values: `{"cache": {}, "prefix": "policy:v1", "suffix": "order:7"}`

2. The empty cache misses; store a symbolic record of processed input, not an answer.

   Changed values: `{"cache": {"policy:v1": "processed-prefix-placeholder"}, "hit": false}`

3. The new question changes only the suffix. The prefix still hits.

   Changed values: `{"suffix": "order:8", "hit": true}`

4. Moving the changing time before the boundary produces a different key and misses.

   Changed values: `{"prefix": "t3|policy:v1", "hit": false}`

[Full runnable example](examples/genai-engineering.py).

Limits: Exact-string prefix-membership model. The stored placeholder is not a transformer KV cache. No tokens, model output, TTL or billing are simulated.

## Explore (remaining exploration time)

Send twice with stable policy first. Change the order question, then move a changing timestamp before the cache boundary. Predict which request will reuse the saved prefix.

Open genai-engineering.html for the executable model.

Model limits: An in-memory exact-string cache with one explicit boundary. It omits provider token thresholds, expiry, eviction, model/settings changes, hierarchical lookback and isolation. It neither contacts an LLM nor saves generated answers. Real hits must be confirmed from provider usage fields.

## Quiz (4 minutes)

1. The toy cache holds policy:v1. Only the order question changes after the boundary. What happens?
   - Miss because every character of the full request must match
   - Hit on the prefix; the new suffix still needs processing
   - Return the old order answer

2. Why move a changing timestamp after the stable boundary?
   - It lets the reusable prefix remain identical
   - It makes policy changes invisible forever
   - It grants the agent permission to act

3. The toy reports a hit for a nine-character policy. What follows about a production API?
   - A real hit is guaranteed
   - The answer is correct
   - Nothing definite; check provider constraints and actual usage

4. Explain why the safer choice works in this example.
5. Change one assumption. What would fail, and what evidence would reveal it?

<details><summary>Answer key — attempt first</summary>

1. Hit on the prefix; the new suffix still needs processing. The prefix is unchanged, so it matches. The suffix can vary. Prompt caching does not store the previous generated answer.

2. It lets the reusable prefix remain identical. A timestamp before the boundary changes the prefix. Moving it after preserves reuse without freezing policy updates or granting permissions.

3. Nothing definite; check provider constraints and actual usage. The toy omits minimum token lengths, expiry and settings. A local string match neither proves a provider hit nor validates an answer.

</details>

## Sources

- [Claude Platform Docs: prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — Living official documentation; publication date not shown; checked 2026-10-01.
