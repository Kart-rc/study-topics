# MCP cache scope is a tenant boundary—not a performance decoration

GenAI engineering · Day48 · 15 minutes

Apply 2026-07-28 MCP cache hints without serving one user's discovery result to another.

## Recall (2 minutes)

<p><a href="../Day33/genai-engineering.html">Day33: The model can use a database handle without ever seeing it</a></p><p>What does the SDK send to the LLM from the local context object automatically?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; local context is not sent to the LLM. The context object is for local code and dependencies.</p></details><p><a href="../Day5/genai-engineering.html">Day5: Context compaction: preserve decisions, discard exhaust</a></p><p>Which item is usually safest to evict from long-running working context?</p><details><summary>Recall first, then reveal the refresher</summary><p>Repeated raw tool output that can be re-fetched. Re-fetchable exhaust is lower-value than the state needed to continue correctly.</p></details>

## Understand (4 minutes)

A café may reuse the public menu for every customer, but it must not hand one customer's allergy note to the next table. Cache freshness and cache sharing answer different questions.

In MCP 2026-07-28, cacheable discovery/read results carry ttlMs and cacheScope. TTL says how long a result may be treated as fresh. private says a shared intermediary must not serve it across users. A notification can invalidate a still-live entry.



A tools list is stable for 60 seconds. For a public, identical list, a gateway may reuse it across tenants. If enabled tools depend on authorization, the server must mark the result private and the client cache key must include the authorization context. Otherwise tenant B can receive tenant A's tool surface.



## Read the visual

Freshness and tenant eligibility are separate gates. The cache can be fresh yet correctly miss for tenant B, making the isolation boundary visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use cache hints when MCP discovery or resource reads are repeated enough to add latency, especially through a shared multi-tenant gateway.

**Practical example.** An agent harness calls <code>tools/list</code> before every turn while entitlements differ by tenant.

**How to decide.** Default to zero TTL and private scope until sameness is proven. Key private entries by authorization context, honor invalidation notifications, and treat TTL as a freshness hint—not an authorization decision or polling interval.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
cache={'scope':'private','tenant':'A','value':['search'],'expires_at':60}
request={'tenant':'B','now':10}
fresh=request['now'] < cache['expires_at']
shareable=cache['scope']=='public' or cache['tenant']==request['tenant']; result={'fresh':fresh,'serve':fresh and shareable}
```

1. Store an authorization-dependent discovery result privately.

   Changed values: `{"cache": {"scope": "private", "tenant": "A", "value": ["search"], "expires_at": 60}}`

2. A second tenant asks while the TTL is still live.

   Changed values: `{"request": {"tenant": "B", "now": 10}}`

3. The value is fresh but may still be ineligible for this requester.

   Changed values: `{"fresh": true}`

4. Scope is enforced independently of freshness.

   Changed values: `{"shareable": false, "result": {"fresh": true, "serve": false}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model is a dictionary with a clock. It does not implement an MCP SDK, transport, protocol negotiation, distributed invalidation, clock skew, eviction, authorization, encryption, stale-on-error policy, or a gateway.

## Explore (remaining exploration time)

Change scope, tenant, TTL, and invalidation. Predict cache hit, miss, or isolation violation.

Open genai-engineering.html for the executable model.

Model limits: The model is a dictionary with a clock. It does not implement an MCP SDK, transport, protocol negotiation, distributed invalidation, clock skew, eviction, authorization, encryption, stale-on-error policy, or a gateway.

## Quiz (4 minutes)

1. What does ttlMs authorize?
   - Nothing; it is a freshness hint
   - Cross-tenant sharing
   - Tool execution

2. When may a shared gateway reuse a public result for tenant B?
   - Only when the result is genuinely identical and safe across users
   - Whenever TTL is positive
   - Whenever tenant A requested it first

3. What does a relevant list-changed notification do?
   - Invalidates the cached result even before TTL expiry
   - Extends the TTL
   - Changes private to public

4. Which MCP results in your harness vary by authorization context?
5. What invalidation signal and cache key would keep them safe?

<details><summary>Answer key — attempt first</summary>

1. Nothing; it is a freshness hint. Freshness and authorization are separate controls.

2. Only when the result is genuinely identical and safe across users. Public scope is a strong statement about shareability.

3. Invalidates the cached result even before TTL expiry. Notification and TTL coexist; invalidation wins.

</details>

## Sources

- [MCP 2026-07-28 changelog](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/changelog.mdx) — Official MCP specification repository; checked November 8, 2026; checked 2026-11-08.
- [MCP Python SDK caching hints](https://github.com/modelcontextprotocol/python-sdk/blob/main/docs/client/caching.md) — Official MCP Python SDK documentation; checked November 8, 2026; checked 2026-11-08.
- [MCP SEP-2549 TTL for list results](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2549-TTL-for-list-results.md) — Official MCP enhancement proposal; checked November 8, 2026; checked 2026-11-08.
