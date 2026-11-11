# 103 can start preload—it is not the final response

APIs & Microservices · Day50 · 15 minutes

Use HTTP 103 Early Hints as speculative performance metadata without treating it as success.

## Recall (2 minutes)

<p><a href="../Day34/apis-microservices.html">Day34: CORS controls browser sharing; it is not API authorization</a></p><p>CORS denies app.example. What does that establish?</p><details><summary>Recall first, then reveal the refresher</summary><p>A conforming browser will not share the response with that JavaScript. CORS is a browser response-sharing protocol.</p></details><p><a href="../Day22/apis-microservices.html">Day22: One idempotency key, one create effect</a></p><p>Retry k-77 with the same payload. Correct outcome?</p><details><summary>Recall first, then reveal the refresher</summary><p>Return the stored result. The repeated intent maps to the original effect and response.</p></details>

## Understand (4 minutes)

A restaurant can tell you the bread is coming while the kitchen still decides whether the main dish is available.

HTTP 103 is an informational response. It can carry likely Link: rel=preload fields so a client starts fetching resources while the origin computes the final response. The client must still wait for and process the final status and headers independently.



An API-backed page sends 103 for /app.css at 20 ms, then discovers at 180 ms that the user is unauthorized and sends final 401. The stylesheet preload may have started; the application must not render authenticated content or mark the request successful.



## Read the visual

A time-scaled response lane puts the 103 before the final status, making speculative work and application outcome separate events.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use 103 when final response generation is slow but useful preload links are known early and clients/intermediaries handle informational responses correctly.

**Practical example.** A gateway emits a stylesheet preload while an upstream page request waits on a regional database.

**How to decide.** Measure actual latency benefit and client support. Skip 103 when the final headers arrive quickly, hints are unstable or sensitive, or HTTP/1.1 compatibility is uncertain.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
events=[{'ms':0,'status':'request'},{'ms':20,'status':103,'link':'/app.css'},{'ms':180,'status':401}]
preload_started=any(e.get('status')==103 for e in events)
final=next(e for e in events if isinstance(e.get('status'),int) and e['status']>=200)
result={'preload_started':preload_started,'application_status':final['status'],'success':200<=final['status']<300}
```

1. Create a response timeline.

   Changed values: `{"events": [{"ms": 0, "status": "request"}, {"ms": 20, "status": 103, "link": "/app.css"}, {"ms": 180, "status": 401}]}`

2. The hint may start speculative work.

   Changed values: `{"preload_started": true}`

3. Find the final, non-informational response.

   Changed values: `{"final": {"ms": 180, "status": 401}}`

4. Keep performance preparation separate from the application result.

   Changed values: `{"result": {"preload_started": true, "application_status": 401, "success": false}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model uses a simple timeline. It does not open HTTP connections, implement caching, browser preload rules, HTTP/2 or HTTP/3 framing, intermediary behavior, credential modes, content policy, or the RFC's cross-origin security considerations.

## Explore (remaining exploration time)

Change final status and hint timing. Predict what may start early and what remains undecided.

Open apis-microservices.html for the executable model.

Model limits: The model uses a simple timeline. It does not open HTTP connections, implement caching, browser preload rules, HTTP/2 or HTTP/3 framing, intermediary behavior, credential modes, content policy, or the RFC's cross-origin security considerations.

## Quiz (4 minutes)

1. A server sends 103, then final 401. What is the application result?
   - 401 Unauthorized
   - 103 success
   - 200 because preload started

2. Why send 103?
   - To let clients speculatively prepare, such as starting preloads
   - To replace final headers
   - To authenticate the user

3. When should a server be cautious?
   - When clients or HTTP/1.1 intermediaries may mishandle informational responses
   - When CSS exists
   - When the final response is 200

4. Which slow page or API response could know safe preload links before its final status?
5. How would you measure whether 103 improves user-visible latency rather than only network activity?

<details><summary>Answer key — attempt first</summary>

1. 401 Unauthorized. 103 is informational; the final response determines the outcome.

2. To let clients speculatively prepare, such as starting preloads. Hints can overlap resource fetch with origin work.

3. When clients or HTTP/1.1 intermediaries may mishandle informational responses. The RFC identifies compatibility and information-disclosure risks.

</details>

## Sources

- [RFC 8297: 103 Early Hints](https://www.rfc-editor.org/rfc/rfc8297.html) — IETF Experimental RFC; published December 2017; checked November 10, 2026; checked 2026-11-10.
- [HTTP Semantics: informational responses](https://www.rfc-editor.org/rfc/rfc9110.html#name-informational-1xx) — IETF Standards Track; foundation; checked 2026-11-10.
