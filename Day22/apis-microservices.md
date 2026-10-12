# One idempotency key, one create effect

APIs & Microservices · Day22 · 15 minutes

Make a retried create request return the original outcome while rejecting key reuse for different intent.

## Recall (2 minutes)

<p><a href="../Day19/apis-microservices.html">Day19: Verify the exact webhook bytes before parsing</a></p><p>Body changes from amount 50 to 500 but header stays the same. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>HMAC mismatch. The secret-backed digest covers the payload bytes; changing them invalidates the old header.</p></details><p><a href="../Day14/apis-microservices.html">Day14: One author query, not three: GraphQL request batching</a></p><p>Three posts have author IDs u1, u2, u1. How many author keys should the request batch fetch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Two unique keys: u1 and u2. The request cache deduplicates the repeated u1 lookup, and the batch fetches u1 and u2 together.</p></details>

## Understand (4 minutes)

A coat-check ticket identifies one stored coat. Presenting the same ticket again should return the same coat, not create another claim.

For a create API, the client sends an idempotency key. The server stores the key, a fingerprint of the intended request, and the result as one durable decision.



POST /orders with key k-77 and amount $25 creates o-900. A network timeout hides the reply. Retrying the same key and payload returns o-900 without a second order. Reusing k-77 with $40 is rejected because the intent changed.



## Read the visual

The store and side-effect counters change independently: a valid retry changes the response message but leaves the order count fixed; mismatched intent turns the decision red.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use idempotency keys for client-retried operations that create side effects and cannot safely depend on transport success.

**Practical example.** Order creation, payment initiation, job submission, or provisioning requests over an unreliable network.

**How to decide.** Let the caller supply a unique intent key and validate a payload fingerprint. Do not use a server-generated key that the client cannot repeat after losing the response.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
store={}
effects=[]
key,payload="k-77",{"amount":25}
fingerprint=tuple(sorted(payload.items()))
store[key]={"fingerprint":fingerprint,"response":{"order_id":"o-900"}}
effects.append("create o-900")
retry=store[key]["response"] if store[key]["fingerprint"]==fingerprint else None
mismatch=tuple(sorted({"amount":40}.items()))!=store[key]["fingerprint"]
```

1. Start one caller intent.

   Changed values: `{"store": {}, "effects": [], "key": "k-77", "payload": {"amount": 25}}`

2. Atomically bind key, intent fingerprint, and result.

   Changed values: `{"store": {"k-77": {"fingerprint": [["amount", 25]], "response": {"order_id": "o-900"}}}, "effects": ["create o-900"], "fingerprint": [["amount", 25]]}`

3. Replay the stored response for the same intent without another effect.

   Changed values: `{"retry": {"order_id": "o-900"}}`

4. Detect an unsafe reuse of the key.

   Changed values: `{"mismatch": true}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executed local Python dictionary operations. It did not test durable concurrency, HTTP, authentication, or a real database.

## Explore (remaining exploration time)

Send the first request, a same-payload retry, and a changed-payload reuse. Watch stored state and side-effect count.

Open apis-microservices.html for the executable model.

Model limits: The browser stores one key in memory. Production needs atomic persistence, scope/tenant binding, retention, concurrency control, response replay policy, authentication, and rules for failed/in-progress requests.

## Quiz (4 minutes)

1. Retry k-77 with the same payload. Correct outcome?
   - Create another order
   - Return the stored result
   - Reject every retry

2. Reuse k-77 with a different amount. Correct outcome?
   - Return the old result silently
   - Reject the mismatch
   - Create under the same key

3. Why should the client choose the key?
   - It can repeat the same intent after losing the response
   - It makes authentication unnecessary
   - It guarantees delivery

4. What identifies one caller intent in your create API?
5. How long must its idempotency record remain durable relative to retry windows?

<details><summary>Answer key — attempt first</summary>

1. Return the stored result. The repeated intent maps to the original effect and response.

2. Reject the mismatch. A fingerprint prevents one key from ambiguously naming two intents.

3. It can repeat the same intent after losing the response. The server cannot give back a key if that very response was lost.

</details>

## Sources

- [AWS Builders Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) — Living article; checked 2026-10-12.
- [AWS Well-Architected: make operations idempotent](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_prevent_interaction_failure_idempotent.html) — Living guidance; checked 2026-10-12.
