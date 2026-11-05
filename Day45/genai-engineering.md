# For new MCP tools, pass the path explicitly—and enforce a real sandbox

GenAI engineering · Day45 · 15 minutes

Replace deprecated MCP roots in new designs with explicit path/resource inputs while keeping filesystem authority outside the protocol hint.

## Recall (2 minutes)

<p><a href="../Day26/genai-engineering.html">Day26: Slice the eval before the average hides a dangerous failure</a></p><p>Why can a 95% overall rate still be unsafe?</p><details><summary>Recall first, then reveal the refresher</summary><p>Rare critical cases may all fail. A majority slice can dominate the aggregate.</p></details><p><a href="../Day30/genai-engineering.html">Day30: Show the agent only the tools this run may use</a></p><p>Why hide delete_customer from a read-only run?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reduce authority exposure and selection errors. A smaller catalog narrows what the model can propose.</p></details>

## Understand (4 minutes)

A note saying “work in this folder” is not a locked door. It tells a worker where to focus; it does not stop them opening another door.

MCP roots were informational workspace hints, not access control. In protocol version 2026-07-28, roots are deprecated for new designs. Prefer explicit tool parameters, resource URIs, server configuration, or environment variables. Then enforce actual access with process permissions, containers, allowlists, and canonical-path checks.



An old lineage server asks the client for root file:///workspace/payments. A malicious input still requests ../../secrets; the root hint alone cannot block it. The new tool accepts resource_uri=file:///workspace/payments/job.sql, resolves it, and the sandbox rejects anything outside the mounted workspace.



## Read the visual

The path passes through two visibly separate gates—an explicit request and an enforced mount—so a deprecated workspace hint cannot be mistaken for authorization.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit resource or path inputs when an agent tool must read a known project artifact, especially while migrating from MCP roots.

**Practical example.** A lineage tool receives one SQL resource URI and runs inside a container that mounts only the approved repository read-only.

**How to decide.** Do not add roots to a new 2026-07-28 design. Keep compatibility only when needed, expose explicit inputs, canonicalize paths, and make the operating-system or container boundary the authority.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
requested='/workspace/payments/../../secrets.txt'; deprecated_roots=False
import posixpath; canonical=posixpath.normpath(requested); mount='/workspace/payments'
inside=canonical==mount or canonical.startswith(mount+'/'); decision='ALLOW' if inside else 'DENY'
authority='read-only sandbox mount'; protocol_input='resource_uri tool parameter'
```

1. A new design receives the target explicitly and does not add deprecated roots.

   Changed values: `{"requested": "/workspace/payments/../../secrets.txt", "deprecated_roots": false}`

2. Canonicalize the teaching path before comparing boundaries.

   Changed values: `{"canonical": "/secrets.txt", "mount": "/workspace/payments"}`

3. The traversal resolves outside the mounted workspace and is denied.

   Changed values: `{"inside": false, "decision": "DENY"}`

4. Keep protocol input separate from the actual authority boundary.

   Changed values: `{"authority": "read-only sandbox mount", "protocol_input": "resource_uri tool parameter"}`

[Full runnable example](examples/genai-engineering.py).

Limits: This model normalizes two synthetic paths. It does not implement URI parsing, symlink/race defenses, Windows paths, remote resources, authentication, process isolation, MCP transport, client consent, or production sandboxing.

## Explore (remaining exploration time)

Try a file inside the mounted workspace and a traversal path. Compare an informational root check with canonicalization plus a sandbox mount.

Open genai-engineering.html for the executable model.

Model limits: This model normalizes two synthetic paths. It does not implement URI parsing, symlink/race defenses, Windows paths, remote resources, authentication, process isolation, MCP transport, client consent, or production sandboxing.

## Quiz (4 minutes)

1. What replaced roots for a new 2026-07-28 MCP design?
   - Explicit tool parameters, resource URIs, configuration, or environment variables
   - A larger root list
   - Model memory

2. Why is an explicit path still not enough?
   - The server needs an enforced sandbox or permission boundary
   - Paths automatically authorize themselves
   - The model must see every directory

3. What should happen to an existing 2025-11-25 client using roots?
   - Maintain compatibility during migration, but do not treat roots as access control
   - Assume roots became a security sandbox
   - Publish secrets as resources

4. Which of your agent tools still depends on roots, and what explicit input will replace it?
5. What OS, container, or allowlist control actually prevents a traversal or symlink escape?

<details><summary>Answer key — attempt first</summary>

1. Explicit tool parameters, resource URIs, configuration, or environment variables. The current migration guidance deprecates roots and recommends explicit inputs/configuration.

2. The server needs an enforced sandbox or permission boundary. Input describes the target; operating-system and application controls determine authority.

3. Maintain compatibility during migration, but do not treat roots as access control. Roots remain functional during the deprecation window; migration and real enforcement are separate concerns.

</details>

## Sources

- [MCP 2026-07-28 release: deprecations](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Official MCP release post; published July 28, 2026; checked 2026-11-04.
- [MCP Python SDK: sampling and roots](https://py.sdk.modelcontextprotocol.io/handlers/sampling-and-roots/) — Official SDK documentation; checked November 4, 2026; checked 2026-11-04.
- [MCP Go SDK client roots](https://go.sdk.modelcontextprotocol.io/client/) — Official SDK documentation; checked November 4, 2026; checked 2026-11-04.
