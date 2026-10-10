# Keep checkout, drop recommendations: design a tested degraded mode

Distinguished Engineer · Day20 · 15 minutes

Preserve the critical customer path when an optional dependency is slow.

## Recall (2 minutes)

<p><a href="../Day5/distinguished-engineer.html">Day5: Dependency isolation: spend concurrency by failure domain</a></p><p>A dependency&#x27;s latency rises tenfold while arrival rate stays fixed. What happens to its concurrency demand?</p><details><summary>Recall first, then reveal the refresher</summary><p>It rises roughly tenfold. Little&#x27;s Law links in-flight work to rate times time.</p></details><p><a href="../Day16/distinguished-engineer.html">Day16: Green before failure, red after: capacity for one-zone loss</a></p><p>At 120 requests/s and 60 capacity per AZ, what happens after one AZ is lost?</p><details><summary>Recall first, then reveal the refresher</summary><p>Each survivor reaches 100%. Two survivors each receive 60 requests/s, exactly their hard capacity.</p></details>

## Understand (4 minutes)

A restaurant can still serve dinner when the dessert printer breaks. If every meal waits for dessert, an optional feature became a critical dependency.

Graceful degradation keeps minimum useful service working while omitting optional work. Leaders must name the outcome that survives, acceptable quality loss, and evidence that the fallback was exercised.



Checkout calls payment, inventory, and recommendations. Recommendations rise from 80 ms to 4 seconds. Payment stays green, but checkout p99 becomes 4.2 seconds.

Contain with a 150 ms recommendation budget and omit that panel. Orders continue. Then repair the recommender and verify the fallback did not hide pricing, inventory, or payment errors.



## Read the visual

The architecture separates critical and optional branches; controls change only the optional branch and survival behavior.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when an optional dependency can consume a critical path’s latency or capacity budget.

**Practical example.** Return checkout confirmation without personalized recommendations after 150 ms.

**How to decide.** Degrade only acceptable quality. Do not hide corrupt prices, authorization failures, or data loss; those need fail-closed or explicit error behavior.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
requests=100
recommendation_ms=4000
fallback_tested=False
served_without_fallback=0 if recommendation_ms>150 else requests
fallback_tested=True
served_with_fallback=requests if fallback_tested else served_without_fallback
```

1. Start overloaded without tested fallback.

   Changed values: `{"requests": 100, "recommendation_ms": 4000, "fallback_tested": false}`

2. Optional latency blocks the toy path.

   Changed values: `{"served_without_fallback": 0}`

3. Tested omission preserves checkout.

   Changed values: `{"fallback_tested": true, "served_with_fallback": 100}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executed a Python decision model, not a capacity forecast.

## Explore (remaining exploration time)

Make recommendations slow and toggle fallback. Observe useful checkout.

Open distinguished-engineer.html for the executable model.

Model limits: The deterministic toy uses 100 requests and omits queues, retries, cohorts, regional failures, and correctness hazards.

## Quiz (4 minutes)

1. Recommendations take 4 seconds. First containment?
   - Wait
   - Bound call and omit them
   - Skip payment

2. Which can be misleadingly green?
   - Payment health
   - Checkout latency
   - Recommendation latency

3. Where not to degrade casually?
   - Recommendations
   - Price or authorization correctness
   - Decoration

4. Which platform dependency is optional during an incident?
5. What test proves degradation is safe?

<details><summary>Answer key — attempt first</summary>

1. Bound call and omit them. Bound the optional branch.

2. Payment health. Payment can be healthy while end-to-end checkout fails.

3. Price or authorization correctness. Incorrect critical decisions are unacceptable.

</details>

## Sources

- [Google SRE: cascading failures](https://sre.google/sre-book/addressing-cascading-failures/) — Foundation; checked 2026-10-10; checked 2026-10-10.
- [Google SRE: production service best practices](https://sre.google/sre-book/service-best-practices/) — Foundation; checked 2026-10-10; checked 2026-10-10.
