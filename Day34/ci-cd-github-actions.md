# A job must match every runner label

CI/CD & GitHub Actions · Day34 · 15 minutes

Route work with labels and groups, while keeping scheduling separate from security and isolation.

## Recall (2 minutes)

<p><a href="../Day26/ci-cd-github-actions.html">Day26: Give every matrix job its own artifact name</a></p><p>Why is one name unsafe across v4 matrix uploads?</p><details><summary>Recall first, then reveal the refresher</summary><p>Artifacts are immutable and parallel jobs collide. Each job should create its own artifact.</p></details><p><a href="../Day14/ci-cd-github-actions.html">Day14: One pipeline contract: reusable GitHub Actions workflows</a></p><p>Where does a reusable workflow declare its caller contract?</p><details><summary>Recall first, then reveal the refresher</summary><p>Under on.workflow_call inputs and secrets. workflow_call is the trigger and contract surface for inputs and secrets.</p></details>

## Understand (4 minutes)

A delivery request that says “refrigerated, electric, Manhattan depot” needs a truck with every listed capability. A truck matching only two conditions is not eligible.

In GitHub Actions, an array in runs-on is an AND filter: a runner must match every value. A runner group narrows which repositories may target a pool. Labels describe scheduling capability; the group access policy and runner hardening form the stronger boundary.



A GPU test requests [self-hosted, linux, x64, gpu]. Runner A has linux+x64 but no gpu, so it waits. Runner B has all four labels and is eligible. If the job also requires group ml-secure, a perfectly labeled runner in another group remains ineligible.



## Read the visual

The three filters show scheduling as set intersection: job labels, runner labels, and group membership must all align.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use labels to select OS, architecture, accelerators, size, or installed capabilities. Use runner groups to limit which repositories can access sensitive or expensive runner pools.

**Practical example.** Only trusted ML repositories may target a private-network GPU pool; ordinary builds stay on ephemeral GitHub-hosted runners.

**How to decide.** Keep labels few and factual, monitor queue time, and use autoscaling/ephemeral runners where appropriate. Treat self-hosted runners as privileged infrastructure. Groups reduce scope, but they do not make untrusted workflow code safe.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
required_labels = ['self-hosted', 'linux', 'x64', 'gpu']
runner_labels = ['self-hosted', 'linux', 'x64']
eligible_before = all(label in runner_labels for label in required_labels)
runner_labels.append('gpu'); eligible_after = all(label in runner_labels for label in required_labels)
```

1. Declare every job capability.

   Changed values: `{"required_labels": ["self-hosted", "linux", "x64", "gpu"]}`

2. The first runner is missing gpu.

   Changed values: `{"runner_labels": ["self-hosted", "linux", "x64"]}`

3. The check is false, so the job waits.

   Changed values: `{"eligible_before": false}`

4. Adding the last label makes the runner eligible.

   Changed values: `{"runner_labels": ["self-hosted", "linux", "x64", "gpu"], "eligible_after": true}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser is a set-intersection model. It does not contact GitHub, inspect runner registration, model scale sets, custom label limits, permissions, repository policy, queue priority, concurrency, compromised runners, or network isolation.

## Explore (remaining exploration time)

Toggle runner labels and the group. The job becomes eligible only when every label and the required group match.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser is a set-intersection model. It does not contact GitHub, inspect runner registration, model scale sets, custom label limits, permissions, repository policy, queue priority, concurrency, compromised runners, or network isolation.

## Quiz (4 minutes)

1. A job lists self-hosted, linux, x64, gpu. Which runner is eligible?
   - One matching all four labels
   - One matching any single label
   - Every organization runner

2. Why add a runner group?
   - To restrict which repositories may access the pool
   - To turn labels into secrets
   - To skip workflow permissions

3. What do labels not prove?
   - That a runner is hardened against untrusted code
   - That a capability is advertised
   - That the scheduler can match a value

4. Which runner capabilities in your organization deserve labels, and which deserve separate groups?
5. What evidence would show a self-hosted runner is ephemeral, patched, and isolated from untrusted repositories?

<details><summary>Answer key — attempt first</summary>

1. One matching all four labels. Array labels are combined as an AND filter.

2. To restrict which repositories may access the pool. Groups add an access boundary around runner sets.

3. That a runner is hardened against untrusted code. Scheduling metadata is not a substitute for isolation and trust policy.

</details>

## Sources

- [GitHub Docs: choosing the runner for a job](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job) — Living documentation; checked October 24, 2026; checked 2026-10-24.
- [GitHub Docs: runner groups](https://docs.github.com/en/actions/concepts/runners/runner-groups) — Living documentation; checked October 24, 2026; checked 2026-10-24.
- [GitHub Docs: secure use of self-hosted runners](https://docs.github.com/en/actions/reference/security/secure-use) — Living documentation; checked October 24, 2026; checked 2026-10-24.
