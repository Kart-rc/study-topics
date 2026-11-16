# Deprecated MCP features still work—migrate before you remove them

GenAI engineering · Day55 · 15 minutes

Treat protocol deprecation as a compatibility window, not permission to break older negotiated clients immediately.

## Recall (2 minutes)

<p><a href="../Day31/genai-engineering.html">Day31: Keep the span, drop the prompt</a></p><p>What remains useful when sensitive trace data is excluded?</p><details><summary>Recall first, then reveal the refresher</summary><p>Span relationships, durations, and status. Operational shape can remain even when payload content is withheld.</p></details><p><a href="../Day35/genai-engineering.html">Day35: Choose whether a tool failure becomes context or stops the run</a></p><p>What does the default function-tool error formatter reveal?</p><details><summary>Recall first, then reveal the refresher</summary><p>A fixed generic message, not the exception details. The default is intentionally generic.</p></details>

## Understand (4 minutes)

A train station can stop selling a ticket before the last valid ticket expires. “Do not start using this” and “this no longer works” are different dates.

MCP 2026-07-28 introduced a formal feature lifecycle. Roots, sampling, logging, and legacy HTTP+SSE are deprecated, but deprecation is not removal. The announced floor is at least twelve months before removal eligibility, and removal still requires a later specification decision. A harness should stop adding new dependence, warn and measure negotiated use, provide the replacement, then remove only when the protocol and supported-client evidence allow it.



Client c55-old still negotiates roots. Client c55-new passes an explicit resource URI. If the server deletes roots on July 29, 2026, the old client breaks inside the compatibility window. A staged adapter serves both, records old use, and gives the owner migration evidence.



## Read the visual

A dated lifecycle passes through an adapter before reaching an old client, separating deprecation, migration evidence, and actual removal.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a compatibility adapter when your agent harness supports multiple MCP revisions or independently upgraded clients and servers.

**Practical example.** A platform server moves file scope from roots discovery to explicit tool parameters while desktop clients upgrade on different schedules.

**How to decide.** Stop new adoption, negotiate by revision/capability, measure legacy use without recording sensitive payloads, publish a migration path, and set removal from current specification plus client evidence. Do not keep a deprecated path forever without an owner.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
clients={'c55-old':'roots','c55-new':'explicit_uri'}
status={'roots':'deprecated','explicit_uri':'active'}
served={c: True for c in clients}; warnings={'c55-old':'migrate_to_explicit_uri'}
result={'old_client_works':served['c55-old'],'legacy_uses':sum(v=='roots' for v in clients.values()),'removed_automatically':False}
```

1. Record the negotiated path for two clients.

   Changed values: `{"clients": {"c55-old": "roots", "c55-new": "explicit_uri"}}`

2. Separate feature lifecycle from transport reachability.

   Changed values: `{"status": {"roots": "deprecated", "explicit_uri": "active"}}`

3. Serve the compatibility window and guide the legacy owner.

   Changed values: `{"served": {"c55-old": true, "c55-new": true}, "warnings": {"c55-old": "migrate_to_explicit_uri"}}`

4. Report compatibility and preserve the non-automatic removal boundary.

   Changed values: `{"result": {"old_client_works": true, "legacy_uses": 1, "removed_automatically": false}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model tracks one feature and two clients. It does not open MCP transports, negotiate real capabilities, implement roots or resource authorization, verify the future removal date, emit OpenTelemetry, or inspect production client inventories.

## Explore (remaining exploration time)

Choose warn-and-serve or immediate removal for an old roots client. Predict compatibility and migration visibility.

Open genai-engineering.html for the executable model.

Model limits: The model tracks one feature and two clients. It does not open MCP transports, negotiate real capabilities, implement roots or resource authorization, verify the future removal date, emit OpenTelemetry, or inspect production client inventories.

## Quiz (4 minutes)

1. What does MCP deprecation mean for roots on 2026-07-28?
   - It remains functional during a minimum twelve-month window, while new implementations should avoid it
   - It is removed that day
   - Every client must silently emulate it

2. Why measure negotiated legacy use?
   - Removal decisions need evidence about supported clients, not guesses
   - Payload logging is required
   - Deprecation warnings automatically migrate clients

3. What is the earliest honest removal rule?
   - A later spec permits removal and supported-client evidence plus policy says the path may close
   - Exactly twelve months after announcement regardless of later decisions
   - As soon as a replacement exists

4. Which deprecated MCP capability still appears in your supported client matrix?
5. What replacement, owner, and usage threshold would make its eventual removal reviewable?

<details><summary>Answer key — attempt first</summary>

1. It remains functional during a minimum twelve-month window, while new implementations should avoid it. Deprecated and removed are separate lifecycle states.

2. Removal decisions need evidence about supported clients, not guesses. Use counts and owner/version metadata expose the remaining migration surface.

3. A later spec permits removal and supported-client evidence plus policy says the path may close. The window is a minimum floor, not an automatic deletion timer.

</details>

## Sources

- [MCP: The 2026-07-28 Specification](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Official MCP release post; published July 28, 2026; checked November 15, 2026; checked 2026-11-15.
- [MCP 2026-07-28 release candidate: deprecations](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) — Official MCP release-candidate post; checked November 15, 2026; checked 2026-11-15.
- [MCP TypeScript SDK: protocol versions](https://ts.sdk.modelcontextprotocol.io/v2/protocol-versions) — Official MCP SDK documentation; checked November 15, 2026; checked 2026-11-15.
