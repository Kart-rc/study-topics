# Decision velocity: match governance to reversibility

Distinguished Engineer · Day6 · 15 minutes

Choose a decision mechanism from reversibility, blast radius, evidence cost, and rollback—not organizational rank.

## Recall (2 minutes)

<p><a href="../Day3/distinguished-engineer.html">Day3: Cell-based architecture: make failure scope a product decision</a></p><p>With 1,000 evenly assigned tenants and 10 cells, what is the modeled one-cell impact?</p><details><summary>Recall first, then reveal the refresher</summary><p>100 tenants. The simplified upper bound is ceil(1,000 / 10) = 100.</p></details><p><a href="../Day5/distinguished-engineer.html">Day5: Dependency isolation: spend concurrency by failure domain</a></p><p>A dependency&#x27;s latency rises tenfold while arrival rate stays fixed. What happens to its concurrency demand?</p><details><summary>Recall first, then reveal the refresher</summary><p>It rises roughly tenfold. Little&#x27;s Law links in-flight work to rate times time.</p></details>

## Understand (4 minutes)

Decision quality and decision speed are both system properties. A one-size review process protects irreversible choices but taxes reversible experiments. Amazon's 2016 shareholder letter calls many reversible choices “two-way doors” and argues for lightweight process, course correction, and decisions before perfect information.

The useful engineering move is classification, not a slogan. Ask what state changes, how far failure propagates, whether rollback restores prior semantics and data, how quickly evidence arrives, and who bears the risk. A change is not reversible merely because a deployment can be rolled back: an exposed contract, leaked data, irreversible migration, or customer promise may survive the rollback.



Original teaching case: Team A wants to change an internal dashboard's default sort order behind a flag. Team B wants to replace an externally consumed Kafka event schema and delete the old field after one week. Both changes have code rollback buttons; only the first is cheaply reversible.

The dashboard can use a named owner, a hypothesis, a one-week metric, and an automatic rollback threshold. The schema change needs compatibility analysis, consumer inventory, a migration period, explicit sign-off, and a durable rollback/data-repair plan.

governance weight ≈ irreversibility + blast radius + uncertainty
rollback quality = code + data + contract + time

A Distinguished Engineer makes the decision path explicit and time-bounded. Heavy review without a decision date is avoidance; lightweight review without an observable rollback is wishful thinking.



## Explore (5 minutes)

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
