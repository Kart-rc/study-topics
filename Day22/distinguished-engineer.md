# The service is green; the business is not recovered yet

Distinguished Engineer · Day22 · 15 minutes

Separate technical restoration, business reconciliation, and systemic prevention instead of declaring victory at the first green dashboard.

## Recall (2 minutes)

<p><a href="../Day19/distinguished-engineer.html">Day19: Build the exit before calling it a two-way door</a></p><p>A pilot has small blast radius, no writes and tested rollback. How should it usually be treated?</p><details><summary>Recall first, then reveal the refresher</summary><p>As a reversible experiment. The return path is practical, so speed and learning can be appropriate. Reversible does not mean risk-free.</p></details><p><a href="../Day7/distinguished-engineer.html">Day7: Load shedding: protect useful work past the breaking point</a></p><p>Demand is 140 units/s and safe capacity is 100. What must a stable admission policy do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject or degrade at least 40 units of work. The system cannot create capacity by accepting work; scarcity must become explicit.</p></details>

## Understand (4 minutes)

A reopened airport is not fully recovered while thousands of passengers still have wrong itineraries. Likewise, healthy servers are only one recovery clock.

Track three outcomes: service restored, business state reconciled, and systemic control closed. Each needs its own owner and evidence.



The pipeline turns green at 10:12. At that moment, 12,400 customer records are still wrong. Replay and reconciliation finish at 11:05. The preventive publish gate is deployed and tested two days later. “Resolved at 10:12” erases most of the work and risk.



## Read the visual

The three milestone cards deliberately do not collapse into one line: the selected evidence turns green while later obligations stay amber.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use multiple recovery clocks when an incident leaves durable customer, financial, data, or compliance effects after infrastructure recovers.

**Practical example.** A corrected ETL job is healthy, but invoices created during the bad window still need identification and repair.

**How to decide.** Close the technical incident when operations stabilize; keep business remediation and prevention as explicit tracked work with exit evidence.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
milestones={"service":"10:12","business":"11:05","prevention":"+2d"}
customer_rows_wrong_at_service_restore=12400
fully_recovered=all(k in milestones for k in ("service","business","prevention")) and customer_rows_wrong_at_service_restore>0
```

1. Record separate evidence times.

   Changed values: `{"milestones": {"service": "10:12", "business": "11:05", "prevention": "+2d"}}`

2. Quantify the residual business impact at technical restoration.

   Changed values: `{"customer_rows_wrong_at_service_restore": 12400}`

3. Require all three recorded outcomes; retain the residual-impact fact.

   Changed values: `{"fully_recovered": true}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executed local Python over illustrative incident facts. It did not query an incident system or validate organizational closure policy.

## Explore (remaining exploration time)

Move the status marker across the three milestones and decide what statement is safe for customers, leaders, and engineers.

Open distinguished-engineer.html for the executable model.

Model limits: The dates are illustrative. Real severity, disclosure, audit, legal, and customer-communication duties depend on the organization and incident.

## Quiz (4 minutes)

1. Pipeline is green; customer rows remain wrong. Status?
   - Fully recovered
   - Technical service restored; business recovery open
   - No incident

2. What closes the prevention clock?
   - A ticket exists
   - The control is deployed and its behavior verified
   - The postmortem meeting ended

3. Why name owners per clock?
   - To split accountability for distinct outcomes
   - To hide the incident
   - To avoid metrics

4. Which incident metric currently turns green before customers are actually whole?
5. Who owns reconciliation evidence after the incident channel quiets down?

<details><summary>Answer key — attempt first</summary>

1. Technical service restored; business recovery open. Availability and durable business state are different outcomes.

2. The control is deployed and its behavior verified. Closure needs evidence that the risk-reduction mechanism works.

3. To split accountability for distinct outcomes. Different work streams can otherwise disappear behind one status.

</details>

## Sources

- [AWS Well-Architected: learn from operational events](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_evolve_ops_exp.html) — Living guidance; checked 2026-10-12.
- [AWS Well-Architected: test recovery procedures](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_testing_resiliency_failure_recovery.html) — Living guidance; checked 2026-10-12.
