# Deal each tenant a hand: shuffle-shard the fleet

Distinguished Engineer · Day13 · 15 minutes

Limit a noisy tenant to a small worker subset while preserving a healthy path for tenants whose hands only partly overlap.

## Recall (2 minutes)

<p><a href="../Day8/distinguished-engineer.html">Day8: Fault injection: bound the experiment before you create the fault</a></p><p>A stop alarm needs three 60-second breaching periods. What should the experiment owner assume?</p><details><summary>Recall first, then reveal the refresher</summary><p>Potentially harmful exposure continues while evidence accumulates. The evaluation window is part of the blast-radius budget, not a grace period without impact.</p></details><p><a href="../Day10/distinguished-engineer.html">Day10: Replace one route at a time</a></p><p>Only /tracking moves. Who handles /orders in this example?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old system. The routing decision is per capability. Moving tracking does not transfer order-write ownership or require two writers.</p></details>

## Understand (4 minutes)

Imagine eight checkout workers. If every tenant can use all eight, one poisonous request can move from worker to worker and damage the whole fleet.

Instead, deal each tenant a small hand of workers. Tenant Rainbow gets workers 1 and 4. Tenant Rose gets 1 and 8. Their hands overlap at worker 1, but not at every worker. This is shuffle sharding.

RainbowW1 · W4

RoseW1 · W8

SunflowerW3 · W6

Rainbow overloads W1 and W4 → Rose can still try W8

The architectural goal is not zero overlap. It is to avoid complete overlap, so one tenant's failure does not become everybody's failure.



Rainbow sends a poisonous request that disables W1 and W4. Rainbow has no healthy worker left. Rose shares W1, but W8 remains healthy. A carefully bounded retry can use W8. Sunflower shares neither failed worker.

healthy = [worker for worker in tenant_hand
           if worker not in failed_workers]

The Distinguished Engineer decision is larger than the assignment algorithm. You need deterministic placement, enough spare capacity inside each hand, Availability Zone diversity, retry limits, overload signals, and an escape plan for truly toxic tenants.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
hands = {
    "Rainbow": ["W1", "W4"],
    "Rose": ["W1", "W8"],
    "Sunflower": ["W3", "W6"],
}
failed = ["W1", "W4"]
healthy = {tenant: [w for w in hand if w not in failed]
           for tenant, hand in hands.items()}
fully_impacted = sorted(tenant for tenant, workers in healthy.items() if not workers)
```

1. Deal each tenant a two-worker hand.

   Changed values: `{"hands": {"Rainbow": ["W1", "W4"], "Rose": ["W1", "W8"], "Sunflower": ["W3", "W6"]}}`

2. Rainbow's two workers fail under its toxic workload.

   Changed values: `{"failed": ["W1", "W4"]}`

3. Check the surviving path inside each tenant's own hand.

   Changed values: `{"healthy": {"Rainbow": [], "Rose": ["W8"], "Sunflower": ["W3", "W6"]}}`

4. Only Rainbow has complete overlap with the failed set.

   Changed values: `{"fully_impacted": ["Rainbow"]}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executes membership filtering for fixed hands. It does not generate or capacity-test real assignments.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>For eight workers, there are 28 unordered two-worker combinations. The combinatorial space can give many tenants different hands without building dedicated fleets. Validate the actual overlap distribution and capacity; a pretty combination count is not an SLO.</p>

</details>

## Explore (remaining exploration time)

Choose a failed-worker set and see which tenants lose their whole hand versus only one path.

Open distinguished-engineer.html for the executable model.

Model limits: A fixed three-tenant illustration. It does not generate production hash assignments, model queue depth or capacity, enforce AZ diversity, or protect shared databases and control planes. Retries help only when the alternate worker is healthy and has spare capacity.

## Quiz (4 minutes)

1. Rainbow uses W1/W4 and Rose uses W1/W8. W1 and W4 fail. Why can Rose continue?
   - Rose has a non-overlapping healthy worker, W8
   - Shuffle sharding repairs W1
   - All tenants secretly use every worker

2. What does shuffle sharding optimize?
   - It eliminates every shared dependency
   - It reduces complete overlap and therefore shared fate
   - It guarantees zero failures

3. Which design can still defeat the isolation?
   - A shared database that every hand can overload
   - Different worker hands
   - A stable tenant-to-hand mapping

4. Explain why partial overlap is acceptable but complete overlap is dangerous.
5. Name the metrics and failure drill you would require before adopting shuffle sharding for a multi-tenant data plane.

<details><summary>Answer key — attempt first</summary>

1. Rose has a non-overlapping healthy worker, W8. Rose overlaps at W1 but not completely; W8 remains a path if capacity and retry behavior are sound.

2. It reduces complete overlap and therefore shared fate. The pattern narrows the group that shares all affected resources; it does not remove every dependency.

3. A shared database that every hand can overload. A common downstream bottleneck can restore a fleet-wide blast radius even when workers are well isolated.

</details>

## Sources

- [AWS Builders' Library: Workload isolation using shuffle-sharding](https://builder.aws.com/content/3F06NpJ8YeoIGP8VHTw4n81pFn8/workload-isolation-using-shuffle-sharding) — Published 2019; checked 2026-10-03.
- [AWS Architecture Blog: Shuffle Sharding—Massive and Magical Fault Isolation](https://aws.amazon.com/blogs/architecture/shuffle-sharding-massive-and-magical-fault-isolation/) — 2014-04-14; checked 2026-10-03.
