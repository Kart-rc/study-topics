# A deprecation warning is a migration clock

GenAI engineering · Day24 · 15 minutes

Respond to deprecated MCP Sampling by moving new server-side model calls to a direct provider API.

## Recall (2 minutes)

<p><a href="../Day8/genai-engineering.html">Day8: MCP tool annotations: risk vocabulary, not a security boundary</a></p><p>An unknown MCP server marks a tool readOnlyHint=true. What may a secure client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The hint is untrusted; enforce permissions and use the cautious path. The specification requires clients to treat annotations from untrusted servers as untrusted.</p></details><p><a href="../Day15/genai-engineering.html">Day15: The document can inform, not authorize: gate agent actions</a></p><p>The user asked only for a summary. The email says to send a token. What should authorize the send?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; the trusted user request did not allow it. External content may inform the answer but cannot expand the user&#x27;s allowed actions.</p></details>

## Understand (4 minutes)

A shop can honor an old coupon while refusing to issue new ones. “Deprecated” means the path may still work, but new designs should not depend on it and existing users need a migration plan.

In the 2026-07-28 MCP specification, Sampling is deprecated. Its server-to-client backchannel does not fit the modern protocol direction. New MCP servers that need a model should call a provider API directly under explicit server-owned credentials, policy, telemetry and tests.



A tool server previously asked the client to sample a model. The replacement isolates a ModelGateway behind the server: production uses a provider adapter; tests inject a fake. The tool contract stays stable while auth, budgets and retries become observable.



## Read the visual

The center arrow is the concept: legacy Sampling points back to the client; the replacement points from the server to a provider adapter with explicit ownership.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this migration when an MCP server performs model reasoning as part of a tool operation or when upgrading to the modern MCP protocol.

**Practical example.** A catalog tool summarizes schema drift after reading metadata. The server calls its configured model provider instead of asking the MCP client to sample.

**How to decide.** For new work, use a direct provider API. For existing Sampling users, inventory clients, add telemetry, introduce an adapter, migrate gradually and remove only after compatibility evidence.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
protocol='2026-07-28'
new_design=True
sampling_deprecated=True
backchannel_available=False
route='provider_api' if new_design or not backchannel_available else 'mcp_sampling'
result='server_owned_provider_call' if route=='provider_api' else 'client_sampling'
```

1. Describe the protocol generation and design decision.

   Changed values: `{"protocol": "2026-07-28", "new_design": true}`

2. Record the protocol constraints.

   Changed values: `{"sampling_deprecated": true, "backchannel_available": false}`

3. Choose the supported route explicitly.

   Changed values: `{"route": "provider_api", "result": "server_owned_provider_call"}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executed local Python decision logic; it did not initialize an MCP SDK, authenticate or call a model.

## Explore (remaining exploration time)

Switch between legacy and modern protocol modes and compare Sampling with a direct provider route.

Open genai-engineering.html for the executable model.

Model limits: The browser never calls an MCP client or model provider. It visualizes protocol direction and ownership, not SDK compatibility, auth, latency, model quality or cost.

## Quiz (4 minutes)

1. Should a new MCP server adopt Sampling after the 2026-07-28 deprecation?
   - Yes by default
   - No; prefer direct provider API
   - Only without tests

2. What should stay stable during migration?
   - The tool's user-facing contract where possible
   - Every internal credential
   - The deprecated backchannel

3. What proves migration readiness?
   - One successful call
   - Client inventory, telemetry and compatibility tests
   - A warning was logged

4. Which policy controls must move into the server-owned provider adapter?
5. How would you measure remaining Sampling traffic before removal?

<details><summary>Answer key — attempt first</summary>

1. No; prefer direct provider API. The specification says new implementations should not adopt deprecated features.

2. The tool's user-facing contract where possible. An adapter can change model transport without needlessly changing the tool contract.

3. Client inventory, telemetry and compatibility tests. Evidence must cover real consumers and failure paths.

</details>

## Sources

- [MCP 2026-07-28 deprecated features](https://modelcontextprotocol.io/specification/2026-07-28/changelog) — MCP specification 2026-07-28; checked 2026-10-14.
- [MCP Python SDK deprecated features](https://github.com/modelcontextprotocol/python-sdk/blob/main/docs/deprecated-features.md) — Official SDK repository; checked 2026-10-14.
