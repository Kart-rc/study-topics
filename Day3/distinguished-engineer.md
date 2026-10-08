# Cell-based architecture: make failure scope a product decision

Distinguished Engineer · Day3 · 15 minutes

A metadata platform serves 1,000 tenants.

## Recall (2 minutes)

<p><a href="../Day2/distinguished-engineer.html">Day2: Canaries: small exposure, useful evidence</a></p><p>At 1% exposure, canary 4%, control 0.1%, what is the overall failure rate?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.139%. 0.01 × 4% + 0.99 × 0.1% = 0.139%. Aggregation hides a severe cohort regression.</p></details>

## Understand (4 minutes)

A metadata platform serves 1,000 tenants. One bad deployment should not have to interrupt all of them.

A cell is a separately operated group of resources serving a subset of tenants. It limits the damage from failures inside that group. A shared dependency can still cross every boundary, so count dependencies as well as boxes.

Watch the visual: Which failure can cross a cell boundary?



Five equally sized cells place 200 tenants in each failure group. Ten cells reduce that to 100. But if all ten need one failed catalog, all 1,000 tenants can still be affected.



## Read the visual

Each outlined cell contains its own tenant allocation. A single-cell failure marks only the first cell. A shared-dependency failure marks every cell, showing why more boxes do not protect a common critical dependency. Tenant counts sum to 1,000 even when the division is uneven.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
tenants = 1000; cells = 5
affected = tenants // cells
cells = 10
affected = tenants // cells
shared_catalog_failed = True
affected = tenants if shared_catalog_failed else tenants // cells
```

1. Start with five evenly loaded cells.

   Changed values: `{"tenants": 1000, "cells": 5}`

2. One cell failure affects 200 tenants in this example.

   Changed values: `{"affected": 200}`

3. Use smaller failure groups.

   Changed values: `{"cells": 10}`

4. One cell now contains 100 tenants.

   Changed values: `{"affected": 100}`

5. The shared dependency crosses cell boundaries.

   Changed values: `{"shared_catalog_failed": true}`

6. The shared failure reaches all 1,000.

   Changed values: `{"affected": 1000}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The example assumes even placement and full dependency failure. It does not size failover capacity or quantify availability. More cells also add operating cost.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A cell is a bounded, independently operable slice of a workload. Requests are assigned to one cell, and a cell failure should not pull other cells down. AWS’s cell-based architecture guidance frames cells as fault-containment boundaries that improve isolation, predictability, and testability.</p><p>“We deployed the same stack N times” is not yet an isolation argument. Routing, identity, configuration, quotas, deployment, telemetry, and recovery paths can remain globally shared. A critical shared path can restore the original blast radius even when the data plane is partitioned.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A metadata platform serves 1,000 tenants in five equally sized cells. Under this deliberately even assignment, losing one cell affects at most 200 tenants. Ten cells reduce the modeled cell failure scope to 100, but double the number of units to deploy and observe.</p><p>Now check “shared dependency failed.” The displayed impact returns to all 1,000 tenants. The cells did not become useless; the model exposed a dependency whose failure bypasses the containment boundary.</p><p>A Distinguished Engineer turns that result into decisions: Which tenant-placement key is stable? What headroom lets a surviving cell absorb recovery? Can the routing/control plane fail closed without taking healthy cells offline? How do schemas and deployments remain compatible across cells? Which high-value tenant needs a dedicated cell? How will teams debug cross-cell inconsistency?</p><p>The migration should be reversible: create placement and routing first, move a cohort, observe cell-local SLOs, rehearse evacuation, then expand. A cell count selected without capacity and operating-cost models is architecture theater.</p>

</details>

## Explore (remaining exploration time)

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
