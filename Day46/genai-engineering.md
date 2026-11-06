# Return a durable task handle when a tool call will outlive the connection

GenAI engineering · Day46 · 15 minutes

Use the MCP Tasks extension for long work while respecting polling, durable IDs, input requests, and cooperative cancellation.

## Recall (2 minutes)

<p><a href="../Day32/genai-engineering.html">Day32: Hand off only the context the next agent needs</a></p><p>What does a handoff input filter change?</p><details><summary>Recall first, then reveal the refresher</summary><p>The context passed to the next agent. It transforms handoff input data.</p></details><p><a href="../Day4/genai-engineering.html">Day4: Agent durability: separate the brain, the hands, and the session</a></p><p>A decoupled sandbox fails after two durable checkpoint events. What can a replacement recover?</p><details><summary>Recall first, then reveal the refresher</summary><p>The session history and two completed checkpoints. The recovery source is the external session log, not the failed sandbox.</p></details>

## Understand (4 minutes)

A coat-check ticket is not the coat. It is a durable handle that lets you leave, return, and retrieve the result later.

The MCP Tasks extension lets a server return resultType: task from a supported tool call. The client persists the task ID and polls tasks/get at the suggested interval. The task may need input, complete, fail, or be cooperatively cancelled.



A deployment tool returns task T-42 with status working and a five-second poll interval. Later it becomes input_required for production approval. The client answers through tasks/update, resumes polling, and eventually receives the original tool result. A reconnect is safe because the task ID was stored durably.



## Read the visual

The same opaque task ID remains fixed while status and required client action change, making durability distinct from the underlying work and from cancellation.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a task handle when tool work can take minutes, cross a disconnect, wait for approval, or map onto an external durable job.

**Practical example.** An agent starts an ECS deployment, disconnects, then resumes status checks and supplies an approval response without restarting the deployment.

**How to decide.** Keep ordinary tool results for short work. Use Tasks only after capability negotiation, persist opaque task IDs securely, honor pollIntervalMs, and design cancellation as intent rather than proof of termination.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
task={'taskId':'T-42','status':'working','pollIntervalMs':5000}; durable_store={'taskId':task['taskId']} 
task['status']='input_required'; task['inputRequests']={'approval':'approve production?'}
approval=True; task.pop('inputRequests'); task['status']='working'
task['status']='completed'; task['result']={'deployment':'green','state':'ready'}; final=task['result']
```

1. Persist the opaque handle before the connection can disappear.

   Changed values: `{"task": {"taskId": "T-42", "status": "working", "pollIntervalMs": 5000}, "durable_store": {"taskId": "T-42"}}`

2. A later poll reveals that the server needs input.

   Changed values: `{"task": {"taskId": "T-42", "status": "input_required", "pollIntervalMs": 5000, "inputRequests": {"approval": "approve production?"}}}`

3. The client answers through the update path and the task resumes.

   Changed values: `{"task": {"taskId": "T-42", "status": "working", "pollIntervalMs": 5000}, "approval": true}`

4. A terminal poll returns the same result shape the original tool call would have returned.

   Changed values: `{"task": {"taskId": "T-42", "status": "completed", "pollIntervalMs": 5000, "result": {"deployment": "green", "state": "ready"}}, "final": {"deployment": "green", "state": "ready"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: This model is a fixed state machine. It does not run MCP, authenticate callers, encrypt task IDs, persist a server database, route HTTP headers, rate-limit polls, execute deployments, or prove cancellation.

## Explore (remaining exploration time)

Advance T-42 through working, input required, resumed, and completed. Try cancellation and observe that acknowledgement does not force the terminal state.

Open genai-engineering.html for the executable model.

Model limits: This model is a fixed state machine. It does not run MCP, authenticate callers, encrypt task IDs, persist a server database, route HTTP headers, rate-limit polls, execute deployments, or prove cancellation.

## Quiz (4 minutes)

1. Why persist the task ID before disconnecting?
   - So polling can resume without starting the side effect again
   - To enumerate every server task
   - To bypass authorization

2. What should a client do with pollIntervalMs?
   - Respect it and allow it to change
   - Poll continuously
   - Treat it as the result

3. A tasks/cancel call is acknowledged. What is guaranteed?
   - Cancellation intent was accepted, not that work stopped
   - The task is already cancelled
   - The result was rolled back

4. Which tool in your harness can outlive a transport connection and should return a durable task?
5. Where will task IDs be stored, scoped, expired, and protected as bearer-like capabilities?

<details><summary>Answer key — attempt first</summary>

1. So polling can resume without starting the side effect again. The durable handle reconnects the client to the existing operation.

2. Respect it and allow it to change. The extension permits rate limiting when clients poll faster than suggested.

3. Cancellation intent was accepted, not that work stopped. Cancellation is cooperative and may end in another terminal status.

</details>

## Sources

- [MCP Tasks Extension overview](https://tasks.extensions.modelcontextprotocol.io/) — Official extension documentation; schema dated July 28, 2026; checked November 5, 2026; checked 2026-11-05.
- [MCP Tasks specification draft](https://tasks.extensions.modelcontextprotocol.io/specification/draft/tasks) — Official extension specification; checked November 5, 2026; checked 2026-11-05.
- [SEP-2663 Tasks Extension](https://tasks.extensions.modelcontextprotocol.io/seps/2663-tasks-extension) — Final SEP; extension release July 28, 2026; checked 2026-11-05.
