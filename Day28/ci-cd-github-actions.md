# Write the deployment decision into the run summary

CI/CD & GitHub Actions · Day28 · 15 minutes

Turn scattered pipeline signals into a short, auditable decision on the workflow summary page.

## Recall (2 minutes)

<p><a href="../Day23/ci-cd-github-actions.html">Day23: Rollback is another deployment—of the last known-good digest</a></p><p>Why not rebuild the old commit during rollback?</p><details><summary>Recall first, then reveal the refresher</summary><p>It can produce different bytes. The verified object is the immutable prior artifact.</p></details><p><a href="../Day11/ci-cd-github-actions.html">Day11: Make the next job wait: GitHub Actions needs</a></p><p>With needs links and test failing, what ultimately happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Package and deploy are skipped. Default dependency conditions require success. Failure propagates as skips down this chain. File order creates no retry loop.</p></details>

## Understand (4 minutes)

A pilot’s dashboard does not make passengers read the engine log to learn whether the plane may take off. CI/CD should work the same way. Logs contain detail; a job summary should state the decision, the evidence, and the next safe action.

GitHub Actions renders Markdown appended to $GITHUB_STEP_SUMMARY on the workflow run summary page.



Tests pass, but the production error budget has only 8% remaining and policy requires 20%. The workflow blocks deployment. Its summary says “BLOCKED,” lists test=pass and error-budget=8%, links the policy, and gives the retry/rollback owner. The raw logs remain available for diagnosis.



## Read the visual

The visual is the exact artifact the technique creates: an operator-facing decision card, with the high-level outcome above the supporting signals.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a job summary when humans must quickly review tests, policy gates, deployment outcomes, or rollback instructions.

**Practical example.** A production deployment passes unit tests but is blocked by an SLO/error-budget guardrail.

**How to decide.** Summarize inputs and the final decision; link artifacts/logs for detail; never dump secrets or megabytes of output into the summary.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
signals={'tests':'pass','error_budget':8}
threshold=20
decision='DEPLOY' if signals['tests']=='pass' and signals['error_budget']>=threshold else 'BLOCKED'
summary={'decision':decision,'evidence':signals,'next':'review SLO'}
```

1. Collect the decision inputs.

   Changed values: `{"signals": {"tests": "pass", "error_budget": 8}}`

2. Load the explicit production policy.

   Changed values: `{"threshold": 20}`

3. Evaluate the gate from evidence.

   Changed values: `{"decision": "BLOCKED"}`

4. Publish a concise human-facing record.

   Changed values: `{"summary": {"decision": "BLOCKED", "evidence": {"tests": "pass", "error_budget": 8}, "next": "review SLO"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The local model does not run Actions. GitHub documents per-step summary files, a 1 MiB per-step limit, and at most 20 displayed step summaries per job; upload failure does not fail the job. Summaries aid humans but do not enforce policy by themselves.

## Explore (remaining exploration time)

Change the error budget. The rendered decision card changes, while the evidence stays visible.

Open ci-cd-github-actions.html for the executable model.

Model limits: The local model does not run Actions. GitHub documents per-step summary files, a 1 MiB per-step limit, and at most 20 displayed step summaries per job; upload failure does not fail the job. Summaries aid humans but do not enforce policy by themselves.

## Quiz (4 minutes)

1. What belongs in a useful job summary?
   - Decision, evidence, and next action
   - Every raw log line
   - Secrets for convenience

2. Does writing BLOCKED to the summary enforce the gate?
   - Yes
   - No; the workflow condition/status must enforce it
   - Only on main

3. Where is Markdown appended?
   - GITHUB_STEP_SUMMARY
   - GITHUB_TOKEN
   - PATH

4. Which three signals would make your deployment summary decision-ready?
5. What must remain in logs or artifacts instead of the summary?

<details><summary>Answer key — attempt first</summary>

1. Decision, evidence, and next action. The summary is a concise operational interface.

2. No; the workflow condition/status must enforce it. Presentation and enforcement are separate.

3. GITHUB_STEP_SUMMARY. GitHub renders content written to the step-summary environment file.

</details>

## Sources

- [GitHub Actions workflow commands: job summaries](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#adding-a-job-summary) — Living documentation; checked 2026-10-18.
- [GitHub Actions contexts](https://docs.github.com/en/actions/learn-github-actions/contexts) — Living documentation; checked 2026-10-18.
- [GitHub Actions deployment environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) — Living documentation; checked 2026-10-18.
