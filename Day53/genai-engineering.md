# JSON Schema default documents a value—the harness must still insert it

GenAI engineering · Day53 · 15 minutes

Keep MCP tool validation, default materialization, and handler execution as three explicit harness stages.

## Recall (2 minutes)

<p><a href="../Day30/genai-engineering.html">Day30: Show the agent only the tools this run may use</a></p><p>Why hide delete_customer from a read-only run?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reduce authority exposure and selection errors. A smaller catalog narrows what the model can propose.</p></details><p><a href="../Day34/genai-engineering.html">Day34: A turn limit stops the loop; it does not make the loop useful</a></p><p>What counts as one SDK turn?</p><details><summary>Recall first, then reveal the refresher</summary><p>One model invocation, including any tool calls it requests. The runner defines a turn at the model-invocation boundary.</p></details>

## Understand (4 minutes)

A restaurant menu may say “standard spice: medium.” If you leave the spice box blank, the printed hint does not walk into the kitchen and fill the order.

MCP tool inputs use JSON Schema. In JSON Schema, default is an annotation: validation does not automatically add the property. A harness can deliberately materialize defaults before calling a handler, but that is application behavior and must be consistent across clients, logs, signatures, approvals, and retries.



The tool search-orders declares limit with default 10 but does not require it. The model sends {"customer":"c52"}. Validation can accept the object while limit is still absent. The harness either inserts 10 explicitly or the handler uses args.get("limit",10).



## Read the visual

A three-stage flow keeps schema annotation, accepted input, and resolved handler arguments separate so the insertion owner is visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit default materialization when several MCP clients call the same tool and the resolved arguments must be stable, observable, and reviewable.

**Practical example.** An order-search tool should cap omitted result limits at 10 before an expensive warehouse query runs.

**How to decide.** Prefer required fields for decisions the model must make. For safe convenience defaults, choose one owning layer, log original and resolved arguments, validate again if transformation can violate the schema, and never assume every JSON Schema validator mutates input.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
schema={'properties':{'limit':{'type':'integer','default':10}},'required':['customer']} ; args={'customer':'c52'}
valid='customer' in args; before=dict(args)
resolved={**args,'limit':args.get('limit',schema['properties']['limit']['default'])}
result={'valid':valid,'before':before,'handler_args':resolved,'inserted_by':'harness'}
```

1. Declare an optional limit annotation and omit it from the call.

   Changed values: `{"schema": {"properties": {"limit": {"type": "integer", "default": 10}}, "required": ["customer"]}, "args": {"customer": "c52"}}`

2. Validate the required customer without mutating arguments.

   Changed values: `{"valid": true, "before": {"customer": "c52"}}`

3. Let the harness deliberately materialize the annotation.

   Changed values: `{"resolved": {"customer": "c52", "limit": 10}}`

4. Preserve both original and resolved values for audit.

   Changed values: `{"result": {"valid": true, "before": {"customer": "c52"}, "handler_args": {"customer": "c52", "limit": 10}, "inserted_by": "harness"}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The local model uses one object and one default. It does not run an MCP client/server, JSON Schema validator, composition keywords, signatures, approval UI, retries, external references, schema-depth limits, or product-specific SDK behavior.

## Explore (remaining exploration time)

Omit or provide limit, then toggle harness materialization. Predict what the handler actually receives.

Open genai-engineering.html for the executable model.

Model limits: The local model uses one object and one default. It does not run an MCP client/server, JSON Schema validator, composition keywords, signatures, approval UI, retries, external references, schema-depth limits, or product-specific SDK behavior.

## Quiz (4 minutes)

1. limit has default 10 and is optional. The model omits it. What does JSON Schema validation do by itself?
   - It can accept the object without inserting limit
   - It always mutates the object to limit=10
   - It must reject the tool call

2. Why log both original and resolved arguments?
   - To distinguish the model's decision from harness policy
   - To hide default behavior
   - To bypass schema validation

3. When is a required property better than a default?
   - When the model or user must make an explicit consequential choice
   - When the field is harmless convenience
   - When every value is equivalent

4. Which harness layer currently owns default insertion, and is that behavior consistent across transports?
5. Which tool argument should become required because silently choosing it changes cost, scope, or authority?

<details><summary>Answer key — attempt first</summary>

1. It can accept the object without inserting limit. The default keyword is annotation metadata, not a required mutation step.

2. To distinguish the model's decision from harness policy. Auditing and evaluation need to know whether a value was supplied or inserted.

3. When the model or user must make an explicit consequential choice. Defaults can silently choose; consequential intent should remain explicit.

</details>

## Sources

- [JSON Schema annotations: default](https://json-schema.org/understanding-json-schema/reference/annotations) — JSON Schema documentation; checked November 13, 2026; checked 2026-11-13.
- [MCP 2026-07-28 release candidate: full JSON Schema 2020-12 for tools](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) — Official MCP blog; published July 28, 2026; checked November 13, 2026; checked 2026-11-13.
- [MCP Python SDK: low-level server schemas](https://py.sdk.modelcontextprotocol.io/advanced/low-level-server/) — Official SDK documentation; checked November 13, 2026; checked 2026-11-13.
