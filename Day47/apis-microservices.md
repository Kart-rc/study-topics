# HTTP 425 says: do not replay this unsafe request in early data

APIs & Microservices · Day47 · 15 minutes

Use 425 Too Early to prevent replay-prone early-data execution without treating every retry as safe.

## Recall (2 minutes)

<p><a href="../Day27/apis-microservices.html">Day27: A valid token does not make every order yours</a></p><p>Alice has a valid token. May she read Bob’s order?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only if object-level policy allows that action. Authentication does not grant access to every object.</p></details><p><a href="../Day31/apis-microservices.html">Day31: A null child can erase its non-null parent</a></p><p>A non-null leaf resolves to null. What happens first?</p><details><summary>Recall first, then reveal the refresher</summary><p>A field error propagates to the nearest nullable parent. The non-null contract forces error propagation.</p></details>

## Understand (4 minutes)

An express lane lets a known customer enter before the identity check finishes. That saves time, but a copied entry ticket could be replayed.

TLS early data can arrive before the full handshake completes and is vulnerable to replay. HTTP 425 Too Early tells the client the server refused to risk processing the request early. A user agent that retries should wait for the handshake and send it once normally.



A client sends POST /payments as early data. The edge cannot guarantee replay safety, so it returns 425 before calling the payment service. After the handshake, the client retries normally with the same idempotency key. The payment service still needs atomic duplicate protection; 425 only protects this early-data boundary.



## Read the visual

The request route branches before the application: an unsafe early POST stops at 425, while the post-handshake retry reaches an idempotency ledger. The two protection boundaries remain distinct.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use 425 at an HTTP endpoint or intermediary that accepts TLS early data but cannot safely process a potentially replayed non-idempotent request.

**Practical example.** A global edge receives a payment POST in 0-RTT data before the TLS handshake is complete.

**How to decide.** Disable early data for unsafe routes when possible. Otherwise reject early processing with 425 and retry only after handshake completion. Still enforce application idempotency for side effects; never loop-retry another 425 as early data.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
request={'method':'POST','path':'/payments','early_data':True,'idempotency_key':'pay-77'}
unsafe=request['method']=='POST'; status=425 if request['early_data'] and unsafe else 200
request['early_data']=False; retry_status=200
ledger={'pay-77':'payment-900'}; effect=ledger[request['idempotency_key']]
```

1. A side-effecting request arrives before handshake completion.

   Changed values: `{"request": {"method": "POST", "path": "/payments", "early_data": true, "idempotency_key": "pay-77"}}`

2. Reject risky early execution before calling the payment service.

   Changed values: `{"unsafe": true, "status": 425}`

3. Retry after the handshake using the same logical intent.

   Changed values: `{"request": {"method": "POST", "path": "/payments", "early_data": false, "idempotency_key": "pay-77"}, "retry_status": 200}`

4. Application idempotency remains the duplicate-effect boundary.

   Changed values: `{"ledger": {"pay-77": "payment-900"}, "effect": "payment-900"}`

[Full runnable example](examples/apis-microservices.py).

Limits: The browser models three booleans, not TLS 1.3, a proxy, a real HTTP client, replay windows, caches, anti-replay infrastructure, or payment idempotency storage. Client behavior varies; test your stack.

## Explore (remaining exploration time)

Switch between GET and payment POST, with or without early data, and observe whether the request is served, rejected, or needs application duplicate protection.

Open apis-microservices.html for the executable model.

Model limits: The browser models three booleans, not TLS 1.3, a proxy, a real HTTP client, replay windows, caches, anti-replay infrastructure, or payment idempotency storage. Client behavior varies; test your stack.

## Quiz (4 minutes)

1. Why return 425 for an early payment POST?
   - To avoid processing replay-prone early data before the handshake
   - To say the payment failed permanently
   - To speed up every retry

2. How should the client retry?
   - After the handshake, not again as early data
   - Immediately as identical early data forever
   - With a different payment intent

3. Why keep an idempotency key?
   - Other duplicate-delivery paths remain outside the 425 boundary
   - 425 makes POST idempotent
   - TLS stores business results

4. Which side-effecting routes at your edge can receive TLS early data today?
5. Where is the stable intent key atomically bound to the resulting effect?

<details><summary>Answer key — attempt first</summary>

1. To avoid processing replay-prone early data before the handshake. 425 rejects the risky timing, not the business request forever.

2. After the handshake, not again as early data. The retry removes the early-data replay condition.

3. Other duplicate-delivery paths remain outside the 425 boundary. Application duplicate protection covers retries and lost responses beyond TLS early data.

</details>

## Sources

- [RFC 8470: Using Early Data in HTTP](https://www.rfc-editor.org/rfc/rfc8470.html) — IETF standards-track RFC; published September 2018; checked November 6, 2026; checked 2026-11-06.
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) — IETF standards-track RFC; published June 2022; checked November 6, 2026; checked 2026-11-06.
