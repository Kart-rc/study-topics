# A job timeout cancels the runner; it does not undo a deployment

CI/CD & GitHub Actions · Day43 · 15 minutes

Use GitHub Actions timeouts to bound stuck work while designing rollback and reconciliation as separate mechanisms.

## Recall (2 minutes)

<p><a href="../Day25/ci-cd-github-actions.html">Day25: A rerun keeps the run ID but increments the attempt</a></p><p>What changes when the same workflow run is rerun?</p><details><summary>Recall first, then reveal the refresher</summary><p>GITHUB_RUN_ATTEMPT. Attempt increments; run ID and the rerun SHA/ref stay the same.</p></details><p><a href="../Day29/ci-cd-github-actions.html">Day29: A skipped required workflow can wait forever</a></p><p>Why can a workflow-level path filter block a PR?</p><details><summary>Recall first, then reveal the refresher</summary><p>The required check is never reported and stays Pending. A skipped required workflow does not emit the successful check the rule expects.</p></details>

## Understand (4 minutes)

A kitchen timer stops the oven. It does not turn a baked cake back into batter.

jobs.<job_id>.timeout-minutes tells GitHub to cancel a job after a limit; the default is 360 minutes. Cancellation stops remaining runner work. Any external side effect already completed—such as changing production traffic—can remain. Rollback must be an explicit, independently reliable action.



A deploy job switches production from v41 to v42 at minute 4. A smoke test hangs. At minute 10 the job is cancelled. Production still serves v42 because the traffic change happened outside the runner. A separate deployment controller or follow-up workflow must observe the incomplete release and restore v41 when policy requires it.



## Read the visual

The timeout marker moves across the deployment timeline, making the external traffic change persist even after runner cancellation.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a job timeout whenever runner work can hang, wait forever on infrastructure, or consume unbounded minutes.

**Practical example.** A GitHub Actions deployment waits on an EKS rollout or a smoke-test endpoint that never returns.

**How to decide.** Set the timeout from expected duration plus measured headroom. Make scripts handle termination where possible, but assume cleanup may not finish. Keep rollback and external reconciliation outside the process being killed.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
timeout_minute=10; traffic_switch_minute=4; smoke_hangs=True
traffic_switched=traffic_switch_minute < timeout_minute; production='v42' if traffic_switched else 'v41'
job='cancelled' if smoke_hangs else 'success'; rollback_ran=False
reconciler_detects=(job=='cancelled' and production=='v42'); desired='v41' if reconciler_detects else production
```

1. Define the job deadline and the completed external change.

   Changed values: `{"timeout_minute": 10, "traffic_switch_minute": 4, "smoke_hangs": true}`

2. The traffic switch happens before cancellation.

   Changed values: `{"traffic_switched": true, "production": "v42"}`

3. The runner stops; no later rollback step is guaranteed.

   Changed values: `{"job": "cancelled", "rollback_ran": false}`

4. An independent observer can decide to restore the last good version.

   Changed values: `{"reconciler_detects": true, "desired": "v41"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The timeline is synthetic. It does not execute GitHub Actions, send termination signals, model action-specific cleanup, runner limits, billing, token expiry, concurrency cancellation, or a real deployment controller.

## Explore (remaining exploration time)

Move the timeout before or after the traffic switch and toggle an external reconciler. Observe which production version survives cancellation.

Open ci-cd-github-actions.html for the executable model.

Model limits: The timeline is synthetic. It does not execute GitHub Actions, send termination signals, model action-specific cleanup, runner limits, billing, token expiry, concurrency cancellation, or a real deployment controller.

## Quiz (4 minutes)

1. The job times out after traffic already switched to v42. What does production serve?
   - v42 unless a separate rollback occurs
   - Automatically v41
   - No version because GitHub deletes production

2. Why keep rollback outside the timed-out job?
   - The process being killed may never reach its cleanup step
   - Timeouts guarantee cleanup
   - GITHUB_TOKEN makes deployments transactional

3. How should you choose timeout-minutes?
   - Expected duration plus measured headroom and a recovery design
   - Always the 360-minute default
   - Shorter than every normal run

4. Which workflows can change production before their final health signal?
5. What independent controller or workflow can detect and reconcile an abandoned deployment?

<details><summary>Answer key — attempt first</summary>

1. v42 unless a separate rollback occurs. Job cancellation does not reverse an external side effect.

2. The process being killed may never reach its cleanup step. A cancellation boundary cannot be trusted to execute later steps.

3. Expected duration plus measured headroom and a recovery design. A useful bound distinguishes a stuck run from normal variance without creating avoidable cancellations.

</details>

## Sources

- [GitHub Actions workflow syntax: job timeout-minutes](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes) — Official documentation; checked November 2, 2026; checked 2026-11-02.
