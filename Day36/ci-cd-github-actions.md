# A protected environment holds the job before the runner sees its secrets

CI/CD & GitHub Actions · Day36 · 15 minutes

Place the production approval boundary before runner assignment and environment-secret access.

## Recall (2 minutes)

<p><a href="../Day27/ci-cd-github-actions.html">Day27: A restore key may return yesterday’s dependencies</a></p><p>A restore prefix returned h1 for requested h2. What next?</p><details><summary>Recall first, then reveal the refresher</summary><p>Run dependency resolution and verification for h2. A partial restore accelerates install but does not establish correctness.</p></details><p><a href="../Day15/ci-cd-github-actions.html">Day15: A temporary cloud badge: GitHub Actions OIDC to AWS</a></p><p>What does id-token: write allow?</p><details><summary>Recall first, then reveal the refresher</summary><p>The job may request an OIDC token. GitHub states that this permission enables token requests; the cloud trust and role policy still decide access.</p></details>

## Understand (4 minutes)

A bank vault does not hand the key to a courier and then ask a manager for approval. Approval comes first; only then does the courier receive access.

When a job references a GitHub environment, its protection rules must pass before the job is sent to a runner. Environment secrets become available only after that boundary.



The build job produces digest sha256:abc. A deploy job references production. A required reviewer rejects it: no production runner starts and no environment secret is released. Approval sends the job to a runner, where the workflow explicitly maps the secret into the deployment step.



## Read the visual

The three-stage gate answers when the runner and secret exist. Pending and rejected reviews leave both downstream boxes visibly inactive.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use environments for production or regulated targets that need approvals, branch restrictions, wait timers, custom policy checks, scoped secrets, or deployment history.

**Practical example.** A Databricks bundle or Kubernetes image may deploy to staging automatically but needs production approval and a production-only credential.

**How to decide.** Keep build artifacts immutable, put approval on the deployment job, scope secrets to the environment, and remember that approval does not validate the artifact by itself.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
review = 'pending'
runner_assigned = review == 'approved'
secret_available = runner_assigned
state = 'waiting for approval' if not runner_assigned else 'deploying'
```

1. The production protection rule is unresolved.

   Changed values: `{"review": "pending"}`

2. A pending job has no runner.

   Changed values: `{"runner_assigned": false}`

3. The environment secret stays behind the same boundary.

   Changed values: `{"secret_available": false}`

4. Expose the deployment state clearly.

   Changed values: `{"state": "waiting for approval"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model shows one job and one reviewer. It does not call GitHub, evaluate plan/repository availability, admin bypass, branch policies, wait timers, custom protection apps, concurrency, OIDC, reusable workflows, self-hosted runner risk, secret masking, or artifact integrity.

## Explore (remaining exploration time)

Approve or reject the deployment. Watch the job, runner, and secret states change in order.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model shows one job and one reviewer. It does not call GitHub, evaluate plan/repository availability, admin bypass, branch policies, wait timers, custom protection apps, concurrency, OIDC, reusable workflows, self-hosted runner risk, secret masking, or artifact integrity.

## Quiz (4 minutes)

1. A production review is pending. Can the job read its environment secret?
   - No; protection passes before runner assignment and secret access
   - Yes; pending is enough
   - Yes; all repository jobs share it

2. What does approval not prove?
   - That the artifact is trusted and correct
   - That a reviewer clicked approve
   - That the job references an environment

3. Where should production approval live?
   - On the job that references the protected environment
   - Only in a README
   - After the credential is used

4. Which deployment jobs currently receive production credentials before a policy decision?
5. What separate artifact-integrity evidence should the reviewer inspect? 

<details><summary>Answer key — attempt first</summary>

1. No; protection passes before runner assignment and secret access. The environment boundary withholds the job and its secret.

2. That the artifact is trusted and correct. Artifact integrity needs separate controls.

3. On the job that references the protected environment. The gate must precede access and deployment.

</details>

## Sources

- [GitHub Docs: deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [GitHub Docs: deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [GitHub Docs: secrets](https://docs.github.com/en/actions/concepts/security/secrets) — Living documentation; checked October 26, 2026; checked 2026-10-26.
