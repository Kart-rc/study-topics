# One trace ID joins the call path; it does not authenticate it

APIs & Microservices · Day24 · 15 minutes

Read and propagate W3C traceparent while keeping tracing separate from authentication and authorization.

## Recall (2 minutes)

<p><a href="../Day15/apis-microservices.html">Day15: One clock across the call chain: gRPC deadlines</a></p><p>After 120 ms of a 500 ms deadline, what budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>380 ms remaining. The original end-to-end promise has 380 ms left.</p></details><p><a href="../Day19/apis-microservices.html">Day19: Verify the exact webhook bytes before parsing</a></p><p>Body changes from amount 50 to 500 but header stays the same. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>HMAC mismatch. The secret-backed digest covers the payload bytes; changing them invalidates the old header.</p></details>

## Understand (4 minutes)

A baggage tag lets airport staff follow one suitcase across flights. It does not prove the person carrying it owns the suitcase. A trace ID similarly joins spans across services; it is correlation context, not identity or permission.

A traceparent carries version, trace ID, parent span ID and flags. Each receiving service keeps the trace ID, creates its own span ID, and passes that new parent onward. Invalid or unsafe input must be handled deliberately.



Gateway, Orders and Payment share trace ID 4bf9…. Orders records Gateway's span as parent, creates span b7ad…, and sends that as Payment's parent. JWT validation and authorization still happen independently.



## Read the visual

The first three boxes share correlation context, while the authorization box changes independently. This makes the non-authentication boundary visible rather than burying it in prose.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use Trace Context across synchronous and asynchronous service boundaries to correlate latency, errors and retries.

**Practical example.** Find whether a slow checkout spent time in the gateway, Orders, Payment or a downstream database.

**How to decide.** Propagate valid context through trusted instrumentation, create a new span per operation, and keep auth decisions on verified credentials. Apply sampling, privacy and abuse controls at trust boundaries.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
traceparent='00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
parts=traceparent.split('-')
version,trace_id,parent_span_id,flags=parts
valid=(len(trace_id)==32 and int(trace_id,16)!=0 and len(parent_span_id)==16 and int(parent_span_id,16)!=0)
orders_span_id='b7ad6b7169203331'
outgoing=f'{version}-{trace_id}-{orders_span_id}-{flags}'
authorized=False
```

1. Split version, trace ID, parent span ID and flags.

   Changed values: `{"traceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01", "parts": ["00", "4bf92f3577b34da6a3ce929d0e0e4736", "00f067aa0ba902b7", "01"]}`

2. Check essential identity constraints for this known version.

   Changed values: `{"version": "00", "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736", "parent_span_id": "00f067aa0ba902b7", "flags": "01", "valid": true}`

3. Create a child span while keeping authorization separate.

   Changed values: `{"orders_span_id": "b7ad6b7169203331", "outgoing": "00-4bf92f3577b34da6a3ce929d0e0e4736-b7ad6b7169203331-01", "authorized": false}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executed local string parsing with a simplified validator. Production libraries must implement the full specification, limits, forwarding, sampling and security guidance.

## Explore (remaining exploration time)

Toggle a valid versus all-zero trace ID and compare propagation with authentication status.

Open apis-microservices.html for the executable model.

Model limits: This browser validates only a tiny subset of the traceparent grammar. It does not create telemetry, enforce trust boundaries, sample traces, verify signatures or authorize requests.

## Quiz (4 minutes)

1. What stays the same across spans in one distributed trace?
   - span ID
   - trace ID
   - service name

2. Can a valid traceparent authorize a payment?
   - Yes
   - No
   - Only if sampled

3. An all-zero trace ID is received. What does the W3C format say?
   - It is invalid
   - It is an admin trace
   - It means success

4. At which ingress boundaries will you accept, replace or annotate incoming trace context?
5. Which credentials—not trace headers—authorize the downstream call?

<details><summary>Answer key — attempt first</summary>

1. trace ID. The shared trace ID correlates the path; each span has its own ID.

2. No. Trace context is observability metadata, not an authenticated principal.

3. It is invalid. All-zero trace and parent IDs are forbidden by the format.

</details>

## Sources

- [W3C Trace Context Recommendation](https://www.w3.org/TR/trace-context/) — W3C Recommendation, November 23, 2021; checked 2026-10-14.
- [OpenTelemetry context propagation](https://opentelemetry.io/docs/concepts/context-propagation/) — Official documentation; checked 2026-10-14.
