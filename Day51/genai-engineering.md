# Stateless MCP needs explicit application handles—not hidden sessions

GenAI engineering · Day51 · 15 minutes

Scale MCP 2026-07-28 across instances while keeping state visible in tool arguments.

## Recall (2 minutes)

<p><a href="../Day29/genai-engineering.html">Day29: Approve this exact tool call—not every future call</a></p><p>A human approved call_A for order 42. Does call_B for order 99 inherit it?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, it is a different call. Call-specific approval covers the inspected pending item.</p></details><p><a href="../Day33/genai-engineering.html">Day33: The model can use a database handle without ever seeing it</a></p><p>What does the SDK send to the LLM from the local context object automatically?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; local context is not sent to the LLM. The context object is for local code and dependencies.</p></details>

## Understand (4 minutes)

A coat-check ticket lets any attendant retrieve your coat. You do not need the same attendant to remember your face.

MCP 2026-07-28 removes the protocol session and Mcp-Session-Id. Each request is self-describing and may reach any server instance. If a tool needs application state across calls, return an explicit handle such as basket_id and require the model to pass it next time. The handle makes state part of the tool contract rather than invisible transport memory.



basket/create lands on instance A and returns b-51. basket/add lands on B with basket_id=b-51. B resolves the application record from the shared business store. Without the handle, B must reject the call; sticky routing is not the contract.



## Read the visual

Two interchangeable server instances connect through an explicit application handle; missing or wrong handles stop before state mutation.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit handles when a modern stateless MCP tool workflow spans calls but the business operation still needs durable application state.

**Practical example.** A data-quality agent creates a draft rule set, receives rule_set_id rs-51, then validates and publishes that exact draft through later tools on any server instance.

**How to decide.** Keep one-shot tools fully stateless. Mint opaque, authorized, expiring handles for multi-step workflows. Use the Tasks extension for durable asynchronous work rather than inventing a transport session.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
store={}; create_node='A'; basket_id='b-51'; store[basket_id]=[]
add_node='B'; call={'basket_id':basket_id,'item':'schema-rule'}
resolved=store.get(call['basket_id']); resolved.append(call['item']) if resolved is not None else None
result={'created_on':create_node,'continued_on':add_node,'basket_id':basket_id,'items':store[basket_id]}
```

1. Instance A creates application state and returns an explicit handle.

   Changed values: `{"store": {"b-51": []}, "create_node": "A", "basket_id": "b-51"}`

2. A later call may land on B and carries the handle as an ordinary argument.

   Changed values: `{"add_node": "B", "call": {"basket_id": "b-51", "item": "schema-rule"}}`

3. B resolves the business state by handle instead of transport affinity.

   Changed values: `{"store": {"b-51": ["schema-rule"]}, "resolved": ["schema-rule"]}`

4. The visible handle connects calls across instances.

   Changed values: `{"result": {"created_on": "A", "continued_on": "B", "basket_id": "b-51", "items": ["schema-rule"]}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The Python and browser models use one in-memory dictionary. They do not implement MCP transport, server/discover, _meta, authorization, tenant binding, opaque IDs, expiry, persistence, encryption, retries, concurrency, or the Tasks extension.

## Explore (remaining exploration time)

Route create and add calls to different instances. Remove or alter the handle and predict the result.

Open genai-engineering.html for the executable model.

Model limits: The Python and browser models use one in-memory dictionary. They do not implement MCP transport, server/discover, _meta, authorization, tenant binding, opaque IDs, expiry, persistence, encryption, retries, concurrency, or the Tasks extension.

## Quiz (4 minutes)

1. The second call reaches instance B with basket_id b-51. What makes continuation possible?
   - The explicit handle identifies application state
   - The removed MCP session ID
   - Sticky routing to A

2. Why is an explicit handle better than hidden transport state?
   - The model and harness can see, validate, authorize, and replay the state reference
   - It removes the need for authorization
   - It makes every operation synchronous

3. What must production add to b-51?
   - Tenant binding, authorization, expiry, and durable storage semantics
   - A predictable sequential integer only
   - A permanent browser cookie

4. Which state in your agent tools is still hidden in server memory?
5. How will you bind an explicit handle to tenant, actor, expiry, and allowed operations?

<details><summary>Answer key — attempt first</summary>

1. The explicit handle identifies application state. The handle is visible in the tool contract and can be resolved anywhere.

2. The model and harness can see, validate, authorize, and replay the state reference. Visible state references are easier to reason about and route.

3. Tenant binding, authorization, expiry, and durable storage semantics. An opaque identifier alone is not a security boundary.

</details>

## Sources

- [MCP 2026-07-28 specification announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — Official MCP release; published July 28, 2026; checked November 11, 2026; checked 2026-11-11.
- [MCP Go SDK protocol lifecycle](https://go.sdk.modelcontextprotocol.io/protocol/) — Official SDK reference for the stateless lifecycle; checked November 11, 2026; checked 2026-11-11.
