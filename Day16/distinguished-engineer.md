# Green before failure, red after: capacity for one-zone loss

Distinguished Engineer · Day16 · 15 minutes

Turn regional average utilization into a zonal evacuation decision by checking the load each surviving zone must carry.

## Recall (2 minutes)

<p><a href="../Day7/distinguished-engineer.html">Day7: Load shedding: protect useful work past the breaking point</a></p><p>Demand is 140 units/s and safe capacity is 100. What must a stable admission policy do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject or degrade at least 40 units of work. The system cannot create capacity by accepting work; scarcity must become explicit.</p></details><p><a href="../Day1/distinguished-engineer.html">Day1: Turn an SLO into a decision</a></p><p>At 99.9% over 10,000 deliveries, 30 failures consume what budget?</p><details><summary>Recall first, then reveal the refresher</summary><p>300%. The allowance is 10 deliveries. Thirty is three times that allowance.</p></details>

## Understand (4 minutes)

A three-lane bridge carries 120 cars per minute. Each lane can carry 60. Today each lane carries 40, so the dashboard says 67% utilized. Green.

Now close one lane. The same 120 cars must fit into two lanes: 60 each. The service has no operating margin for retries, uneven balancing, or a second small fault.


Visual question: Where does the lost zone’s traffic go?



The first calculation is normal load per zone = total / zones. The failure calculation is evacuated load per survivor = total / (zones - 1).

For 120 requests/second across three zones, the failure load is 60. If the operating target is 80%, each surviving zone needs at least 60 / 0.8 = 75 requests/second of capacity.

This is an N+1 question: can the system meet its useful-work target after losing one failure domain, without first depending on a stressed control plane to add capacity?



## Read the visual

Where does the lost zone’s traffic go? The same total requests are redistributed from three zones into two. Bars share one requests-per-second scale; the dashed line is each zone’s 80% operating target. Red overflow means demand exceeds hard capacity.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Run this capacity check before approving a zonal evacuation plan, reducing fleet size, or committing to an availability target that includes losing one Availability Zone.

**Practical example.** Your data-quality API handles 120 useful requests/s across three AZs, each rated for 60. Losing one AZ pushes each survivor from 40 to 60 requests/s. To stay at the chosen 80% operating target, each AZ needs capacity for at least 75 requests/s.

**How to decide.** Provision and test survivor capacity before relying on the plan. Then verify routing and data dependencies in a controlled exercise. This equal-zone model needs adjustment for uneven traffic, retries, or a database that cannot fail over as assumed.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
zones = 3
total_rps = 120
capacity_per_zone = 60
operating_target = 0.80
normal_rps_per_zone = total_rps / zones
normal_utilization = normal_rps_per_zone / capacity_per_zone
survivors = zones - 1
evacuated_rps_per_zone = total_rps / survivors
evacuated_utilization = evacuated_rps_per_zone / capacity_per_zone
minimum_capacity = evacuated_rps_per_zone / operating_target
passes_target = capacity_per_zone >= minimum_capacity
```

1. Define the failure domains, useful load, hard capacity, and desired post-failure margin.

   Changed values: `{"zones": 3, "total_rps": 120, "capacity_per_zone": 60, "operating_target": 0.8}`

2. The calm-day regional view looks healthy at about 67%.

   Changed values: `{"normal_rps_per_zone": 40, "normal_utilization": 0.6666666666666666}`

3. Remove one zone before dividing. Each survivor now reaches 100%.

   Changed values: `{"survivors": 2, "evacuated_rps_per_zone": 60, "evacuated_utilization": 1}`

4. To stay at or below 80%, every zone needs 75 requests/s of capacity.

   Changed values: `{"minimum_capacity": 75, "passes_target": false}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model is deterministic capacity arithmetic. It does not simulate AWS routing, queueing, retries, autoscaling, or a zonal data plane.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A senior review should ask for a game-day or controlled zonal shift that verifies routing, application health, data dependencies, and useful-work SLIs. Trigger, mechanism, cascade, and missing control are distinct: the zone loss is the trigger; insufficient survivor headroom is the mechanism; retries and saturation are the cascade; customer errors are the impact; an N+1 capacity gate is one missing control.</p>

</details>

## Explore (remaining exploration time)

Change traffic and per-zone capacity. Compare the calm-day dashboard with the one-zone-loss result before choosing a rollout or evacuation plan.

Open distinguished-engineer.html for the executable model.

Model limits: This arithmetic assumes even traffic, one complete zone loss, identical zones, and instantly movable requests. Real planning must include zonal services, quotas, connection pools, data locality, retry amplification, autoscaling delay, fail-open/closed behavior, and correlated failures. A target such as 80% is a design input, not an AWS guarantee.

## Quiz (4 minutes)

1. At 120 requests/s and 60 capacity per AZ, what happens after one AZ is lost?
   - Each survivor reaches 100%
   - Each remains at 67%
   - Traffic disappears

2. Why is the normal regional utilization misleading?
   - It averages across capacity that will not exist during evacuation
   - CPU metrics are never useful
   - Availability Zones always share capacity

3. What is the main boundary of the toy?
   - It ignores imbalance, retries, quotas, and recovery delay
   - It proves autoscaling is unnecessary
   - It guarantees all AWS services evacuate instantly

4. What production evidence would prove that zonal evacuation works beyond this capacity calculation?
5. How would retry amplification change the required post-failure headroom?

<details><summary>Answer key — attempt first</summary>

1. Each survivor reaches 100%. Two survivors each receive 60 requests/s, exactly their hard capacity.

2. It averages across capacity that will not exist during evacuation. Failure planning must recalculate against the surviving failure domains.

3. It ignores imbalance, retries, quotas, and recovery delay. The arithmetic is a first guardrail, not a full recovery proof.

</details>

## Sources

- [AWS Builders’ Library: Static stability using Availability Zones](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) — Foundation; designs that keep working when dependencies are impaired; checked 2026-10-06.
- [AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html) — Document revision published 2024-11-06; resilience and recovery guidance; checked 2026-10-06.
