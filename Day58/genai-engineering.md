# A cancel acknowledgement means ‘request received’—not ‘work stopped’

GenAI engineering · Day58 · 15 minutes

Model MCP task cancellation as cooperative and eventually consistent, without inventing a cancelled terminal state.

## Recall (2 minutes)

<p><a href="../Day38/genai-engineering.html">Day38: A child agent gets new input, not an isolated application state</a></p><p>The child receives narrow tool_input. Is parent application state isolated?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; nested runs do not get an isolated copy by default. Input schema and object isolation are different controls.</p></details><p><a href="../Day10/genai-engineering.html">Day10: Valid tool input can still be the wrong action</a></p><p>A100 / 25 cents passes the schema. Why is it blocked?</p><details><summary>Recall first, then reveal the refresher</summary><p>The amount does not match the requested $25. 25 is a valid positive integer, but it means $0.25. The trusted request is 2500 cents; schema validity does not establish intent.</p></details>

## Understand (4 minutes)

Pressing the elevator’s close-door button sends a request. It does not prove the doors have already closed; another passenger may cross the sensor first.

For the MCP Tasks extension, tasks/cancel signals intent. A successful response is an empty acknowledgement. The task may still appear working, and it may finish as completed, failed, or cancelled. Cancellation is cooperative: the server decides whether and when it can stop.

A harness should separate local waiting from remote execution. An abort signal can stop the caller from waiting; a task cancellation request asks the remote system to stop. Neither rewrites an observed final outcome.



Task t58 is working. The client sends cancel and receives an acknowledgement. The tool finishes its final safe step before the server applies cancellation, so the next observation is completed. The harness reports “cancel requested; task completed,” not “cancelled.”



## Read the visual

Intent, acknowledgement, non-terminal observation, and terminal outcome occupy separate states so the learner cannot collapse them into one cancelled flag.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use cooperative task cancellation when long-running agent tools outlive one request and callers need a bounded way to stop waiting or request remote cleanup.

**Practical example.** A catalog-profiling tool is running as an MCP task when the user changes the dataset selection.

**How to decide.** Expose cancel intent, acknowledgement, local ownership release, and observed terminal outcome separately. Make side-effect safety and idempotency explicit; do not promise rollback.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
status='working'; cancel_requested=True
cancel_acknowledged=True
observations=['working','completed']
result={'cancel_requested':cancel_requested,'acknowledged':cancel_acknowledged,'observations':observations,'terminal':observations[-1],'claim':'request acknowledged; completed observed'}
```

1. Request cancellation while t58 is still working.

   Changed values: `{"status": "working", "cancel_requested": true}`

2. Record the empty acknowledgement without changing status locally.

   Changed values: `{"cancel_acknowledged": true}`

3. Observe that work won the race before cancellation took effect.

   Changed values: `{"observations": ["working", "completed"]}`

4. Report intent and observed outcome separately.

   Changed values: `{"result": {"cancel_requested": true, "acknowledged": true, "observations": ["working", "completed"], "terminal": "completed", "claim": "request acknowledged; completed observed"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model has one task and a predetermined race. It does not implement the MCP transport, authorization, task TTL, notifications, cleanup, tool-specific compensation, network partitions, duplicate cancels, or durable storage.

## Explore (remaining exploration time)

Choose whether work wins the race or cancellation wins. Predict the acknowledgement and final status independently.

Open genai-engineering.html for the executable model.

Model limits: The model has one task and a predetermined race. It does not implement the MCP transport, authorization, task TTL, notifications, cleanup, tool-specific compensation, network partitions, duplicate cancels, or durable storage.

## Quiz (4 minutes)

1. tasks/cancel returns an empty success result. What is proven?
   - The server acknowledged cancellation intent
   - The task is already terminal cancelled
   - All side effects rolled back

2. Why might t58 finish completed after cancel?
   - Work can win the race before cooperative cancellation takes effect
   - Completed means the task ID changed
   - MCP forbids cancellation

3. What remains tool-specific?
   - Whether completed side effects need compensation or are idempotent
   - The JSON-RPC method name
   - The existence of a task ID

4. Which long-running tool side effects survive a late cancellation in your harness?
5. How will your UI distinguish local stop-waiting from remote task cancellation?

<details><summary>Answer key — attempt first</summary>

1. The server acknowledged cancellation intent. Acknowledgement and terminal state are separate.

2. Work can win the race before cooperative cancellation takes effect. Cancellation is eventually consistent and cooperative.

3. Whether completed side effects need compensation or are idempotent. The protocol cannot automatically undo domain effects.

</details>

## Sources

- [MCP Tasks Extension specification](https://tasks.extensions.modelcontextprotocol.io/specification/2026-07-28/tasks) — Official stable extension specification; checked November 18, 2026; checked 2026-11-18.
- [MCP Tasks Extension overview](https://tasks.extensions.modelcontextprotocol.io/) — Official extension documentation; checked November 18, 2026; checked 2026-11-18.
