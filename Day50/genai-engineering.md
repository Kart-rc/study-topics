# Route on MCP headers—then reject a body that disagrees

GenAI engineering · Day50 · 15 minutes

Use MCP 2026 header-based routing without letting a proxy and server interpret different requests.

## Recall (2 minutes)

<p><a href="../Day34/genai-engineering.html">Day34: A turn limit stops the loop; it does not make the loop useful</a></p><p>What counts as one SDK turn?</p><details><summary>Recall first, then reveal the refresher</summary><p>One model invocation, including any tool calls it requests. The runner defines a turn at the model-invocation boundary.</p></details><p><a href="../Day6/genai-engineering.html">Day6: Agent sandboxing: make authority smaller than intent</a></p><p>What distinguishes a sandbox boundary from a permission prompt?</p><details><summary>Recall first, then reveal the refresher</summary><p>It enforces what the process can access outside the model. OS and proxy controls constrain capability even when the model proposes the wrong action.</p></details>

## Understand (4 minutes)

An envelope label helps the mailroom route a package, but the label and form inside must describe the same destination.

For MCP 2026-07-28 Streamable HTTP, Mcp-Method and Mcp-Name support routing before parsing the full JSON-RPC body. The server must reject a mismatch with MCP error -32020. The headers are duplicated routing metadata, not a second source of truth.



A gateway routes Mcp-Method: tools/call and Mcp-Name: query_orders to the data-tool pool. If the body says tools/call for delete_catalog, the server rejects it instead of executing either interpretation.



## Read the visual

The proxy route and parsed body converge at an equality gate; disagreement terminates before dispatch.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use header routing when an MCP gateway, WAF, or load balancer must steer requests before decoding the JSON-RPC body.

**Practical example.** Send query tools to a read-only pool and image tools to a GPU pool, then verify header/body equality at the server boundary.

**How to decide.** Use the headers for early routing only on the 2026-07-28 protocol path. Keep body parsing and mismatch rejection authoritative; older protocol versions need their documented transport behavior.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
headers={'Mcp-Method':'tools/call','Mcp-Name':'query_orders'}
body={'method':'tools/call','params':{'name':'delete_catalog'}}
method_match=headers['Mcp-Method']==body['method']; name_match=headers['Mcp-Name']==body['params']['name']
result={'accepted':method_match and name_match,'error':None if method_match and name_match else -32020}
```

1. Receive routing metadata.

   Changed values: `{"headers": {"Mcp-Method": "tools/call", "Mcp-Name": "query_orders"}}`

2. Parse a body that disagrees on the principal name.

   Changed values: `{"body": {"method": "tools/call", "params": {"name": "delete_catalog"}}}`

3. Compare both mirrored values.

   Changed values: `{"method_match": true, "name_match": false}`

4. Reject before tool dispatch when either value differs.

   Changed values: `{"result": {"accepted": false, "error": -32020}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model compares strings only. It omits HTTP parsing, protocol negotiation, Mcp-Param headers, proxies, signatures, authorization, JSON-RPC batch behavior, redirects, CORS, request smuggling, and SDK interoperability.

## Explore (remaining exploration time)

Change method or name in one layer. Predict the route and the server result.

Open genai-engineering.html for the executable model.

Model limits: The model compares strings only. It omits HTTP parsing, protocol negotiation, Mcp-Param headers, proxies, signatures, authorization, JSON-RPC batch behavior, redirects, CORS, request smuggling, and SDK interoperability.

## Quiz (4 minutes)

1. Header says query_orders; body says delete_catalog. What should happen?
   - Reject with -32020 and execute nothing
   - Trust the proxy route
   - Trust the body silently

2. Why include the headers?
   - To enable early routing while preserving body agreement
   - To replace authorization
   - To encrypt JSON-RPC

3. What remains outside this lesson?
   - Authorization, proxy hardening, protocol negotiation, and parameter headers
   - The tool name
   - String equality

4. Which MCP gateway could benefit from early method/name routing?
5. Where will you enforce the equality check so no downstream pool can bypass it?

<details><summary>Answer key — attempt first</summary>

1. Reject with -32020 and execute nothing. Mismatch rejection prevents split interpretation.

2. To enable early routing while preserving body agreement. They expose routing metadata before full parsing.

3. Authorization, proxy hardening, protocol negotiation, and parameter headers. Matching metadata is only one harness boundary.

</details>

## Sources

- [MCP 2026-07-28 changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) — Official MCP specification; header-based routing introduced in 2026-07-28; checked 2026-11-10.
- [MCP Go SDK protocol lifecycle](https://go.sdk.modelcontextprotocol.io/protocol/) — Official SDK reference; mismatch maps to -32020; checked 2026-11-10.
- [MCP draft changelog](https://modelcontextprotocol.io/specification/draft/changelog) — Official current draft; checked November 10, 2026; checked 2026-11-10.
