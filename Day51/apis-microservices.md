# Half-close ends your sends; cancel ends the gRPC call

APIs & Microservices · Day51 · 15 minutes

Distinguish finishing a client-stream from cancelling the RPC and its already-applied effects.

## Recall (2 minutes)

<p><a href="../Day29/apis-microservices.html">Day29: gRPC retries stop when response headers commit the RPC</a></p><p>When does gRPC consider the RPC committed for retry purposes?</p><details><summary>Recall first, then reveal the refresher</summary><p>When response headers are received. After response headers, no further automatic retries are attempted.</p></details><p><a href="../Day33/apis-microservices.html">Day33: The second DELETE may say 404 and still be idempotent</a></p><p>The first DELETE removed job 42, but its 204 response was lost. What can a retry return while remaining idempotent?</p><details><summary>Recall first, then reveal the refresher</summary><p>404 with job 42 still absent. Idempotence concerns intended effect, not identical response messages.</p></details>

## Understand (4 minutes)

Sealing an envelope says “I am done adding pages; please answer.” Tearing up the conversation says “stop now.”

In a client-streaming gRPC, the client sends multiple messages and then half-closes its send side. The server can finish reading and return one response. Cancellation is different: it terminates the RPC immediately. Changes already made before cancellation are not rolled back automatically.



A client streams quantities 3, 4, and 5 for order o-51. Half-close lets the server return total 12. If the client cancels after 3 and 4, the third message is not sent, and any database effect already committed for the first two messages needs its own transaction or compensation design.



## Read the visual

One stream forks into a half-close path that still receives a response and a cancel path that stops the RPC while exposing any already-committed subtotal.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use client streaming when one logical operation uploads an ordered sequence and the server should respond after the client finishes sending.

**Practical example.** Stream data-quality rule fragments, half-close the request stream, then receive one compiled validation result.

**How to decide.** Use unary RPC for small bounded payloads. For streaming side effects, define commit boundaries, idempotency, deadline, cancellation cleanup, and partial-progress semantics before choosing the protocol.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
messages=[3,4,5]; received=[]
received.extend(messages[:2]); subtotal=sum(received)
received.append(messages[2]); half_closed=True
result={'received':received,'half_closed':half_closed,'response_total':sum(received),'rpc_cancelled':False}
```

1. Prepare one logical client-streaming request.

   Changed values: `{"messages": [3, 4, 5], "received": []}`

2. The server reads the first two ordered messages.

   Changed values: `{"received": [3, 4], "subtotal": 7}`

3. Send the final message and half-close the client send side.

   Changed values: `{"received": [3, 4, 5], "half_closed": true}`

4. The server can finish and return one response after half-close.

   Changed values: `{"result": {"received": [3, 4, 5], "half_closed": true, "response_total": 12, "rpc_cancelled": false}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model uses a local list and integer sum. It does not open HTTP/2 streams, apply flow control, run generated stubs, deliver metadata/status, enforce deadlines, observe races, persist transactions, retry, or guarantee when a real server notices cancellation.

## Explore (remaining exploration time)

Choose half-close or cancel after two messages. Predict what the server may read, respond, and retain.

Open apis-microservices.html for the executable model.

Model limits: The model uses a local list and integer sum. It does not open HTTP/2 streams, apply flow control, run generated stubs, deliver metadata/status, enforce deadlines, observe races, persist transactions, retry, or guarantee when a real server notices cancellation.

## Quiz (4 minutes)

1. The client sent all chunks and wants the single server response. What should it do?
   - Half-close the send side and continue reading
   - Cancel the RPC
   - Open an unrelated unary call

2. Why is cancel not a rollback?
   - Effects committed before cancellation remain unless the application repairs them
   - gRPC stores a database transaction
   - Cancellation always retries

3. When is unary simpler?
   - When the request is small and bounded and one message fits
   - Whenever ordering matters
   - Whenever a deadline exists

4. Which client-streaming RPC lacks an explicit half-close and partial-progress contract?
5. What side effects could survive cancellation, and how would you reconcile them?

<details><summary>Answer key — attempt first</summary>

1. Half-close the send side and continue reading. Half-close signals no more request messages while the response can still arrive.

2. Effects committed before cancellation remain unless the application repairs them. The gRPC lifecycle does not undo application side effects.

3. When the request is small and bounded and one message fits. Streaming adds lifecycle and partial-progress semantics.

</details>

## Sources

- [gRPC core concepts and RPC lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/) — Official gRPC documentation; checked November 11, 2026; checked 2026-11-11.
- [gRPC cancellation guide](https://grpc.io/docs/guides/cancellation/) — Official gRPC guide; checked November 11, 2026; checked 2026-11-11.
- [gRPC C++ best practices](https://grpc.io/docs/languages/cpp/best_practices/) — Official guidance recommending client half-close; checked November 11, 2026; checked 2026-11-11.
