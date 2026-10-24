# CORS controls browser sharing; it is not API authorization

APIs & Microservices · Day34 · 15 minutes

Trace preflight and response sharing, then keep authentication and authorization on the server.

## Recall (2 minutes)

<p><a href="../Day26/apis-microservices.html">Day26: Budget GraphQL breadth before nested lists multiply</a></p><p>10 repos × 10 issues × 10 comments produces how many comment nodes?</p><details><summary>Recall first, then reveal the refresher</summary><p>1000. Nested list widths multiply.</p></details><p><a href="../Day14/apis-microservices.html">Day14: One author query, not three: GraphQL request batching</a></p><p>Three posts have author IDs u1, u2, u1. How many author keys should the request batch fetch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Two unique keys: u1 and u2. The request cache deduplicates the repeated u1 lookup, and the batch fetches u1 and u2 together.</p></details>

## Understand (4 minutes)

A hotel curtain can stop someone in one room from seeing into another. It does not stop a person outside the hotel from calling the front desk. CORS is a browser-enforced sharing rule, not a universal network firewall.

For some cross-origin requests, the browser first sends an OPTIONS preflight. The server's CORS response says which origins, methods, headers, and credential modes the browser may expose to JavaScript. A curl client or another service is not constrained by the browser's CORS checks.



app.example wants to call api.example/orders with Authorization. The browser preflights. If the server allows that origin and header, JavaScript may read the response. If not, the browser blocks sharing. The API still must validate the token and verify that this user may read order 42.



## Read the visual

The two gates answer the common misconception directly: browser sharing can pass or fail independently of API authorization.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Configure CORS when browser JavaScript must call an API on another origin. Keep the allowed origin, method, header, and credential policy narrow.

**Practical example.** A React operations console on app.example calls an order API on api.example with a bearer token.

**How to decide.** Use server-side authentication and object-level authorization for protection. Use CORS only for browser sharing. Avoid reflecting arbitrary origins, and never combine wildcard origin with credential assumptions. Test simple requests, preflighted requests, and failures.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
origin_allowed = True
token_valid = True
order_permission = False
browser_may_share = origin_allowed; api_returns = 200 if token_valid and order_permission else 403
```

1. The API permits browser sharing with app.example.

   Changed values: `{"origin_allowed": true}`

2. The caller presents a valid token.

   Changed values: `{"token_valid": true}`

3. The authenticated subject still lacks access to order 42.

   Changed values: `{"order_permission": false}`

4. CORS passes while authorization correctly denies the object.

   Changed values: `{"browser_may_share": true, "api_returns": 403}`

[Full runnable example](examples/apis-microservices.py).

Limits: The browser model simplifies the Fetch Standard. Real simple requests may skip preflight; credentials, redirects, caches, exposed headers, opaque responses, service workers, cookies, CSRF, and framework behavior add detail. It makes no network calls.

## Explore (remaining exploration time)

Choose caller type, origin permission, and token validity. Watch browser sharing and server authorization as separate decisions.

Open apis-microservices.html for the executable model.

Model limits: The browser model simplifies the Fetch Standard. Real simple requests may skip preflight; credentials, redirects, caches, exposed headers, opaque responses, service workers, cookies, CSRF, and framework behavior add detail. It makes no network calls.

## Quiz (4 minutes)

1. CORS denies app.example. What does that establish?
   - A conforming browser will not share the response with that JavaScript
   - The API cannot be called by curl
   - The user is unauthenticated

2. What must still protect GET /orders/42?
   - Server-side authentication and object-level authorization
   - Access-Control-Allow-Origin alone
   - A JavaScript variable

3. Why can a preflight succeed but the API still return 403?
   - CORS and authorization answer different questions
   - OPTIONS logs the user in
   - 403 means the origin is always allowed

4. Which browser origins, methods, and headers should your most sensitive API actually allow?
5. How would you prove that curl cannot read order 42 without authorization even though curl ignores CORS?

<details><summary>Answer key — attempt first</summary>

1. A conforming browser will not share the response with that JavaScript. CORS is a browser response-sharing protocol.

2. Server-side authentication and object-level authorization. Non-browser clients bypass browser CORS enforcement.

3. CORS and authorization answer different questions. The browser may be allowed to make/read a request whose user lacks business permission.

</details>

## Sources

- [WHATWG Fetch Standard: CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) — Living standard; checked October 24, 2026; checked 2026-10-24.
- [WHATWG Fetch Standard: CORS-preflight fetch](https://fetch.spec.whatwg.org/#cors-preflight-fetch) — Living standard; checked October 24, 2026; checked 2026-10-24.
- [MDN CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — Living reference; checked October 24, 2026; checked 2026-10-24.
