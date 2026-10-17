# A valid token does not make every order yours

APIs & Microservices · Day27 · 15 minutes

Authorize the user’s action on the specific object after resolving its identity.

## Recall (2 minutes)

<p><a href="../Day17/apis-microservices.html">Day17: Keyset pagination: continue after a row, not a position</a></p><p>After page A,B and insertion of X before A, what does OFFSET 2 return?</p><details><summary>Recall first, then reveal the refresher</summary><p>B,C. Positions shift. B becomes third and is returned again.</p></details><p><a href="../Day21/apis-microservices.html">Day21: Retry-After is a floor, not a synchronized alarm clock</a></p><p>Retry-After: 3. Is a retry at second 1 compliant with the advice?</p><details><summary>Recall first, then reveal the refresher</summary><p>No. The field asks the client to wait.</p></details>

## Understand (4 minutes)

A valid building badge gets Alice through the lobby; it does not let her open every apartment. An API token proves an identity and perhaps scopes, but an endpoint must still decide whether that identity may perform this action on this object.

Broken Object Level Authorization (BOLA) appears when an API accepts an object ID and returns or changes that object without checking ownership or policy.



Alice legitimately calls GET /orders/42; order 42 belongs to Alice. She changes the URL to /orders/43; order 43 belongs to Bob. A vulnerable handler queries by ID and returns it. The fixed handler loads the order, evaluates can_read(user, order), and returns 404/403 without leaking the object.



## Read the visual

Three boxes force three questions in order: who is the caller, which object is requested, and may that caller perform this action on that object? The vulnerable mode visibly skips only the third question.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Apply object-level authorization to every endpoint or resolver that accepts an object identifier, including nested IDs and batch operations.

**Practical example.** A customer changes an order ID in a REST path, GraphQL argument, or gRPC request.

**How to decide.** Authenticate first, resolve the object, then enforce user + action + object policy server-side. Random IDs are defense-in-depth, not authorization.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
orders={42:'Alice',43:'Bob'}
user='Alice'
requested_id=43
owner=orders[requested_id]
authenticated=True
authorized=authenticated and owner==user
```

1. Authenticate Alice and load the two ownership records.

   Changed values: `{"orders": {"42": "Alice", "43": "Bob"}, "user": "Alice"}`

2. Alice changes only the object identifier.

   Changed values: `{"requested_id": 43, "owner": "Bob"}`

3. The token remains valid; authentication still passes.

   Changed values: `{"authenticated": true}`

4. Object-level policy correctly denies Bob’s order.

   Changed values: `{"authorized": false}`

[Full runnable example](examples/apis-microservices.py).

Limits: This is a local authorization model, not a complete IAM system. Real services need tenant boundaries, role/attribute policy, batch semantics, existence-leak decisions, caching rules, audit logs, race handling, and tests for every action.

## Explore (remaining exploration time)

Change the requested order and toggle the ownership check. The door shows why token validity and object permission are separate decisions.

Open apis-microservices.html for the executable model.

Model limits: This is a local authorization model, not a complete IAM system. Real services need tenant boundaries, role/attribute policy, batch semantics, existence-leak decisions, caching rules, audit logs, race handling, and tests for every action.

## Quiz (4 minutes)

1. Alice has a valid token. May she read Bob’s order?
   - Yes, authentication is enough
   - Only if object-level policy allows that action
   - Yes, if the ID is a UUID

2. Do random object IDs replace authorization?
   - Yes
   - No—they are defense-in-depth only
   - Only in GraphQL

3. Where must the check run?
   - Server-side for every object/action path
   - Only in the browser
   - Only in documentation

4. How would you test BOLA across REST, GraphQL, and gRPC endpoints in your platform?
5. Would your service return 403 or 404 for a forbidden object, and what information tradeoff drives that choice?

<details><summary>Answer key — attempt first</summary>

1. Only if object-level policy allows that action. Authentication does not grant access to every object.

2. No—they are defense-in-depth only. An unguessable ID does not define permission.

3. Server-side for every object/action path. Clients are not trusted enforcement points.

</details>

## Sources

- [OWASP API Security Top 10 2023: Broken Object Level Authorization](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) — OWASP API1:2023; checked 2026-10-17.
- [OAuth 2.0 Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html) — RFC 6750; checked 2026-10-17.
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) — Living guidance; checked 2026-10-17.
