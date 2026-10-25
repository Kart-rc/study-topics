# A failed step silently adds success() to the next condition

CI/CD & GitHub Actions · Day35 · 15 minutes

Make cleanup and diagnostics run under the intended status without creating cancellation-resistant jobs.

## Recall (2 minutes)

<p><a href="../Day21/ci-cd-github-actions.html">Day21: Do not run fork code inside a trusted pull_request_target job</a></p><p>What completes the vulnerable pattern after checking out fork code?</p><details><summary>Recall first, then reveal the refresher</summary><p>Executing its build/test/configuration. Execution gives attacker-controlled files the job’s authority.</p></details><p><a href="../Day25/ci-cd-github-actions.html">Day25: A rerun keeps the run ID but increments the attempt</a></p><p>What changes when the same workflow run is rerun?</p><details><summary>Recall first, then reveal the refresher</summary><p>GITHUB_RUN_ATTEMPT. Attempt increments; run ID and the rerun SHA/ref stay the same.</p></details>

## Understand (4 minutes)

A fire alarm closes an office. A normal delivery rule—“if it is after 5 PM, lock the archive”—still assumes the office is operating normally. To override that assumption, the rule must explicitly say what to do during an alarm.

GitHub Actions applies a default success() status check to an if that contains no status function. After a failed step, if: steps.test.outcome == 'failure' alone can still be skipped; include failure().



Tests fail. An upload step with no if is skipped. if: failure() uploads failure diagnostics. always() also runs on cancellation and is suited to small step-level logging, but GitHub warns against using it for critical tasks that might hang. !cancelled() runs after success or failure but stops on cancellation.



## Read the visual

The small timeline ties each expression to the state transition it permits, instead of presenting status functions as an abstract syntax list.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use status functions for diagnostic uploads, cleanup, notifications, and dependent jobs whose behavior differs after failure or cancellation.

**Practical example.** Upload test reports after a test failure, but do not start a long source checkout after the workflow has been canceled.

**How to decide.** Use failure() for failure-only evidence, always() sparingly for short cancellation-safe steps, and !cancelled() for work that should run after success/failure but honor cancellation.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
statuses = ['success', 'failure', 'cancelled']
default_runs = {s: s == 'success' for s in statuses}
failure_runs = {s: s == 'failure' for s in statuses}
not_cancelled_runs = {s: s != 'cancelled' for s in statuses}
```

1. List the upstream states we must distinguish.

   Changed values: `{"statuses": ["success", "failure", "cancelled"]}`

2. A normal condition inherits success().

   Changed values: `{"default_runs": {"success": true, "failure": false, "cancelled": false}}`

3. failure() selects the diagnostic path.

   Changed values: `{"failure_runs": {"success": false, "failure": true, "cancelled": false}}`

4. !cancelled() honors an explicit stop.

   Changed values: `{"not_cancelled_runs": {"success": true, "failure": true, "cancelled": false}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser evaluates four simplified status choices. GitHub expressions also include ancestor job status, continue-on-error outcome versus conclusion, matrices, skipped jobs, cancellation timing, and runner termination. No workflow ran.

## Explore (remaining exploration time)

Select an upstream result and condition. The job timeline shows whether the diagnostic step runs.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser evaluates four simplified status choices. GitHub expressions also include ancestor job status, continue-on-error outcome versus conclusion, matrices, skipped jobs, cancellation timing, and runner termination. No workflow ran.

## Quiz (4 minutes)

1. Tests fail and upload has if: steps.test.outcome == 'failure' but no status function. Likely result?
   - The default success() can still skip it
   - It always runs
   - The workflow restarts

2. Best condition for failure-only diagnostics?
   - failure()
   - success()
   - cancelled()

3. Why avoid always() for a critical source-fetch task?
   - It can keep running after cancellation and hang until timeout
   - It disables logs
   - It changes repository permissions

4. Which current workflow diagnostics are skipped because they implicitly require success?
5. Which cleanup steps must honor cancellation, and which short steps truly need always()?

<details><summary>Answer key — attempt first</summary>

1. The default success() can still skip it. A status function is needed to override the implicit success gate.

2. failure(). failure() makes the intended status explicit.

3. It can keep running after cancellation and hang until timeout. GitHub recommends !cancelled() when cancellation should be honored.

</details>

## Sources

- [GitHub Docs: status check functions](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#status-check-functions) — Living documentation; checked October 25, 2026; checked 2026-10-25.
- [GitHub Docs: workflow cancellation](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-cancellation) — Living documentation; checked October 25, 2026; checked 2026-10-25.
- [GitHub Docs: troubleshooting workflows](https://docs.github.com/en/actions/how-tos/troubleshoot-workflows) — Living documentation; checked October 25, 2026; checked 2026-10-25.
