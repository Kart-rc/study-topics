# Decision velocity: match governance to reversibility

Distinguished Engineer · Day6 · 15 minutes

Two teams ask for a fast decision.

## Recall (2 minutes)

<p><a href="../Day3/distinguished-engineer.html">Day3: Cell-based architecture: make failure scope a product decision</a></p><p>With 1,000 evenly assigned tenants and 10 cells, what is the modeled one-cell impact?</p><details><summary>Recall first, then reveal the refresher</summary><p>100 tenants. The simplified upper bound is ceil(1,000 / 10) = 100.</p></details><p><a href="../Day5/distinguished-engineer.html">Day5: Dependency isolation: spend concurrency by failure domain</a></p><p>A dependency&#x27;s latency rises tenfold while arrival rate stays fixed. What happens to its concurrency demand?</p><details><summary>Recall first, then reveal the refresher</summary><p>It rises roughly tenfold. Little&#x27;s Law links in-flight work to rate times time.</p></details>

## Understand (4 minutes)

Two teams ask for a fast decision. One changes a dashboard sort order. The other deletes a field used by external consumers. Both can roll back code, but their consequences are very different.

Match review effort to how hard the whole change is to reverse. Consider data, consumer contracts, scope, and uncertainty—not only the deployment button. Reversible experiments can move quickly with an owner and a clear stop rule.



The dashboard has a flag and unchanged stored data. The schema deletion lacks a safe old-reader path. The small decision rule below sends the second proposal to a compatibility review. It makes the assumptions visible; it is not an organizational policy engine.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
dashboard = {"code_reversible": True, "data_compatible": True, "external_consumers": False}
schema = {"code_reversible": True, "data_compatible": False, "external_consumers": True}
dashboard_path = "bounded experiment" if dashboard["data_compatible"] else "compatibility review"
schema_path = "bounded experiment" if schema["data_compatible"] else "compatibility review"
missing_evidence = "consumer inventory and migration/repair plan"
```

1. This example has a narrow, reversible surface.

   Changed values: `{"dashboard": {"code_reversible": true, "data_compatible": true, "external_consumers": false}}`

2. The schema change has lasting external consequences.

   Changed values: `{"schema": {"code_reversible": true, "data_compatible": false, "external_consumers": true}}`

3. A small experiment is plausible for the dashboard.

   Changed values: `{"dashboard_path": "bounded experiment"}`

4. The schema proposal needs deeper work.

   Changed values: `{"schema_path": "compatibility review"}`

5. Name what would make the next decision possible.

   Changed values: `{"missing_evidence": "consumer inventory and migration/repair plan"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This rule illustrates reasoning, not a universal approval policy. Security, legal constraints, customer importance, and unknown dependencies can change the review path.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Decision quality and decision speed are both system properties. A one-size review process protects irreversible choices but taxes reversible experiments. Amazon's 2016 shareholder letter calls many reversible choices “two-way doors” and argues for lightweight process, course correction, and decisions before perfect information.</p><p>The useful engineering move is classification, not a slogan. Ask what state changes, how far failure propagates, whether rollback restores prior semantics and data, how quickly evidence arrives, and who bears the risk. A change is not reversible merely because a deployment can be rolled back: an exposed contract, leaked data, irreversible migration, or customer promise may survive the rollback.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> Team A wants to change an internal dashboard's default sort order behind a flag. Team B wants to replace an externally consumed Kafka event schema and delete the old field after one week. Both changes have code rollback buttons; only the first is cheaply reversible.</p><p>The dashboard can use a named owner, a hypothesis, a one-week metric, and an automatic rollback threshold. The schema change needs compatibility analysis, consumer inventory, a migration period, explicit sign-off, and a durable rollback/data-repair plan.</p><pre>governance weight ≈ irreversibility + blast radius + uncertainty
rollback quality = code + data + contract + time</pre><p>A Distinguished Engineer makes the decision path explicit and time-bounded. Heavy review without a decision date is avoidance; lightweight review without an observable rollback is wishful thinking.</p>

</details>

## Explore (remaining exploration time)

Classify the default values, then make rollback weaker. Explain which evidence would justify upgrading a two-way-door experiment into a one-way-door review.

Open distinguished-engineer.html for the executable model.

Model limits: A heuristic scoring exercise, not an approval policy. It assumes additive risk dimensions and treats rollback quality as one toggle. It omits regulatory obligations, security threat models, correlated organizational incentives, financial exposure, ethical impact, dependency ownership, asymmetric probabilities, and the actual cost of delay.

## Quiz (4 minutes)

1. Why is a deployment rollback button insufficient evidence of reversibility?
   - Data and external contracts may remain changed
   - Rollback buttons are always slow
   - Every change needs executive approval

2. What is the right process for a small, measurable, cheaply reversible experiment?
   - The same process as an irreversible data deletion
   - A lightweight, time-bounded decision with guardrails and rollback
   - No owner and no metrics

3. What is this calculator allowed to do?
   - Authorize the change
   - Replace risk specialists
   - Structure a conversation about review weight

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Data and external contracts may remain changed. True reversal must account for state and commitments beyond the binary.

2. A lightweight, time-bounded decision with guardrails and rollback. Governance should match the decision's actual reversibility and exposure.

3. Structure a conversation about review weight. The additive score is a teaching heuristic, not a production policy or approval.

</details>

## Sources

- [Amazon: Jeff Bezos' 2016 Letter to Shareholders](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders) — Letter covering 2016; published on About Amazon 2018-03-21; checked 2026-09-26.
