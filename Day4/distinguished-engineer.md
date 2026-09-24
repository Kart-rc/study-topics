# Static stability: survive first, repair second

Distinguished Engineer · Day4 · 15 minutes

Size pre-existing zonal capacity and distinguish a resilience design from a recovery plan that depends on an impaired control plane.

## Recall (2 minutes)

<p><a href="../Day1/distinguished-engineer.html">Day1: Turn an SLO into a decision</a></p><p>At 99.9% over 10,000 deliveries, 30 failures consume what budget?</p><details><summary>Recall first, then reveal the refresher</summary><p>300%. The allowance is 10 deliveries. Thirty is three times that allowance.</p></details><p><a href="../Day3/distinguished-engineer.html">Day3: Cell-based architecture: make failure scope a product decision</a></p><p>With 1,000 evenly assigned tenants and 10 cells, what is the modeled one-cell impact?</p><details><summary>Recall first, then reveal the refresher</summary><p>100 tenants. The simplified upper bound is ceil(1,000 / 10) = 100.</p></details>

## Understand (4 minutes)

A statically stable system keeps its existing useful work running when a dependency is impaired. It may stop accepting configuration changes, but its data plane does not require emergency provisioning or mutation to survive.

AWS describes the control plane as the machinery that creates and changes resources, while the data plane performs their ongoing work. The control plane is typically more complex and lower volume. Building the incident response around “launch replacements now” introduces the control plane—and bootstrapping, discovery, credentials, and configuration—into the worst possible moment.



Original teaching case: A three-AZ data-quality service is load-tested to 50% of total demand in each zone. Normal provisioned capacity is 150%. Lose one zone and 100% remains: no scale-up is needed. AWS gives this same three-zone arithmetic as 50% overprovisioning, with each zone operating at 66% of its tested capacity.

If each zone holds only 35% of demand, losing one leaves 70%. A reactive plan needs 30 percentage points of new capacity. It may recover when control-plane operations work, but it is not statically stable.

survivingCapacity = (zones - 1) × capacityPerZone
staticStable = survivingCapacity ≥ 100% demand

A Distinguished Engineer turns the arithmetic into an operating contract: define which failure the service must absorb, fund the required headroom, keep critical request paths zone-local where appropriate, pre-provision standby state, and run game days that disable control-plane changes. Cost objections are real; the response is tiering and explicit risk acceptance, not relabeling reactive recovery as high availability.



## Explore (5 minutes)

At three zones, find the minimum whole-number capacity per zone that survives one loss. Disable the control plane and compare 50% with 35%. Then identify one bootstrap dependency your data plane still takes during recovery.

Open distinguished-engineer.html for the executable model.

Model limits: Uniform load, one entire zone lost, perfect traffic shifting, identical capacity, and a binary control-plane state. It omits gray failures, cross-zone calls, stateful quorum, data durability, health-check errors, autoscaling delay, regional failure, uneven traffic, cost, and service-specific AWS behavior. Capacity percentages are teaching arithmetic, not sizing advice.

## Quiz (4 minutes)

1. Three zones each carry capacity equal to 50% of demand. One fails. What remains?
   - 50%
   - 100%
   - 150%

2. Why is emergency scale-out weaker than pre-provisioned headroom?
   - It depends on control-plane and bootstrap paths during an impairment
   - It always costs more
   - It removes health checks

3. The data plane serves old configuration but cannot accept updates during a control-plane outage. Is that consistent with static stability?
   - No, every operation must remain available
   - Yes, existing useful work can continue while changes pause
   - Only if all zones fail

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 100%. Two surviving zones each contribute 50%, so existing capacity still meets demand.

2. It depends on control-plane and bootstrap paths during an impairment. The repair path adds changing infrastructure and several dependencies precisely when conditions are degraded.

3. Yes, existing useful work can continue while changes pause. Static stability prioritizes continued established behavior; control-plane mutations can be temporarily unavailable.

</details>

## Sources

- [AWS Builders' Library: Static stability using Availability Zones](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) — Established AWS architecture guidance; publication date not stated; checked 2026-09-24.
