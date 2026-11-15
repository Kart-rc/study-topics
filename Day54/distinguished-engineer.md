# Eight teams logged in; only four finished—measure task success, not platform traffic

Distinguished Engineer · Day54 · 15 minutes

Pair adoption with task completion and user experience so platform activity cannot masquerade as reduced cognitive load.

## Recall (2 minutes)

<p><a href="../Day36/distinguished-engineer.html">Day36: An owner needs a decision right, not just a name</a></p><p>A platform catalog names an owner but lists no authority. What is missing?</p><details><summary>Recall first, then reveal the refresher</summary><p>The decisions that owner may take. Ownership must connect to action.</p></details><p><a href="../Day8/distinguished-engineer.html">Day8: Fault injection: bound the experiment before you create the fault</a></p><p>A stop alarm needs three 60-second breaching periods. What should the experiment owner assume?</p><details><summary>Recall first, then reveal the refresher</summary><p>Potentially harmful exposure continues while evidence accumulates. The evaluation window is part of the blast-radius budget, not a grace period without impact.</p></details>

## Understand (4 minutes)

A busy help desk is not automatically a helpful help desk. A long queue may mean the opposite.

Platform page views and logins prove exposure. They do not prove that engineers completed work faster, with fewer failures, or with less confusion. Measure a chain: eligible teams, active users, successful representative tasks, and user feedback. The denominator matters at every step.



Ten teams are eligible for the deployment portal. Eight log in, so adoption is 80%. Only four complete a production-safe deployment within the target time, so task success is 40% of eligible teams—or 50% of adopters. The right next move is to repair the workflow, not celebrate traffic or mandate more use.



## Read the visual

A three-stage funnel keeps eligible, active, and successful teams on explicit denominators, exposing whether reach or task quality is the constraint.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use an outcome scorecard when an internal platform has adoption goals and leadership needs to decide whether to invest, mandate, or retire a path.

**Practical example.** A platform team sees rising portal sessions while support tickets and failed production deployments also rise.

**How to decide.** Define eligible users, a small set of representative tasks, completion quality/time, and satisfaction. Segment by user type. Treat adoption as one signal, not the objective. A small platform may use interviews and task traces before building a large metrics system.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
eligible=10; active=8; successful=4
adoption=active/eligible
success_of_eligible=successful/eligible; success_of_adopters=successful/active
result={'adoption_pct':int(adoption*100),'eligible_success_pct':int(success_of_eligible*100),'adopter_success_pct':int(success_of_adopters*100),'decision':'repair-task-flow'}
```

1. Count the same population through a task funnel.

   Changed values: `{"eligible": 10, "active": 8, "successful": 4}`

2. Measure reach among eligible teams.

   Changed values: `{"adoption": 0.8}`

3. Separate population impact from post-entry quality.

   Changed values: `{"success_of_eligible": 0.4, "success_of_adopters": 0.5}`

4. Choose the next action from the leak, not the busiest number.

   Changed values: `{"result": {"adoption_pct": 80, "eligible_success_pct": 40, "adopter_success_pct": 50, "decision": "repair-task-flow"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model uses three counts and no causal inference. It does not measure developer productivity, survey bias, task difficulty, platform age, team mix, delivery performance, or business outcomes. Metrics should guide investigation, not rank people.

## Explore (remaining exploration time)

Change eligible, active, and successful team counts. Predict whether the problem is awareness, adoption, or task quality.

Open distinguished-engineer.html for the executable model.

Model limits: The model uses three counts and no causal inference. It does not measure developer productivity, survey bias, task difficulty, platform age, team mix, delivery performance, or business outcomes. Metrics should guide investigation, not rank people.

## Quiz (4 minutes)

1. Eight of ten teams log in; four deploy successfully. What does 80% prove?
   - Adoption among eligible teams, not task value
   - The platform doubled productivity
   - Every team prefers the platform

2. Why report success against both eligible teams and adopters?
   - The two denominators separate reach from workflow quality
   - It makes every percentage larger
   - It removes the need for interviews

3. When is a mandate premature?
   - When usage is high but representative tasks still fail or frustrate users
   - When task success is measured
   - When the platform has documentation

4. What representative platform task would reveal real value better than monthly active users?
5. Which segmentation would show that an aggregate success rate hides a failing team type?

<details><summary>Answer key — attempt first</summary>

1. Adoption among eligible teams, not task value. Activity measures use, while completion and experience measure whether the use worked.

2. The two denominators separate reach from workflow quality. Eligible-team success shows population impact; adopter success shows how well the path works after entry.

3. When usage is high but representative tasks still fail or frustrate users. More forced traffic magnifies a broken workflow rather than fixing it.

</details>

## Sources

- [DORA capability: Platform engineering](https://dora.dev/capabilities/platform-engineering/) — DORA research guidance; checked November 14, 2026; checked 2026-11-14.
- [DORA: Choosing measurement frameworks to fit organizational goals](https://dora.dev/research/2025/measurement-frameworks/) — DORA research guidance; published 2025; checked November 14, 2026; checked 2026-11-14.
- [Google Cloud: Improving developers' platform experience](https://cloud.google.com/blog/products/application-development/how-platform-engineers-can-improve-their-developers-experience) — Google Cloud engineering guidance; published 2024; checked November 14, 2026; checked 2026-11-14.
