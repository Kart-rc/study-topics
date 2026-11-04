# Return a resource link when the model does not need the whole file yet

GenAI engineering · Day44 · 15 minutes

Keep large MCP resources out of the immediate tool result while preserving a client-controlled fetch path.

## Recall (2 minutes)

<p><a href="../Day31/genai-engineering.html">Day31: Keep the span, drop the prompt</a></p><p>What remains useful when sensitive trace data is excluded?</p><details><summary>Recall first, then reveal the refresher</summary><p>Span relationships, durations, and status. Operational shape can remain even when payload content is withheld.</p></details><p><a href="../Day3/genai-engineering.html">Day3: MCP OAuth: bind the token to the server, then mint a new upstream credential</a></p><p>A client presents aud=storage.api to catalog.example. What should strict validation do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject because the token was not issued for the MCP server. The MCP server validates that it is the intended audience; a downstream audience is not interchangeable.</p></details>

## Understand (4 minutes)

A library catalog gives you a title and shelf location. It does not photocopy a 400-page book into every search result.

An MCP tool may return a resource_link with a URI, name, description, and media type instead of embedding the resource bytes. The client can fetch or subscribe when needed. Tool-returned links are not guaranteed to appear in resources/list, so the harness must preserve the returned link itself.



A search tool finds a 20 MB Parquet profile. Returning a link keeps the immediate result small and lets the host decide whether to read it. Embedding may still fit a tiny configuration file that the model needs now. A link is not authorization: the client still needs safe URI handling and access checks.



## Read the visual

The byte path visibly forks at the tool result: embedding crosses the boundary immediately, while a resource link leaves content behind a later client decision.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a resource link when a tool discovers a large, binary, optional, or lazily consumed artifact.

**Practical example.** A data-quality tool returns a profile report, Spark event log, or lineage export that only a follow-up diagnostic needs.

**How to decide.** Embed small essential text that the next model step truly needs. Link large or optional resources. Preserve provenance, enforce URI and authorization policy, and do not assume a link is present in resources/list.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
artifact={'name':'spark-event-log.zst','bytes':20_000_000,'mime':'application/zstd'}
result={'type':'resource_link','uri':'s3://diagnostics/run-42','name':artifact['name'],'mimeType':artifact['mime']} 
immediate_payload_bytes=len(str(result).encode()); deferred_bytes=artifact['bytes']
listed_later=False; harness_must_preserve_uri=not listed_later
```

1. Start with a twenty-megabyte diagnostic artifact.

   Changed values: `{"artifact": {"name": "spark-event-log.zst", "bytes": 20000000, "mime": "application/zstd"}}`

2. Return metadata and a client-fetchable URI, not the artifact bytes.

   Changed values: `{"result": {"type": "resource_link", "uri": "s3://diagnostics/run-42", "name": "spark-event-log.zst", "mimeType": "application/zstd"}}`

3. Measure only this teaching record; the actual wire encoding will differ.

   Changed values: `{"immediate_payload_bytes": 122, "deferred_bytes": 20000000}`

4. Model the specification boundary that the link may not appear in resources/list.

   Changed values: `{"listed_later": false, "harness_must_preserve_uri": true}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model counts synthetic bytes and assumes one link record. It does not implement an MCP transport, resources/read, subscriptions, authentication, URI allowlists, redirects, MIME validation, content scanning, caching, range reads, or model context limits.

## Explore (remaining exploration time)

Change file size and delivery mode. Observe whether bytes enter the immediate result or remain behind a client-controlled fetch boundary.

Open genai-engineering.html for the executable model.

Model limits: The model counts synthetic bytes and assumes one link record. It does not implement an MCP transport, resources/read, subscriptions, authentication, URI allowlists, redirects, MIME validation, content scanning, caching, range reads, or model context limits.

## Quiz (4 minutes)

1. A tool finds a 100 MB event log that may not be needed. What should it return?
   - A resource_link with useful metadata
   - The entire log as prompt text
   - Only a filename with no URI

2. Why must the harness preserve a tool-returned link?
   - It might not appear in resources/list
   - Every link is automatically public
   - The model can reconstruct any URI

3. What does resource_link not provide by itself?
   - Authorization and safe URI handling
   - A URI and media metadata
   - A deferred fetch option

4. Which current tools embed logs or documents the model rarely needs?
5. What URI, authorization, provenance, and content checks must your host apply before fetching a link?

<details><summary>Answer key — attempt first</summary>

1. A resource_link with useful metadata. The link preserves a client-fetchable path without forcing the bytes into the immediate result.

2. It might not appear in resources/list. The specification does not guarantee tool-returned links are listed later.

3. Authorization and safe URI handling. The host must still validate access, origins, content, and transport behavior.

</details>

## Sources

- [MCP 2026-07-28 tools specification: resource links](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx#resource-links) — Official specification; checked November 3, 2026; checked 2026-11-03.
- [MCP TypeScript SDK: ResourceLink outputs](https://ts.sdk.modelcontextprotocol.io/server#resourcelink-outputs) — Official SDK documentation; checked November 3, 2026; checked 2026-11-03.
