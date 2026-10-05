# Three copies, one mistake: correlated failure

Distinguished Engineer · Day14 · 15 minutes

Recognize when replicas share the same cause of failure and use deployment waves to preserve a healthy comparison group.

## Recall (2 minutes)

<p><a href="../Day5/distinguished-engineer.html">Day5: Dependency isolation: spend concurrency by failure domain</a></p><p>A dependency&#x27;s latency rises tenfold while arrival rate stays fixed. What happens to its concurrency demand?</p><details><summary>Recall first, then reveal the refresher</summary><p>It rises roughly tenfold. Little&#x27;s Law links in-flight work to rate times time.</p></details><p><a href="../Day9/distinguished-engineer.html">Day9: Rollback safety: old code must survive new state</a></p><p>Why can a successful binary rollback still fail?</p><details><summary>Recall first, then reveal the refresher</summary><p>New code may already have written durable state the old code cannot read. Deployment state and durable data evolve on different timelines.</p></details>

## Understand (4 minutes)

Three spare house keys do not help if all three are inside the same locked bag. The count is three; the failure cause is still one.

Replicas improve availability only when important failures are independent. A bad fleet-wide configuration, shared DNS dependency, or simultaneous rollout can make many copies fail together. That is a correlated failure.

Cell Aconfig v2

Cell Bconfig v2

Cell Cconfig v2

One bad config → three failures. Replication did not create independence.



Checkout has three cells and needs two healthy cells.

A fleet-wide rollout sends bad config v2 to A, B, and C. Healthy cells: 0.A one-cell wave sends v2 only to A. Its error rate jumps.The gate stops. B and C remain on v1. Healthy cells: 2.affected = min(wave_size, replicas)
healthy = replicas - affected
continue_rollout = healthy >= required_healthy and error_rate 

The wave does not make the configuration correct. It limits exposure long enough for evidence to stop the change.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
replicas = 3
required_healthy = 2
bad_change = True
fleet_wave = 3
fleet_healthy = replicas - fleet_wave if bad_change else replicas
safe_wave = 1
safe_healthy = replicas - safe_wave if bad_change else replicas
target_met = safe_healthy >= required_healthy
rollout_action = "stop" if bad_change else "continue"
```

1. The service has three cells and needs two healthy cells.

   Changed values: `{"replicas": 3, "required_healthy": 2, "bad_change": true}`

2. A fleet-wide wave couples all three cells to one bad change.

   Changed values: `{"fleet_wave": 3, "fleet_healthy": 0}`

3. A one-cell wave contains the first impact to one cell.

   Changed values: `{"safe_wave": 1, "safe_healthy": 2}`

4. The service retains two healthy cells, and the evidence gate stops the rollout.

   Changed values: `{"target_met": true, "rollout_action": "stop"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executes deterministic blast-radius arithmetic. It does not estimate real failure probability, detect hidden dependencies, or choose a safe observation window.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A Distinguished Engineer should ask for a <em>cause map</em>, not only a replica map: power, network, DNS, IAM, base image, deployment system, schema, operator path, and recovery control plane. Independence must exist along the failure modes that matter.</p>

</details>

## Explore (remaining exploration time)

Set a deployment wave size. Predict how many cells remain healthy after the first bad wave and whether the service still meets its two-cell target.

Open distinguished-engineer.html for the executable model.

Model limits: The arithmetic assumes the new version immediately fails every cell it reaches and the old version remains healthy. Real failures can be delayed, partial, or caused by shared control planes, identities, dependencies, data, and operator actions.

## Quiz (4 minutes)

1. Bad v2 reaches all three cells at once. How many independent software-version outcomes were tested?
   - Three
   - One shared outcome
   - Zero deployments

2. Why does a one-cell wave help?
   - It proves v2 can never fail later
   - It preserves two unchanged cells while evidence is collected
   - It removes every shared dependency

3. Where can this design still fail?
   - A shared DNS or identity dependency can take every cell down
   - One bad cell can be stopped
   - Two cells can remain on v1

4. Explain why replica count is not the same as failure independence.
5. Name one shared dependency in your platform and one signal that could reveal it.

<details><summary>Answer key — attempt first</summary>

1. One shared outcome. All cells received the same risky change together, so the rollout created one shared failure cause.

2. It preserves two unchanged cells while evidence is collected. A small wave limits exposure and leaves a healthy comparison group; it is not a universal proof.

3. A shared DNS or identity dependency can take every cell down. Runtime cells are not independent if they rely on one failing dependency or control plane.

</details>

## Sources

- [AWS Builders’ Library: Minimizing correlated failures in distributed systems](https://builder.aws.com/content/3Ev2H7t3l2eZa9xBXiZcAjz12JK/minimizing-correlated-failures-in-distributed-systems) — AWS article surfaced in its current Builder Center edition in 2026; foundation; checked 2026-10-04.
- [AWS Well-Architected DevOps Guidance: cell-based deployment and release](https://docs.aws.amazon.com/wellarchitected/latest/devops-guidance/dl.ads.6-utilize-cell-based-architectures-for-granular-deployment-and-release.html) — Published 2023-09-21; living guidance; checked 2026-10-04.
