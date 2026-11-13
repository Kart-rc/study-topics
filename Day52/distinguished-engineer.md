# A migration ends when the old path is unused—not when the new path launches

Distinguished Engineer · Day52 · 15 minutes

Define exit evidence for a platform migration and decommission the legacy path without mistaking deployment for adoption.

## Recall (2 minutes)

<p><a href="../Day35/distinguished-engineer.html">Day35: An ADR is evidence, not a forever rule</a></p><p>A recorded capacity assumption becomes false. First response?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reopen the decision with current evidence. The changed context is decision input.</p></details><p><a href="../Day7/distinguished-engineer.html">Day7: Load shedding: protect useful work past the breaking point</a></p><p>Demand is 140 units/s and safe capacity is 100. What must a stable admission policy do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject or degrade at least 40 units of work. The system cannot create capacity by accepting work; scarcity must become explicit.</p></details>

## Understand (4 minutes)

Opening a new bridge does not remove traffic from the old bridge. Drivers may keep using the familiar route for years.

A platform migration has two finish lines: the target works, and the source is no longer needed. The second needs evidence—remaining callers, traffic, data dependencies, exception owners, controlled shutdown, rollback window, and cost removal. Otherwise the organization pays for two platforms and inherits two failure surfaces.



The new Airflow service runs 4,800 of 5,000 workflows. The launch slide says “96% migrated,” but 200 workflows still call the old scheduler and 40 have no owner. The migration cannot close until those callers move, receive an explicit retained exception, or are retired—and the old endpoint survives a controlled stop test.



## Read the visual

A migration ledger separates moved workloads, governed exceptions, unresolved callers, and ownerless dependencies before the decommission gate.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit exit criteria when replacing a scheduler, data platform, API, identity system, or shared library across many teams.

**Practical example.** Move 5,000 workflows from Step Functions wrappers to Airflow while tracking the remaining callers and decommissioning the old control plane.

**How to decide.** Keep a temporary bridge when it reduces migration risk, but give it an owner, expiry, and usage telemetry. Close only after inbound use is understood, data is preserved, support is ready, and a controlled stop demonstrates the old path is no longer required.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
total=5000; migrated=4800; approved_exceptions=120
unresolved=total-migrated-approved_exceptions
ownerless=40; controlled_stop_passed=False
result={'launched':True,'unresolved':unresolved,'ownerless':ownerless,'safe_to_decommission':unresolved==0 and ownerless==0 and controlled_stop_passed}
```

1. Record migrated workloads and explicitly retained exceptions.

   Changed values: `{"total": 5000, "migrated": 4800, "approved_exceptions": 120}`

2. Calculate work that has neither moved nor been accepted.

   Changed values: `{"unresolved": 80}`

3. Add two exit risks that a launch percentage hides.

   Changed values: `{"ownerless": 40, "controlled_stop_passed": false}`

4. Keep launch and decommission decisions separate.

   Changed values: `{"result": {"launched": true, "unresolved": 80, "ownerless": 40, "safe_to_decommission": false}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model counts synthetic workflows. It does not discover real dependencies, prove data retention, model hidden batch callers, execute a controlled stop, estimate regulatory obligations, calculate migration cost, or authorize decommissioning.

## Explore (remaining exploration time)

Change migrated, exception, and ownerless counts. Predict whether the program is launched, adoptable, or safe to decommission.

Open distinguished-engineer.html for the executable model.

Model limits: The model counts synthetic workflows. It does not discover real dependencies, prove data retention, model hidden batch callers, execute a controlled stop, estimate regulatory obligations, calculate migration cost, or authorize decommissioning.

## Quiz (4 minutes)

1. The new platform serves 96% of workflows. What remains unproven?
   - That every remaining caller is migrated, intentionally retained, or retired
   - That the new platform can run any workflow
   - That executives saw the launch

2. Why run a controlled stop?
   - To surface hidden inbound dependencies before irreversible decommissioning
   - To create more migration work
   - To avoid collecting usage telemetry

3. When may an exception remain?
   - When it has an explicit owner, reason, compensating control, and review date
   - Whenever a team is busy
   - Whenever the new platform is cheaper

4. Which migration is reporting launch progress without an old-path shutdown metric?
5. What controlled stop and rollback window would expose hidden callers safely?

<details><summary>Answer key — attempt first</summary>

1. That every remaining caller is migrated, intentionally retained, or retired. Adoption and source retirement require evidence beyond target launch.

2. To surface hidden inbound dependencies before irreversible decommissioning. A bounded stop turns unknown dependency risk into observable evidence.

3. When it has an explicit owner, reason, compensating control, and review date. A retained path is a governed decision, not silent migration debt.

</details>

## Sources

- [AWS: Retiring applications during migration](https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-retiring-applications/) — AWS Prescriptive Guidance; checked November 12, 2026; checked 2026-11-12.
- [AWS retirement best practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-retiring-applications/best-practices.html) — Official guidance on inbound connections and controlled stops; checked November 12, 2026; checked 2026-11-12.
- [Google Cloud migration validation practices](https://docs.cloud.google.com/architecture/migration-to-google-cloud-best-practices) — Official guidance; checked November 12, 2026; checked 2026-11-12.
