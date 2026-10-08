# Dependency isolation: spend concurrency by failure domain

Distinguished Engineer · Day5 · 15 minutes

A slow enrichment service uses all ten outbound slots.

## Recall (2 minutes)

<p><a href="../Day2/distinguished-engineer.html">Day2: Canaries: small exposure, useful evidence</a></p><p>At 1% exposure, canary 4%, control 0.1%, what is the overall failure rate?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.139%. 0.01 × 4% + 0.99 × 0.1% = 0.139%. Aggregation hides a severe cohort regression.</p></details><p><a href="../Day4/distinguished-engineer.html">Day4: Static stability: survive first, repair second</a></p><p>Three zones each carry capacity equal to 50% of demand. One fails. What remains?</p><details><summary>Recall first, then reveal the refresher</summary><p>100%. Two surviving zones each contribute 50%, so existing capacity still meets demand.</p></details>

## Understand (4 minutes)

A slow enrichment service uses all ten outbound slots. Important policy reads now wait, even though their own dependency is healthy.

A bulkhead is a separate pool of limited resources. Reserving slots for different classes of work can stop one slow class from occupying everything. The tradeoff is that a quiet pool may leave slots unused while another is busy.



Policy reads need about 4 × 0.2 = 0.8 concurrent slots. Enrichment at six requests per second and two seconds each needs about 12. Reserving four policy slots and six enrichment slots protects the first class while bounding the second.



## Read the visual

Arrival rate times service time gives required concurrent slots. A shared ten-slot bar fills with policy and enrichment demand; when overloaded the toy proportionally reduces both. A physical divider into four policy and six enrichment slots keeps policy demand at 0.8 slots while limiting enrichment. Labels show fractional average occupancy, not individual requests.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
policy_demand = 4 * 0.2
enrichment_demand = 6 * 2
shared_slots = 10
policy_slots = 4; enrichment_slots = 6
policy_headroom = policy_slots - policy_demand
excess_bulk_demand = enrichment_demand - enrichment_slots
```

1. Arrival rate times average latency gives mean concurrency demand.

   Changed values: `{"policy_demand": 0.8}`

2. The slow path wants 12 simultaneous slots.

   Changed values: `{"enrichment_demand": 12}`

3. The slow path can exhaust the shared pool.

   Changed values: `{"shared_slots": 10}`

4. Separate budgets prevent cross-pool borrowing.

   Changed values: `{"policy_slots": 4, "enrichment_slots": 6}`

5. The policy pool has room in this average-load calculation.

   Changed values: `{"policy_headroom": 3.2}`

6. Six slots of bulk demand must wait or be rejected.

   Changed values: `{"excess_bulk_demand": 6}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This uses average demand, not a queueing guarantee. Bursts, tail latency, and scheduling matter. Isolation must also exist in downstream dependencies to contain shared failures.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Concurrency is inventory. By Little's Law, the average in-flight work is arrival rate times latency. A downstream dependency that becomes ten times slower can consume roughly ten times the callers, sockets, or task slots even when request rate is unchanged.</p><p>If unrelated features share one pool, the slow path can starve healthy paths. Dependency isolation assigns separate concurrency budgets to meaningful failure domains—dependency, workload class, tenant tier, or operation. Exhaustion then becomes a bounded local failure with fast rejection rather than a process-wide queue.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A governance API has ten outbound slots. Critical policy reads arrive at 4 requests/second and take 200 ms, needing about 0.8 concurrent calls. Bulk lineage enrichment arrives at 6 requests/second. At 200 ms it needs 1.2 slots; at 2 seconds it needs 12.</p><p>With a shared pool, the slow enrichment path can occupy all ten slots and make policy reads wait. With four slots reserved for policy reads and six for enrichment, bulk throughput degrades and rejects quickly while critical reads keep enough inventory.</p><pre>inFlight demand ≈ arrivalRate × latency
shared pool: unrelated modes compete
isolated pools: each mode has a bounded blast radius</pre><p>The Distinguished Engineer decision is not “add bulkheads everywhere.” Each pool costs utilization and tuning complexity. Choose boundaries from correlated latency modes, criticality, and telemetry; define admission behavior; and revisit allocations using observed saturation, rejection, and downstream latency.</p>

</details>

## Explore (remaining exploration time)

Raise bulk dependency latency from 200 ms to 2 seconds. Predict critical throughput with and without isolation. Then explain what metric would tell you a pool is protecting the wrong boundary.

Open distinguished-engineer.html for the executable model.

Model limits: A steady-state Little's Law calculator with two workloads, fixed arrival rates, fixed service time for critical traffic, instantaneous admission, and no queue. It omits distributions, retries, timeouts, connection setup, CPU, priority scheduling, adaptive limits, fairness, autoscaling, burstiness, and multi-hop feedback.

## Quiz (4 minutes)

1. A dependency's latency rises tenfold while arrival rate stays fixed. What happens to its concurrency demand?
   - It falls tenfold
   - It stays constant
   - It rises roughly tenfold

2. Why give critical policy reads a separate pool from bulk enrichment?
   - To contain a correlated slow mode to its own feature budget
   - To make all capacity perfectly utilized
   - To remove the need for timeouts

3. What is the main tradeoff of fixed isolated pools?
   - They guarantee zero failures
   - Reserved capacity can sit idle while another pool rejects work
   - They merge failure domains

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. It rises roughly tenfold. Little's Law links in-flight work to rate times time.

2. To contain a correlated slow mode to its own feature budget. The isolation boundary preserves inventory for the healthy critical path.

3. Reserved capacity can sit idle while another pool rejects work. Isolation buys containment at the cost of possible stranded capacity and added tuning.

</details>

## Sources

- [AWS Builders' Library: Using dependency isolation to contain concurrency overload](https://builder.aws.com/content/3EuxuD6bWtQ6gEp9FaKQfd3Z2AM/using-dependency-isolation-to-contain-concurrency-overload) — Updated 2026-07-07; checked 2026-09-25.
