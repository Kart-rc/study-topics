# A strategic rewrite needs a replaceable seam—not a blank sheet

Distinguished Engineer · Day67 · 15 minutes

Scope a high-leverage rewrite around one replaceable bottleneck, then gate rollout on semantic parity, operability, compatibility, and an explicit fallback boundary.

## Recall (2 minutes)

<p><a href="../Day40/distinguished-engineer.html">Day40: When overloaded, finish valuable work before starting expendable work</a></p><p>Capacity is 100; checkout demand is 80 and crawler demand is 50. Priority admission completes what?</p><details><summary>Recall first, then reveal the refresher</summary><p>80 checkout and 20 crawler units. Finish the higher-priority 80, then use the remaining 20.</p></details><p><a href="../Day42/distinguished-engineer.html">Day42: A post-incident action should remove a condition, not repeat a warning</a></p><p>A deterministic contract can detect a missing row policy. Strongest direct action?</p><details><summary>Recall first, then reveal the refresher</summary><p>Block publication when the policy is absent. The gate acts at the failure boundary before exposure.</p></details>

## Understand (4 minutes)

Imagine renovating a restaurant kitchen while the dining room stays open. Keep the menu, ordering counter, and supplier doors stable; replace the cooking line that causes the queue. A blank-sheet rebuild closes the restaurant and makes every boundary part of the project.

A strategic rewrite begins with a measured bottleneck and a replaceable seam: stable inputs, observable outputs, and an old path that can still accept traffic. The new component earns expansion only when it preserves semantics and gains operational maturity—not when its benchmark looks good. This turns “rewrite the platform” into a sequence of falsifiable decisions: profile, isolate, prove parity, canary, expand, and stop where compatibility or risk says stop.



A synthetic query fleet spends 92% of CPU in execution while its SQL front end, planner, and storage contracts are stable. A native execution engine is therefore a plausible seam. On 100 representative queries it uses 41% less CPU, but only 96 results match the legacy engine. The decision is hold the canary: four semantic gaps outweigh the performance win. After fixes reach 100/100 parity, the team routes 5% of eligible traffic, watches correctness, crashes, memory, latency, and fallback rate, then expands only the eligible set. Unsupported connectors remain on the old engine; “90% of eligible traffic” is not misreported as 90% of all traffic.



## Read the visual

The stack keeps SQL/planning and connector/storage boundaries visible while the execution layer alone is highlighted as the replaceable seam. Each state changes one decision variable—bottleneck evidence, parity, canary traffic, then eligibility—so a performance result cannot silently override correctness or scope.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a seam-first rewrite when profiling finds one concentrated bottleneck, the surrounding contracts can stay stable, and the legacy path can remain as a bounded fallback during migration.

**Practical example.** Your Spark or Presto estate has accumulated years of planner, connector, security, and user-facing semantics, but most compute cost is concentrated in the local execution layer.

**How to decide.** Replace the execution layer behind its plan and data interfaces. Gate every traffic increase on semantic parity and production controls; keep unsupported workloads explicitly out of scope instead of pulling them into a platform-wide rewrite.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
profile={'execution_cpu_share':92,'candidate_cpu_saving':41,'queries':100,'semantic_matches':96}
seam={'replace':'execution engine','preserve':['SQL','planner','connectors'],'fallback':'legacy engine'}
gate={'semantic_gaps':profile['queries']-profile['semantic_matches'],'canary_percent':0}
decision={'action':'hold canary','scope':'execution engine only','reason':'4 semantic gaps remain'}
```

1. Start with a concentrated bottleneck and keep the performance claim separate from correctness.

   Changed values: `{"profile": {"execution_cpu_share": 92, "candidate_cpu_saving": 41, "queries": 100, "semantic_matches": 96}}`

2. Name the component boundary and the old path that makes comparison and rollback possible.

   Changed values: `{"seam": {"replace": "execution engine", "preserve": ["SQL", "planner", "connectors"], "fallback": "legacy engine"}}`

3. Turn parity into a traffic gate; four mismatches mean the canary remains closed.

   Changed values: `{"gate": {"semantic_gaps": 4, "canary_percent": 0}}`

4. Choose the bounded next action rather than widening the rewrite to solve unrelated layers.

   Changed values: `{"decision": {"action": "hold canary", "scope": "execution engine only", "reason": "4 semantic gaps remain"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is an original local decision model, not a live Presto or Velox benchmark. Its corpus and metrics are synthetic. Real rollout requires workload-specific semantic, performance, security, resilience, and rollback evidence.

## Explore (remaining exploration time)

Move through the four evidence states. Predict the decision before reading it, then name the stable seam, the rollout gate, and the stop boundary for one rewrite in your estate.

Open distinguished-engineer.html for the executable model.

Model limits: This is an original local decision model, not a live Presto or Velox benchmark. Its 100-query corpus, 92% CPU share, 41% saving, parity counts, and traffic percentages are synthetic. A stable interface can still hide semantic coupling; matching outputs does not prove identical performance, security, or failure behavior; and a fallback can become permanent dual-operation debt. Real adoption needs workload-specific tests, shadowing, observability, capacity planning, rollback drills, and human review.

## Quiz (4 minutes)

1. A new engine cuts CPU 41%, but 4 of 100 representative query results differ. What is the correct rollout decision?
   - Hold traffic and close the semantic gaps
   - Expand because CPU is the strategic metric
   - Rewrite the planner too

2. Why preserve the SQL surface, planner, and connectors when execution is the measured bottleneck?
   - Stable boundaries concentrate the change and preserve fallback
   - Those components never need improvement
   - A rewrite should avoid all integration tests

3. The new engine carries 90% of eligible traffic. What must an executive update say?
   - Name the eligibility boundary and the unsupported workloads
   - Say the migration is 90% complete without qualification
   - Count fallback traffic as migrated

4. Choose one proposed rewrite. What profile evidence identifies the bottleneck, and which input/output contracts form the smallest credible seam?
5. Write the rollout gate, fallback, eligibility denominator, and explicit stop boundary. Which result would make you pause rather than widen the rewrite?

<details><summary>Answer key — attempt first</summary>

1. Hold traffic and close the semantic gaps. Silent wrong answers are a stop condition. Performance matters only after semantic parity is credible.

2. Stable boundaries concentrate the change and preserve fallback. A seam narrows blast radius and supports comparison, routing, and rollback; it does not declare adjacent layers perfect.

3. Name the eligibility boundary and the unsupported workloads. The denominator is part of the evidence. Eligibility exclusions reveal the remaining compatibility and operating cost.

</details>

## Sources

- [Uber Engineering: Velox at Uber—Rebuilding Presto's Execution Engine for Speed and Scale](https://www.uber.com/us/en/blog/velox-at-uber/) — Recent primary case; published November 10, 2026. Reports a profiled execution bottleneck, operational foundation work, result verification, phased routing, compatibility limits, upstream discipline, and measured production outcomes.; checked 2026-11-27.
- [Velox: Design Philosophy](https://velox-lib.io/docs/community/design-philosophy/) — Maintained primary project documentation. Defines reliability, semantic extensibility, real-workload evidence, testing, verification, and long-term maintainability as design principles.; checked 2026-11-27.
- [Meta Engineering: Introducing Velox](https://engineering.fb.com/2023/03/09/open-source/velox-open-source-execution-engine/) — Primary foundation; published March 9, 2023. Describes the execution engine as a reusable data-plane component that accepts optimized plans and leaves front ends and optimizers outside its boundary.; checked 2026-11-27.
