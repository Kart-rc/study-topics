# MCP OAuth: bind the token to the server, then mint a new upstream credential

GenAI engineering · Day3 · 15 minutes

A token intended for a storage API arrives at a catalog tool server.

## Recall (2 minutes)

<p><a href="../Day2/genai-engineering.html">Day2: Grade the outcome, not the victory message</a></p><p>All four fixtures claim success, but only one meets the contract. Claim-only grading produces how many false positives?</p><details><summary>Recall first, then reveal the refresher</summary><p>3. The other three fixtures are incorrectly labeled successful by the weak grader.</p></details>

## Understand (4 minutes)

A token intended for a storage API arrives at a catalog tool server. Even if the storage API would accept it, that does not make it a valid credential for the catalog.

The audience says which service a token is intended for. Each server must check that boundary and the requested permission. When the catalog calls storage, it should use an appropriately scoped upstream credential rather than blindly forwarding the client token.



The first token names storage.api and is rejected by catalog.example. The corrected token names catalog.example. The catalog’s separate upstream credential names storage.api and allows read access only.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
server = "catalog.example"; client_audience = "storage.api"
accepted = client_audience == server
client_audience = "catalog.example"
accepted = client_audience == server
upstream = {"aud": "storage.api", "scope": "read"}
```

1. The token is addressed to the wrong service.

   Changed values: `{"server": "catalog.example", "client_audience": "storage.api"}`

2. The catalog rejects this mismatch.

   Changed values: `{"accepted": false}`

3. A replacement token names the catalog.

   Changed values: `{"client_audience": "catalog.example"}`

4. The audience check now passes.

   Changed values: `{"accepted": true}`

5. A separate upstream credential has its own narrow purpose.

   Changed values: `{"upstream": {"aud": "storage.api", "scope": "read"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: This only illustrates audience matching. Real token verification also requires signature, issuer, expiry, scope, and authorization checks. It does not implement OAuth or prove a request is authorized.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>An agent harness may make an MCP server feel like a local function, but its authorization boundary is still a network security boundary. The MCP authorization specification says clients must indicate the intended resource, servers must validate that an access token was issued for them, and MCP servers must not pass a client token through to an upstream API.</p><p>Audience validation answers “was this credential minted for this server?” Separate upstream credentials answer “what may this server do as itself?” If the server accepts any bearer token and forwards it, a credential intended for another service can be misused, logged, or broadened through the harness.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> An agent calls <code>catalog.example/tools/read</code>. The presented token says <code>aud=storage.api</code>, not <code>aud=catalog.example</code>. A naive server accepts it and forwards the same token to storage. The request may work, but the MCP boundary has neither validated its own audience nor constrained the downstream identity.</p><p>In strict mode the catalog rejects that token. With <code>aud=catalog.example</code>, it accepts the client request, authorizes the tool, and uses a separate, narrowly scoped <code>aud=storage.api; scope=read</code> credential for its upstream call.</p><pre>client token → aud=catalog.example
MCP server validates audience + tool authorization
server credential → aud=storage.api, scope=read</pre><p>Harness engineering implication: represent the MCP server and every upstream service as distinct principals in traces and policy tests. A tool allowlist does not repair token confusion.</p>

</details>

## Explore (remaining exploration time)

Choose storage.api in naive mode and predict whether the MCP server accepts and what it forwards. Turn on strict validation. Then choose catalog.example. Explain which identity should appear in the storage audit log.

Open genai-engineering.html for the executable model.

Model limits: A deterministic audience string model, not OAuth validation. It omits issuer and signature checks, scopes, consent, PKCE, discovery, refresh, token exchange, replay protection, DPoP/mTLS, multi-tenant policy, and actual MCP transport. A correct audience is necessary but not sufficient authorization.

## Quiz (4 minutes)

1. A client presents aud=storage.api to catalog.example. What should strict validation do?
   - Accept because storage is downstream
   - Reject because the token was not issued for the MCP server
   - Rewrite the audience string

2. Why should the MCP server use a separate upstream token?
   - To preserve audience and privilege boundaries instead of passing the client's credential through
   - To make traces shorter
   - To avoid authenticating the client

3. The token has the correct audience. Is the tool call automatically authorized?
   - Yes
   - No; issuer, signature, scope and resource/tool policy still matter
   - Only for read tools

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Reject because the token was not issued for the MCP server. The MCP server validates that it is the intended audience; a downstream audience is not interchangeable.

2. To preserve audience and privilege boundaries instead of passing the client's credential through. Separate credentials keep the client-to-server and server-to-upstream trust decisions distinct.

3. No; issuer, signature, scope and resource/tool policy still matter. Audience validation is one required check, not the complete authorization decision.

</details>

## Sources

- [Model Context Protocol authorization specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization) — Protocol version 2025-06-18; checked against versioned specification; checked 2026-09-23.
