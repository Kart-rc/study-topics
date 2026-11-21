# MCP sampling is an era-dependent compatibility path—not a new-server default

GenAI engineering · Day60 · 15 minutes

Route legacy sampling deliberately and migrate modern MCP servers to direct model-provider calls without hiding credential ownership.

## Recall (2 minutes)

<p><a href="../Day39/genai-engineering.html">Day39: Two agent turns need one owner of session history</a></p><p>A and B both read version 8, then the ledger stores A before B. What is wrong?</p><details><summary>Recall first, then reveal the refresher</summary><p>B&#x27;s answer appears after A but was generated without A&#x27;s turn. Stored order and observed context disagree.</p></details><p><a href="../Day11/genai-engineering.html">Day11: Keep the reusable part first: prompt-cache boundaries</a></p><p>The toy cache holds policy:v1. Only the order question changes after the boundary. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Hit on the prefix; the new suffix still needs processing. The prefix is unchanged, so it matches. The suffix can vary. Prompt caching does not store the previous generated answer.</p></details>

## Understand (4 minutes)

An old office intercom can still work during a transition, but a new building should not install it as the main phone system.

MCP sampling let a server ask the connected client's model for a completion. The 2026-07-28 protocol deprecated that path; current SDK guidance says new servers should call their model provider directly. Compatibility code still needs negotiated-version and capability checks. The migration also moves model credentials and usage governance to the server side.



Tool summarize60 receives a call. On a 2025-era connection with declared sampling capability, its compatibility path can request client sampling. On a 2026-07-28 connection, the new implementation calls the configured provider. The harness records which route owns model choice, credentials, cost, and policy.



## Read the visual

A protocol-era switch routes one tool through either the client host or a server-owned provider, with ownership labels on both paths.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit routing while a server must support older MCP clients during a deprecation window.

**Practical example.** An internal summarization tool serves one legacy desktop host and one modern automation harness.

**How to decide.** Build new work on direct provider calls. Keep legacy sampling behind version and capability checks, an owner, telemetry, and a removal date; never silently copy a user's client credentials into the server.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
connections=[('legacy','sampling'),('modern','direct_provider')]
owners={'sampling':'client_host','direct_provider':'server'}
routes={era:{'path':path,'owner':owners[path]} for era,path in connections}
result={'legacy':routes['legacy'],'modern':routes['modern'],'new_default':'direct_provider'}
```

1. Define one compatibility route and one target route.

   Changed values: `{"connections": [["legacy", "sampling"], ["modern", "direct_provider"]]}`

2. Name who owns model credentials and policy.

   Changed values: `{"owners": {"sampling": "client_host", "direct_provider": "server"}}`

3. Make protocol-era routing explicit.

   Changed values: `{"routes": {"legacy": {"path": "sampling", "owner": "client_host"}, "modern": {"path": "direct_provider", "owner": "server"}}}`

4. Keep compatibility without making it the new default.

   Changed values: `{"result": {"legacy": {"path": "sampling", "owner": "client_host"}, "modern": {"path": "direct_provider", "owner": "server"}, "new_default": "direct_provider"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model routes two strings. It does not implement MCP transport, MRTR input_required, provider authentication, quotas, data residency, approvals, timeouts, retries, capability negotiation, or model output validation.

## Explore (remaining exploration time)

Toggle the negotiated protocol era and watch model and credential ownership move between host and server.

Open genai-engineering.html for the executable model.

Model limits: The model routes two strings. It does not implement MCP transport, MRTR input_required, provider authentication, quotas, data residency, approvals, timeouts, retries, capability negotiation, or model output validation.

## Quiz (4 minutes)

1. What should a new 2026-07-28 server use for model completions?
   - A direct provider API call
   - A new dependency on deprecated requestSampling
   - An unversioned guess

2. What must a legacy sampling path verify?
   - Negotiated era and declared client capability
   - Only the prompt length
   - Nothing

3. What changes in the migration?
   - Credential, model, cost, and policy ownership move to the server
   - The model output becomes automatically trustworthy
   - All user approval disappears

4. Which legacy hosts still require sampling compatibility?
5. Who will own provider credentials, budget, retention, and removal timing?

<details><summary>Answer key — attempt first</summary>

1. A direct provider API call. Current SDK guidance names direct provider calls as the migration target.

2. Negotiated era and declared client capability. Unsupported sampling should fail before the wire.

3. Credential, model, cost, and policy ownership move to the server. The harness must make the new trust and cost boundary explicit.

</details>

## Sources

- [MCP TypeScript SDK: Sampling](https://ts.sdk.modelcontextprotocol.io/v2/servers/sampling) — Official MCP SDK documentation; checked November 20, 2026; checked 2026-11-20.
- [MCP 2026-07-28 release](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Official MCP project release; published July 28, 2026; checked November 20, 2026; checked 2026-11-20.
