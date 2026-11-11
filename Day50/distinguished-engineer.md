# A pilot that avoids the hard case proves only the easy case

Distinguished Engineer · Day50 · 15 minutes

Select a low-blast-radius pilot that still exercises the majority of in-scope capabilities.

## Recall (2 minutes)

<p><a href="../Day34/distinguished-engineer.html">Day34: Let the data plane keep working when the control plane is sick</a></p><p>The control plane is down but data nodes have valid version 17. Desired behavior?</p><details><summary>Recall first, then reveal the refresher</summary><p>Continue existing traffic on version 17 and block management changes. Static stability preserves known-good service while management is impaired.</p></details><p><a href="../Day6/distinguished-engineer.html">Day6: Decision velocity: match governance to reversibility</a></p><p>Why is a deployment rollback button insufficient evidence of reversibility?</p><details><summary>Recall first, then reveal the refresher</summary><p>Data and external contracts may remain changed. True reversal must account for state and commitments beyond the binary.</p></details>

## Understand (4 minutes)

A driving test held only in an empty parking lot is safe, but it does not prove motorway readiness.

A good platform pilot balances two dimensions: failure must be affordable, and the workload must still exercise representative risks. Predefine measurable success and the next decision. Recommendations and redesign findings are useful evidence, not pilot failure.



Three pipeline candidates exist. A tiny CSV batch is safe but exercises 2 of 7 required capabilities. A payments stream exercises all 7 but has unacceptable blast radius. A duplicated order stream exercises 6 of 7 with synthetic customer data and reversible cutover. The third is the decision-grade pilot.



## Read the visual

Three candidates sit on the same coverage and blast-radius scales, revealing why easiest and most complete can both be wrong.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this method before declaring a platform pattern ready for a broader migration wave.

**Practical example.** Choose a shadow order pipeline that includes schema drift, backfill, observability, privacy, and rollback without serving production decisions.

**How to decide.** Prefer low criticality plus high scope coverage. If no candidate has both, create a shadow or replay environment rather than selecting an easy but unrepresentative demo.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
candidates=[{'name':'tiny batch','coverage':20,'blast':10},{'name':'payments live','coverage':100,'blast':95},{'name':'orders shadow','coverage':85,'blast':25}]
eligible=[x for x in candidates if x['coverage']>=70 and x['blast']<=40]
chosen=max(eligible,key=lambda x:x['coverage']-x['blast'])
result={'chosen':chosen['name'],'coverage':chosen['coverage'],'blast':chosen['blast']} 
```

1. Describe three pilot candidates.

   Changed values: `{"candidates": [{"name": "tiny batch", "coverage": 20, "blast": 10}, {"name": "payments live", "coverage": 100, "blast": 95}, {"name": "orders shadow", "coverage": 85, "blast": 25}]}`

2. Apply the predeclared coverage and blast-radius gates.

   Changed values: `{"eligible": [{"name": "orders shadow", "coverage": 85, "blast": 25}]}`

3. Rank only candidates that passed both hard gates.

   Changed values: `{"chosen": {"name": "orders shadow", "coverage": 85, "blast": 25}}`

4. Record the choice and its evidence dimensions.

   Changed values: `{"result": {"chosen": "orders shadow", "coverage": 85, "blast": 25}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The weighted score is a decision aid, not an AWS formula. It omits political sponsorship, opportunity cost, regulatory approval, team skill, dependency timing, and qualitative failure modes.

## Explore (remaining exploration time)

Score three candidates for risk, scope coverage, and evidence quality; move the threshold and observe the choice.

Open distinguished-engineer.html for the executable model.

Model limits: The weighted score is a decision aid, not an AWS formula. It omits political sponsorship, opportunity cost, regulatory approval, team skill, dependency timing, and qualitative failure modes.

## Quiz (4 minutes)

1. Which pilot is strongest?
   - The reversible shadow workload covering most capabilities
   - The easiest possible demo
   - The highest-blast-radius production flow

2. Why define success before starting?
   - To prevent post-hoc storytelling and make the next decision explicit
   - To guarantee zero findings
   - To remove users

3. What invalidates the score?
   - An unmodeled regulatory or dependency risk
   - A pilot recommendation
   - A reversible cutover

4. Which candidate in your roadmap is safe but too unrepresentative?
5. What evidence and next decision will be fixed before the pilot starts?

<details><summary>Answer key — attempt first</summary>

1. The reversible shadow workload covering most capabilities. It balances representative evidence with affordable failure.

2. To prevent post-hoc storytelling and make the next decision explicit. Predetermined evidence supports a real go/no-go decision.

3. An unmodeled regulatory or dependency risk. Weighted arithmetic cannot erase a hard constraint.

</details>

## Sources

- [AWS Prescriptive Guidance: Running a pilot](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-migration-connect/pilot.html) — Official AWS guidance; checked November 10, 2026; checked 2026-11-10.
- [AWS Prescriptive Guidance: application prioritization](https://docs.aws.amazon.com/prescriptive-guidance/latest/application-portfolio-assessment-guide/prioritization-and-migration-strategy.html) — Official AWS guidance; checked November 10, 2026; checked 2026-11-10.
