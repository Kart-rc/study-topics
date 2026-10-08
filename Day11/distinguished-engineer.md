# A backup is a promise until you restore it

Distinguished Engineer · Day11 · 15 minutes

Turn “we have backups” into two measurable recovery promises and one usable-service check.

## Recall (2 minutes)

<p><a href="../Day3/distinguished-engineer.html">Day3: Cell-based architecture: make failure scope a product decision</a></p><p>With 1,000 evenly assigned tenants and 10 cells, what is the modeled one-cell impact?</p><details><summary>Recall first, then reveal the refresher</summary><p>100 tenants. The simplified upper bound is ceil(1,000 / 10) = 100.</p></details><p><a href="../Day7/distinguished-engineer.html">Day7: Load shedding: protect useful work past the breaking point</a></p><p>Demand is 140 units/s and safe capacity is 100. What must a stable admission policy do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject or degrade at least 40 units of work. The system cannot create capacity by accepting work; scarcity must become explicit.</p></details>

## Understand (4 minutes)

An order database stops at noon. The backup console is green. That tells you a backup job ran; it does not tell you how soon customers can place orders again, or which recent orders will be missing.

Make two promises explicit. RPO is the largest acceptable gap in recoverable data, measured in time. RTO is the longest acceptable service interruption. They are targets set with the business. A drill measures what your system actually achieved.

Use the timestamp of the data you can really recover, not simply the timestamp when a backup job finished. Count recovery from the interruption until the service is usable, including detection, restore, validation and traffic routing in this example.



Our team promises at most five minutes of lost order history and at most thirty minutes of downtime. The baseline drill uses data through 11:55. Detection takes 3 minutes, restore takes 18, validation takes 7, and routing takes 2. Total: 30 minutes. The measured data gap is 5 minutes. Both targets are met, with no time margin.

Now the restored order table fails its integrity check. The clock may still read thirty, but the service is not recovered. A faster restore cannot compensate for unusable data. Likewise, a green integrity check cannot compensate for a ten-minute data gap when the business allowed only five.

As the technical leader, ask for a representative drill with an owner and saved evidence: newest recoverable order time, sample order checks, dependency readiness, and an end-to-end order request. Review the gap with the service owner before declaring the recovery design adequate.



## Read the visual

How much data is missing, and how long is service unavailable? Two timelines have different meanings. The data-age bar looks backward from failure; the recovery segments look forward. The 30-minute line applies to total interruption, including checks and routing.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rpo_target = 5
rto_target = 30
data_gap = 5
phases = {"detect": 3, "restore": 18, "validate": 7, "route": 2}
downtime = sum(phases.values())
timing_ok = data_gap <= rpo_target and downtime <= rto_target
integrity_ok = True
ready = timing_ok and integrity_ok
integrity_ok = False
ready = timing_ok and integrity_ok
```

1. Record the promises and the measured parts of the baseline drill.

   Changed values: `{"rpo_target": 5, "rto_target": 30, "data_gap": 5, "phases": {"detect": 3, "restore": 18, "validate": 7, "route": 2}}`

2. The thirty-minute drill and five-minute gap both fit, exactly.

   Changed values: `{"downtime": 30, "timing_ok": true}`

3. Usable data is a separate condition; the baseline meets it.

   Changed values: `{"integrity_ok": true, "ready": true}`

4. Timing stayed the same, but failed integrity makes ready false.

   Changed values: `{"integrity_ok": false, "ready": false}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Decision arithmetic over synthetic drill results. The code does not perform recovery or assess backup integrity.

## Explore (remaining exploration time)

Compare a five-minute and ten-minute recovery-point age. Increase restore time. Finally fail the integrity check while all timing targets pass. Which promise remains unproven?

Open distinguished-engineer.html for the executable model.

Model limits: Synthetic minutes and a manually selected integrity result. It does not restore a database or prove an RTO/RPO. A single drill cannot guarantee all disaster scenarios. Detection, restore, validation and routing are sequential here; actual runbooks may overlap work or discover missing dependencies.

## Quiz (4 minutes)

1. The recovery point is 11:50, failure is noon, and service returns at 12:25. Targets are RPO 5 and RTO 30 minutes. Which timing target is missed?
   - Only RTO
   - Only RPO
   - Neither

2. Why include validation before declaring recovery?
   - To prove the restored service and data can be used
   - Because the backup job timestamp always proves integrity
   - To make the RPO larger

3. One small drill meets both targets. What can the leader conclude?
   - Every regional disaster is covered
   - Backups no longer need testing
   - That tested scenario met the targets; broader evidence is still needed

4. What evidence would you ask the order-service owner to show before accepting the 30-minute promise?
5. If DNS or an identity provider is unavailable during the drill, how would that change the recovery boundary?

<details><summary>Answer key — attempt first</summary>

1. Only RPO. The ten-minute data gap misses RPO 5. Twenty-five minutes of downtime meets RTO 30. Finishing sooner does not recreate missing orders.

2. To prove the restored service and data can be used. A restored resource can be corrupt, incomplete or inaccessible. Validation tests usability; a job timestamp does not. Validation does not change the agreed RPO.

3. That tested scenario met the targets; broader evidence is still needed. The result applies to the tested size, dependencies and failure scope. It is evidence, not a universal guarantee or a reason to stop drills.

</details>

## Sources

- [AWS Well-Architected: disaster recovery objectives](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html) — Living official documentation; publication date not shown; checked 2026-10-01.
- [AWS REL09-BP04: periodic recovery testing](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_backing_up_data_periodic_recovery_testing_data.html) — Living official documentation; publication date not shown; checked 2026-10-01.
