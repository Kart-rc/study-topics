# The failover button must survive the outage

Distinguished Engineer · Day31 · 15 minutes

Keep emergency traffic movement on a highly available data-plane path.

## Recall (2 minutes)

<p><a href="../Day19/distinguished-engineer.html">Day19: Build the exit before calling it a two-way door</a></p><p>A pilot has small blast radius, no writes and tested rollback. How should it usually be treated?</p><details><summary>Recall first, then reveal the refresher</summary><p>As a reversible experiment. The return path is practical, so speed and learning can be appropriate. Reversible does not mean risk-free.</p></details><p><a href="../Day23/distinguished-engineer.html">Day23: Let the new system observe production before production observes it</a></p><p>Shadow returns $27; legacy returns $25. What sees the customer?</p><details><summary>Recall first, then reveal the refresher</summary><p>$25. The legacy path still owns the response.</p></details>

## Understand (4 minutes)

A fire exit is useless if its key is stored inside the burning room. Failover mechanisms have the same trap: the primary system fails, then the management path needed to change routing fails with it.

A control plane creates and configures resources. A data plane performs the service’s core function. AWS recommends data-plane operations when availability matters. For ARC routing control, configuration is separate from the highly available routing-control data plane.



Before the incident, a team creates routing controls, safety rules, and credentials. During the incident, the primary region and normal console path are impaired. The runbook calls the ARC data-plane endpoint to change the routing control, then health-checked DNS moves traffic. Configuration work waits until the incident is stable.



## Read the visual

The diagram deliberately removes the normal control path. If the standby still becomes reachable, the recovery mechanism does not share the outage’s main dependency.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this design for disaster recovery actions that must work during regional, console, IAM-path, or control-plane impairment.

**Practical example.** A multi-region payments API must move traffic to its standby while the primary region and normal deployment tooling are unavailable.

**How to decide.** Pre-provision the recovery path, credentials, safety rules, and tested runbook. Keep incident-time actions small. If failover still needs resource creation or a large deployment, the recovery mechanism is too dependent on control-plane availability.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
primary_healthy = False
control_plane_available = False
routing_control_prepared = True
traffic_target = 'standby' if routing_control_prepared else 'primary'
```

1. The primary is impaired.

   Changed values: `{"primary_healthy": false}`

2. Assume the normal management path is unavailable too.

   Changed values: `{"control_plane_available": false}`

3. The recovery data-plane path was provisioned and tested beforehand.

   Changed values: `{"routing_control_prepared": true}`

4. The small emergency action moves traffic without creating resources.

   Changed values: `{"traffic_target": "standby"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This local model has two regions and two API paths. It does not call AWS, validate ARC safety rules, model DNS TTLs, health checks, IAM, quotas, client caching, or application data recovery.

## Explore (remaining exploration time)

Disable the normal control path and test whether the pre-provisioned data-plane route still moves traffic.

Open distinguished-engineer.html for the executable model.

Model limits: This local model has two regions and two API paths. It does not call AWS, validate ARC safety rules, model DNS TTLs, health checks, IAM, quotas, client caching, or application data recovery.

## Quiz (4 minutes)

1. Why pre-provision routing controls before an outage?
   - Incident-time switching should not depend on resource creation
   - It guarantees zero data loss
   - It removes health checks

2. Which path should a failover runbook prefer when AWS documents it as highly available?
   - The routing-control data-plane API
   - A new CloudFormation stack
   - An ad hoc console workflow

3. What remains outside this lesson?
   - Application data replication and correctness
   - Whether primary traffic moves
   - The need for runbooks

4. Which management dependency could block one of your current recovery runbooks?
5. What pre-provisioned evidence would let an incident commander trust the emergency data-plane action?

<details><summary>Answer key — attempt first</summary>

1. Incident-time switching should not depend on resource creation. Configuration is a control-plane activity that may be unavailable during disruption.

2. The routing-control data-plane API. The emergency operation belongs on the resilient data plane.

3. Application data replication and correctness. Routing traffic does not by itself make application state correct or current.

</details>

## Sources

- [AWS ARC data and control planes](https://docs.aws.amazon.com/r53recovery/latest/dg/data-and-control-planes.html) — Living documentation; checked 2026-10-21.
- [AWS Well-Architected REL06-BP01](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_monitor_aws_resources.html) — Living documentation; checked 2026-10-21.
