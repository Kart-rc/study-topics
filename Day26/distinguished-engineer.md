# Show unit cost before you charge teams

Distinguished Engineer · Day26 · 15 minutes

Turn shared-platform spend into a decision metric without hiding unallocated cost.

## Recall (2 minutes)

<p><a href="../Day20/distinguished-engineer.html">Day20: Keep checkout, drop recommendations: design a tested degraded mode</a></p><p>Recommendations take 4 seconds. First containment?</p><details><summary>Recall first, then reveal the refresher</summary><p>Bound call and omit them. Bound the optional branch.</p></details><p><a href="../Day22/distinguished-engineer.html">Day22: The service is green; the business is not recovered yet</a></p><p>Pipeline is green; customer rows remain wrong. Status?</p><details><summary>Recall first, then reveal the refresher</summary><p>Technical service restored; business recovery open. Availability and durable business state are different outcomes.</p></details>

## Understand (4 minutes)

A restaurant bill is not useful for improvement until you know what was ordered. Likewise, “the data platform cost $420k” does not say whether efficiency improved while usage doubled. Pair cost with a business output, such as successful terabytes processed.

Showback makes costs visible. Chargeback bills teams. Start with showback while tags and shared-cost allocation are still being repaired.



Team A costs $12,000 and successfully processes 600 TB: $20/TB. Team B costs $8,000 for 200 TB: $40/TB. Another $5,000 is unallocated. Do not smear that unknown cost across teams and call it precise; publish the gap and fix ownership.



## Read the visual

The bars separate assigned teams from the unknown pool. The unit value changes with successful output; the dollar bar does not pretend that higher utilization costs less.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use unit-cost showback when a shared platform must connect engineering choices to business output.

**Practical example.** Compare monthly Spark platform cost per successful terabyte by domain, while exposing untagged shared services separately.

**How to decide.** Move toward chargeback only when ownership, allocation rules, dispute paths, and unit definitions are stable enough that teams can act on the numbers.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
cost_a=12000
tb_a=600
cost_b=8000
tb_b=200
unit_a=cost_a/tb_a
unit_b=cost_b/tb_b
unallocated=5000
total=cost_a+cost_b+unallocated
allocation_coverage=(cost_a+cost_b)/total
```

1. Start with allocated spend and successful output.

   Changed values: `{"cost_a": 12000, "tb_a": 600, "cost_b": 8000, "tb_b": 200}`

2. Compute comparable unit costs.

   Changed values: `{"unit_a": 20.0, "unit_b": 40.0}`

3. Keep unknown shared cost visible.

   Changed values: `{"unallocated": 5000, "total": 25000}`

4. Measure confidence in the showback before using it as a bill.

   Changed values: `{"allocation_coverage": 0.8}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model assumes one synthetic unit and simple direct allocation. Real programs need amortization, commitments, shared services, failed work, data-quality rules, and anti-gaming controls.

## Explore (remaining exploration time)

Change Team B output and unallocated cost. Watch total spend stay the same while decision quality changes.

Open distinguished-engineer.html for the executable model.

Model limits: The model assumes one synthetic unit and simple direct allocation. Real programs need amortization, commitments, shared services, failed work, data-quality rules, and anti-gaming controls.

## Quiz (4 minutes)

1. Why pair cost with successful TB?
   - To connect spend with useful output
   - To make tags unnecessary
   - To guarantee fairness

2. What should happen to unallocated cost?
   - Hide it
   - Expose it and improve attribution
   - Split it randomly

3. When is chargeback premature?
   - Allocation rules are unstable and disputed
   - Unit definitions are clear
   - Teams can influence the metric

4. Which denominator would be hardest for teams to game on your platform?
5. What allocation-coverage threshold would you require before chargeback?

<details><summary>Answer key — attempt first</summary>

1. To connect spend with useful output. A unit metric shows efficiency as workload volume changes.

2. Expose it and improve attribution. Visible uncertainty creates a repair target without false precision.

3. Allocation rules are unstable and disputed. Billing on weak attribution creates distrust and bad incentives.

</details>

## Sources

- [AWS Well-Architected: define cost optimization KPIs](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_monitor_usage_define_kpi.html) — Living guidance; checked 2026-10-16.
- [AWS cost allocation tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/custom-tags.html) — Living documentation; checked 2026-10-16.
- [AWS cost allocation tags best practices](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/cost-allocation-tags.html) — Living whitepaper; checked 2026-10-16.
