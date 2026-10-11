# Do not run fork code inside a trusted pull_request_target job

CI/CD & GitHub Actions · Day21 · 15 minutes

Keep untrusted pull-request code out of jobs that hold base-repository secrets or write tokens.

## Recall (2 minutes)

<p><a href="../Day13/ci-cd-github-actions.html">Day13: One job, then gone: ephemeral self-hosted runners</a></p><p>What happens after an ephemeral self-hosted runner processes one job?</p><details><summary>Recall first, then reveal the refresher</summary><p>GitHub automatically de-registers it. GitHub documents one-job assignment and automatic de-registration; your infrastructure should then wipe or destroy it.</p></details><p><a href="../Day17/ci-cd-github-actions.html">Day17: Deployment concurrency: one pending run or a queue?</a></p><p>R1 runs; R2 then R3 wait with default queue and cancel-in-progress:false. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>R2 is canceled; R3 waits. False protects the running job, not the default pending slot.</p></details>

## Understand (4 minutes)

A visitor may hand reception a form. They should not be allowed to replace the receptionist’s instruction book and then use the master keys.

pull_request is designed to run untrusted fork code with restrictions. pull_request_target runs trusted base-branch workflow logic with elevated trust. The dangerous combination is checking out the fork head and then executing it in that trusted job.



A workflow triggered by pull_request_target checks out github.event.pull_request.head.sha and runs make test. The PR changes the Makefile to print a secret. Checkout alone is data movement; make test completes the exploit by executing attacker-controlled code.

GitHub’s current guide says its default public-repository policy is in evaluate mode and is scheduled for enforcement on November 2, 2026. Verify policy state again before relying on that date.



## Read the visual

The arrow is harmless data inspection until it becomes execution inside the privileged zone; then the destination box turns red.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this distinction for public repositories accepting fork pull requests, especially when workflows can write, use secrets, populate caches, or reach internal runners.

**Practical example.** Run tests on pull_request with read-only permissions; perform trusted labeling separately without executing fork code.

**How to decide.** Prefer pull_request for building/testing fork code. Use pull_request_target only for necessary trusted automation and keep PR content as untrusted data.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
event="pull_request_target"
executes_fork=True
privileged=True
crosses_boundary=executes_fork and privileged
decision="BLOCK" if crosses_boundary else "ALLOW"
```

1. Record the trust inputs.

   Changed values: `{"event": "pull_request_target", "executes_fork": true, "privileged": true}`

2. Detect untrusted execution with elevated authority.

   Changed values: `{"crosses_boundary": true}`

3. Fail the policy check before the job runs.

   Changed values: `{"decision": "BLOCK"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executed local policy arithmetic only; it did not run GitHub Actions or process real repository secrets.

## Explore (remaining exploration time)

Choose the event, whether fork code is executed, and whether secrets are present. Locate the trust-boundary crossing.

Open ci-cd-github-actions.html for the executable model.

Model limits: This model reduces GitHub’s permission, approval, cache, artifact, runner, and policy system to three switches. Review current organization policies and the complete secure-use guidance.

## Quiz (4 minutes)

1. What completes the vulnerable pattern after checking out fork code?
   - Executing its build/test/configuration
   - Reading PR number
   - Using a hosted runner name

2. Safer default for fork tests without secrets?
   - pull_request
   - pull_request_target with write token
   - issue_comment plus checkout

3. Does “checkout only” make all later steps safe?
   - Yes
   - No; tools may execute checked-out scripts, dependencies, or config
   - Only on Linux

4. Which current workflow could execute fork-controlled configuration indirectly?
5. How would you separate untrusted testing from a later trusted action?

<details><summary>Answer key — attempt first</summary>

1. Executing its build/test/configuration. Execution gives attacker-controlled files the job’s authority.

2. pull_request. The pull_request event applies fork protections.

3. No; tools may execute checked-out scripts, dependencies, or config. Execution can be indirect. Follow the data into every tool.

</details>

## Sources

- [GitHub: securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target) — Living documentation with a dated 2026-11-02 policy milestone; checked 2026-10-11.
- [GitHub: secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) — Living documentation; checked 2026-10-11.
