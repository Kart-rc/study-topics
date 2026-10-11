# Freeze the tool catalog: schema drift can impersonate model drift

GenAI engineering · Day21 · 15 minutes

Record the exact tool schemas used by every evaluation so a changed harness is not blamed on the model.

## Recall (2 minutes)

<p><a href="../Day6/genai-engineering.html">Day6: Agent sandboxing: make authority smaller than intent</a></p><p>What distinguishes a sandbox boundary from a permission prompt?</p><details><summary>Recall first, then reveal the refresher</summary><p>It enforces what the process can access outside the model. OS and proxy controls constrain capability even when the model proposes the wrong action.</p></details><p><a href="../Day13/genai-engineering.html">Day13: Same logic, new surface: metamorphic tests for an LLM</a></p><p>The identifier is renamed consistently everywhere. What should happen to the entailment label?</p><details><summary>Recall first, then reveal the refresher</summary><p>It should stay the same. A consistent symbol rename preserves the logical structure, so the relation requires the same judgment.</p></details>

## Understand (4 minutes)

Two runners take the same exam, but one receives a calculator with different buttons. Comparing their scores as if the exam were identical is unfair.

An agent evaluation includes the model, prompt, data, and tool catalog. Tool names, descriptions, input schemas, and output schemas can change. Snapshot a canonical catalog and hash it for every trial.



Trial A exposes search(query). Trial B exposes search(query, region required). The same agent call now fails validation. Without a catalog hash, the dashboard says “model regression”; the evidence actually says “harness changed.”



## Read the visual

The two trial cards keep model and prompt implicit while the tool hash changes beside the score, making the confound visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use catalog snapshots when comparing models, prompts, or releases that can call MCP tools.

**Practical example.** Store canonical tools/list output, protocol version, server build, and schema hash with each eval trial.

**How to decide.** Pin tools for controlled comparisons. Run a separate compatibility suite against the live catalog so production drift is still detected.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
import json, hashlib
catalog_a={"tools":[{"name":"search","inputSchema":{"required":["query"]}}]}
canonical=json.dumps(catalog_a,sort_keys=True,separators=(",",":"))
hash_a=hashlib.sha256(canonical.encode()).hexdigest()[:8]
catalog_b={"tools":[{"name":"search","inputSchema":{"required":["query","region"]}}]}
hash_b=hashlib.sha256(json.dumps(catalog_b,sort_keys=True,separators=(",",":")).encode()).hexdigest()[:8]
comparable=hash_a==hash_b
```

1. Define the first catalog.

   Changed values: `{"catalog_a": {"tools": [{"name": "search", "inputSchema": {"required": ["query"]}}]}}`

2. Canonicalize and hash trial A.

   Changed values: `{"canonical": "{\"tools\":[{\"inputSchema\":{\"required\":[\"query\"]},\"name\":\"search\"}]}", "hash_a": "6492c748"}`

3. Hash trial B and test comparability.

   Changed values: `{"catalog_b": {"tools": [{"name": "search", "inputSchema": {"required": ["query", "region"]}}]}, "hash_b": "8edce0dd", "comparable": false}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executed local Python hashing synthetic catalogs. It did not connect to an MCP server or establish a universal canonicalization standard.

## Explore (remaining exploration time)

Switch the second trial between the same and changed tool schema. Decide whether the score difference is attributable.

Open genai-engineering.html for the executable model.

Model limits: The browser uses two tiny schemas and a displayed teaching hash. Production canonicalization must define ordering, omit volatile fields deliberately, retain full schemas securely, and include server/protocol identity.

## Quiz (4 minutes)

1. Same prompt/model, different tool hash, lower score. First conclusion?
   - Model regressed
   - Comparison is confounded
   - Tool hash is irrelevant

2. What belongs in the trial record?
   - Only final answer
   - Catalog snapshot/hash plus model, prompt, data and protocol/server versions
   - User secrets

3. Why still test the live catalog?
   - Pinned evals prove compatibility forever
   - Production tools can drift and need separate compatibility evidence
   - MCP forbids changes

4. Which volatile catalog fields should your canonicalizer exclude, and why?
5. What separate test proves a pinned agent still works with today’s live tools?

<details><summary>Answer key — attempt first</summary>

1. Comparison is confounded. The harness changed with the measured outcome.

2. Catalog snapshot/hash plus model, prompt, data and protocol/server versions. Attribution needs the effective environment, not secrets.

3. Production tools can drift and need separate compatibility evidence. Controlled evaluation and production compatibility answer different questions.

</details>

## Sources

- [MCP 2026-07-28: tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) — Specification dated 2026-07-28; checked 2026-10-11.
- [MCP 2026-07-28: versioning and compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning) — Specification dated 2026-07-28; checked 2026-10-11.
- [MCP release-candidate notes](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) — Published 2026-07-28; checked 2026-10-11.
