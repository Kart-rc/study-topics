# Discover MCP capabilities before choosing the modern protocol path

GenAI engineering · Day47 · 15 minutes

Use server discovery and per-request metadata without assuming every MCP server supports the same protocol era.

## Recall (2 minutes)

<p><a href="../Day27/genai-engineering.html">Day27: Replay the observation—not the side effect</a></p><p>What should replay do with a refund tool?</p><details><summary>Recall first, then reveal the refresher</summary><p>Stub/block it and record the proposed call. Offline evaluation should not repeat a side effect.</p></details><p><a href="../Day31/genai-engineering.html">Day31: Keep the span, drop the prompt</a></p><p>What remains useful when sensitive trace data is excluded?</p><details><summary>Recall first, then reveal the refresher</summary><p>Span relationships, durations, and status. Operational shape can remain even when payload content is withheld.</p></details>

## Understand (4 minutes)

A universal travel adapter checks the outlet before sending power. It does not push one plug into every wall.

In MCP 2026-07-28, a client may call server/discover to learn supported versions and capabilities. The modern core is stateless: version and client capabilities travel in request _meta. Discovery is optional, so a harness still needs an explicit compatibility policy for older servers.



The harness prefers 2026-07-28 and needs tools plus tasks. Server A advertises 2026-07-28 and tools, but Tasks are an extension it lacks. The harness can use tools and disable background-task UX. Server B supports the legacy initialization era, so an SDK may fall back if policy permits; a pinned-modern client should fail clearly.



## Read the visual

A three-stage compatibility route shows desired features, advertised server support, and the resulting enabled intersection, with legacy fallback as a distinct policy branch.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use discovery when one harness connects to independently upgraded MCP servers or needs to choose modern stateless behavior before ordinary calls.

**Practical example.** An enterprise agent connects to catalog, ticketing, and code servers maintained by different teams.

**How to decide.** Pin when compatibility and auditability outweigh reach. Allow an SDK-managed fallback only with tests and telemetry. Always gate optional features on advertised capability and enforced policy, not on a server name.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
client={'preferred':'2026-07-28','needs':['tasks','tools'],'fallback':True}
server={'versions':['2026-07-28'],'capabilities':['tools']}
version=client['preferred'] if client['preferred'] in server['versions'] else 'legacy' if client['fallback'] else None
enabled=sorted(set(client['needs']) & set(server['capabilities'])); disabled=sorted(set(client['needs'])-set(enabled)); result={'version':version,'enabled':enabled,'disabled':disabled}
```

1. State the harness preference and optional feature needs.

   Changed values: `{"client": {"preferred": "2026-07-28", "needs": ["tasks", "tools"], "fallback": true}}`

2. Discovery advertises modern tools but no tasks extension.

   Changed values: `{"server": {"versions": ["2026-07-28"], "capabilities": ["tools"]}}`

3. Choose a protocol route under explicit fallback policy.

   Changed values: `{"version": "2026-07-28"}`

4. Enable only the capability intersection.

   Changed values: `{"enabled": ["tools"], "disabled": ["tasks"], "result": {"version": "2026-07-28", "enabled": ["tools"], "disabled": ["tasks"]}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser is a capability intersection model. It sends no JSON-RPC, authenticates no server, validates no schemas, implements no fallback transport, and does not prove an extension is safe or authorized.

## Explore (remaining exploration time)

Switch advertised versions and task support. Watch the harness choose modern, legacy, or fail-closed routes.

Open genai-engineering.html for the executable model.

Model limits: The browser is a capability intersection model. It sends no JSON-RPC, authenticates no server, validates no schemas, implements no fallback transport, and does not prove an extension is safe or authorized.

## Quiz (4 minutes)

1. What does server/discover provide?
   - Supported protocol versions, capabilities, and server information for path selection
   - Authorization to every tool
   - A durable session

2. A modern server lacks the Tasks extension. What should the harness do?
   - Use supported features and disable task-specific behavior
   - Pretend tasks exist
   - Call initialize repeatedly

3. Why can pinning fail closed be useful?
   - It prevents silent downgrade when auditability requires one protocol era
   - It makes every server modern
   - It replaces authentication

4. Which MCP servers in your estate can be pinned to 2026-07-28 today?
5. What telemetry will reveal unintended fallback or capability loss?

<details><summary>Answer key — attempt first</summary>

1. Supported protocol versions, capabilities, and server information for path selection. Discovery informs compatibility; it does not grant effects.

2. Use supported features and disable task-specific behavior. Feature use must be the intersection of need, advertisement, and policy.

3. It prevents silent downgrade when auditability requires one protocol era. Compatibility policy should be explicit and observable.

</details>

## Sources

- [MCP 2026-07-28 specification announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Official MCP project post; published July 28, 2026; checked November 6, 2026; checked 2026-11-06.
- [MCP TypeScript SDK protocol versions](https://ts.sdk.modelcontextprotocol.io/v2/protocol-versions) — Official MCP SDK documentation; checked November 6, 2026; checked 2026-11-06.
- [MCP roadmap](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/) — Official MCP project roadmap; published September 2026; checked November 6, 2026; checked 2026-11-06.
