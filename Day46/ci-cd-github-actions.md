# Blue/green rollback switches traffic; it does not rewind shared data

CI/CD & GitHub Actions · Day46 · 15 minutes

Separate environment deployment, traffic routing, health gates, and data compatibility in a GitHub Actions blue/green release.

## Recall (2 minutes)

<p><a href="../Day32/ci-cd-github-actions.html">Day32: Block the newly vulnerable dependency, not the whole history</a></p><p>A PR introduces one high advisory and threshold is high. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>The review job fails. The introduced severity meets the fail threshold.</p></details><p><a href="../Day20/ci-cd-github-actions.html">Day20: A tag can move; a full commit SHA cannot</a></p><p>v1 moves aaa→bbb. @v1 does what?</p><details><summary>Recall first, then reveal the refresher</summary><p>Can run bbb without workflow diff. Ref resolves at run time.</p></details>

## Understand (4 minutes)

A restaurant opens a fully prepared second dining room before sending guests there. If service fails, the host sends new guests back to the old room.

Blue/green deployment keeps the old version (blue) serving while the replacement (green) is installed and tested. A router shifts traffic only after checks. GitHub Actions can orchestrate jobs and protected environments; the actual traffic shift belongs to the deployment platform.



Blue serves 100% of checkout traffic. GitHub deploys green, smoke tests it, then CodeDeploy shifts 10% to green. If green errors, routing returns to blue. Any database writes green already made remain and must be backward-compatible or explicitly compensated.



## Read the visual

Two proportional traffic bars move independently of the shared-data state, making the exact power—and the exact limit—of a blue/green rollback visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use blue/green when you need production-like validation and a fast traffic rollback while briefly paying for two environments.

**Practical example.** An ECS checkout service deploys a new task set, receives a 10% canary, and returns traffic to the old task set if the error gate fails.

**How to decide.** Choose blue/green when routing is controllable and both versions can safely share dependencies. Prefer in-place for low-risk stateless work; use expand/contract schemas or isolated data paths when shared-data compatibility is not guaranteed.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
traffic={'blue':100,'green':0}; shared_db={'schema':'expand-compatible','green_writes':0}
green_deployed=True; smoke_passed=True; traffic={'blue':90,'green':10}
shared_db['green_writes']=3; green_error_rate=0.08; gate_passed=green_error_rate<0.02
traffic={'blue':100,'green':0} if not gate_passed else traffic; rollback='route to blue'; data_rewound=False
```

1. Start with blue serving and a schema both versions can read.

   Changed values: `{"traffic": {"blue": 100, "green": 0}, "shared_db": {"schema": "expand-compatible", "green_writes": 0}}`

2. Deploy and test green before shifting a 10% canary.

   Changed values: `{"traffic": {"blue": 90, "green": 10}, "green_deployed": true, "smoke_passed": true}`

3. Green writes three records, then fails the synthetic error gate.

   Changed values: `{"shared_db": {"schema": "expand-compatible", "green_writes": 3}, "green_error_rate": 0.08, "gate_passed": false}`

4. Routing rolls back quickly, but committed shared data remains.

   Changed values: `{"traffic": {"blue": 100, "green": 0}, "rollback": "route to blue", "data_rewound": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: This model omits real GitHub jobs, AWS credentials, CodeDeploy configuration, health-check windows, DNS, sticky sessions, connection draining, queues, database migration details, cost, and region failure.

## Explore (remaining exploration time)

Move traffic from blue to green and inject a green failure. Observe routing reverse while the shared-data marker stays changed.

Open ci-cd-github-actions.html for the executable model.

Model limits: This model omits real GitHub jobs, AWS credentials, CodeDeploy configuration, health-check windows, DNS, sticky sessions, connection draining, queues, database migration details, cost, and region failure.

## Quiz (4 minutes)

1. Green fails during a 10% canary. What is the fast rollback?
   - Route new traffic back to blue
   - Delete the Git history
   - Assume database writes vanish

2. What does a GitHub environment approval provide?
   - A gate before the deployment job and its environment secrets
   - The load balancer implementation
   - Automatic database rewind

3. What is the shared-data boundary?
   - Both versions must tolerate the database state during rollback
   - Blue owns all past data
   - Green writes are always temporary

4. Which router or deployment service actually shifts traffic in your release path?
5. Which database change would make returning to blue unsafe, and how will expand/contract sequencing prevent it?

<details><summary>Answer key — attempt first</summary>

1. Route new traffic back to blue. Blue/green rollback is primarily a routing action while blue remains available.

2. A gate before the deployment job and its environment secrets. GitHub gates orchestration; the deployment platform moves traffic.

3. Both versions must tolerate the database state during rollback. Routing reversal does not undo already committed side effects.

</details>

## Sources

- [GitHub Actions: deploying with environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments) — Official GitHub documentation; checked November 5, 2026; checked 2026-11-05.
- [AWS CodeDeploy overview](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html) — Official AWS documentation; checked November 5, 2026; checked 2026-11-05.
- [AWS CodeDeploy deployment configurations](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html) — Official AWS documentation; checked November 5, 2026; checked 2026-11-05.
