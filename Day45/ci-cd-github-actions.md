# Writing GITHUB_ENV changes the next step—not the current shell

CI/CD & GitHub Actions · Day45 · 15 minutes

Use GitHub Actions environment files with the correct step boundary and avoid treating them like immediate shell assignments.

## Recall (2 minutes)

<p><a href="../Day26/ci-cd-github-actions.html">Day26: Give every matrix job its own artifact name</a></p><p>Why is one name unsafe across v4 matrix uploads?</p><details><summary>Recall first, then reveal the refresher</summary><p>Artifacts are immutable and parallel jobs collide. Each job should create its own artifact.</p></details><p><a href="../Day30/ci-cd-github-actions.html">Day30: A called workflow cannot add permissions its caller withheld</a></p><p>A grants packages: read. C asks for packages: write. What is C’s effective maximum?</p><details><summary>Recall first, then reveal the refresher</summary><p>read. Nested reusable workflows cannot elevate permissions above the caller chain.</p></details>

## Understand (4 minutes)

Dropping a note into the next shift's inbox does not change what the current worker already knows.

A step appends NAME=value to the file named by GITHUB_ENV. The runner reads that file after the step and injects the value into later steps in the same job. The writing step does not gain the new variable unless it also sets its own shell variable.



Step 1 writes RELEASE_COLOR=blue to $GITHUB_ENV. An immediate echo "$RELEASE_COLOR" is empty. Step 2 sees blue. A different job does not inherit it; use job outputs or artifacts for cross-job state.



## Read the visual

The runner boundary is a visible gate between the file write and the next process, explaining both the same-step surprise and the cross-job limit.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use GITHUB_ENV when several later steps in one job need a small runtime value discovered by an earlier step.

**Practical example.** A build step computes the immutable image digest; later scan and summary steps need it within the same job.

**How to decide.** Use a normal shell variable inside the current step, GITHUB_ENV for later steps in one job, job outputs for small cross-job control data, and artifacts for files. Never write untrusted multiline data without a collision-safe method.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
step1_shell={}; github_env=[]
github_env.append('RELEASE_COLOR=blue'); same_step=step1_shell.get('RELEASE_COLOR')
next_step={'RELEASE_COLOR':'blue'}; same_job_value=next_step['RELEASE_COLOR']
different_job={}; cross_job_value=different_job.get('RELEASE_COLOR'); transport='job output or artifact'
```

1. Begin the writing step with no RELEASE_COLOR variable.

   Changed values: `{"step1_shell": {}, "github_env": []}`

2. Queue the value for the runner; the current shell still does not see it.

   Changed values: `{"github_env": ["RELEASE_COLOR=blue"], "same_step": null}`

3. At the step boundary, the runner injects the queued value.

   Changed values: `{"next_step": {"RELEASE_COLOR": "blue"}, "same_job_value": "blue"}`

4. A different job needs an explicit cross-job mechanism.

   Changed values: `{"different_job": {}, "cross_job_value": null, "transport": "job output or artifact"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model omits runner implementation, shells, encoding, multiline delimiters, command injection, reserved variables, composite actions, containers, matrices, secret masking, and actual GitHub execution.

## Explore (remaining exploration time)

Advance through the workflow steps and choose whether the same or a different job is reading. Watch when the variable becomes visible.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model omits runner implementation, shells, encoding, multiline delimiters, command injection, reserved variables, composite actions, containers, matrices, secret masking, and actual GitHub execution.

## Quiz (4 minutes)

1. Step 1 appends COLOR=blue to GITHUB_ENV, then immediately echoes $COLOR. What appears?
   - The previous/unset value unless the shell also assigned COLOR
   - blue is guaranteed immediately
   - The value appears in every job

2. Who sees the value?
   - Subsequent steps in the same job
   - All repository workflows
   - Earlier steps

3. What should carry a file to another job?
   - An artifact, with an output for small control metadata
   - GITHUB_ENV alone
   - A comment in the YAML

4. Which values in your workflows are same-step, later-step, cross-job, or file-sized?
5. Where could untrusted text written to an environment file alter later commands?

<details><summary>Answer key — attempt first</summary>

1. The previous/unset value unless the shell also assigned COLOR. The writing step cannot access the newly queued environment value through GITHUB_ENV.

2. Subsequent steps in the same job. The runner injects the value after the writing step for later steps in that job.

3. An artifact, with an output for small control metadata. Environment files are job-local; artifacts are the file transport mechanism.

</details>

## Sources

- [GitHub Actions workflow commands: environment files](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands) — Official GitHub documentation; checked November 4, 2026; checked 2026-11-04.
