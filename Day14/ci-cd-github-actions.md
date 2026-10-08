# One pipeline contract: reusable GitHub Actions workflows

CI/CD & GitHub Actions · Day14 · 15 minutes

Separate a caller’s deployment choice from a shared workflow’s implementation using typed inputs and explicit secrets.

## Recall (2 minutes)

<p><a href="../Day11/ci-cd-github-actions.html">Day11: Make the next job wait: GitHub Actions needs</a></p><p>With needs links and test failing, what ultimately happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Package and deploy are skipped. Default dependency conditions require success. Failure propagates as skips down this chain. File order creates no retry loop.</p></details><p><a href="../Day13/ci-cd-github-actions.html">Day13: One job, then gone: ephemeral self-hosted runners</a></p><p>What happens after an ephemeral self-hosted runner processes one job?</p><details><summary>Recall first, then reveal the refresher</summary><p>GitHub automatically de-registers it. GitHub documents one-job assignment and automatic de-registration; your infrastructure should then wipe or destroy it.</p></details>

## Understand (4 minutes)

A restaurant can reuse one kitchen recipe while each table supplies an order slip. The slip says “staging” or “production”; it does not rewrite the recipe.

A reusable GitHub Actions workflow is that shared recipe. It lives in .github/workflows, declares workflow_call, and defines the inputs and secrets a caller may pass.

Visual question: Which caller values fit the reusable workflow contract?



Two services use one deployment workflow.

on:
  workflow_call:
    inputs:
      environment: {required: true, type: string}
    secrets:
      deploy_token: {required: true}

The caller uses the workflow at the job level, not inside steps:

jobs:
  deploy:
    uses: acme/platform/.github/workflows/deploy.yml@v3
    with:
      environment: staging
    secrets:
      deploy_token: ${{ secrets.DEPLOY_TOKEN }}

This creates a visible contract. It does not automatically make the shared workflow safe: pin trustworthy refs, keep permissions narrow, and understand that environment secrets have special behavior.



## Read the visual

Which caller values fit the reusable workflow contract? Read across each connector: caller input must fit the declared type and the required secret must arrive. Both connections are needed before the shared steps can start. Inherit works in this toy but exposes more secrets.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
contract = {'environment_type': 'string', 'secret_required': True}
caller = {'environment': 'staging', 'deploy_token': 'present'}
input_ok = isinstance(caller['environment'], str)
secret_ok = caller.get('deploy_token') == 'present'
call_status = 'accepted' if input_ok and secret_ok else 'rejected'
```

1. Represent the reusable workflow’s declared contract.

   Changed values: `{"contract": {"environment_type": "string", "secret_required": true}}`

2. The caller supplies one string input and one named secret.

   Changed values: `{"caller": {"environment": "staging", "deploy_token": "present"}}`

3. Validate the two requirements independently.

   Changed values: `{"input_ok": true, "secret_ok": true}`

4. Only a caller satisfying the contract reaches the shared jobs.

   Changed values: `{"call_status": "accepted"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executes a Python model of two contract checks. It does not parse YAML or run GitHub Actions; the YAML shown is explanatory and version-sensitive behavior comes from GitHub Docs.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>For platform teams, reusable workflows are an API. Version them, publish compatibility expectations, pin third-party actions, set minimal <code>permissions</code>, expose useful outputs, and instrument call adoption and failure rates. Reuse can centralize both good controls and bad mistakes.</p>

</details>

## Explore (remaining exploration time)

Change the caller’s input type and secret choice. Predict whether the contract accepts the call before any deployment steps run.

Open ci-cd-github-actions.html for the executable model.

Model limits: This is a local contract checker, not the GitHub Actions expression engine. It does not fetch a workflow ref, enforce repository access, model nested workflows, permissions, environments, billing, or runner execution.

## Quiz (4 minutes)

1. Where does a reusable workflow declare its caller contract?
   - Under on.workflow_call inputs and secrets
   - Inside a README only
   - Inside the caller’s first shell step

2. How does a caller invoke a reusable workflow?
   - With jobs.<job_id>.uses
   - With run inside a step
   - By copying every step

3. What is a boundary of reuse?
   - A shared workflow automatically receives every environment secret
   - Environment secrets cannot be passed through workflow_call in the same way as named caller secrets
   - Typed inputs never need validation

4. Explain what belongs in the caller versus the reusable workflow.
5. If @v3 is moved to new code, what supply-chain risk appears and how would you reduce it?

<details><summary>Answer key — attempt first</summary>

1. Under on.workflow_call inputs and secrets. workflow_call is the trigger and contract surface for inputs and secrets.

2. With jobs.<job_id>.uses. Reusable workflows are called at the job level. Actions are used inside steps.

3. Environment secrets cannot be passed through workflow_call in the same way as named caller secrets. GitHub documents special environment-secret behavior; secret flow must be designed explicitly.

</details>

## Sources

- [GitHub Docs: Reuse workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows) — Living GitHub Actions documentation; checked 2026-10-04; checked 2026-10-04.
- [GitHub Docs: Workflow syntax for workflow_call](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_call) — Living GitHub Actions reference; checked 2026-10-04; checked 2026-10-04.
