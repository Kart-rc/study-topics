# MCP progress is a live signal—not a durable task record

GenAI engineering · Day49 · 15 minutes

Use request-scoped progress notifications without mistaking them for resumable work.

## Recall (2 minutes)

<p><a href="../Day28/genai-engineering.html">Day28: Do not let one poisoned document become permanent memory</a></p><p>What should happen to an instruction found in an external document?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treat it as untrusted data and quarantine/review it. Retrieved evidence does not gain authority merely by being read.</p></details><p><a href="../Day32/genai-engineering.html">Day32: Hand off only the context the next agent needs</a></p><p>What does a handoff input filter change?</p><details><summary>Recall first, then reveal the refresher</summary><p>The context passed to the next agent. It transforms handoff input data.</p></details>

## Understand (4 minutes)

A delivery driver can text “three stops away.” That update reassures you while the trip is active; it is not the warehouse record that lets another driver resume after a crash.

In MCP 2026-07-28, a caller opts in with an opaque _meta.progressToken. The server may send notifications/progress on that request's response stream before the final response. The receiver is not obligated to send them. If work must outlive the stream, use the tasks extension or an explicit durable handle.



A corpus-indexing tool emits 20/100 and 70/100 on the same SSE response stream, then returns a final result. If the connection breaks at 70, those notifications do not prove a durable checkpoint exists. A task handle with persisted status is the recovery contract.



## Read the visual

The response-stream timeline ends at the disconnect while the durable-handle lane remains empty, making the recovery boundary explicit.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use progress notifications when an in-flight MCP call is slow enough that the client needs liveness and completion estimates.

**Practical example.** A harness displays indexing progress while a tool processes 100 documents on one response stream.

**How to decide.** Use request progress for live UX. Use a durable task or explicit handle when the caller must poll, reconnect, resume, or supply later input.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
request={'id':9,'progress_token':'p-9'}; stream=[]
stream.append({'method':'notifications/progress','token':'p-9','progress':20,'total':100})
stream.append({'method':'notifications/progress','token':'p-9','progress':70,'total':100}); connected=False
durable_task_handle=None; result={'seen':[e['progress'] for e in stream],'connected':connected,'resumable':durable_task_handle is not None}
```

1. The caller opts this request into progress notifications.

   Changed values: `{"request": {"id": 9, "progress_token": "p-9"}, "stream": []}`

2. The server reports request-scoped progress on the live stream.

   Changed values: `{"stream": [{"method": "notifications/progress", "token": "p-9", "progress": 20, "total": 100}]}`

3. The stream breaks after another update.

   Changed values: `{"stream": [{"method": "notifications/progress", "token": "p-9", "progress": 20, "total": 100}, {"method": "notifications/progress", "token": "p-9", "progress": 70, "total": 100}], "connected": false}`

4. Without a separate durable handle, the client cannot infer resumability.

   Changed values: `{"durable_task_handle": null, "result": {"seen": [20, 70], "connected": false, "resumable": false}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser models event order, not an MCP transport. It does not open SSE or STDIO, negotiate a protocol version, handle buffering, validate tokens, persist tasks, estimate trustworthy totals, or implement cancellation and reconnect semantics.

## Explore (remaining exploration time)

Toggle opt-in and disconnect. Predict which events the client sees and whether it can resume.

Open genai-engineering.html for the executable model.

Model limits: The browser models event order, not an MCP transport. It does not open SSE or STDIO, negotiate a protocol version, handle buffering, validate tokens, persist tasks, estimate trustworthy totals, or implement cancellation and reconnect semantics.

## Quiz (4 minutes)

1. A request has no progressToken. Must the server send progress?
   - No; the caller did not opt in
   - Yes, every 10 percent
   - Only over STDIO

2. Why is 70% not a recovery checkpoint?
   - A request-scoped notification does not define durable resumable state
   - Percentages cannot be numbers
   - SSE automatically persists everything

3. When should the harness use a task handle instead?
   - When work must survive disconnects or later polling/input
   - For every fast synchronous call
   - Only to display a spinner

4. Which long-running tool in your harness only needs live progress, and which one needs a durable task?
5. What state must be persisted before you can honestly claim that a disconnected call is resumable?

<details><summary>Answer key — attempt first</summary>

1. No; the caller did not opt in. The progress token requests out-of-band progress; even with it, the receiver is not obligated to report.

2. A request-scoped notification does not define durable resumable state. Progress describes the live request, while recovery requires stored state and a handle.

3. When work must survive disconnects or later polling/input. Durable tasks are the contract for work that outlives one request stream.

</details>

## Sources

- [MCP 2026-07-28 basic specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/index.mdx) — Official MCP specification; progressToken opts a request into progress; checked 2026-11-09.
- [MCP 2026-07-28 Streamable HTTP](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/transports/streamable-http.mdx) — Official MCP transport specification; request-scoped progress precedes the final response; checked 2026-11-09.
- [MCP 2026-07-28 changelog](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/changelog.mdx) — Official MCP changelog; tasks are an extension and progress stays request-scoped; checked 2026-11-09.
- [MCP Python SDK migration guide](https://github.com/modelcontextprotocol/python-sdk/blob/main/docs/migration.md) — Official SDK guidance; 2026-07-28 progress is server-to-client; checked 2026-11-09.
