# A task ID may be a bearer secret—authorize every poll

GenAI engineering · Day56 · 15 minutes

Keep durable MCP task state bound to the original caller across disconnects and follow-up requests.

## Recall (2 minutes)

<p><a href="../Day37/genai-engineering.html">Day37: Approval allows a tool call; an idempotency key prevents duplicate effects</a></p><p>The approved refund times out after the processor may have committed. Safe retry?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only with the same approved arguments and a destination-enforced stable idempotency key. Approval is permission; the destination key handles duplicate delivery.</p></details><p><a href="../Day9/genai-engineering.html">Day9: Eval leakage: keep a set the prompt never studied</a></p><p>Why can a dev-set score rise without deployment quality improving?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness may have memorized visible cases through targeted prompt and tool changes. Repeatedly fixing known cases optimizes the test surface as well as the underlying behavior.</p></details>

## Understand (4 minutes)

A coat-check ticket is useful because it retrieves something later. If anyone holding the number can claim the coat, the number is also a secret.

The MCP Tasks extension allows a task ID to identify durable stored state, and the specification says it may act as a bearer token. IDs must be hard to guess, but entropy is not authorization. Every tasks/get, tasks/update, and tasks/cancel request must authenticate and authorize the caller. A client that resumes by ID must carry the original request context—headers, tenant, and timeout policy—into follow-ups.



Tenant red starts task t56. Tenant blue learns the ID from a log. A server that checks only “does t56 exist?” leaks status and perhaps results. A safe lookup checks task.owner == caller.tenant before returning anything.



## Read the visual

A task record and caller identity meet at an authorization gate, showing why a valid identifier alone returns no state.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use durable tasks for expensive MCP tool work that must survive disconnects or require later input.

**Practical example.** A lineage extraction tool returns a task handle while a Spark plan is analyzed asynchronously.

**How to decide.** Use opaque high-entropy IDs, bind stored tasks to authenticated principal and authorization policy, propagate wire context to every follow-up, redact IDs from logs, expire state, and avoid tasks when synchronous work is short enough.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
task={'id':'t56','owner':'red','status':'working'}
caller='blue'; exists=task['id']=='t56'
authorized=exists and caller==task['owner']
result={'exists':exists,'authorized':authorized,'response':'denied' if not authorized else task['status']}
```

1. Store a durable task with an owner.

   Changed values: `{"task": {"id": "t56", "owner": "red", "status": "working"}}`

2. Let another tenant present the valid ID.

   Changed values: `{"caller": "blue", "exists": true}`

3. Check identity and ownership, not existence alone.

   Changed values: `{"authorized": false}`

4. Deny without exposing task state.

   Changed values: `{"result": {"exists": true, "authorized": false, "response": "denied"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model compares two tenant strings. It does not implement MCP transport, token validation, capability negotiation, cryptographic entropy, task storage, expiry, cancellation, input requests, log redaction, or cross-region recovery.

## Explore (remaining exploration time)

Switch the polling tenant from red to blue. Predict whether task status is returned.

Open genai-engineering.html for the executable model.

Model limits: The model compares two tenant strings. It does not implement MCP transport, token validation, capability negotiation, cryptographic entropy, task storage, expiry, cancellation, input requests, log redaction, or cross-region recovery.

## Quiz (4 minutes)

1. Blue knows red's task ID. What must the server do?
   - Authenticate and authorize blue against that task before revealing data
   - Return status because the ID is valid
   - Rotate only the polling interval

2. Why use high-entropy task IDs?
   - To prevent enumeration and guessing
   - To replace authorization
   - To make polling faster

3. What context must a resumed client preserve?
   - Authentication headers, caller scope, and request timeout policy
   - Only the task status message
   - The model prompt in public logs

4. Where could task IDs leak today—logs, URLs, traces, chat transcripts, or metrics?
5. Which principal and policy will each follow-up request re-evaluate?

<details><summary>Answer key — attempt first</summary>

1. Authenticate and authorize blue against that task before revealing data. Task IDs may be bearer-like, but every task request still requires authorization.

2. To prevent enumeration and guessing. Entropy reduces discovery; it does not establish ownership.

3. Authentication headers, caller scope, and request timeout policy. Follow-up requests cross the same security boundary as creation.

</details>

## Sources

- [MCP Tasks Extension: Tasks specification](https://tasks.extensions.modelcontextprotocol.io/specification/2026-07-28/tasks) — Official MCP extension specification; checked November 16, 2026; checked 2026-11-16.
- [MCP Tasks Extension overview](https://tasks.extensions.modelcontextprotocol.io/) — Official MCP extension documentation; checked November 16, 2026; checked 2026-11-16.
