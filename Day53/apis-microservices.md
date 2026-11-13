# 409 says the resource state conflicts; 422 says the instructions cannot be processed

APIs & Microservices · Day53 · 15 minutes

Return an error that tells clients whether to refresh resource state or repair otherwise well-formed content.

## Recall (2 minutes)

<p><a href="../Day30/apis-microservices.html">Day30: One URL, two languages: Vary is part of the cache key</a></p><p>What does Vary: Accept-Language change?</p><details><summary>Recall first, then reveal the refresher</summary><p>The cache’s representation-matching key. The nominated request header must match before a stored response is reused without revalidation.</p></details><p><a href="../Day34/apis-microservices.html">Day34: CORS controls browser sharing; it is not API authorization</a></p><p>CORS denies app.example. What does that establish?</p><details><summary>Recall first, then reveal the refresher</summary><p>A conforming browser will not share the response with that JavaScript. CORS is a browser response-sharing protocol.</p></details>

## Understand (4 minutes)

A bank transfer can fail for two different reasons. You may be editing an old account version, or you may be asking to transfer a negative amount. The fixes are different.

409 Conflict fits a request that clashes with the current state of the target resource and might succeed after the client resolves that conflict. 422 Unprocessable Content fits understood, syntactically correct content whose instructions cannot be processed. A useful response explains the repair path.



Client A reads order o52 at version 7. Client B changes it to version 8. A's update with version 7 gets 409 plus the current version. A separate request with quantity -2 gets 422 plus a field error. Retrying either unchanged is not a fix.



## Read the visual

One order update branches on stale state versus invalid instructions, pairing each status with a different client repair action.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this distinction when an API accepts structurally valid JSON but must communicate either stale resource state or invalid domain instructions.

**Practical example.** An order update uses optimistic concurrency and domain validation in a financial workflow.

**How to decide.** Use 409 when current server state is the conflict and provide safe reconciliation metadata. Use 422 when the representation is understood but its instructions cannot be processed. Keep 400 for malformed or otherwise generic request errors when a more precise status is not useful.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
server={'id':'o52','version':8}; request={'version':7,'quantity':2}
status=409 if request['version']!=server['version'] else 200
if status==200 and request['quantity']<0: status=422
action='refresh-and-reconcile' if status==409 else ('repair-content' if status==422 else 'accept'); result={'status':status,'action':action}
```

1. Create a stale but otherwise valid update.

   Changed values: `{"server": {"id": "o52", "version": 8}, "request": {"version": 7, "quantity": 2}}`

2. Check target-resource state first.

   Changed values: `{"status": 409}`

3. Validate domain instructions only after state matches.

   Changed values: `{}`

4. Return a repair path aligned to the failure.

   Changed values: `{"action": "refresh-and-reconcile", "result": {"status": 409, "action": "refresh-and-reconcile"}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model implements one opinionated validation order. RFC 9110 does not prescribe every application mapping. It does not send HTTP, define a standard error body, authorize callers, prevent races, merge updates, persist orders, or guarantee that every framework uses the same exception mapping.

## Explore (remaining exploration time)

Change order version and quantity. Predict 200, 409, or 422 and the next client action.

Open apis-microservices.html for the executable model.

Model limits: The model implements one opinionated validation order. RFC 9110 does not prescribe every application mapping. It does not send HTTP, define a standard error body, authorize callers, prevent races, merge updates, persist orders, or guarantee that every framework uses the same exception mapping.

## Quiz (4 minutes)

1. o52 is now version 8; the client sends version 7. Which response best guides repair?
   - 409 with current-version or reconciliation information
   - 422 because JSON parsed
   - 200 and silently overwrite

2. The current version is correct but quantity is -2. Why 422?
   - The content type and syntax are understood, but the instruction cannot be processed
   - The resource version is stale
   - The server is overloaded

3. What should the client avoid for both errors?
   - Blindly retrying the identical request
   - Showing field guidance for 422
   - Refreshing state for 409

4. Which current API maps stale state and invalid domain content to the same status?
5. What safe reconciliation data can a 409 response reveal without leaking another tenant's state?

<details><summary>Answer key — attempt first</summary>

1. 409 with current-version or reconciliation information. The request conflicts with the resource's current version and may be resolvable after refresh.

2. The content type and syntax are understood, but the instruction cannot be processed. The problem is semantic content, not resource-state concurrency.

3. Blindly retrying the identical request. Neither error is made safe or successful by an unchanged retry.

</details>

## Sources

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) — IETF standard; published June 2022; checked November 13, 2026; checked 2026-11-13.
- [RFC 9110 information page](https://www.rfc-editor.org/info/rfc9110/) — IETF publication record; checked November 13, 2026; checked 2026-11-13.
