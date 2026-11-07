# A green workflow is not deployment evidence until the deployment status says so

CI/CD & GitHub Actions · Day47 · 15 minutes

Model release progress as deployment states tied to an immutable revision, not merely a successful workflow run.

## Recall (2 minutes)

<p><a href="../Day27/ci-cd-github-actions.html">Day27: A restore key may return yesterday’s dependencies</a></p><p>A restore prefix returned h1 for requested h2. What next?</p><details><summary>Recall first, then reveal the refresher</summary><p>Run dependency resolution and verification for h2. A partial restore accelerates install but does not establish correctness.</p></details><p><a href="../Day31/ci-cd-github-actions.html">Day31: Attest the digest, not the tag</a></p><p>Why attest a digest rather than a tag?</p><details><summary>Recall first, then reveal the refresher</summary><p>A digest identifies the artifact bytes. A mutable name can be reused; a content digest changes with the bytes.</p></details>

## Understand (4 minutes)

A courier can finish the delivery route while the recipient still rejects the package. “Route completed” and “package accepted” are different facts.

A GitHub workflow run records automation execution. A deployment records a request for a specific ref, and deployment statuses describe its progress: queued, in progress, success, failure, or error. GitHub does not access your servers; the deployment integration must report the real outcome.



Workflow run 812 builds SHA a1b2 and exits zero after asking Argo CD to deploy. The cluster health gate fails five minutes later. If the pipeline marks only the workflow green, the dashboard lies. A deployment for SHA a1b2 should move queued → in_progress → failure with a log URL.



## Read the visual

Two timelines deliberately diverge after dispatch: the workflow stays green while the deployment status changes with cluster evidence, exposing the observability gap.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use deployment records and statuses when release completion is asynchronous or another system actually performs rollout and health checks.

**Practical example.** GitHub Actions submits an EKS deployment to Argo CD and waits for health evidence from the cluster.

**How to decide.** Key every deployment to an immutable SHA or digest, publish transitions from the system that observes them, and include logs. A synchronous tiny deployment may report directly, but never equate dispatch success with production success.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
workflow={'run':812,'sha':'a1b2','state':'success','meaning':'dispatch accepted'}
deployment={'sha':'a1b2','statuses':['queued','in_progress']} 
cluster_health='failed'; deployment['statuses'].append('failure')
current=deployment['statuses'][-1]; release_green=current=='success'
```

1. The workflow completed its orchestration step.

   Changed values: `{"workflow": {"run": 812, "sha": "a1b2", "state": "success", "meaning": "dispatch accepted"}}`

2. Track release state independently for the exact revision.

   Changed values: `{"deployment": {"sha": "a1b2", "statuses": ["queued", "in_progress"]}}`

3. The system observing the cluster reports the real outcome.

   Changed values: `{"deployment": {"sha": "a1b2", "statuses": ["queued", "in_progress", "failure"]}, "cluster_health": "failed"}`

4. Pipeline observability reads the latest deployment status.

   Changed values: `{"current": "failure", "release_green": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model is an in-memory state machine. It does not call GitHub, Argo CD, EKS, protection rules, environments, webhooks, authentication, retention APIs, concurrency controls, or rollback automation.

## Explore (remaining exploration time)

Change cluster health after workflow completion and compare workflow state with the deployment timeline.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model is an in-memory state machine. It does not call GitHub, Argo CD, EKS, protection rules, environments, webhooks, authentication, retention APIs, concurrency controls, or rollback automation.

## Quiz (4 minutes)

1. The workflow exits zero after dispatch, but cluster health fails. What should deployment status be?
   - failure
   - success
   - queued forever

2. Why key a deployment to SHA a1b2?
   - To identify exactly what revision the status describes
   - To make logs unnecessary
   - To rewrite the branch

3. What does GitHub not do for a deployment record?
   - Access and change your servers automatically
   - Store the requested ref
   - Dispatch deployment events

4. Which system currently knows whether your production rollout is healthy?
5. Where will SHA, environment, status, description, and log URL be joined for release reporting?

<details><summary>Answer key — attempt first</summary>

1. failure. The deployment status should reflect the observed rollout outcome.

2. To identify exactly what revision the status describes. A mutable branch name cannot by itself identify the deployed bits.

3. Access and change your servers automatically. An integration performs rollout and reports evidence.

</details>

## Sources

- [GitHub REST deployments](https://docs.github.com/en/rest/deployments/deployments) — Official GitHub documentation; checked November 6, 2026; checked 2026-11-06.
- [GitHub REST deployment statuses](https://docs.github.com/en/rest/deployments/statuses) — Official GitHub documentation; checked November 6, 2026; checked 2026-11-06.
- [GitHub deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments) — Official GitHub documentation; checked November 6, 2026; checked 2026-11-06.
