# fail-fast cancels sibling matrix jobs; continue-on-error forgives only one job

CI/CD & GitHub Actions · Day59 · 15 minutes

Model GitHub Actions matrix failures so experimental coverage does not hide stable-platform breakage.

## Recall (2 minutes)

<p><a href="../Day33/ci-cd-github-actions.html">Day33: Do not paste a pull-request title into a shell script</a></p><p>Why is ${{ github.event.pull_request.title }} dangerous inside run:?</p><details><summary>Recall first, then reveal the refresher</summary><p>GitHub substitutes it into generated shell code. Attacker-controlled text can change the script&#x27;s grammar.</p></details><p><a href="../Day37/ci-cd-github-actions.html">Day37: One deployment at a time is not a rollback</a></p><p>Run A is canceled after applying a database migration. What is guaranteed?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only remaining workflow work is canceled; external recovery still needs a design. Workflow cancellation is not transactional rollback.</p></details>

## Understand (4 minutes)

A fire alarm can evacuate the whole building, while a test-kitchen mistake can be recorded without closing the restaurant. These are different policies.

In a job matrix, strategy.fail-fast applies to the matrix and defaults to true: a non-forgiven failure cancels queued and in-progress siblings. continue-on-error applies to one job. Mark only the experimental combination as allowed to fail; do not apply it to stable coverage.



Java 21 and 25 are required; Java 26-ea is experimental. If 26-ea fails with continue-on-error: true, stable jobs continue. If Java 21 fails, fail-fast cancels siblings.



## Read the visual

Three matrix cells share one fail-fast boundary, while only the experimental cell carries its own continue-on-error exception.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a test matrix when one codebase supports multiple runtimes or operating systems.

**Practical example.** A data connector tests supported JDKs and one early-access JDK without letting the experiment mask stable regressions.

**How to decide.** Keep required combinations un-forgiven. Label experiments explicitly, decide whether fast cancellation saves useful capacity, and retain enough logs to diagnose the first required failure.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
jobs={'21':'required','25':'required','26-ea':'experimental'}; failure='26-ea'
forgiven=(jobs[failure]=='experimental')
siblings_cancelled=not forgiven
result={'failure':failure,'forgiven':forgiven,'siblings_cancelled':siblings_cancelled,'workflow':'success-with-experimental-failure'}
```

1. Define stable and experimental combinations.

   Changed values: `{"jobs": {"21": "required", "25": "required", "26-ea": "experimental"}, "failure": "26-ea"}`

2. Evaluate continue-on-error for the failing job.

   Changed values: `{"forgiven": true}`

3. Apply fail-fast only to a non-forgiven failure.

   Changed values: `{"siblings_cancelled": false}`

4. Keep the experimental result visible without blocking stable coverage.

   Changed values: `{"result": {"failure": "26-ea", "forgiven": true, "siblings_cancelled": false, "workflow": "success-with-experimental-failure"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model has three jobs and instant state transitions. It omits runner timing, cancellation races, queued capacity, retries, artifacts, billing, branch protection, and required-check naming.

## Explore (remaining exploration time)

Switch the failing combination between experimental and stable. Predict which siblings are cancelled.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model has three jobs and instant state transitions. It omits runner timing, cancellation races, queued capacity, retries, artifacts, billing, branch protection, and required-check naming.

## Quiz (4 minutes)

1. The experimental job fails with continue-on-error true. What happens?
   - Other matrix jobs continue
   - Every sibling is cancelled
   - The failure becomes a stable pass

2. A required stable job fails while fail-fast is true. What happens?
   - Queued and in-progress matrix siblings are cancelled
   - Only the UI color changes
   - continue-on-error is added automatically

3. What is the dangerous configuration?
   - continue-on-error true for required stable jobs
   - An explicit experimental flag
   - Testing two supported versions

4. Which matrix combinations are truly required?
5. Would fail-fast save capacity or erase useful diagnosis in this workflow?

<details><summary>Answer key — attempt first</summary>

1. Other matrix jobs continue. The forgiveness applies to that job.

2. Queued and in-progress matrix siblings are cancelled. Fail-fast applies across the matrix.

3. continue-on-error true for required stable jobs. Forgiving required coverage can produce a green workflow with a real regression.

</details>

## Sources

- [GitHub Actions workflow syntax: matrix failure handling](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstrategyfail-fast) — Official GitHub documentation; checked November 19, 2026; checked 2026-11-19.
- [GitHub Actions: running job variations](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations) — Official GitHub documentation; checked November 19, 2026; checked 2026-11-19.
