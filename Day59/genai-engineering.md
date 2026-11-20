# Use form elicitation for preferences; send secrets to a URL flow

GenAI engineering · Day59 · 15 minutes

Keep passwords, API keys, payments, and OAuth credentials out of MCP form responses and model context.

## Recall (2 minutes)

<p><a href="../Day33/genai-engineering.html">Day33: The model can use a database handle without ever seeing it</a></p><p>What does the SDK send to the LLM from the local context object automatically?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; local context is not sent to the LLM. The context object is for local code and dependencies.</p></details><p><a href="../Day37/genai-engineering.html">Day37: Approval allows a tool call; an idempotency key prevents duplicate effects</a></p><p>The approved refund times out after the processor may have committed. Safe retry?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only with the same approved arguments and a destination-enforced stable idempotency key. Approval is permission; the destination key handles duplicate delivery.</p></details>

## Understand (4 minutes)

A waiter can ask “window or aisle?” at the table. A credit-card PIN belongs in the bank's secure terminal, not spoken into the dining room.

MCP form elicitation returns structured, non-sensitive answers through the client and into the tool conversation. Sensitive information must use URL mode or another out-of-band flow. In the 2026-07-28 lifecycle, the request can arrive through multi-round-trip input-required flow, but the security boundary remains: form content is in-band.



Tool deploy59 asks for region and maintenance window in a form. When it needs cloud authorization, it returns a trusted HTTPS URL. The harness shows the destination, waits for completion, and never copies the credential into form JSON.



## Read the visual

Two input paths diverge before collection: a region enters the visible form, while the API key leaves through a labeled trusted-URL boundary.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use elicitation when a long-running tool needs a small user decision it cannot infer safely.

**Practical example.** A deployment tool asks for region in form mode, then opens the organization's OAuth approval URL.

**How to decide.** Classify every requested field. Use form only for non-sensitive structured data. Validate URL origin, explain the transition, require explicit user action, and bind completion to the original request.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
requests=[('region','non_sensitive'),('api_key','sensitive')]
routes={'non_sensitive':'form','sensitive':'url'}
decisions={name:routes[kind] for name,kind in requests}
result={'region':decisions['region'],'api_key':decisions['api_key'],'secret_in_form':False}
```

1. Classify requested fields before choosing a channel.

   Changed values: `{"requests": [["region", "non_sensitive"], ["api_key", "sensitive"]]}`

2. Define the in-band and out-of-band routes.

   Changed values: `{"routes": {"non_sensitive": "form", "sensitive": "url"}}`

3. Route each value by sensitivity.

   Changed values: `{"decisions": {"region": "form", "api_key": "url"}}`

4. Confirm the secret never enters form content.

   Changed values: `{"result": {"region": "form", "api_key": "url", "secret_in_form": false}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The model classifies two fields. It does not implement MCP transport, MRTR, URL-origin policy, OAuth, phishing defense, callback binding, client capability negotiation, or secret storage.

## Explore (remaining exploration time)

Classify a region choice and an API key. Watch the harness route one in-band and one out-of-band.

Open genai-engineering.html for the executable model.

Model limits: The model classifies two fields. It does not implement MCP transport, MRTR, URL-origin policy, OAuth, phishing defense, callback binding, client capability negotiation, or secret storage.

## Quiz (4 minutes)

1. Where should an API key be entered?
   - A trusted URL or out-of-band secure flow
   - Form elicitation
   - The model prompt

2. Why is region suitable for a form?
   - It is a non-sensitive structured preference
   - It is always a password
   - It bypasses validation

3. What must the harness still verify for URL mode?
   - Destination/origin, user intent, and binding to the pending request
   - Only the button color
   - Nothing

4. Which inputs in your harness are currently sensitive but in-band?
5. How will a user verify the URL destination before continuing?

<details><summary>Answer key — attempt first</summary>

1. A trusted URL or out-of-band secure flow. Secrets must not travel through form mode.

2. It is a non-sensitive structured preference. Form mode is designed for bounded non-sensitive input.

3. Destination/origin, user intent, and binding to the pending request. Out-of-band does not automatically mean trustworthy.

</details>

## Sources

- [MCP TypeScript SDK: Elicitation](https://ts.sdk.modelcontextprotocol.io/v2/servers/elicitation) — Official MCP SDK documentation; checked November 19, 2026; checked 2026-11-19.
- [MCP 2026-07-28 specification release](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Official MCP project release; published July 28, 2026; checked November 19, 2026; checked 2026-11-19.
