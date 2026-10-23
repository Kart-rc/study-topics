# A shared quota is a shared failure domain

Distinguished Engineer · Day33 · 15 minutes

Expose which teams can exhaust the same finite platform limit.

## Recall (2 minutes)

<p><a href="../Day20/distinguished-engineer.html">Day20: Keep checkout, drop recommendations: design a tested degraded mode</a></p><p>Recommendations take 4 seconds. First containment?</p><details><summary>Recall first, then reveal the refresher</summary><p>Bound call and omit them. Bound the optional branch.</p></details><p><a href="../Day24/distinguished-engineer.html">Day24: A migration ends when the old path can be removed</a></p><p>New-system traffic is 100%, but one old dependency remains. Decision?</p><details><summary>Recall first, then reveal the refresher</summary><p>Keep and move the dependency. Cutover percentage alone does not prove removability.</p></details>

## Understand (4 minutes)

Three apartments can share one electrical breaker. Each apartment looks healthy until their combined load trips the breaker and everyone goes dark.

A cloud quota works the same way. If unrelated workloads share one account, Region, NAT gateway, API burst pool, or database connection ceiling, one workload can consume another's safety margin.



The account allows 1,000 concurrent jobs. Finance normally uses 350 and ML uses 300, leaving 350 spare. A retraining surge pushes ML to 750. Total demand becomes 1,100; the shared ceiling rejects 100 jobs, and the failure crosses team boundaries.



## Read the visual

Separate bars show each tenant's demand against one denominator, so the shared coupling is visible instead of hidden inside a single percentage.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use quota failure-domain analysis when multiple critical workloads share an account, Region, network path, control plane, or managed-service limit.

**Practical example.** Two data platforms share one regional API quota; an ML backfill can throttle finance ingestion.

**How to decide.** Monitor aggregate headroom and per-workload contribution. Split accounts/resources when the shared failure consequence exceeds the benefit of pooling; otherwise reserve capacity and enforce tenant limits.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
quota = 1000; finance = 350; ml_normal = 300
normal_headroom = quota - finance - ml_normal
ml_surge = 750; surge_total = finance + ml_surge
rejected = max(0, surge_total - quota)
```

1. Record the shared ceiling and normal demand.

   Changed values: `{"quota": 1000, "finance": 350, "ml_normal": 300}`

2. Normal operation leaves 350 jobs of margin.

   Changed values: `{"normal_headroom": 350}`

3. ML surges while finance demand is unchanged.

   Changed values: `{"ml_surge": 750, "surge_total": 1100}`

4. One shared ceiling rejects 100 jobs across the failure domain.

   Changed values: `{"rejected": 100}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This arithmetic model assumes one hard quota and simultaneous demand. Real services use multiple adjustable/fixed quotas, bursts, asynchronous enforcement, retries, per-resource limits, and different failure modes.

## Explore (remaining exploration time)

Move ML demand. Watch shared headroom disappear and identify when finance becomes exposed despite unchanged demand.

Open distinguished-engineer.html for the executable model.

Model limits: This arithmetic model assumes one hard quota and simultaneous demand. Real services use multiple adjustable/fixed quotas, bursts, asynchronous enforcement, retries, per-resource limits, and different failure modes.

## Quiz (4 minutes)

1. Finance stays at 350 while ML rises to 750 under a 1,000 quota. What happens?
   - Combined demand exceeds the shared ceiling by 100
   - Finance is isolated automatically
   - The quota becomes 1,100

2. Why track per-workload contribution as well as total utilization?
   - It identifies who consumes headroom and where controls belong
   - It makes quotas disappear
   - It replaces load tests

3. When is a separate account or resource boundary justified?
   - When cross-workload failure cost outweighs pooling benefits
   - Whenever utilization is nonzero
   - Only after a global outage

4. Which three quotas create the largest cross-team blast radius in your platform?
5. What evidence would justify isolation instead of a quota increase and tenant limits?

<details><summary>Answer key — attempt first</summary>

1. Combined demand exceeds the shared ceiling by 100. Shared limits couple otherwise unrelated demand.

2. It identifies who consumes headroom and where controls belong. Ownership data turns an aggregate alert into an actionable design decision.

3. When cross-workload failure cost outweighs pooling benefits. Isolation is a tradeoff, not a reflex.

</details>

## Sources

- [AWS Well-Architected REL01-BP01: quotas and constraints](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_manage_service_limits_aware_quotas_and_constraints.html) — Living guidance; checked 2026-10-23.
- [AWS Well-Architected REL01-BP02: quotas across accounts and Regions](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_manage_service_limits_limits_considered.html) — Living guidance; checked 2026-10-23.
- [AWS Well-Architected REL01-BP03: fixed quotas](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_manage_service_limits_aware_fixed_limits.html) — Living guidance; checked 2026-10-23.
