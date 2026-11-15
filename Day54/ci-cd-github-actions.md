# A self-hosted runner can remember the last job—destroy it before trust changes

CI/CD & GitHub Actions · Day54 · 15 minutes

Prevent untrusted workflow code from leaving files or processes that a later privileged job inherits.

## Recall (2 minutes)

<p><a href="../Day36/ci-cd-github-actions.html">Day36: A protected environment holds the job before the runner sees its secrets</a></p><p>A production review is pending. Can the job read its environment secret?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; protection passes before runner assignment and secret access. The environment boundary withholds the job and its secret.</p></details><p><a href="../Day24/ci-cd-github-actions.html">Day24: A merge queue needs tests for the merge group</a></p><p>Which event makes Actions run for a GitHub merge queue candidate?</p><details><summary>Recall first, then reveal the refresher</summary><p>merge_group. The merge_group event targets the temporary queued candidate.</p></details>

## Understand (4 minutes)

A hotel room is safe for the next guest only after it is reset. Reusing a room exactly as the last guest left it transfers trust between strangers.

GitHub warns that self-hosted runners are not guaranteed to be clean ephemeral machines and can be persistently compromised by untrusted workflow code. A later job on the same host may inherit files, processes, credentials, sockets, or modified tools. Put untrusted work on disposable infrastructure; scope runner groups and workflow access; keep privileged deployment separate.



Pull request pr-54 writes /tmp/deploy-wrapper on runner r7. The job ends green. Later, a trusted production job lands on the same persistent runner and invokes that wrapper. An ephemeral just-in-time runner would be removed after the pull-request job, so the file would not cross the boundary.



## Read the visual

Two jobs share or lose one disk between them, making the exact persistence point and the effect of runner destruction visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use ephemeral self-hosted runners when jobs need your network or hardware but code trust varies between runs.

**Practical example.** An EKS platform runs pull-request tests and production deployments through organization-owned runner scale sets.

**How to decide.** Separate runner groups by trust and workflow, allow only selected repositories, minimize token permissions, and prefer one-job ephemeral instances. GitHub-hosted runners may be simpler when private-network access and custom hardware are unnecessary.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
host_files=set(); lifecycle='persistent'
host_files.add('/tmp/deploy-wrapper')
if lifecycle=='ephemeral': host_files.clear()
result={'deploy_inherits_wrapper':'/tmp/deploy-wrapper' in host_files,'safe_boundary':lifecycle=='ephemeral'}
```

1. Create one self-hosted runner disk.

   Changed values: `{"lifecycle": "persistent"}`

2. Let the untrusted job leave a file.

   Changed values: `{}`

3. Destroy state only in the ephemeral branch.

   Changed values: `{}`

4. Inspect what the privileged job inherits.

   Changed values: `{"result": {"deploy_inherits_wrapper": true, "safe_boundary": false}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The local model tracks one file between two jobs. It does not start Actions runners, containers, VMs, ARC, runner scale sets, JIT registration, EKS, malware, network persistence, secrets, token permissions, logs, autoscaling, or image patching.

## Explore (remaining exploration time)

Choose persistent or ephemeral lifecycle, then run an untrusted build followed by a privileged deploy. Predict which artifact survives.

Open ci-cd-github-actions.html for the executable model.

Model limits: The local model tracks one file between two jobs. It does not start Actions runners, containers, VMs, ARC, runner scale sets, JIT registration, EKS, malware, network persistence, secrets, token permissions, logs, autoscaling, or image patching.

## Quiz (4 minutes)

1. pr-54 writes a wrapper and the same runner later deploys. What is the failure?
   - Persistent state crossed from untrusted to privileged work
   - The first job was too short
   - The YAML used two jobs

2. Why prefer ephemeral JIT runners?
   - One job gets one runner lifecycle, reducing persistence between jobs
   - They make workflow code trustworthy
   - They remove the need for token scoping

3. What remains necessary with ephemeral runners?
   - Trusted images, narrow registration and token permissions, network isolation, and logging
   - Nothing else
   - Only a longer timeout

4. Which current workflow can execute less-trusted code on a runner later used for production?
5. What state besides disk—processes, network, credentials, images—needs its own isolation or reset evidence?

<details><summary>Answer key — attempt first</summary>

1. Persistent state crossed from untrusted to privileged work. Host reuse creates an unintended trust bridge even when each job is separate.

2. One job gets one runner lifecycle, reducing persistence between jobs. Destruction closes one persistence path; other controls remain necessary.

3. Trusted images, narrow registration and token permissions, network isolation, and logging. Ephemerality is one boundary, not a complete runner security program.

</details>

## Sources

- [GitHub Actions: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) — Official GitHub documentation; checked November 14, 2026; checked 2026-11-14.
- [GitHub Actions: Self-hosted runners reference](https://docs.github.com/en/actions/reference/runners/self-hosted-runners) — Official GitHub documentation; checked November 14, 2026; checked 2026-11-14.
- [GitHub Actions: Adding self-hosted runners](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners) — Official GitHub documentation; checked November 14, 2026; checked 2026-11-14.
