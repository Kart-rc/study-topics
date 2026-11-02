# Ask for missing input without turning secrets into chat fields

GenAI engineering · Day43 · 15 minutes

Use MCP elicitation modes so a tool can pause for user input while the client controls consent and sensitive data stays out of in-band forms.

## Recall (2 minutes)

<p><a href="../Day25/genai-engineering.html">Day25: Compare candidates on the same cases</a></p><p>Why run A and B on the same cases?</p><details><summary>Recall first, then reveal the refresher</summary><p>To remove case-mix difficulty as an explanation. Pairing controls which scenario each candidate sees.</p></details><p><a href="../Day29/genai-engineering.html">Day29: Approve this exact tool call—not every future call</a></p><p>A human approved call_A for order 42. Does call_B for order 99 inherit it?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, it is a different call. Call-specific approval covers the inspected pending item.</p></details>

## Understand (4 minutes)

A clerk can ask for your delivery date on a form. They should send you to the payment terminal for a card secret instead of writing it on that form.

In MCP 2026-07-28, a server can return input_required during a request. The client displays an elicitation, the user may accept, decline, or cancel, and the client retries the original call with inputResponses. Form mode collects flat structured non-secret input. URL mode moves sensitive interaction out of band.



A shipping tool needs a delivery date: form mode requests a date and lets the user review it. A payment step needs credentials: URL mode displays the target host and asks before navigation. If the user declines, the harness must stop or choose a non-sensitive alternative; it must not fabricate an answer.



## Read the visual

The replay shows the stateless pause-and-retry boundary and makes the sensitive-data path visibly different from a normal form.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use elicitation when a tool discovers missing information mid-call and the user—not the model—must supply or authorize it.

**Practical example.** A fulfillment MCP tool has the order ID but needs a delivery window; a separate payment service needs sensitive authorization.

**How to decide.** Use a form only for reviewable non-secret primitive fields. Use URL mode for passwords, tokens, payment credentials, or sensitive authorization. Require the client capability and handle decline/cancel as normal outcomes.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
request={'method':'tools/call','name':'ship','arguments':{'order_id':'O-42'}}
result={'resultType':'input_required','inputRequests':[{'method':'elicitation/create','params':{'mode':'form','message':'Choose delivery date'}}]}
input_response={'action':'accept','content':{'date':'2026-11-05'}}
retry={**request,'inputResponses':[input_response]}; outcome='retry original call'
```

1. The original call has an order but no delivery date.

   Changed values: `{"request": {"method": "tools/call", "name": "ship", "arguments": {"order_id": "O-42"}}}`

2. The server returns a structured request for user input.

   Changed values: `{"result": {"resultType": "input_required", "inputRequests": [{"method": "elicitation/create", "params": {"mode": "form", "message": "Choose delivery date"}}]}}`

3. The client records an explicit reviewed response.

   Changed values: `{"input_response": {"action": "accept", "content": {"date": "2026-11-05"}}}`

4. The client retries the same operation with the response attached.

   Changed values: `{"retry": {"method": "tools/call", "name": "ship", "arguments": {"order_id": "O-42"}, "inputResponses": [{"action": "accept", "content": {"date": "2026-11-05"}}]}, "outcome": "retry original call"}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model is a local replay of the 2026-07-28 protocol shape. It does not implement an MCP transport, capability negotiation, schema validation, browser navigation, origin verification, OAuth, retries, or server-side state.

## Explore (remaining exploration time)

Switch between a delivery date and a payment credential, then accept or decline. Watch where data travels and whether the original tool call may retry.

Open genai-engineering.html for the executable model.

Model limits: The model is a local replay of the 2026-07-28 protocol shape. It does not implement an MCP transport, capability negotiation, schema validation, browser navigation, origin verification, OAuth, retries, or server-side state.

## Quiz (4 minutes)

1. A tool needs an API key. Which elicitation mode fits?
   - URL mode
   - Form mode with a password field
   - Put it in the model prompt

2. Why does the client retry the original request after acceptance?
   - MRTR returns input_required instead of holding a bidirectional stream open
   - The server has already completed the side effect
   - The model must guess the answer first

3. The user declines a delivery-date form. What should the harness do?
   - Treat decline as a normal outcome and stop or offer an alternative
   - Invent tomorrow's date
   - Retry forever

4. Which tools in your harness currently guess missing user input instead of eliciting it?
5. Which requested values must never cross the in-band form path?

<details><summary>Answer key — attempt first</summary>

1. URL mode. The specification forbids form mode for credentials and requires the out-of-band URL path.

2. MRTR returns input_required instead of holding a bidirectional stream open. The answer is attached as inputResponses to the retried request.

3. Treat decline as a normal outcome and stop or offer an alternative. Consent is part of the protocol outcome, not an error to bypass.

</details>

## Sources

- [MCP 2026-07-28 specification: Elicitation](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/client/elicitation.mdx) — Official specification; checked November 2, 2026; checked 2026-11-02.
- [MCP 2026-07-28 release notes](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Official release notes; published July 28, 2026; checked November 2, 2026; checked 2026-11-02.
