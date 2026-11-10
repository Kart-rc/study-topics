# Put things that change together behind one ownership boundary

Distinguished Engineer · Day49 · 15 minutes

Use change coupling and business capability—not the org chart alone—to test service and team boundaries.

## Recall (2 minutes)

<p><a href="../Day28/distinguished-engineer.html">Day28: Measure the journey, not the sign-ups</a></p><p>Which metric best represents platform activation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Teams completing the valuable production journey. A platform earns value when users complete a useful outcome.</p></details><p><a href="../Day32/distinguished-engineer.html">Day32: Put toil on a budget before it owns the roadmap</a></p><p>What makes manual onboarding likely toil?</p><details><summary>Recall first, then reveal the refresher</summary><p>It repeats, is automatable, and scales with tenants. Toil is classified by work characteristics, not taste.</p></details>

## Understand (4 minutes)

A kitchen works faster when the cook who seasons a dish can also taste it. If every change needs a handoff to a separate “spice team,” the organization has drawn a boundary through one unit of work.

A useful service boundary has high cohesion inside and low coupling outside: functions that change together live together, and one team can test, deploy, and operate the capability independently. Team ownership should align to that boundary, not passively dictate it.



In six checkout changes, price calculation and promotion eligibility changed together five times. Splitting them into “pricing API” and “campaign API” creates five coordinated releases. Keeping both inside the checkout capability leaves only the less frequent payment-provider contract crossing a boundary.



## Read the visual

The same observed change pairs flow through two ownership maps, making coordination cost visible before debating service names.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use change-coupling evidence when a service split creates coordinated releases, chatty calls, shared schemas, or incidents that bounce between teams.

**Practical example.** Checkout, promotion, and payment teams must attend the same release call for nearly every pricing change.

**How to decide.** Co-locate capabilities that change together and can share one operational objective. Keep a boundary when independent scale, security, resilience, or domain language outweighs coordination cost.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
changes=[('price','promotion'),('price','promotion'),('price','promotion'),('price','promotion'),('price','promotion'),('checkout','payment')]
layer_owner={'price':'pricing-team','promotion':'campaign-team','checkout':'checkout-team','payment':'payments-team'}
cap_owner={'price':'checkout-team','promotion':'checkout-team','checkout':'checkout-team','payment':'payments-team'}
layer_cross=sum(layer_owner[a]!=layer_owner[b] for a,b in changes); capability_cross=sum(cap_owner[a]!=cap_owner[b] for a,b in changes); result={'layer_cross':layer_cross,'capability_cross':capability_cross}
```

1. Record six synthetic change pairs from release history.

   Changed values: `{"changes": [["price", "promotion"], ["price", "promotion"], ["price", "promotion"], ["price", "promotion"], ["price", "promotion"], ["checkout", "payment"]]}`

2. Model a technical or component-oriented ownership split.

   Changed values: `{"layer_owner": {"price": "pricing-team", "promotion": "campaign-team", "checkout": "checkout-team", "payment": "payments-team"}}`

3. Model a business-capability ownership proposal.

   Changed values: `{"cap_owner": {"price": "checkout-team", "promotion": "checkout-team", "checkout": "checkout-team", "payment": "payments-team"}}`

4. Count how often each proposal turns one change into cross-team coordination.

   Changed values: `{"layer_cross": 6, "capability_cross": 1, "result": {"layer_cross": 6, "capability_cross": 1}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is a six-change coupling sample, not an automatic decomposition algorithm. It omits regulatory segregation, team skill, data ownership, runtime latency, transaction boundaries, scaling, vendor constraints, and future product direction.

## Explore (remaining exploration time)

Switch between a technical-layer split and a business-capability split. Predict the number of cross-team change pairs.

Open distinguished-engineer.html for the executable model.

Model limits: This is a six-change coupling sample, not an automatic decomposition algorithm. It omits regulatory segregation, team skill, data ownership, runtime latency, transaction boundaries, scaling, vendor constraints, and future product direction.

## Quiz (4 minutes)

1. Price and promotion change together in five of six releases. What does that suggest?
   - Test whether they belong in one cohesive capability boundary
   - Split them further by programming language
   - Share their database across every team

2. Why align ownership to a business boundary?
   - One team can change, test, deploy, and operate the capability
   - Every service becomes the same size
   - Network calls disappear automatically

3. When might you keep a boundary despite co-change?
   - When security, resilience, scale, or domain semantics require independent control
   - Whenever the org chart already exists
   - When two teams use the same language

4. Which two components in your estate most often require a coordinated release?
5. Which non-change constraint could still justify keeping them separate?

<details><summary>Answer key — attempt first</summary>

1. Test whether they belong in one cohesive capability boundary. Repeated co-change is evidence that the current boundary cuts through one unit of work.

2. One team can change, test, deploy, and operate the capability. Autonomy is an ownership and change-flow property, not a line-count target.

3. When security, resilience, scale, or domain semantics require independent control. Coordination cost is one input; architecture characteristics can justify separation.

</details>

## Sources

- [AWS Well-Architected REL03-BP02](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_service_architecture_business_domains.html) — Official AWS Well-Architected guidance; domain-focused services and loose coupling; checked 2026-11-09.
- [AWS Prescriptive Guidance: service per team](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/service-per-team.html) — Official AWS guidance; ownership and autonomy trade-offs; checked 2026-11-09.
- [Azure Architecture Center: microservices](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices) — Official Microsoft architecture guidance; change-together cohesion; checked 2026-11-09.
