# Measure the journey, not the sign-ups

Distinguished Engineer · Day28 · 15 minutes

Evaluate a platform by successful user outcomes and retained use, not account creation.

## Recall (2 minutes)

<p><a href="../Day23/distinguished-engineer.html">Day23: Let the new system observe production before production observes it</a></p><p>Shadow returns $27; legacy returns $25. What sees the customer?</p><details><summary>Recall first, then reveal the refresher</summary><p>$25. The legacy path still owns the response.</p></details><p><a href="../Day11/distinguished-engineer.html">Day11: A backup is a promise until you restore it</a></p><p>The recovery point is 11:50, failure is noon, and service returns at 12:25. Targets are RPO 5 and RTO 30 minutes. Which timing target is missed?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only RPO. The ten-minute data gap misses RPO 5. Twenty-five minutes of downtime meets RTO 30. Finishing sooner does not recreate missing orders.</p></details>

## Understand (4 minutes)

A gym with 1,000 memberships is not successful if only 20 people finish a workout. Platform sign-ups are equally weak evidence. The meaningful journey is narrower: team starts → service created → first safe production deployment → team returns and deploys again.

Each drop is a product signal. A steep fall before production may mean the golden path is incomplete, documentation is unclear, or a control still requires tickets.



100 teams open the portal, 72 create a service, 45 reach production, and 36 deploy again within 30 days. Activation is 45%, not 100%. Retained activation is 36%. Interview the 27 teams lost between service creation and production before adding more templates.



## Read the visual

The narrowing funnel encodes the claim: every later stage contains stronger evidence of delivered user value than the larger stage above it.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a journey funnel when evaluating an internal developer/data platform or prioritizing platform roadmap work.

**Practical example.** A new service template has many clicks, but teams abandon it when identity, data access, or production approval still requires manual work.

**How to decide.** Define one valuable completed journey, instrument each transition, segment by team type, combine behavior with interviews, and avoid turning the metric into a quota.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
journey={'opened':100,'created':72,'production':45,'retained':36}
activation=journey['production']/journey['opened']
retained_activation=journey['retained']/journey['opened']
largest_drop=max([('open_to_create',28),('create_to_prod',27),('prod_to_return',9)],key=lambda x:x[1])[0]
```

1. Count teams at meaningful journey milestones.

   Changed values: `{"journey": {"opened": 100, "created": 72, "production": 45, "retained": 36}}`

2. Activation requires the first valuable outcome.

   Changed values: `{"activation": 0.45}`

3. Retained use is stronger than a one-time success.

   Changed values: `{"retained_activation": 0.36}`

4. Use the largest loss to focus discovery.

   Changed values: `{"largest_drop": "open_to_create"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: A funnel does not prove causality or capture quality, toil shifted elsewhere, security, satisfaction, or business value. Instrumentation can be incomplete and targets can be gamed; pair it with qualitative research and delivery/reliability outcomes.

## Explore (remaining exploration time)

Change how many teams reach production. The funnel and the resulting decision change together.

Open distinguished-engineer.html for the executable model.

Model limits: A funnel does not prove causality or capture quality, toil shifted elsewhere, security, satisfaction, or business value. Instrumentation can be incomplete and targets can be gamed; pair it with qualitative research and delivery/reliability outcomes.

## Quiz (4 minutes)

1. Which metric best represents platform activation?
   - Portal accounts created
   - Teams completing the valuable production journey
   - Templates published

2. A large drop occurs before production. What next?
   - Add more sign-up banners
   - Study that transition with data and user interviews
   - Delete the funnel

3. Can this funnel prove the platform caused faster delivery?
   - Yes by itself
   - No; combine with comparisons, outcomes, and qualitative evidence
   - Only if sign-ups are high

4. What single completed journey best represents value on your data platform?
5. How could teams game your chosen platform adoption metric?

<details><summary>Answer key — attempt first</summary>

1. Teams completing the valuable production journey. A platform earns value when users complete a useful outcome.

2. Study that transition with data and user interviews. The drop identifies where to investigate friction.

3. No; combine with comparisons, outcomes, and qualitative evidence. Descriptive conversion is useful but not causal proof.

</details>

## Sources

- [CNCF Platforms White Paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/) — CNCF TAG App Delivery; checked 2026-10-18.
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/) — Living documentation; checked 2026-10-18.
- [DORA metrics](https://dora.dev/guides/dora-metrics-four-keys/) — Living research guidance; checked 2026-10-18.
