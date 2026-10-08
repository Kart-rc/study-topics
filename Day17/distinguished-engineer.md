# Automation payback: include the work that remains

Distinguished Engineer · Day17 · 15 minutes

Turn a recurring platform chore into an explicit build-versus-maintain decision.

## Recall (2 minutes)

<p><a href="../Day8/distinguished-engineer.html">Day8: Fault injection: bound the experiment before you create the fault</a></p><p>A stop alarm needs three 60-second breaching periods. What should the experiment owner assume?</p><details><summary>Recall first, then reveal the refresher</summary><p>Potentially harmful exposure continues while evidence accumulates. The evaluation window is part of the blast-radius budget, not a grace period without impact.</p></details><p><a href="../Day2/distinguished-engineer.html">Day2: Canaries: small exposure, useful evidence</a></p><p>At 1% exposure, canary 4%, control 0.1%, what is the overall failure rate?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.139%. 0.01 × 4% + 0.99 × 0.1% = 0.139%. Aggregation hides a severe cohort regression.</p></details>

## Understand (4 minutes)

You can wash dishes by hand or spend time installing a dishwasher. The machine saves repeated effort, but installation and upkeep still count. Automation has the same shape.

Toil is recurring operational work that leaves little lasting improvement. Measure one unit of work. Compare manual effort with residual human effort plus maintenance. A script that constantly breaks can move the work rather than remove it.

Total hours spent6030004812Weeks24 h build costWeek 8: both 40 hSolid blue: manual, +5 h/week.Dashed brown: automated, +2 h/week.The automation line starts higher because you build first. Its slower rise repays that head start. After the crossing, automation has used fewer total hours.

For 20 standard access requests weekly, a self-service path reduces review from 15 to 3 minutes each. Weekly maintenance takes one hour. At week 4, manual handling has cost 20 hours. Automation has cost 24 build hours plus 8 operating hours: 32. At week 8 both total 40. At week 12, automation has saved 12 hours.

This original estimate is not a universal funding rule. Expose assumptions, assign an owner, and measure the result after launch.



## Read the visual

The cumulative-effort chart starts manual work at 0 hours and automation at its 24-hour build cost. Line slope is weekly work: 5 manual hours versus 2 ongoing automated hours at the default. The lines cross at week 8 and 40 hours; the vertical gap after the crossing is saved work. At 5 requests and 1 upkeep hour the slopes are equal, so the lines never meet. The live chart recalculates line slopes, crossing, and axis scale from the controls; its 12-week window is explicit.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Teams compete for capacity to automate recurring tickets, approvals, or platform operations.

**Practical example.** Compare self-service Kafka topic provisioning with a manual request queue. Measure volume, review time, exceptions, and upkeep before promising saved engineering time.

**How to decide.** Check that expected useful lifetime and benefits justify the cost. Low-volume work may only need simplification. Reduced errors or faster customer response can justify investment even when hours alone do not.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
requests = 20
manual_minutes = 15
residual_minutes = 3
build_hours = 24
maintenance_hours = 1
manual_weekly = requests * manual_minutes / 60
auto_weekly = requests * residual_minutes / 60 + maintenance_hours
net_saved = manual_weekly - auto_weekly
payback_weeks = build_hours / net_saved if net_saved > 0 else None
manual_at_12 = 12 * manual_weekly
auto_at_12 = build_hours + 12 * auto_weekly
saved_at_12 = manual_at_12 - auto_at_12
```

1. List recurring work and initial investment.

   Changed values: `{"requests": 20, "manual_minutes": 15, "residual_minutes": 3, "build_hours": 24, "maintenance_hours": 1}`

2. Compare 5 hours with 2, not with zero.

   Changed values: `{"manual_weekly": 5.0, "auto_weekly": 2.0}`

3. Three hours saved weekly repays 24 in eight weeks.

   Changed values: `{"net_saved": 3.0, "payback_weeks": 8.0}`

4. At week 12 total effort is 60 versus 48 hours.

   Changed values: `{"manual_at_12": 60.0, "auto_at_12": 48.0, "saved_at_12": 12.0}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executed Python decision arithmetic. Inputs are estimates, not measured outcomes.

## Explore (remaining exploration time)

Predict which line will be lower at week 12. Lower requests to 5: the lines become parallel. Why does the 24-hour build cost never get repaid? Then raise upkeep to 6 and explain why the gap grows.

Open distinguished-engineer.html for the executable model.

Model limits: The browser calculates synthetic effort with constant demand and maintenance. It omits adoption, uncertainty, incidents, financial valuation, and risk reduction. This is a decision aid, not a funding algorithm.

## Quiz (4 minutes)

1. 24 build hours; 3 net hours saved weekly. When is effort equal?
   - Week 3
   - Week 5
   - Week 8

2. At 5 requests weekly and 1 upkeep hour, what is net saving?
   - 0 hours/week
   - 1 hour/week
   - 5 hours/week

3. Little hour savings, but fewer dangerous manual errors: what next?
   - Reject automatically
   - Assess risk reduction separately
   - Pretend upkeep is zero

4. What would you measure before funding this project?
5. How would twice as much exception handling change the decision?

<details><summary>Answer key — attempt first</summary>

1. Week 8. 24/3 = 8. Counting all 5 manual hours as savings ignores remaining work.

2. 0 hours/week. Manual is 1.25 hours; residual review is 0.25 plus 1 upkeep.

3. Assess risk reduction separately. Make other benefits explicit instead of changing the arithmetic.

</details>

## Sources

- [Google SRE Workbook: eliminating toil](https://sre.google/workbook/eliminating-toil/) — Book published 2018; living online chapter; checked 2026-10-07.
