# Influence before the decision window closes—not after the answer is polished

Distinguished Engineer · Day64 · 15 minutes

Sequence cross-organization involvement early while labeling evidence, unknowns, and commitments honestly.

## Recall (2 minutes)

<p><a href="../Day35/distinguished-engineer.html">Day35: An ADR is evidence, not a forever rule</a></p><p>A recorded capacity assumption becomes false. First response?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reopen the decision with current evidence. The changed context is decision input.</p></details><p><a href="../Day39/distinguished-engineer.html">Day39: A game day needs a measurable hypothesis and a stop condition</a></p><p>Success falls to 97.8% and the stop threshold is 98%. What next?</p><details><summary>Recall first, then reveal the refresher</summary><p>Terminate the fault and restore the system. A stop condition is a guardrail, not a suggestion.</p></details>

## Understand (4 minutes)

If friends must choose a restaurant by noon, sending a perfect review at 2 PM does not help. Sending “the kitchen is definitely safe” at 9 AM before checking is also harmful.

Cross-organization technical influence has the same timing problem. A Distinguished Engineer should expose the decision question early, bring in the people who own constraints, and label what is known, provisional, and still being tested. This is an influence sequence: the right evidence reaches the right decision owner before the choice becomes expensive to change.



A platform team investigates a managed change-data-capture service for eight weeks. Consumer roadmaps lock in week 6. Waiting until week 8 produces a polished recommendation that no team has capacity to adopt. Instead, in week 2 the DE shares the problem, current evidence, open security and replay questions, and the week-5 test. Security and two consumer owners shape the test. The week-6 decision uses the new evidence without pretending the service was proven in week 2.



## Read the visual

A four-week timeline shows the same CDC investigation under four influence sequences. Late contact misses the roadmap lock; early overclaim creates a broken promise; honest or staged involvement brings bounded evidence and relevant constraints to the decision in time.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use an influence sequence when evidence takes time to develop but another team's budget, roadmap, security review, or vendor decision will close first.

**Practical example.** A data-platform group is evaluating managed CDC while security, finance, and two consumer teams are making commitments that determine whether adoption is possible.

**How to decide.** Engage named decision owners early with a bounded question, current evidence, unknowns, and the next test. Wait for a finished answer only when the decision is local, reversible, and no external planning window will close.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
window={'roadmap_lock_week':6,'full_research_week':8,'first_outreach_week':2}
packet={'known':'CDC reduces custom polling','unknowns':['replay recovery','security boundary'],'next_test_week':5}
participants=['platform owner','security owner','two consumer owners']
result={'window_preserved':window['first_outreach_week']<window['roadmap_lock_week'],'commitment':'conditional','decision_week':window['roadmap_lock_week'],'participants':participants}
```

1. Make the timing conflict visible before polishing the recommendation.

   Changed values: `{"window": {"roadmap_lock_week": 6, "full_research_week": 8, "first_outreach_week": 2}}`

2. Separate current evidence from unknowns and name the next evidence-producing test.

   Changed values: `{"packet": {"known": "CDC reduces custom polling", "unknowns": ["replay recovery", "security boundary"], "next_test_week": 5}}`

3. Invite owners who can add relevant constraints rather than broadcasting to everyone.

   Changed values: `{"participants": ["platform owner", "security owner", "two consumer owners"]}`

4. Record a conditional decision path: early influence without a premature technology commitment.

   Changed values: `{"result": {"window_preserved": true, "commitment": "conditional", "decision_week": 6, "participants": ["platform owner", "security owner", "two consumer owners"]}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is an original local timing model, not Spotify's or Thoughtworks' influence process. It assumes one roadmap lock and four synthetic weeks. It omits trust history, power dynamics, procurement, regulatory review, calendar availability, decision rights, reversibility, and evidence quality.

## Explore (remaining exploration time)

Switch among a late broadcast, an early overclaim, an honest early note, and a staged sequence. Predict whether the week-6 roadmap decision receives usable evidence without creating a false commitment.

Open distinguished-engineer.html for the executable model.

Model limits: This is an original local timing model, not Spotify's or Thoughtworks' influence process. It assumes one roadmap lock and four synthetic weeks. It omits trust history, power dynamics, procurement, regulatory review, calendar availability, decision rights, reversibility, and evidence quality.

## Quiz (4 minutes)

1. The CDC evidence is complete in week 8, but consumer roadmaps lock in week 6. What should the DE do in week 2?
   - Share the decision question, current evidence, unknowns, and next test with relevant owners
   - Declare the service proven so teams reserve capacity
   - Stay silent until every question is closed

2. Why invite security and consumer owners before the week-5 test?
   - Their constraints can shape evidence while the test is still changeable
   - Every stakeholder receives a veto
   - Early attendance proves adoption

3. When is a polished late recommendation acceptable?
   - The decision is local, reversible, and no external planning window closes
   - Several teams lock annual budgets before the evidence arrives
   - Security approval is required before any pilot

4. Which real platform decision has an evidence-ready date later than another team's decision date?
5. Write the early influence packet: decision question, known evidence, unknowns, next test, decision owner, and deadline.

<details><summary>Answer key — attempt first</summary>

1. Share the decision question, current evidence, unknowns, and next test with relevant owners. Early involvement protects the decision window only when provisional evidence remains clearly provisional.

2. Their constraints can shape evidence while the test is still changeable. Relevant owners contribute constraints and cases; involvement is input, not automatic consensus or commitment.

3. The decision is local, reversible, and no external planning window closes. The sequence is needed when another party's decision becomes hard to change before research finishes.

</details>

## Sources

- [Spotify Engineering: AI Product Management at Spotify—A View From Three Angles](https://engineering.atspotify.com/2026/11/ai-product-management-at-spotify-a-view-from-three-angles) — Recent primary case; published November 9, 2026. Describes involving relevant teams early, stating what evidence does and does not show, and the risk that a decision window closes before research finishes.; checked 2026-11-24.
- [Spotify Engineering: Technical Decision-Making in a Fragmented Space](https://engineering.atspotify.com/2024/07/technical-decision-making-in-a-fragmented-space-spotify-in-car-case-study) — Primary case study; published July 10, 2024. Uses a big-picture RFC followed by smaller focused RFCs for the teams relevant to each question.; checked 2026-11-24.
- [Thoughtworks: How to better connect strategy to implementation](https://www.thoughtworks.com/en-ca/insights/blog/technology-strategy/how-to-better-connect-strategy-to-implementation) — Practice guidance; published January 23, 2026. Recommends involving people from the start with clear rationale and connecting strategic artifacts to implementation.; checked 2026-11-24.
