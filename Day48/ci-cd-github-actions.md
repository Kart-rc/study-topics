# A tolerated failure has outcome=failure and conclusion=success

CI/CD & GitHub Actions · Day48 · 15 minutes

Preserve raw GitHub Actions evidence when continue-on-error deliberately normalizes a step.

## Recall (2 minutes)

<p><a href="../Day33/ci-cd-github-actions.html">Day33: Do not paste a pull-request title into a shell script</a></p><p>Why is ${{ github.event.pull_request.title }} dangerous inside run:?</p><details><summary>Recall first, then reveal the refresher</summary><p>GitHub substitutes it into generated shell code. Attacker-controlled text can change the script&#x27;s grammar.</p></details><p><a href="../Day21/ci-cd-github-actions.html">Day21: Do not run fork code inside a trusted pull_request_target job</a></p><p>What completes the vulnerable pattern after checking out fork code?</p><details><summary>Recall first, then reveal the refresher</summary><p>Executing its build/test/configuration. Execution gives attacker-controlled files the job’s authority.</p></details>

## Understand (4 minutes)

A smoke alarm can fire while the building remains open because the test is advisory. “Alarm fired” and “building decision” are both true.

For a step with continue-on-error, GitHub exposes steps.<id>.outcome before normalization and conclusion after it. A failing advisory step can therefore have outcome failure and conclusion success.



A preview-environment probe exits 1 but is temporarily advisory. The job continues. A summary that reads only conclusion reports success and hides the degradation. Reading the raw outcome lets the pipeline emit a warning, count debt, or block promotion under a separate policy.



## Read the visual

One failing signal splits into two labeled facts: raw outcome and normalized conclusion. The divergence is the concept, not decorative pipeline boxes.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use outcome versus conclusion when a workflow intentionally tolerates an experimental, flaky, or non-blocking step but still needs truthful telemetry.

**Practical example.** A new integration-test shard is advisory for one week while failure rate is measured.

**How to decide.** Give the step an id, inspect its raw outcome explicitly, and attach an owner and expiry to tolerance. Do not use continue-on-error for mandatory security, release, or data-integrity gates.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
raw_exit=1; continue_on_error=True
outcome='failure' if raw_exit else 'success'
conclusion='success' if outcome=='failure' and continue_on_error else outcome
result={'outcome':outcome,'conclusion':conclusion,'warn':outcome=='failure'}
```

1. Run an advisory check that fails.

   Changed values: `{"raw_exit": 1, "continue_on_error": true}`

2. Capture the result before tolerance is applied.

   Changed values: `{"outcome": "failure"}`

3. Normalize control flow while preserving raw evidence.

   Changed values: `{"conclusion": "success"}`

4. Telemetry can warn even though the job continues.

   Changed values: `{"result": {"outcome": "failure", "conclusion": "success", "warn": true}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model covers one step. It omits job-level continue-on-error, implicit success() conditions, matrices, cancellation, composite actions, retries, annotations, required checks, shell behavior, and real workflow execution.

## Explore (remaining exploration time)

Toggle raw result and tolerance. Predict outcome, conclusion, downstream condition, and job truth.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model covers one step. It omits job-level continue-on-error, implicit success() conditions, matrices, cancellation, composite actions, retries, annotations, required checks, shell behavior, and real workflow execution.

## Quiz (4 minutes)

1. A tolerated step exits 1. What are its values?
   - outcome=failure, conclusion=success
   - outcome=success, conclusion=failure
   - both skipped

2. Why inspect outcome?
   - To preserve the raw failure signal
   - To make the command pass retroactively
   - To expose secrets

3. Which gate should not be merely tolerated?
   - A mandatory security or release-integrity gate
   - A time-boxed experimental check
   - A diagnostic probe with an owner

4. Which tolerated step in your workflows currently disappears from dashboards?
5. What owner, metric, and expiry would make that tolerance temporary?

<details><summary>Answer key — attempt first</summary>

1. outcome=failure, conclusion=success. Outcome is pre-normalization; conclusion is post-normalization.

2. To preserve the raw failure signal. Tolerance should not erase evidence.

3. A mandatory security or release-integrity gate. Mandatory controls must fail the promotion path.

</details>

## Sources

- [GitHub Actions contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts) — Official GitHub documentation; checked November 8, 2026; checked 2026-11-08.
- [GitHub workflow syntax: continue-on-error](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) — Official GitHub documentation; checked November 8, 2026; checked 2026-11-08.
