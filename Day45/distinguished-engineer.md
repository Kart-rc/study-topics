# During an incident, one person commands while another changes the system

Distinguished Engineer · Day45 · 15 minutes

Separate incident coordination, operational work, and communication so responders do not compete for attention or control.

## Recall (2 minutes)

<p><a href="../Day26/distinguished-engineer.html">Day26: Show unit cost before you charge teams</a></p><p>Why pair cost with successful TB?</p><details><summary>Recall first, then reveal the refresher</summary><p>To connect spend with useful output. A unit metric shows efficiency as workload volume changes.</p></details><p><a href="../Day30/distinguished-engineer.html">Day30: An operational-readiness review is evidence, residual risk, and owners</a></p><p>The restore checkbox is empty. What should the ORR record?</p><details><summary>Recall first, then reveal the refresher</summary><p>Residual risk, owner, due date, and launch decision. A backup is not restore evidence; unresolved risk must stay visible.</p></details>

## Understand (4 minutes)

In an emergency room, the coordinator does not perform every procedure while answering every family question. Splitting roles protects the attention of the people doing each job.

In a large incident, the Incident Commander holds the overall state and priorities. The Operations Lead is the group changing the system. The Communications Lead gives periodic updates. The commander owns any role not yet delegated, but should split roles as the incident grows.



A payment API has 35% errors. Priya becomes commander and sets the goal: stop bad writes, restore checkout, then reconcile. Marco leads operations and is the only group applying changes. Lee posts stakeholder updates every 15 minutes. Engineers may investigate in parallel, but change requests flow through Ops.



## Read the visual

The role lanes show that investigation can fan out while production changes converge on one Ops lane and stakeholder questions converge on Communications.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit incident roles when impact, responders, dependencies, or stakeholder demand exceed what one person can track safely.

**Practical example.** A cross-region payment incident involves API, Kafka, database, customer support, risk, and executive stakeholders.

**How to decide.** Keep a lightweight single owner for small incidents. Split command, operations, and communications once context switching or conflicting changes appear; record handoffs and one current objective.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
incident={'impact':'35% payment errors','objective':'stop bad writes'}; roles={'IC':'Priya'}
roles['Ops']='Marco'; change_authority=['Ops']
roles['Comms']='Lee'; update_minutes=15
investigations=['API','Kafka','database']; decision='findings flow to IC; approved actions flow to Ops'
```

1. Declare one incident and one current objective; the commander initially owns undelegated roles.

   Changed values: `{"incident": {"impact": "35% payment errors", "objective": "stop bad writes"}, "roles": {"IC": "Priya"}}`

2. Delegate operational work and name one lane for system changes.

   Changed values: `{"roles": {"IC": "Priya", "Ops": "Marco"}, "change_authority": ["Ops"]}`

3. Delegate periodic stakeholder communication.

   Changed values: `{"roles": {"IC": "Priya", "Ops": "Marco", "Comms": "Lee"}, "update_minutes": 15}`

4. Parallelize investigation without parallelizing uncontrolled changes.

   Changed values: `{"investigations": ["API", "Kafka", "database"], "decision": "findings flow to IC; approved actions flow to Ops"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model uses only three roles and a synthetic attention score. It does not represent organization-specific severity, legal/security response, psychological safety, shifts, time zones, tooling, authority, or actual incident outcomes.

## Explore (remaining exploration time)

Change incident size and role delegation. Observe when one person becomes an attention bottleneck and when the operating lane becomes clear.

Open distinguished-engineer.html for the executable model.

Model limits: The model uses only three roles and a synthetic attention score. It does not represent organization-specific severity, legal/security response, psychological safety, shifts, time zones, tooling, authority, or actual incident outcomes.

## Quiz (4 minutes)

1. Who should apply operational changes in the described incident?
   - The Ops group coordinated with the Incident Commander
   - Every investigator independently
   - The Communications Lead

2. Why separate communications?
   - Stakeholder updates stop interrupting operational diagnosis
   - It hides impact
   - It grants database access

3. When is a three-role structure unnecessary?
   - A small incident one person can safely coordinate without attention loss
   - A cross-region outage with ten responders
   - Conflicting production changes are already occurring

4. At what incident size or signal will your team split IC, Ops, and Communications?
5. How will you prevent a senior stakeholder from bypassing the operating lane during an outage?

<details><summary>Answer key — attempt first</summary>

1. The Ops group coordinated with the Incident Commander. A single operating lane reduces conflicting changes while command retains the high-level state.

2. Stakeholder updates stop interrupting operational diagnosis. A Communications Lead keeps updates accurate and frees Ops and command to do their jobs.

3. A small incident one person can safely coordinate without attention loss. Use the lightest structure that preserves control; delegate when scale creates contention.

</details>

## Sources

- [Google SRE Workbook: Incident response](https://sre.google/workbook/incident-response/) — Official Google SRE guidance; checked November 4, 2026; checked 2026-11-04.
- [Google SRE Book: Managing incidents](https://sre.google/sre-book/managing-incidents/) — Official Google SRE guidance; checked November 4, 2026; checked 2026-11-04.
