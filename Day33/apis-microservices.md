# The second DELETE may say 404 and still be idempotent

APIs & Microservices · Day33 · 15 minutes

Separate the repeated request's intended effect from its response code.

## Recall (2 minutes)

<p><a href="../Day20/apis-microservices.html">Day20: Stop routing before the next RPC: gRPC health Watch</a></p><p>B NOT_SERVING with health enabled?</p><details><summary>Recall first, then reveal the refresher</summary><p>Avoid B. Health changes eligibility.</p></details><p><a href="../Day24/apis-microservices.html">Day24: One trace ID joins the call path; it does not authenticate it</a></p><p>What stays the same across spans in one distributed trace?</p><details><summary>Recall first, then reveal the refresher</summary><p>trace ID. The shared trace ID correlates the path; each span has its own ID.</p></details>

## Understand (4 minutes)

Pressing an elevator's “door close” button twice should not close a second door. The display may change from “closing” to “already closed,” but the intended state stays closed.

HTTP idempotence means repeating the same request has the same intended effect. It does not require identical responses. A first DELETE /jobs/42 can return 204; a retry can return 404 because the job is already absent.



Job 42 exists. The first DELETE removes it and returns 204. The client loses that response and retries. The server finds no job and returns 404. Database state after both calls is still “job 42 absent.” Logging each attempt also does not change the requested effect.



## Read the visual

The same database state sits beside two different responses, making the exact semantics visible: same intended effect, not same status.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Rely on DELETE idempotence when clients, gateways, or SDKs may retry after losing a response and the requested resource state is simply absent.

**Practical example.** An operator cancels a scheduled data job; the network drops after deletion, so the client repeats the DELETE.

**How to decide.** Define and document the chosen response for an already-absent resource. Make downstream side effects retry-safe too. Use an operation resource when deletion is asynchronous, and an idempotency key when the operation is actually a non-idempotent POST.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
resource_present = True
first_status = 204 if resource_present else 404; resource_present = False
second_status = 204 if resource_present else 404; resource_present = False
final_state = 'absent' if not resource_present else 'present'
```

1. Job 42 exists before the first request.

   Changed values: `{"resource_present": true}`

2. The first DELETE removes the resource.

   Changed values: `{"resource_present": false, "first_status": 204}`

3. The retry can report absence without changing the final state.

   Changed values: `{"second_status": 404}`

4. Both executions converge on the same intended resource state.

   Changed values: `{"final_state": "absent"}`

[Full runnable example](examples/apis-microservices.py).

Limits: The browser holds one Boolean resource. It does not model authorization, soft deletes, cascades, async deletion, concurrent recreation, caches, replicas, billing effects, audit logs, or framework behavior.

## Explore (remaining exploration time)

Run the same DELETE twice. Compare response codes with the resource state after each call.

Open apis-microservices.html for the executable model.

Model limits: The browser holds one Boolean resource. It does not model authorization, soft deletes, cascades, async deletion, concurrent recreation, caches, replicas, billing effects, audit logs, or framework behavior.

## Quiz (4 minutes)

1. The first DELETE removed job 42, but its 204 response was lost. What can a retry return while remaining idempotent?
   - 404 with job 42 still absent
   - 201 with a new job
   - It must repeat byte-identical 204

2. Why can the server log both DELETE attempts?
   - Incidental logging does not change the requested resource effect
   - DELETE is a safe method
   - Logs recreate the job

3. What requires extra design beyond HTTP method semantics?
   - Retry-safe downstream billing or notifications
   - The word DELETE
   - Returning a status code

4. What should your API return for DELETE of an already-absent resource, and why?
5. Which downstream effects in your delete path would violate retry safety?

<details><summary>Answer key — attempt first</summary>

1. 404 with job 42 still absent. Idempotence concerns intended effect, not identical response messages.

2. Incidental logging does not change the requested resource effect. The specification distinguishes requested semantics from incidental side effects.

3. Retry-safe downstream billing or notifications. An idempotent method label cannot make arbitrary external side effects idempotent.

</details>

## Sources

- [RFC 9110 §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2) — Published June 2022; checked 2026-10-23.
- [RFC 9110 §9.3.5 DELETE](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.5) — Published June 2022; checked 2026-10-23.
