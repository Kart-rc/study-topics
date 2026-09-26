# Dependency isolation: spend concurrency by failure domain

Distinguished Engineer · Day5 · 15 minutes

Turn a slow dependency into a contained feature failure instead of a process-wide concurrency collapse.

## Recall (2 minutes)

<p><a href="../Day2/distinguished-engineer.html">Day2: Canaries: small exposure, useful evidence</a></p><p>At 1% exposure, canary 4%, control 0.1%, what is the overall failure rate?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.139%. 0.01 × 4% + 0.99 × 0.1% = 0.139%. Aggregation hides a severe cohort regression.</p></details><p><a href="../Day4/distinguished-engineer.html">Day4: Static stability: survive first, repair second</a></p><p>Three zones each carry capacity equal to 50% of demand. One fails. What remains?</p><details><summary>Recall first, then reveal the refresher</summary><p>100%. Two surviving zones each contribute 50%, so existing capacity still meets demand.</p></details>

## Understand (4 minutes)

Concurrency is inventory. By Little's Law, the average in-flight work is arrival rate times latency. A downstream dependency that becomes ten times slower can consume roughly ten times the callers, sockets, or task slots even when request rate is unchanged.

If unrelated features share one pool, the slow path can starve healthy paths. Dependency isolation assigns separate concurrency budgets to meaningful failure domains—dependency, workload class, tenant tier, or operation. Exhaustion then becomes a bounded local failure with fast rejection rather than a process-wide queue.



Original teaching case: A governance API has ten outbound slots. Critical policy reads arrive at 4 requests/second and take 200 ms, needing about 0.8 concurrent calls. Bulk lineage enrichment arrives at 6 requests/second. At 200 ms it needs 1.2 slots; at 2 seconds it needs 12.

With a shared pool, the slow enrichment path can occupy all ten slots and make policy reads wait. With four slots reserved for policy reads and six for enrichment, bulk throughput degrades and rejects quickly while critical reads keep enough inventory.

inFlight demand ≈ arrivalRate × latency
shared pool: unrelated modes compete
isolated pools: each mode has a bounded blast radius

The Distinguished Engineer decision is not “add bulkheads everywhere.” Each pool costs utilization and tuning complexity. Choose boundaries from correlated latency modes, criticality, and telemetry; define admission behavior; and revisit allocations using observed saturation, rejection, and downstream latency.



## Explore (5 minutes)

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
