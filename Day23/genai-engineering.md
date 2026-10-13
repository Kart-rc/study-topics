# Return “input required,” then retry the same tool call

GenAI engineering · Day23 · 15 minutes

Understand MCP multi-round-trip requests without hidden transport session state.

## Recall (2 minutes)

<p><a href="../Day18/genai-engineering.html">Day18: Reset the world between trials: isolate agent evaluations</a></p><p>B does nothing but inherits A’s correct report. What does the naive grader say?</p><details><summary>Recall first, then reveal the refresher</summary><p>Pass. An existence/content-only grader sees the old correct file and passes. It has no provenance information.</p></details><p><a href="../Day20/genai-engineering.html">Day20: A tool call is a proposal: validate before the handler</a></p><p>dataset missing. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Validation error before handler. The effect target is ambiguous.</p></details>

## Understand (4 minutes)

A clerk pauses an application and hands back a numbered form for the missing signature. You return the signed form with the same case number.

In MCP 2026-07-28, a server can return input_required with requests and opaque requestState. The client fulfills them and retries the original method with inputResponses.



book_table(date=Friday) lacks party size. The server returns an elicitation plus state s23. The client asks the user, receives 4, and retries the same tool call with that answer and state. The server then returns the final booking.



## Read the visual

The sequence diagram shows the original call returning rather than holding a stream. State and answers visibly travel back on the retry.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use MRTR when a tool, prompt, or resource needs user input, sampling, or roots during one logical operation over a stateless protocol.

**Practical example.** A booking tool requests party size only after checking that Friday has availability.

**How to decide.** Use explicit input-required rounds for protocol-visible interaction. Use a separate durable task when work is long-running, and never auto-answer sensitive elicitation without user-facing policy.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
request={"method":"tools/call","args":{"date":"Friday"}}
first={"resultType":"input_required","requestState":"s23","inputRequests":{"party_size":"elicit"}}
retry={**request,"inputResponses":{"party_size":4},"requestState":first["requestState"]}
final={"resultType":"final","booking_id":"b-900"} if retry["inputResponses"]["party_size"] else None
```

1. Create the initial tool call.

   Changed values: `{"request": {"method": "tools/call", "args": {"date": "Friday"}}}`

2. Server returns explicit continuation state and a requested input.

   Changed values: `{"first": {"resultType": "input_required", "requestState": "s23", "inputRequests": {"party_size": "elicit"}}}`

3. Client retries the original call with the answer and state.

   Changed values: `{"retry": {"method": "tools/call", "args": {"date": "Friday"}, "inputResponses": {"party_size": 4}, "requestState": "s23"}}`

4. Server produces the final result.

   Changed values: `{"final": {"resultType": "final", "booking_id": "b-900"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executed local Python over synthetic protocol dictionaries. It did not use an MCP SDK or contact a server.

## Explore (remaining exploration time)

Step through initial call, input-required result, user response, and retry. Watch what the server must carry explicitly.

Open genai-engineering.html for the executable model.

Model limits: The model omits protocol negotiation, cancellation, max-round limits, authentication, sensitive-field UI, errors, and SDK-specific callback behavior.

## Quiz (4 minutes)

1. What does the client retry after fulfilling input?
   - A new unrelated method
   - The original request with inputResponses and requestState
   - Only a websocket

2. Why echo opaque requestState?
   - To expose secrets to the model
   - To carry server continuation state explicitly
   - To replace authentication

3. When is MRTR the wrong mechanism?
   - One missing user parameter
   - A long-running durable job needing independent lifecycle
   - One sampling request

4. Which of your tools currently hides continuation state in a session?
5. What elicitation must always stop for explicit user review?

<details><summary>Answer key — attempt first</summary>

1. The original request with inputResponses and requestState. MRTR continues one logical operation by retrying the original request.

2. To carry server continuation state explicitly. The stateless transport does not hide continuation state.

3. A long-running durable job needing independent lifecycle. Durable asynchronous work belongs in a task lifecycle.

</details>

## Sources

- [MCP 2026-07-28 release](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Published 2026-07-28; checked 2026-10-13.
- [MCP TypeScript SDK support for 2026-07-28](https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28) — Current v2 docs; checked 2026-10-13.
