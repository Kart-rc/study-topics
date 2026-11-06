# Scaling lead time spends headroom before new capacity arrives

Distinguished Engineer · Day46 · 15 minutes

Set an autoscaling trigger early enough that demand growth does not exhaust the current fleet during detection and startup delay.

## Recall (2 minutes)

<p><a href="../Day32/distinguished-engineer.html">Day32: Put toil on a budget before it owns the roadmap</a></p><p>What makes manual onboarding likely toil?</p><details><summary>Recall first, then reveal the refresher</summary><p>It repeats, is automatable, and scales with tenants. Toil is classified by work characteristics, not taste.</p></details><p><a href="../Day4/distinguished-engineer.html">Day4: Static stability: survive first, repair second</a></p><p>Three zones each carry capacity equal to 50% of demand. One fails. What remains?</p><details><summary>Recall first, then reveal the refresher</summary><p>100%. Two surviving zones each contribute 50%, so existing capacity still meets demand.</p></details>

## Understand (4 minutes)

A fire engine called at the moment a building is fully on fire is already late. Autoscaling also has delay: metrics travel, a policy decides, resources start, and health checks pass.

Headroom is unused capacity held for that interval. A useful trigger accounts for how much demand can grow before replacement capacity becomes ready, plus uncertainty. A 90% target may be too late even when average utilization looks comfortable.



A service can handle 1,000 requests per second. It is receiving 750, growing by 70 per minute, and new nodes take four minutes to serve traffic. Before they arrive, demand reaches 1,030. To survive that deterministic ramp, the trigger must fire by 720 requests per second or earlier, before adding uncertainty.



## Read the visual

A time-indexed capacity bar shows demand consuming the unused band before nodes become ready, turning an abstract utilization target into a deadline.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use lead-time headroom when capacity arrives minutes after demand changes and exhaustion causes queues, throttling, or SLO breaches.

**Practical example.** An EKS API tier needs four minutes for metric propagation, node provisioning, image pull, and readiness while a partner launch adds 70 requests per second each minute.

**How to decide.** Use predictive or scheduled scaling for known events, target tracking with measured headroom for organic growth, and load shedding for bursts faster than any provisioning path. Re-measure lead time and growth instead of copying a universal percentage.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
capacity_rps=1000; current_rps=750; growth_rps_per_min=70; ready_minutes=4
growth_during_lead=growth_rps_per_min*ready_minutes
demand_at_ready=current_rps+growth_during_lead; latest_trigger=capacity_rps-growth_during_lead
survives=demand_at_ready<=capacity_rps; required_headroom_fraction=growth_during_lead/capacity_rps
```

1. Set the measured capacity, demand ramp, and end-to-end scaling delay.

   Changed values: `{"capacity_rps": 1000, "current_rps": 750, "growth_rps_per_min": 70, "ready_minutes": 4}`

2. Demand can add 280 rps while the fleet is still unchanged.

   Changed values: `{"growth_during_lead": 280}`

3. The current trigger is late; deterministic demand reaches 1,030 rps.

   Changed values: `{"demand_at_ready": 1030, "latest_trigger": 720}`

4. The model needs at least 28% headroom before uncertainty.

   Changed values: `{"survives": false, "required_headroom_fraction": 0.28}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is a deterministic linear-growth model. It omits stochastic bursts, correlated failures, warm pools, nonlinear service curves, queueing, downstream bottlenecks, metric lag distributions, cost, and multi-region failover.

## Explore (remaining exploration time)

Change growth and ready time. Watch the demand ramp cross the current capacity line and see the latest safe trigger move left.

Open distinguished-engineer.html for the executable model.

Model limits: This is a deterministic linear-growth model. It omits stochastic bursts, correlated failures, warm pools, nonlinear service curves, queueing, downstream bottlenecks, metric lag distributions, cost, and multi-region failover.

## Quiz (4 minutes)

1. Capacity is 1,000 rps, growth 70 rps/min, and lead time four minutes. What is the latest deterministic trigger?
   - 720 rps
   - 930 rps
   - 1,280 rps

2. Why is a high utilization target risky?
   - Detection and provisioning consume time while demand can keep rising
   - It always costs more
   - It disables metrics

3. What handles a burst faster than provisioning?
   - Load shedding or pre-provisioned capacity
   - A later alarm
   - A larger dashboard

4. What is the measured p95 end-to-end scaling lead time for your slowest tier?
5. Which burst requires pre-scaling or load shedding because reactive scaling cannot arrive in time?

<details><summary>Answer key — attempt first</summary>

1. 720 rps. Reserve 70×4=280 rps of headroom: 1,000−280=720.

2. Detection and provisioning consume time while demand can keep rising. The existing fleet must survive the entire response delay.

3. Load shedding or pre-provisioned capacity. Autoscaling cannot create capacity before its measured lead time.

</details>

## Sources

- [AWS Well-Architected REL07-BP03](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_adapt_to_changes_proactive_adapt_auto.html) — Official AWS guidance; checked November 5, 2026; checked 2026-11-05.
