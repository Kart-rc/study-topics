# One job, then gone: ephemeral self-hosted runners

CI/CD & GitHub Actions · Day13 · 15 minutes

See how destroying a self-hosted runner after one job reduces cross-job residue without making the current job trusted.

## Recall (2 minutes)

<p><a href="../Day12/ci-cd-github-actions.html">Day12: Speed aid or handoff record? Cache vs artifact</a></p><p>The dependency cache misses. What should the build do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Download or regenerate dependencies, then continue. GitHub&#x27;s guidance says jobs should be able to recreate cached files when the cache is unavailable.</p></details>

## Understand (4 minutes)

A hotel cleans and resets a room between guests. If the same workspace is reused without a reset, the next guest may find files or processes left by the previous one.

A persistent self-hosted runner can execute many jobs. A compromised or careless job may leave credentials, files, or background processes. An ephemeral runner is registered for one job, then GitHub de-registers it. Your automation destroys the machine or container and creates a clean one for the next job.

Provisionclean image

Run one jobworkspace changes

Destroyno next job on this runner

new job → new runner

GitHub recommends ephemeral self-hosted runners for autoscaling. The one-job lifecycle limits exposure from previous jobs. It does not protect a secret deliberately given to the current job.



An untrusted build writes leftover_token.txt. On a persistent runner, the next deployment job can see it unless cleanup was perfect. On an ephemeral runner, the runner is de-registered after the build and the backing environment is wiped before another job starts.

./config.sh --url https://github.com/acme   --token "$REGISTRATION_TOKEN" --ephemeral

Runner lifecycle changes operational duties. Forward runner logs to external storage before destruction. Keep the base image patched, scope network and IAM permissions, and assume repository code executed in the job may be hostile.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
persistent_disk = {}
persistent_disk["leftover_token.txt"] = "synthetic"
next_persistent_job_sees_residue = "leftover_token.txt" in persistent_disk
ephemeral_disk = {"leftover_token.txt": "synthetic"}
ephemeral_disk = {}  # destroy after one job
next_ephemeral_job_sees_residue = "leftover_token.txt" in ephemeral_disk
```

1. Start a reusable runner with an empty workspace.

   Changed values: `{"persistent_disk": {}}`

2. The untrusted build leaves a file behind.

   Changed values: `{"persistent_disk": {"leftover_token.txt": "synthetic"}}`

3. A later job on the same runner sees the residue.

   Changed values: `{"next_persistent_job_sees_residue": true}`

4. Destroying the one-job environment removes cross-job disk state.

   Changed values: `{"ephemeral_disk": {}, "next_ephemeral_job_sees_residue": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executes dictionary mutations. It does not provision or attack a runner and says nothing about secrets granted inside one job.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>GitHub's reference also notes that a job with no matching online runner may stay queued until the 24-hour timeout. Autoscaling correctness therefore includes capacity, routing labels, registration, cleanup, external logs, and upgrade discipline.</p>

</details>

## Explore (remaining exploration time)

Run an untrusted job, then a trusted job. Switch between persistent and ephemeral runners and inspect the residue.

Open ci-cd-github-actions.html for the executable model.

Model limits: A dictionary standing in for runner disk. It does not provision GitHub runners, ARC, VMs, containers, networks, IAM, or log forwarding. Ephemeral lifecycle reduces cross-job persistence; it does not secure secrets and permissions available during the same job.

## Quiz (4 minutes)

1. What happens after an ephemeral self-hosted runner processes one job?
   - GitHub automatically de-registers it
   - It becomes a permanent cache
   - It receives every queued job

2. Which risk does the one-job lifecycle directly reduce?
   - Residue from a previous job reaching a later job
   - A current job reading every secret granted to it
   - A vulnerable base image

3. Why must logs be sent elsewhere?
   - The ephemeral environment is destroyed, so local diagnostic logs would disappear
   - GitHub Actions cannot create logs
   - External logs make all jobs trustworthy

4. Explain the hotel-room analogy and name two threats it does not solve.
5. Design a minimum runner identity, network, image, and logging boundary for an EKS-based runner pool.

<details><summary>Answer key — attempt first</summary>

1. GitHub automatically de-registers it. GitHub documents one-job assignment and automatic de-registration; your infrastructure should then wipe or destroy it.

2. Residue from a previous job reaching a later job. A new environment limits cross-job carryover. Same-job permissions and image security remain separate controls.

3. The ephemeral environment is destroyed, so local diagnostic logs would disappear. GitHub explicitly warns that ephemeral runner logs need external preservation for troubleshooting.

</details>

## Sources

- [GitHub Docs: Self-hosted runners reference—ephemeral runners for autoscaling](https://docs.github.com/en/actions/reference/runners/self-hosted-runners#ephemeral-runners-for-autoscaling) — Living official documentation; checked 2026-10-03.
