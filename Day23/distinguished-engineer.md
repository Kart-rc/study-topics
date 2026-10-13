# Let the new system observe production before production observes it

Distinguished Engineer · Day23 · 15 minutes

Use shadow traffic to compare a migration target without letting its responses affect customers.

## Recall (2 minutes)

<p><a href="../Day18/distinguished-engineer.html">Day18: Keep the reason, not just the verdict: architecture decision records</a></p><p>The requirement changes to 15 minutes. What follows immediately?</p><details><summary>Recall first, then reveal the refresher</summary><p>Start a review; ADR-8 is not accepted yet. An assumption change is evidence for review. It neither evaluates alternatives nor accepts a replacement.</p></details><p><a href="../Day20/distinguished-engineer.html">Day20: Keep checkout, drop recommendations: design a tested degraded mode</a></p><p>Recommendations take 4 seconds. First containment?</p><details><summary>Recall first, then reveal the refresher</summary><p>Bound call and omit them. Bound the optional branch.</p></details>

## Understand (4 minutes)

A trainee can prepare every restaurant order beside the chef while only the chef’s plate reaches the customer. You learn from real demand without exposing the trainee’s mistakes.

Shadowing copies requests to the new path. The old path still owns the response. Compare outputs, latency, errors, and side effects before moving real traffic.



The legacy pricing API returns $25 for request r-23. The new API returns $27. Customers still receive $25. The mismatch becomes evidence to investigate, not an accidental rollout.



## Read the visual

The request forks, but only the upper legacy arrow reaches the customer. The lower box turns red when effects are live, revealing the central migration boundary.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use shadowing when a replacement can process representative production inputs safely and you need evidence beyond synthetic tests.

**Practical example.** Run a new lineage parser beside the existing parser and compare emitted edges without publishing the candidate graph.

**How to decide.** Shadow read-only or isolated behavior first. If the candidate can trigger payments, emails, writes, or quotas, stub or redirect those effects before copying traffic.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
request={"id":"r-23","sku":"A"}
legacy={"price":25}
shadow={"price":27}
customer_response=legacy
diff={k:(legacy.get(k),shadow.get(k)) for k in legacy if legacy.get(k)!=shadow.get(k)}
decision="INVESTIGATE" if diff else "EVIDENCE_OK"
```

1. Record one request and both outputs.

   Changed values: `{"request": {"id": "r-23", "sku": "A"}, "legacy": {"price": 25}, "shadow": {"price": 27}}`

2. Keep legacy authoritative while computing differences.

   Changed values: `{"customer_response": {"price": 25}, "diff": {"price": [25, 27]}}`

3. Turn disagreement into migration evidence, not customer exposure.

   Changed values: `{"decision": "INVESTIGATE"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executed local Python over synthetic responses. It did not mirror network traffic or isolate real side effects.

## Explore (remaining exploration time)

Toggle whether candidate side effects are isolated, then compare a matching and mismatching response.

Open distinguished-engineer.html for the executable model.

Model limits: Shadowing does not test customer-visible behavior, writes, long-term state, authorization differences, or full load unless explicitly designed. Duplicating traffic can add cost and privacy risk.

## Quiz (4 minutes)

1. Shadow returns $27; legacy returns $25. What sees the customer?
   - $27
   - $25
   - Both

2. What must be isolated before shadowing a create call?
   - Side effects
   - Metrics
   - Request IDs

3. What does a perfect shadow comparison not prove?
   - Candidate handled observed inputs
   - Customer-visible cutover and stateful writes are safe
   - Outputs matched

4. Which side effect makes one of your services unsafe to shadow today?
5. What mismatch rate and categories would justify a cutover decision?

<details><summary>Answer key — attempt first</summary>

1. $25. The legacy path still owns the response.

2. Side effects. Copied writes can duplicate real-world actions.

3. Customer-visible cutover and stateful writes are safe. Shadowing deliberately omits some production effects.

</details>

## Sources

- [AWS SageMaker shadow tests](https://docs.aws.amazon.com/sagemaker/latest/dg/shadow-tests.html) — Living documentation; checked 2026-10-13.
- [AWS CloudFront zero-downtime API migration](https://aws.amazon.com/blogs/migration-and-modernization/migrating-and-decomposing-apis-with-zero-downtime-using-cloudfront/) — Published 2026; checked 2026-10-13.
