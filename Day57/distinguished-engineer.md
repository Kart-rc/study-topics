# A paved road needs an escape hatch—and a route back

Distinguished Engineer · Day57 · 15 minutes

Standardize the common platform path without turning legitimate exceptions into permanent shadow infrastructure.

## Recall (2 minutes)

<p><a href="../Day32/distinguished-engineer.html">Day32: Put toil on a budget before it owns the roadmap</a></p><p>What makes manual onboarding likely toil?</p><details><summary>Recall first, then reveal the refresher</summary><p>It repeats, is automatable, and scales with tenants. Toil is classified by work characteristics, not taste.</p></details><p><a href="../Day36/distinguished-engineer.html">Day36: An owner needs a decision right, not just a name</a></p><p>A platform catalog names an owner but lists no authority. What is missing?</p><details><summary>Recall first, then reveal the refresher</summary><p>The decisions that owner may take. Ownership must connect to action.</p></details>

## Understand (4 minutes)

A highway makes the common trip fast. An ambulance still needs an exit. If that exit becomes an unmarked dirt road with no way back, every later trip becomes harder.

A platform “paved road” packages the safe common path: templates, APIs, observability, security, and support. Teams should adopt it because it reduces cognitive load, not only because policy mandates it. Real exceptions still exist. A disciplined escape hatch records the unmet need, owner, controls, expiry or review date, and re-entry condition. Otherwise the exception becomes a second platform.



Forty producer teams use the standard Spark batch template. Team p57 needs a GPU library the standard image lacks. Approve a bounded custom image for 60 days, retain scanning and lineage controls, name an owner, and define “return when platform image v12 includes the library.”



## Read the visual

A branch leaves the golden path for one unmet need while controls and a dated re-entry condition determine whether it returns or becomes a shadow platform.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a governed escape hatch when the platform path blocks a material requirement but the team can preserve non-negotiable safety and operability controls.

**Practical example.** One regulated data-science workload needs a specialized runtime before the enterprise EKS Spark image supports it.

**How to decide.** First ask whether the platform should absorb the need. If not yet, approve the smallest exception with owner, controls, review date, and re-entry test. Reject exceptions that bypass mandatory security or have no accountable operating model.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
exception={'owner':True,'controls':True,'review_days':60,'reentry':'image-v12'}
governed=exception['owner'] and exception['controls']
temporary=exception['review_days']>0 and bool(exception['reentry'])
result={'approved':governed and temporary,'shadow_platform':not(governed and temporary),'reentry':exception['reentry']}
```

1. Capture the four pieces that keep an exception bounded.

   Changed values: `{"exception": {"owner": true, "controls": true, "review_days": 60, "reentry": "image-v12"}}`

2. Keep accountability and mandatory controls.

   Changed values: `{"governed": true}`

3. Require a review clock and a concrete route back.

   Changed values: `{"temporary": true}`

4. Approve the bounded path without creating a permanent second standard.

   Changed values: `{"result": {"approved": true, "shadow_platform": false, "reentry": "image-v12"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model scores one exception on four fields. It does not measure platform value, team capability, legal risk, runtime vulnerabilities, funding, roadmap priority, migration cost, organizational power, or whether the exception should become a standard feature.

## Explore (remaining exploration time)

Toggle p57 from an undocumented fork to a time-bounded exception. Predict support load and the chance of returning to the platform.

Open distinguished-engineer.html for the executable model.

Model limits: The model scores one exception on four fields. It does not measure platform value, team capability, legal risk, runtime vulnerabilities, funding, roadmap priority, migration cost, organizational power, or whether the exception should become a standard feature.

## Quiz (4 minutes)

1. What makes p57's escape hatch governable?
   - Named owner, retained controls, review date, and re-entry condition
   - A private repository
   - A permanent waiver

2. Why should adoption be value-led?
   - Teams sustain use when the platform removes real cognitive and operational burden
   - Mandates always improve usability
   - Every workload is identical

3. When should the exception be rejected?
   - It bypasses a mandatory control with no compensating design
   - The platform lacks one library today
   - It has a 60-day review

4. Which current exception has no re-entry condition and is becoming a second platform?
5. What unmet need should the paved road absorb next because several teams share it?

<details><summary>Answer key — attempt first</summary>

1. Named owner, retained controls, review date, and re-entry condition. The exception stays bounded and observable.

2. Teams sustain use when the platform removes real cognitive and operational burden. A platform is a product, not only a control point.

3. It bypasses a mandatory control with no compensating design. An escape hatch is not permission to abandon non-negotiable risk controls.

</details>

## Sources

- [CNCF Platforms White Paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/) — CNCF TAG App Delivery guidance; checked November 17, 2026; checked 2026-11-17.
- [CNCF Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) — CNCF TAG App Delivery guidance; checked November 17, 2026; checked 2026-11-17.
