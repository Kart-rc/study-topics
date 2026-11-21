# A technology radar needs movement evidence—not a prettier dot

Distinguished Engineer · Day61 · 15 minutes

Turn an internal technology radar into a small, reviewable portfolio of evidence-backed adoption policies.

## Recall (2 minutes)

<p><a href="../Day27/distinguished-engineer.html">Day27: Standardize the guardrail—not every implementation</a></p><p>What should the shared platform contract standardize?</p><details><summary>Recall first, then reveal the refresher</summary><p>Observable safety and operability outcomes. Common outcomes allow different valid implementations.</p></details><p><a href="../Day34/distinguished-engineer.html">Day34: Let the data plane keep working when the control plane is sick</a></p><p>The control plane is down but data nodes have valid version 17. Desired behavior?</p><details><summary>Recall first, then reveal the refresher</summary><p>Continue existing traffic on version 17 and block management changes. Static stability preserves known-good service while management is impaired.</p></details>

## Understand (4 minutes)

A grocery shelf label says what the store will stock, not which package got the loudest applause. A technology-radar ring should work the same way: it expresses the organization's current use policy.

Assess means learn without creating production dependency. Trial means use in a bounded production context that can carry the risk. Adopt means a proven default for an appropriate context. Caution means do not start new use until named concerns are resolved. Movement needs evidence, an owner, a review date, and an explicit next test. Otherwise the radar becomes decoration.



Three data teams ask to make the synthetic CatalogBridge metadata client the platform default. A demo puts it in Assess. One bounded production workload with rollback and telemetry can justify Trial under the company's local policy. It moves to Adopt only after evidence from three materially different workloads shows the same operating guardrails work. A failed rollback moves it to Caution until the return path is repaired.



## Read the visual

One candidate moves through four evidence packets. The ring, owner, review date, and next test change together, showing that the dot is a use policy rather than a popularity score.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a technology radar when teams face repeated platform choices and need a visible default, bounded experiments, and explicit retirement guidance.

**Practical example.** A data-platform group must decide whether a new metadata client is only worth studying, safe for one production pilot, or ready to become the supported default.

**How to decide.** Define local entry and exit evidence for every ring, cap concurrent trials, name a champion and review date, and publish context. Use a short decision record instead when only one team and one decision are involved.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
packet={'production_contexts':1,'rollback_tested':True,'critical_failure':False}
ring='Caution' if packet['critical_failure'] else ('Adopt' if packet['production_contexts']>=3 and packet['rollback_tested'] else ('Trial' if packet['production_contexts']>=1 and packet['rollback_tested'] else 'Assess'))
record={'ring':ring,'owner':'platform_council','review_on':'2027-02-21'}
result={**record,'next_evidence':'different_workload' if ring=='Trial' else 'bounded_pilot'}
```

1. Record evidence for one bounded production pilot.

   Changed values: `{"packet": {"production_contexts": 1, "rollback_tested": true, "critical_failure": false}}`

2. Apply the organization's explicit local movement rule.

   Changed values: `{"ring": "Trial"}`

3. Attach accountability and a time to revisit the policy.

   Changed values: `{"record": {"ring": "Trial", "owner": "platform_council", "review_on": "2027-02-21"}}`

4. Publish the next evidence needed, not only the current dot.

   Changed values: `{"result": {"ring": "Trial", "owner": "platform_council", "review_on": "2027-02-21", "next_evidence": "different_workload"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This local model is an original governance rule, not Thoughtworks' universal scoring formula. It reduces evidence to four packets and cannot measure security, regulatory fit, ecosystem health, switching cost, skill availability, performance, vendor risk, or the quality of production experience.

## Explore (remaining exploration time)

Move CatalogBridge through demo, bounded production, three-context evidence, and failed rollback. Predict the ring before revealing the local policy result.

Open distinguished-engineer.html for the executable model.

Model limits: This local model is an original governance rule, not Thoughtworks' universal scoring formula. It reduces evidence to four packets and cannot measure security, regulatory fit, ecosystem health, switching cost, skill availability, performance, vendor risk, or the quality of production experience.

## Quiz (4 minutes)

1. A polished demo has no production use. What is the strongest supported ring in the local policy?
   - Assess
   - Trial
   - Adopt

2. Why does the Trial ring need a WIP limit?
   - To keep experiments few enough to support and finish
   - To maximize the number of logos
   - To make every trial permanent

3. When should a radar entry be replaced by a simpler decision record?
   - One team faces one bounded choice with no recurring portfolio policy
   - Many teams repeatedly choose among platform defaults
   - The organization needs explicit retirement guidance

4. Which technology choice is repeated often enough to deserve a portfolio-level policy?
5. What exact production evidence would move it one ring, and what failure would move it outward?

<details><summary>Answer key — attempt first</summary>

1. Assess. The demo supports learning, not a production recommendation.

2. To keep experiments few enough to support and finish. A trial consumes operating attention and must produce a decision.

3. One team faces one bounded choice with no recurring portfolio policy. A radar earns its cost when it coordinates repeated choices across a portfolio.

</details>

## Sources

- [Thoughtworks Technology Radar, Volume 35](https://www.thoughtworks.com/content/dam/thoughtworks/documents/radar/2026/11/tr_technology_radar_vol_35_en.pdf) — Primary Technology Advisory Board publication; November 2026; checked 2026-11-21.
- [Thoughtworks Technology Radar FAQ](https://www.thoughtworks.com/radar/faq) — Official definitions and evidence rules; current page; checked 2026-11-21.
- [Thoughtworks Enterprise Architecture Playbook: Tech radar](https://www.thoughtworks.com/content/dam/thoughtworks/documents/report/thoughtworks-enterprise-architecture-playbook.pdf) — Official playbook; 2025; recommends context, a Trial WIP limit, and quarterly review; checked 2026-11-21.
