# An operational-readiness review is evidence, residual risk, and owners

Distinguished Engineer · Day30 · 15 minutes

Turn a launch checklist into a visible risk decision rather than a ceremonial meeting.

## Recall (2 minutes)

<p><a href="../Day24/distinguished-engineer.html">Day24: A migration ends when the old path can be removed</a></p><p>New-system traffic is 100%, but one old dependency remains. Decision?</p><details><summary>Recall first, then reveal the refresher</summary><p>Keep and move the dependency. Cutover percentage alone does not prove removability.</p></details><p><a href="../Day12/distinguished-engineer.html">Day12: Keep serving with the last good map: control plane vs data plane</a></p><p>The control plane fails after cell-a was published. In the stable design, where does the next order go?</p><details><summary>Recall first, then reveal the refresher</summary><p>cell-a. The data plane keeps the last good snapshot and continues using the known route.</p></details>

## Understand (4 minutes)

A pilot does not ask, “Did everyone attend the safety meeting?” The pilot checks fuel, weather, instruments, and named actions. A launch review should work the same way.

An operational-readiness review (ORR) gathers evidence about architecture, operations, event management, and release quality. Unmet items become visible residual risks with owners and dates. The decision is “ship, ship with an explicit condition, or stop”—not “the meeting happened.”



A Kafka platform launch has four claims: restore tested, one-zone capacity proven, pager owner named, and rollback rehearsed. Three pass. The restore test is missing. The board cannot turn that red item green with optimism. It records the risk, owner, due date, and whether the launch can be safely scoped.



## Read the visual

The evidence board makes missing proof remain red and attaches a follow-up. It distinguishes “review completed” from “risk accepted with eyes open.”

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use an ORR before a new service, major feature, architecture change, or material operating-model change can affect customers.

**Practical example.** An EKS-hosted Kafka gateway is moving critical traffic and needs evidence for capacity, recovery, monitoring, deployment, and ownership.

**How to decide.** Keep the checklist specific to recurring failure modes. Require links to evidence, record residual risk, and retire stale questions. For a tiny reversible change, use a smaller readiness check rather than a large board.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
evidence={'restore':False,'capacity':True,'owner':True,'rollback':True}
missing=[name for name,ok in evidence.items() if not ok]
residual_risk={'item':missing[0],'owner':'storage-team','due':'2026-10-22'}
decision='CONDITIONAL' if missing else 'READY'
```

1. Represent linked evidence, not meeting attendance.

   Changed values: `{"evidence": {"restore": false, "capacity": true, "owner": true, "rollback": true}}`

2. Keep unresolved readiness claims visible.

   Changed values: `{"missing": ["restore"]}`

3. Assign the missing test to a named owner and date.

   Changed values: `{"residual_risk": {"item": "restore", "owner": "storage-team", "due": "2026-10-22"}}`

4. The launch decision follows the unresolved risk.

   Changed values: `{"decision": "CONDITIONAL"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This toy uses four equal-weight checks. Real ORRs need risk severity, workload context, exceptions, independent review when warranted, and follow-up tracking. A passed checklist cannot prove every unknown failure has been removed.

## Explore (remaining exploration time)

Mark evidence present or missing. The launch outcome follows the highest unresolved risk, not the number of attendees.

Open distinguished-engineer.html for the executable model.

Model limits: This toy uses four equal-weight checks. Real ORRs need risk severity, workload context, exceptions, independent review when warranted, and follow-up tracking. A passed checklist cannot prove every unknown failure has been removed.

## Quiz (4 minutes)

1. The restore checkbox is empty. What should the ORR record?
   - Residual risk, owner, due date, and launch decision
   - Attendance as proof
   - Green because backups exist

2. Why tailor ORR questions to recurring failure modes?
   - Evidence then targets known causes of impact
   - It guarantees no novel incident
   - It removes ownership

3. What is the boundary of a passed ORR?
   - It reduces known risk but cannot eliminate unknown failure
   - It proves the service cannot fail
   - It replaces monitoring

4. Which current launch claim is backed only by confidence rather than linked evidence?
5. Who may accept each residual-risk tier, and when must an exception expire?

<details><summary>Answer key — attempt first</summary>

1. Residual risk, owner, due date, and launch decision. A backup is not restore evidence; unresolved risk must stay visible.

2. Evidence then targets known causes of impact. Specific checks improve prevention without turning the review into an endless generic list.

3. It reduces known risk but cannot eliminate unknown failure. Readiness evidence is not certainty.

</details>

## Sources

- [AWS Operational Readiness Reviews](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html) — Living AWS Well-Architected guidance; checked 2026-10-20.
- [AWS ORR tool](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/the-orr-tool.html) — Living guidance; checked 2026-10-20.
- [AWS example ORR questions](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/appendix-b-example-orr-questions.html) — Living guidance; checked 2026-10-20.
