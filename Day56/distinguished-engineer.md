# A healthy global average can hide one tenant in pain

Distinguished Engineer · Day56 · 15 minutes

Make platform reliability decisions from tenant and tier distributions, not only aggregate success.

## Recall (2 minutes)

<p><a href="../Day37/distinguished-engineer.html">Day37: Match decision process to reversal cost</a></p><p>A change is flag-protected and rolls back in five minutes for one team. Default process?</p><details><summary>Recall first, then reveal the refresher</summary><p>A local guarded experiment with evidence. Reversible choices should not inherit one-way-door ceremony.</p></details><p><a href="../Day9/distinguished-engineer.html">Day9: Rollback safety: old code must survive new state</a></p><p>Why can a successful binary rollback still fail?</p><details><summary>Recall first, then reveal the refresher</summary><p>New code may already have written durable state the old code cannot read. Deployment state and durable data evolve on different timelines.</p></details>

## Understand (4 minutes)

If nine checkout lanes are empty and one has a hundred people, the store’s average queue can still look small. The people in the bad lane do not experience the average.

A shared platform can report 99.9% overall success while a small tenant repeatedly fails. Distinguished-level judgment keeps the global SLO but adds tenant/tier views, minimum-volume rules, top-offender evidence, and a response policy. Do not create thousands of noisy pages; use distributions and drill-downs to find concentrated harm.



Tenant A sends 999,000 successful requests. Tenant B sends 1,000 requests and 500 fail. Global success is about 99.95%; B experiences only 50%. The platform is globally green and locally broken.



## Read the visual

Three equal cards contrast raw tenant denominators with the traffic-weighted aggregate, exposing exactly how the large tenant dominates it.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use tenant-aware reliability views when a shared service has uneven traffic and aggregate metrics can be dominated by large users.

**Practical example.** A data-quality API serves forty producer teams; one smaller team cannot register rules although the fleet dashboard is green.

**How to decide.** Retain a global objective for capacity and business health, then add tier and tenant distributions with minimum-volume confidence rules. Page on actionable widespread harm; route concentrated degradation to an owned incident or ticket policy.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
a={'requests':999000,'failures':0}; b={'requests':1000,'failures':500}
global_success=1-(a['failures']+b['failures'])/(a['requests']+b['requests'])
b_success=1-b['failures']/b['requests']
result={'global_pct':round(global_success*100,2),'tenant_b_pct':round(b_success*100,2),'needs_tenant_view':True}
```

1. Create one large healthy tenant and one small degraded tenant.

   Changed values: `{"a": {"requests": 999000, "failures": 0}, "b": {"requests": 1000, "failures": 500}}`

2. Compute the traffic-weighted aggregate.

   Changed values: `{"global_success": 0.9995}`

3. Compute the affected tenant's experience.

   Changed values: `{"b_success": 0.5}`

4. Show why both views are required.

   Changed values: `{"result": {"global_pct": 99.95, "tenant_b_pct": 50.0, "needs_tenant_view": true}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model has two tenants and a single success metric. It does not handle sampling confidence, latency, retries, traffic weighting, tier contracts, low-volume burn rates, regional cells, alert routing, or privacy limits.

## Explore (remaining exploration time)

Move failed requests between the large and small tenant. Predict global and tenant success.

Open distinguished-engineer.html for the executable model.

Model limits: The model has two tenants and a single success metric. It does not handle sampling confidence, latency, retries, traffic weighting, tier contracts, low-volume burn rates, regional cells, alert routing, or privacy limits.

## Quiz (4 minutes)

1. Why is 99.95% global success misleading here?
   - Tenant A's volume hides Tenant B's 50% success
   - Percentages cannot measure reliability
   - Tenant B has too many requests

2. Why not page separately for every tiny tenant?
   - Low-volume noise needs confidence and actionability rules
   - Small tenants never matter
   - AWS forbids tenant metrics

3. What should remain alongside tenant views?
   - A global objective plus tier/distribution evidence
   - Only the worst tenant
   - Only CPU utilization

4. Which platform SLO could be green while one producer team is unable to complete its core task?
5. What minimum-volume or confidence rule would prevent noisy tenant alerts without hiding harm?

<details><summary>Answer key — attempt first</summary>

1. Tenant A's volume hides Tenant B's 50% success. Aggregate weighting can conceal concentrated harm.

2. Low-volume noise needs confidence and actionability rules. Tenant visibility and alert design are separate decisions.

3. A global objective plus tier/distribution evidence. The system needs both overall and concentrated-harm perspectives.

</details>

## Sources

- [AWS SaaS Lens: Tenant-aware operations](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/tenant-aware-operations.html) — AWS Well-Architected guidance; checked November 16, 2026; checked 2026-11-16.
- [AWS SaaS Lens: Operate](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/operate.html) — AWS Well-Architected guidance; checked November 16, 2026; checked 2026-11-16.
