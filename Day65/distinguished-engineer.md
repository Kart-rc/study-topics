# A maturity model is a constraint map—not a promotion ladder

Distinguished Engineer · Day65 · 15 minutes

Read an uneven platform-maturity profile and invest in the high-friction aspect instead of chasing one overall level.

## Recall (2 minutes)

<p><a href="../Day41/distinguished-engineer.html">Day41: Failover buys continuity; failback must reconcile the writes made while away</a></p><p>Recovery accepted 27 writes. Primary has not reverse-synced. Immediate cutback exposes what?</p><details><summary>Recall first, then reveal the refresher</summary><p>A 27-write gap. The original primary lacks recovery-period writes.</p></details><p><a href="../Day13/distinguished-engineer.html">Day13: Deal each tenant a hand: shuffle-shard the fleet</a></p><p>Rainbow uses W1/W4 and Rose uses W1/W8. W1 and W4 fail. Why can Rose continue?</p><details><summary>Recall first, then reveal the refresher</summary><p>Rose has a non-overlapping healthy worker, W8. Rose overlaps at W1 but not completely; W8 remains a path if capacity and retry behavior are sound.</p></details>

## Understand (4 minutes)

A car with four new tires and one flat tire does not become “80% road-ready.” The lowest critical part still stops the trip.

Platform maturity works the same way. Investment, adoption, interfaces, operations, and measurement can mature at different speeds. Do not average them into one flattering score or race every aspect upward together. Use the profile as a constraint map: find the high-friction aspect, improve it, observe what changes, and iterate.



A data-product platform has a dedicated team (investment level 2), a polished self-service portal (interfaces level 3), and centrally tracked work (operations level 2). Yet only 10 of 40 target teams complete their first data product. Adoption and measurement are both level 1. Another portal redesign moves the strongest aspect while the bottleneck stays hidden. Instrumenting the first-product journey reveals that 26 of 36 starters stop at access approval. The next investment is the approval path and its feedback loop—not more interface polish.



## Read the visual

Five proportional bars show the platform's aspects on the same 1–4 scale. Portal polish raises an already-strong interface bar while two constraints stay red; measurement reveals the access dropout, and only then does the model select a targeted adoption fix.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a multi-aspect maturity profile when a platform has visible technical capability but adoption, feedback, funding, or operating behavior still limits value.

**Practical example.** Your AWS/Spark data-product portal can provision storage and pipelines, but most domain teams abandon onboarding during security and access approval.

**How to decide.** Map each aspect independently, then fund one evidenced high-friction improvement and remeasure. Use a simple backlog instead when one local defect is already known and no organization-wide capability change is being considered.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
profile={'investment':2,'adoption':1,'interfaces':3,'operations':2,'measurement':1}
journey={'eligible':40,'started':36,'completed':10}
dropoffs={'access_approval':26,'other_after_start':journey['started']-journey['completed']-26}
result={'lowest_aspects':[k for k,v in profile.items() if v==min(profile.values())],'next_action':'instrument and redesign access approval','observed_completion':f"{journey['completed']}/{journey['eligible']}"}
```

1. Record each aspect independently instead of assigning one platform-wide badge.

   Changed values: `{"profile": {"investment": 2, "adoption": 1, "interfaces": 3, "operations": 2, "measurement": 1}}`

2. Measure the valuable first-product journey rather than portal traffic or feature count.

   Changed values: `{"journey": {"eligible": 40, "started": 36, "completed": 10}}`

3. Locate the observed friction: all 26 starter drop-offs in this synthetic example occur at access approval.

   Changed values: `{"dropoffs": {"access_approval": 26, "other_after_start": 0}}`

4. Choose a targeted learning-and-fix step without claiming that maturity or adoption has already improved.

   Changed values: `{"result": {"lowest_aspects": ["adoption", "measurement"], "next_action": "instrument and redesign access approval", "observed_completion": "10/40"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is an original local teaching model, not a CNCF assessment or a prediction of real adoption. The levels and 40-team funnel are synthetic. One low score does not prove causality, sequencing, ROI, or readiness to advance; regulated controls, reliability, support capacity, skills, incentives, and qualitative evidence still require direct investigation.

## Explore (remaining exploration time)

Switch among the current profile, interface polish, a feedback loop, and a targeted access fix. Predict which bars move and whether first-product completion can plausibly improve.

Open distinguished-engineer.html for the executable model.

Model limits: This is an original local teaching model, not a CNCF assessment or a prediction of real adoption. The levels and 40-team funnel are synthetic. One low score does not prove causality, sequencing, ROI, or readiness to advance; regulated controls, reliability, support capacity, skills, incentives, and qualitative evidence still require direct investigation.

## Quiz (4 minutes)

1. Interfaces are level 3, while adoption and measurement are level 1. What is the best next move?
   - Instrument the user journey and investigate the high-friction step
   - Average the scores and declare level 2
   - Redesign the portal before collecting evidence

2. Why is one overall maturity score misleading?
   - Different aspects mature independently, and a weak critical aspect can block value
   - All five aspects must always have identical scores
   - Higher interface maturity guarantees intrinsic adoption

3. What does the 26-of-36 access dropout prove?
   - It identifies a high-friction step to investigate, not guaranteed causality or ROI
   - Removing approval will certainly produce 36 adopters
   - The platform should immediately advance every aspect to level 3

4. Score one real internal platform independently on investment, adoption, interfaces, operations, and measurement. Which score is evidence-backed least well?
5. Name the next evidence-producing action, the user journey it observes, and what result would cause you to choose a different constraint.

<details><summary>Answer key — attempt first</summary>

1. Instrument the user journey and investigate the high-friction step. The profile points to missing adoption evidence; improving the strongest aspect does not reveal the constraint.

2. Different aspects mature independently, and a weak critical aspect can block value. Averages hide the shape of the profile and can make over-investment look balanced.

3. It identifies a high-friction step to investigate, not guaranteed causality or ROI. The funnel narrows the next inquiry; direct evidence and remeasurement are still required.

</details>

## Sources

- [Martin Fowler: The Data Product Platform Navigator](https://martinfowler.com/articles/data-product-platform-nav.html) — Recent practitioner framework; published November 5, 2026. Applies five independently assessed platform aspects to data-product platforms and recommends mapping current state, focusing on a high-friction aspect, and iterating.; checked 2026-11-25.
- [CNCF TAG App Delivery: Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) — Primary maintained model; v1 completed October 2023. Defines four levels across Investment, Adoption, Interfaces, Operations, and Measurement rather than one platform-wide level.; checked 2026-11-25.
- [Thoughtworks: Turning the tide—overcoming low developer adoption](https://www.thoughtworks.com/en-sg/insights/blog/platforms/platform-engineering-challenges--a-guide-to-overcoming-an-inadeq/turning-the-tide--overcoming-the-platform-challenge-of-low-devel) — Practitioner case and guidance; published March 10, 2026. Emphasizes identifying user friction, measuring adoption rather than feature count, and avoiding a copy-paste platform strategy.; checked 2026-11-25.
