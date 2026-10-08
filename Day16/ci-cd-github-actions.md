# The production secret waits: GitHub deployment environments

CI/CD & GitHub Actions · Day16 · 15 minutes

Model how an environment can hold a deployment job until branch and approval protections pass, then release environment secrets to that job.

## Recall (2 minutes)

<p><a href="../Day13/ci-cd-github-actions.html">Day13: One job, then gone: ephemeral self-hosted runners</a></p><p>What happens after an ephemeral self-hosted runner processes one job?</p><details><summary>Recall first, then reveal the refresher</summary><p>GitHub automatically de-registers it. GitHub documents one-job assignment and automatic de-registration; your infrastructure should then wipe or destroy it.</p></details><p><a href="../Day15/ci-cd-github-actions.html">Day15: A temporary cloud badge: GitHub Actions OIDC to AWS</a></p><p>What does id-token: write allow?</p><details><summary>Recall first, then reveal the refresher</summary><p>The job may request an OIDC token. GitHub states that this permission enables token requests; the cloud trust and role policy still decide access.</p></details>

## Understand (4 minutes)

A bank vault does not hand over the production key just because someone reached the vault door. It checks who arrived and whether another person approved the release.

A GitHub Actions job can reference an environment such as production. Protection rules can restrict deployment branches, require a reviewer, or impose a wait timer. Environment secrets become available only after the protection rules pass.


Visual question: Where does the production secret stay while a job waits?



The workflow declares the environment on the deployment job:

jobs:
  deploy:
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          TOKEN: ${{ secrets.PROD_TOKEN }}

If the branch is not allowed, the job is denied. If approval is required but missing, it waits. Only after the rules pass can the job start and read PROD_TOKEN.



## Read the visual

Where does the production secret stay while a job waits? The secret is drawn inside its environment boundary. It crosses to the deploy job only when the branch and approval gates both open. A queued or denied job never receives the secret in this model.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a deployment environment when a production job should wait for an allowed branch and an independent reviewer before receiving its environment secrets. Configure the protection rules on the environment as well as naming it in the workflow.

**Practical example.** Your data-quality service builds an artifact after tests pass. The production job references the production environment. With main allowed but approval pending, it waits and PROD_TOKEN is withheld. After an eligible reviewer approves, the job can start and receive that secret.

**How to decide.** Choose this for a release boundary that needs explicit approval. For a low-risk sandbox, automated checks may be sufficient. Confirm protection-rule availability for your GitHub plan; keep runner and deployment-script security checks too.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
branch = 'main'
approval = 'pending'
allowed_branches = {'main'}
prevent_self_review = True
branch_ok = branch in allowed_branches
approved = approval == 'approved_by_other'
job_state = 'DENIED' if not branch_ok else ('WAITING' if not approved else 'RUNNING')
environment_secret_available = job_state == 'RUNNING'
deployment_executed = environment_secret_available
```

1. Model a production environment that accepts main and requires an independent approval.

   Changed values: `{"branch": "main", "approval": "pending", "prevent_self_review": true}`

2. The branch passes, but the reviewer decision is still missing.

   Changed values: `{"branch_ok": true, "approved": false}`

3. Protection rules determine whether the deploy job is denied, waiting, or running.

   Changed values: `{"job_state": "WAITING"}`

4. The environment secret appears only after the job is allowed to start.

   Changed values: `{"environment_secret_available": false, "deployment_executed": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The Python decision model does not call GitHub, create an environment, or exercise plan-specific protection-rule availability.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>GitHub documents required reviewers, wait timers, deployment branch/tag restrictions, administrator bypass settings, custom protection rules, and environment secrets. Required reviewers can include up to six users or teams, but only one approval is needed. Availability varies by plan and repository visibility, so verify the current repository settings rather than copying a generic policy.</p>

</details>

## Explore (remaining exploration time)

Change the branch and reviewer decision. Predict whether the job is denied, waiting, or running—and whether the secret is available.

Open ci-cd-github-actions.html for the executable model.

Model limits: This model covers one environment with a branch restriction and one required approval. GitHub plan, repository visibility, admin-bypass settings, wait timers, custom protection rules, and self-hosted runner security change the real boundary. An environment gate does not make a deployment script safe or isolate a self-hosted runner.

## Quiz (4 minutes)

1. Main is allowed but approval is pending. What can the job read?
   - The environment secret is withheld while the job waits
   - The secret is printed in build logs
   - The deploy job runs immediately

2. Why put the environment on the deploy job instead of the build job?
   - Only the deployment boundary should receive production authority
   - Every job should receive all secrets
   - It makes tests unnecessary

3. What remains true after approval?
   - The deployment script and runner still need their own security controls
   - Approval proves the release is defect-free
   - Self-hosted runners become isolated containers

4. Which automated signal would you add as a custom protection rule, and what false positive could block safe releases?
5. How would you design emergency bypass so it is fast, visible, and reviewable?

<details><summary>Answer key — attempt first</summary>

1. The environment secret is withheld while the job waits. Environment secrets are not available until required protection rules pass.

2. Only the deployment boundary should receive production authority. Least privilege keeps build and test work outside the production trust boundary.

3. The deployment script and runner still need their own security controls. Environment approval is one gate, not a full supply-chain or runtime control.

</details>

## Sources

- [GitHub Docs: Deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments) — Living official documentation; protection rules and environment secrets; checked 2026-10-06.
- [GitHub Docs: Workflow syntax—jobs.<job_id>.environment](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idenvironment) — Living official syntax reference; checked 2026-10-06.
