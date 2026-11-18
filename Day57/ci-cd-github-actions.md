# A fast job can still wait eight minutes for a runner—measure queue and execution separately

CI/CD & GitHub Actions · Day57 · 15 minutes

Diagnose GitHub Actions latency by separating runner wait from the time steps actually execute.

## Recall (2 minutes)

<p><a href="../Day32/ci-cd-github-actions.html">Day32: Block the newly vulnerable dependency, not the whole history</a></p><p>A PR introduces one high advisory and threshold is high. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>The review job fails. The introduced severity meets the fail threshold.</p></details><p><a href="../Day36/ci-cd-github-actions.html">Day36: A protected environment holds the job before the runner sees its secrets</a></p><p>A production review is pending. Can the job read its environment secret?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; protection passes before runner assignment and secret access. The environment boundary withholds the job and its secret.</p></details>

## Understand (4 minutes)

A five-minute doctor visit can still consume an hour if you wait fifty-five minutes in the lobby. Making the examination faster does not fix the lobby.

A workflow’s wall-clock latency contains distinct phases. The run is created, a job waits for a matching runner, the job starts, and its steps execute until completion. GitHub’s workflow-job API exposes job started_at, completed_at, runner labels, name, and step timings. Pair that with the run’s creation time to estimate queue time. Treat the result as operational evidence; retries, dependencies, approvals, and matrix scheduling may need separate attribution.



Run 57 is created at 10:00. The build job starts at 10:08 and completes at 10:10. Total latency is 10 minutes, but execution is only 2. Tuning tests cannot recover the eight minutes spent waiting for a suitable runner.



## Read the visual

A proportional timeline keeps queue and execution on one consistent scale, so the largest latency phase is visually and numerically obvious.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use phase-separated pipeline metrics when developers report slow feedback even though job steps look fast.

**Practical example.** A data-platform repository has scarce GPU or self-hosted runner labels and pull requests wait before any test begins.

**How to decide.** Measure by workflow, job, label, repository, event, and percentile. Add runner capacity or change label policy for queue time; optimize steps or caching for execution time. Do not mix environment approvals or dependency waits into runner queue without modeling them separately.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
run_created=0; job_started=8; job_completed=10
queue_minutes=job_started-run_created
execution_minutes=job_completed-job_started
result={'queue_minutes':queue_minutes,'execution_minutes':execution_minutes,'total_minutes':job_completed-run_created,'dominant':'queue'}
```

1. Place one job on a minute timeline.

   Changed values: `{"run_created": 0, "job_started": 8, "job_completed": 10}`

2. Estimate time before execution begins.

   Changed values: `{"queue_minutes": 8}`

3. Measure step execution separately.

   Changed values: `{"execution_minutes": 2}`

4. Choose the remediation from the dominant phase.

   Changed values: `{"result": {"queue_minutes": 8, "execution_minutes": 2, "total_minutes": 10, "dominant": "queue"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model has one independent job and uses run creation as a simple queue baseline. It does not call GitHub APIs, model needs dependencies, matrices, approvals, concurrency groups, retries, hosted-runner provisioning, billing, clock skew, cancelled jobs, webhook delivery, or percentile aggregation.

## Explore (remaining exploration time)

Move runner wait from zero to eight minutes while keeping execution at two. Predict which remediation changes.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model has one independent job and uses run creation as a simple queue baseline. It does not call GitHub APIs, model needs dependencies, matrices, approvals, concurrency groups, retries, hosted-runner provisioning, billing, clock skew, cancelled jobs, webhook delivery, or percentile aggregation.

## Quiz (4 minutes)

1. Run created 10:00; job starts 10:08; completes 10:10. What dominates?
   - Eight-minute runner queue time
   - Two-minute execution time
   - Artifact retention

2. Which action best fits the evidence?
   - Investigate matching runner capacity and label policy
   - Rewrite the two-minute test first
   - Increase artifact retention

3. What can invalidate the simple queue estimate?
   - The job first waited on needs dependencies or an environment approval
   - The job has a name
   - The workflow succeeded

4. Which runner label has the highest pull-request queue percentile in your repositories?
5. Which non-runner waits must be separated before using creation-to-start as queue time?

<details><summary>Answer key — attempt first</summary>

1. Eight-minute runner queue time. Most feedback latency occurs before steps start.

2. Investigate matching runner capacity and label policy. Fix the phase that consumes the time.

3. The job first waited on needs dependencies or an environment approval. Creation-to-start can include non-runner waits unless they are separated.

</details>

## Sources

- [GitHub REST API: Workflow jobs](https://docs.github.com/en/rest/actions/workflow-jobs) — Official GitHub documentation; checked November 17, 2026; checked 2026-11-17.
- [GitHub REST API: Workflow runs](https://docs.github.com/en/rest/actions/workflow-runs) — Official GitHub documentation; checked November 17, 2026; checked 2026-11-17.
