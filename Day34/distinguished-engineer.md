# Let the data plane keep working when the control plane is sick

Distinguished Engineer · Day34 · 15 minutes

Design a platform so existing traffic can continue on last-known-good configuration during management outages.

## Recall (2 minutes)

<p><a href="../Day26/distinguished-engineer.html">Day26: Show unit cost before you charge teams</a></p><p>Why pair cost with successful TB?</p><details><summary>Recall first, then reveal the refresher</summary><p>To connect spend with useful output. A unit metric shows efficiency as workload volume changes.</p></details><p><a href="../Day14/distinguished-engineer.html">Day14: Three copies, one mistake: correlated failure</a></p><p>Bad v2 reaches all three cells at once. How many independent software-version outcomes were tested?</p><details><summary>Recall first, then reveal the refresher</summary><p>One shared outcome. All cells received the same risky change together, so the rollout created one shared failure cause.</p></details>

## Understand (4 minutes)

The control plane is the front desk: it creates, updates, and deletes resources. The data plane is the elevator: it performs the service people already depend on. If the front desk computer fails, the elevator should not immediately stop.

Keep the high-volume data path simple. Distribute versioned configuration ahead of need. Cache the last-known-good version. During a control-plane outage, reject new changes but continue serving with known state.



A Kafka gateway has routing config version 17. The control API becomes unavailable. A weak design checks the API on every record and stops. A statically stable design keeps routing existing records with version 17, raises an age alarm, and blocks new tenant provisioning until the control plane recovers.



## Read the visual

The split-plane visual answers which actions stop and which continue when management is unavailable.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use control/data-plane separation for gateways, schedulers, feature configuration, authorization snapshots, routing, and infrastructure whose existing service is more critical than management changes.

**Practical example.** An EKS data gateway continues routing known tenants from a signed S3 configuration snapshot while its tenant-management API is down.

**How to decide.** Define which operations must continue, how stale configuration may become, how revocation works, and which emergency changes need a separate highly available data-plane mechanism. Static stability is not permission to serve indefinitely stale or unsafe state.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
control_plane_healthy = False
cached_config_version = 17
existing_traffic_served = cached_config_version == 17
new_changes_accepted = control_plane_healthy
```

1. Simulate the management API outage.

   Changed values: `{"control_plane_healthy": false}`

2. The data node already has one known-good version.

   Changed values: `{"cached_config_version": 17}`

3. Existing routing continues without a live control-plane read.

   Changed values: `{"existing_traffic_served": true}`

4. New provisioning stays blocked until management recovers.

   Changed values: `{"new_changes_accepted": false}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The browser uses two booleans and one version. It omits config signing, distribution, cache expiry, revocation, split brain, schema compatibility, regional failure, load shedding, observability, and recovery reconciliation.

## Explore (remaining exploration time)

Toggle control-plane health and cached configuration. Watch existing traffic and new changes take different paths.

Open distinguished-engineer.html for the executable model.

Model limits: The browser uses two booleans and one version. It omits config signing, distribution, cache expiry, revocation, split brain, schema compatibility, regional failure, load shedding, observability, and recovery reconciliation.

## Quiz (4 minutes)

1. The control plane is down but data nodes have valid version 17. Desired behavior?
   - Continue existing traffic on version 17 and block management changes
   - Stop all traffic immediately
   - Invent version 18 locally

2. Why avoid a control-plane API call on every data request?
   - It couples the larger, critical path to a smaller, more complex dependency
   - It removes all monitoring
   - It makes configs immutable forever

3. What must still bound last-known-good operation?
   - Staleness, revocation, safety, and reconciliation policy
   - A decorative dashboard
   - Unlimited cache age

4. For one platform you own, list control-plane and data-plane operations separately.
5. Which revocation or safety event must bypass cached configuration, and how would it work during an outage?

<details><summary>Answer key — attempt first</summary>

1. Continue existing traffic on version 17 and block management changes. Static stability preserves known-good service while management is impaired.

2. It couples the larger, critical path to a smaller, more complex dependency. Scale mismatch and dependency failures can turn management impairment into service failure.

3. Staleness, revocation, safety, and reconciliation policy. Continuity must not silently defeat urgent security or correctness changes.

</details>

## Sources

- [AWS Builders' Library: Static stability using Availability Zones](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) — Published December 5, 2019; checked 2026-10-24.
- [AWS Fault Isolation Boundaries: control planes and data planes](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/control-planes-and-data-planes.html) — Living AWS guidance; checked 2026-10-24.
- [AWS Builders' Library: putting the smaller service in control](https://aws.amazon.com/builders-library/avoiding-overload-in-distributed-systems-by-putting-the-smaller-service-in-control/) — Published October 6, 2020; checked 2026-10-24.
