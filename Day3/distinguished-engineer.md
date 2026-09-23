# Cell-based architecture: make failure scope a product decision

Distinguished Engineer · Day3 · 15 minutes

Quantify a cell boundary, expose shared dependencies that bypass it, and frame the migration decisions a senior technical leader must align.

## Recall (2 minutes)

<p><a href="../Day2/distinguished-engineer.html">Day2: Canaries: small exposure, useful evidence</a></p><p>At 1% exposure, canary 4%, control 0.1%, what is the overall failure rate?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.139%. 0.01 × 4% + 0.99 × 0.1% = 0.139%. Aggregation hides a severe cohort regression.</p></details>

## Understand (4 minutes)

A cell is a bounded, independently operable slice of a workload. Requests are assigned to one cell, and a cell failure should not pull other cells down. AWS’s cell-based architecture guidance frames cells as fault-containment boundaries that improve isolation, predictability, and testability.

“We deployed the same stack N times” is not yet an isolation argument. Routing, identity, configuration, quotas, deployment, telemetry, and recovery paths can remain globally shared. A critical shared path can restore the original blast radius even when the data plane is partitioned.



Original teaching case: A metadata platform serves 1,000 tenants in five equally sized cells. Under this deliberately even assignment, losing one cell affects at most 200 tenants. Ten cells reduce the modeled cell failure scope to 100, but double the number of units to deploy and observe.

Now check “shared dependency failed.” The displayed impact returns to all 1,000 tenants. The cells did not become useless; the model exposed a dependency whose failure bypasses the containment boundary.

A Distinguished Engineer turns that result into decisions: Which tenant-placement key is stable? What headroom lets a surviving cell absorb recovery? Can the routing/control plane fail closed without taking healthy cells offline? How do schemas and deployments remain compatible across cells? Which high-value tenant needs a dedicated cell? How will teams debug cross-cell inconsistency?

The migration should be reversible: create placement and routing first, move a cohort, observe cell-local SLOs, rehearse evacuation, then expand. A cell count selected without capacity and operating-cost models is architecture theater.



## Explore (5 minutes)

Predict maximum affected tenants at 5 and 10 cells. Toggle the shared dependency failure. Then explain which dependency you would remove from the synchronous request path first and what new operational burden the extra cells create.

Open distinguished-engineer.html for the executable model.

Model limits: Even tenant distribution, one complete cell failure, identical cell capacity, and a binary shared-dependency switch. It omits correlated Availability Zone or Region failure, noisy-neighbor load, state replication, tenant weights, evacuation capacity, placement churn, partial degradation, and recovery time. Cell count is not a real availability calculation.

## Quiz (4 minutes)

1. With 1,000 evenly assigned tenants and 10 cells, what is the modeled one-cell impact?
   - 10 tenants
   - 100 tenants
   - All tenants

2. Why can a global synchronous dependency defeat cell isolation?
   - Its failure can block requests in every otherwise healthy cell
   - It makes cells cheaper
   - It automatically rebalances tenants

3. What is a credible first migration move?
   - Move every tenant at once
   - Create placement/routing, move a cohort, and rehearse recovery
   - Remove all telemetry

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 100 tenants. The simplified upper bound is ceil(1,000 / 10) = 100.

2. Its failure can block requests in every otherwise healthy cell. A shared critical path creates a correlated failure boundary outside the cells.

3. Create placement/routing, move a cohort, and rehearse recovery. A bounded cohort tests both data-plane behavior and the operating model while preserving rollback.

</details>

## Sources

- [AWS Prescriptive Guidance: Reducing the scope of impact with cell-based architecture](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/reducing-scope-of-impact-with-cell-based-architecture.html) — Published 2023-09-20; checked 2026-09-23.
