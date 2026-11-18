# traceparent joins spans across services—it does not authenticate the caller

APIs & Microservices · Day57 · 15 minutes

Propagate a valid W3C trace context for correlation while keeping authorization tied to independently verified identity.

## Recall (2 minutes)

<p><a href="../Day32/apis-microservices.html">Day32: Wait for ready, but never wait past the deadline</a></p><p>Ready at 3s, deadline at 5s, Wait-for-Ready enabled. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>The RPC sends with about 2s remaining. The call waits, but the original deadline keeps counting.</p></details><p><a href="../Day36/apis-microservices.html">Day36: OpenAPI readOnly and writeOnly describe direction; they do not authorize</a></p><p>password is writeOnly in the schema. What guarantees it is absent from responses?</p><details><summary>Recall first, then reveal the refresher</summary><p>Server-side serialization and tests, not the annotation alone. The specification treats it as an annotation.</p></details>

## Understand (4 minutes)

A luggage tag helps several airports recognize the same journey. It does not prove the person carrying the suitcase is the passenger named on a passport.

The W3C traceparent header carries a version, trace ID, parent ID, and trace flags. A service extracts a valid context, creates its own child span, and injects the new context on the next call. That joins gateway, orders, and inventory work into one trace. The header is caller-controlled telemetry input. It can be malformed, sampled or unsampled, and may have privacy implications. Authentication and authorization must use trusted security credentials—not a trace ID.



Gateway receives trace 57aa… and a valid bearer identity for tenant red. It creates span gw57, then sends the same trace ID with a new parent ID to orders. Orders correlates the spans but still authorizes tenant red from the bearer token. If the token is absent, the shared trace must not grant access.



## Read the visual

Two parallel decisions show a trace continuing across gateway and orders while authorization independently allows or denies the same request.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use W3C Trace Context when HTTP or gRPC calls cross service boundaries and you need one end-to-end latency and error trace.

**Practical example.** API Gateway, an orders service, and an inventory service propagate trace context while OpenTelemetry correlates spans and logs.

**How to decide.** Use a standard propagator, validate or replace malformed incoming context, generate new span IDs per hop, apply sampling policy deliberately, avoid secrets in tracestate, and keep security identity in the authorization layer.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
incoming='00-'+'57'*16+'-'+'ab'*8+'-01'; bearer_tenant=None
parts=incoming.split('-'); trace_valid=(len(parts)==4 and len(parts[1])==32 and len(parts[2])==16)
trace_id=parts[1] if trace_valid else '99'*16; authorized=(bearer_tenant=='red')
result={'trace_joined':trace_valid,'trace_id_prefix':trace_id[:4],'authorized':authorized,'decision':'deny' if not authorized else 'allow'}
```

1. Receive valid-looking trace context without a security principal.

   Changed values: `{"incoming": "00-57575757575757575757575757575757-abababababababab-01", "bearer_tenant": null}`

2. Apply a deliberately simplified shape check.

   Changed values: `{"parts": ["00", "57575757575757575757575757575757", "abababababababab", "01"], "trace_valid": true}`

3. Continue correlation independently from authorization.

   Changed values: `{"trace_id": "57575757575757575757575757575757", "authorized": false}`

4. Deny access even though trace correlation succeeds.

   Changed values: `{"result": {"trace_joined": true, "trace_id_prefix": "5757", "authorized": false, "decision": "deny"}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model checks a simplified header shape and one authorization boolean. It does not implement the full W3C grammar, all-zero checks, tracestate limits, sampling propagation, baggage, OpenTelemetry SDK behavior, cryptographic identity, privacy policy, proxies, message queues, gRPC metadata, or trace-backend storage.

## Explore (remaining exploration time)

Keep traceparent valid while removing authorization, then make traceparent malformed while keeping authorization. Predict correlation and access separately.

Open apis-microservices.html for the executable model.

Model limits: The model checks a simplified header shape and one authorization boolean. It does not implement the full W3C grammar, all-zero checks, tracestate limits, sampling propagation, baggage, OpenTelemetry SDK behavior, cryptographic identity, privacy policy, proxies, message queues, gRPC metadata, or trace-backend storage.

## Quiz (4 minutes)

1. A request has a valid traceparent but no valid credential. What should orders do?
   - Keep or record trace context as policy allows, but deny the request
   - Authorize because the trace ID is valid
   - Replace authorization with tracestate

2. What changes at each service hop?
   - The parent/span ID while the trace ID continues
   - The trace ID must always change
   - The bearer principal becomes the trace ID

3. What should a service do with malformed incoming context?
   - Follow propagator policy, commonly reject that context and start a new valid root—not trust it
   - Grant access
   - Copy it unchanged into credentials

4. Where does your platform currently lose trace context between HTTP, Kafka, and Spark boundaries?
5. Which telemetry fields could leak tenant or user information if copied into tracestate or baggage?

<details><summary>Answer key — attempt first</summary>

1. Keep or record trace context as policy allows, but deny the request. Correlation metadata is not caller identity.

2. The parent/span ID while the trace ID continues. Child spans share a trace but have their own span identities.

3. Follow propagator policy, commonly reject that context and start a new valid root—not trust it. Untrusted telemetry input needs validation and bounded handling.

</details>

## Sources

- [W3C Trace Context](https://www.w3.org/TR/trace-context/) — W3C Recommendation and current publication page; checked November 17, 2026; checked 2026-11-17.
- [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/) — Official OpenTelemetry documentation; checked November 17, 2026; checked 2026-11-17.
- [OpenTelemetry Propagators API](https://opentelemetry.io/docs/specs/otel/context/api-propagators/) — Official OpenTelemetry specification; checked November 17, 2026; checked 2026-11-17.
