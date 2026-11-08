# gRPC metadata rides beside the messages—not inside the protobuf contract

APIs & Microservices · Day48 · 15 minutes

Place call-wide authentication and tracing in metadata while keeping business data in typed messages.

## Recall (2 minutes)

<p><a href="../Day33/apis-microservices.html">Day33: The second DELETE may say 404 and still be idempotent</a></p><p>The first DELETE removed job 42, but its 204 response was lost. What can a retry return while remaining idempotent?</p><details><summary>Recall first, then reveal the refresher</summary><p>404 with job 42 still absent. Idempotence concerns intended effect, not identical response messages.</p></details><p><a href="../Day21/apis-microservices.html">Day21: Retry-After is a floor, not a synchronized alarm clock</a></p><p>Retry-After: 3. Is a retry at second 1 compliant with the advice?</p><details><summary>Recall first, then reveal the refresher</summary><p>No. The field asks the client to wait.</p></details>

## Understand (4 minutes)

A shipping box contains the product; labels on the outside carry routing and handling information. gRPC metadata is a call-associated side channel implemented with HTTP/2 headers and trailers.

Client metadata and initial server headers arrive before messages. Server trailers close the RPC and can carry call-wide facts. Business fields that must be typed, versioned, stored, or processed per message belong in protobuf messages instead.



A streaming ingestion RPC sends an authorization credential and trace context before the first record. Ten typed Event messages follow. The server closes with status and a trailer containing modeled query cost. Putting customer_id only in metadata would hide a business invariant from the message schema.



## Read the visual

A three-stage RPC timeline places initial metadata before messages and trailers after them. Moving candidate fields teaches availability and schema ownership.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use metadata for call-wide cross-cutting context such as authentication credentials, tracing, routing hints, or final diagnostic facts.

**Practical example.** A Kafka bridge opens one gRPC stream with trace context in headers and receives final server utilization in trailers.

**How to decide.** Keep values small, non-secret in logs, and call-scoped. Use protobuf fields when each message owns the value, consumers need typed evolution, or the value affects business semantics.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
timeline=[]; timeline.append(('initial_metadata',{'traceparent':'00-abc-def-01'}))
timeline.append(('messages',[{'event_id':1},{'event_id':2}]))
timeline.append(('trailers',{'query-cost':'7','grpc-status':'0'}))
result={'order':[stage for stage,_ in timeline]}
```

1. Send call-wide trace context before request data.

   Changed values: `{"timeline": [["initial_metadata", {"traceparent": "00-abc-def-01"}]]}`

2. Keep per-event business facts in typed messages.

   Changed values: `{"timeline": [["initial_metadata", {"traceparent": "00-abc-def-01"}], ["messages", [{"event_id": 1}, {"event_id": 2}]]]}`

3. Return final call facts when the server closes.

   Changed values: `{"timeline": [["initial_metadata", {"traceparent": "00-abc-def-01"}], ["messages", [{"event_id": 1}, {"event_id": 2}]], ["trailers", {"query-cost": "7", "grpc-status": "0"}]]}`

4. The ordered stages make availability explicit.

   Changed values: `{"result": {"order": ["initial_metadata", "messages", "trailers"]}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The browser models ordering only. It does not open HTTP/2, encode HPACK, enforce the suggested 8 KiB request-header limit, implement interceptors, binary metadata, deadlines, status details, proxies, or language-specific APIs.

## Explore (remaining exploration time)

Move a candidate field among initial metadata, message, and trailing metadata; predict its availability over the RPC timeline.

Open apis-microservices.html for the executable model.

Model limits: The browser models ordering only. It does not open HTTP/2, encode HPACK, enforce the suggested 8 KiB request-header limit, implement interceptors, binary metadata, deadlines, status details, proxies, or language-specific APIs.

## Quiz (4 minutes)

1. Where should per-event customer_id live?
   - In each typed protobuf message
   - Only in final trailers
   - Only in server logs

2. When do server trailers arrive?
   - When the server closes the RPC, after message data
   - Before the client request
   - Inside every protobuf field

3. What is metadata best for?
   - Small call-wide cross-cutting context
   - Large business payloads
   - Replacing protobuf evolution

4. Which field in your APIs is currently metadata but really belongs to the business message?
5. Which trailer would improve diagnostics without becoming a hidden contract?

<details><summary>Answer key — attempt first</summary>

1. In each typed protobuf message. It is business data owned by each event.

2. When the server closes the RPC, after message data. Trailers communicate final call information and status.

3. Small call-wide cross-cutting context. Metadata accompanies the call; it is not the application schema.

</details>

## Sources

- [gRPC metadata guide](https://grpc.io/docs/guides/metadata/) — Official gRPC documentation; checked November 8, 2026; checked 2026-11-08.
- [gRPC HTTP/2 protocol](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md) — Official gRPC protocol documentation; checked November 8, 2026; checked 2026-11-08.
