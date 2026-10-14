# A migration ends when the old path can be removed

Distinguished Engineer · Day24 · 15 minutes

Turn migration completion into an evidence-based decommission gate rather than a launch milestone.

## Recall (2 minutes)

<p><a href="../Day8/distinguished-engineer.html">Day8: Fault injection: bound the experiment before you create the fault</a></p><p>A stop alarm needs three 60-second breaching periods. What should the experiment owner assume?</p><details><summary>Recall first, then reveal the refresher</summary><p>Potentially harmful exposure continues while evidence accumulates. The evaluation window is part of the blast-radius budget, not a grace period without impact.</p></details><p><a href="../Day15/distinguished-engineer.html">Day15: Two windows, one page: alert on sustained budget burn</a></p><p>Why does the brief spike not page at the default threshold?</p><details><summary>Recall first, then reveal the refresher</summary><p>The short window is high but the long window is only 2×. Both windows must cross the threshold; the long window rejects a short-lived burst.</p></details>

## Understand (4 minutes)

Moving apartments is not finished when the new keys work. It is finished when mail is redirected, the old utilities are off, the inspection passes, and returning the old keys is safe.

A production migration needs the same exit gate: zero intended traffic on the old path, no unknown dependencies, reconciled data, a completed rollback window, named owners and stakeholder approval. Keeping the old system “just in case” indefinitely preserves cost and hidden coupling.



Checkout moved to a new cell. Traffic reached 100%, but a monthly finance export still reads the old database. The dependency scan blocks retirement. After the export moves, reconciliation stays green for 14 days and the fallback window closes, the gate can approve deletion.



## Read the visual

Each box is an independent veto. The final decision changes only when every red blocker turns green, emphasizing that retirement is an AND gate.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a decommission gate after cutover for databases, services, queues, regions or vendor migrations.

**Practical example.** Retire an old Kafka cluster only after producers, consumers, ACL automation, backups and disaster-recovery procedures no longer depend on it.

**How to decide.** Require measurable exit criteria and an accountable approver. Extend the window for high-impact uncertainty; do not keep the source alive merely because no owner will sign.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
old_traffic_pct=0
unknown_dependencies=0
stable_days=14
data_reconciled=True
owner_approved=True
eligible=(old_traffic_pct==0 and unknown_dependencies==0 and stable_days>=14 and data_reconciled and owner_approved)
decision='RETIRE' if eligible else 'KEEP'
```

1. Capture measurable retirement evidence.

   Changed values: `{"old_traffic_pct": 0, "unknown_dependencies": 0, "stable_days": 14}`

2. Add correctness and accountability gates.

   Changed values: `{"data_reconciled": true, "owner_approved": true}`

3. Retire only when every required gate passes.

   Changed values: `{"eligible": true, "decision": "RETIRE"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executed local Python over declared facts; it did not discover dependencies, compare data or retire infrastructure.

## Explore (remaining exploration time)

Change old traffic, unknown dependencies and stable days. Observe which single unmet condition blocks retirement.

Open distinguished-engineer.html for the executable model.

Model limits: This model treats five gates as Boolean facts. Real migration evidence has sampling error, long-tail jobs, legal retention, asset disposal, security and rollback trade-offs.

## Quiz (4 minutes)

1. New-system traffic is 100%, but one old dependency remains. Decision?
   - Retire
   - Keep and move the dependency
   - Ignore it

2. Why set a rollback window?
   - To keep dual systems forever
   - To time-box fallback while evidence accumulates
   - To avoid reconciliation

3. Strongest retirement signal?
   - Launch succeeded
   - Exit criteria pass with named approval
   - No alerts today

4. Which long-tail dependency in your estate is least visible to traffic dashboards?
5. Who is accountable for approving irreversible deletion?

<details><summary>Answer key — attempt first</summary>

1. Keep and move the dependency. Cutover percentage alone does not prove removability.

2. To time-box fallback while evidence accumulates. A time-box creates a deliberate point for closing fallback.

3. Exit criteria pass with named approval. Multiple independent criteria reduce hidden dependency risk.

</details>

## Sources

- [Google Cloud migration best practices](https://cloud.google.com/architecture/migration-to-google-cloud-best-practices) — Living architecture guidance; checked 2026-10-14.
- [AWS application retirement best practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/application-portfolio-assessment-guide/application-retirement.html) — AWS Prescriptive Guidance; checked 2026-10-14.
