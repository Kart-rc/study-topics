# A required matrix failure may cancel siblings; an experimental failure need not

CI/CD & GitHub Actions · Day42 · 15 minutes

Use fail-fast and per-job continue-on-error deliberately so a test matrix stops waste without hiding required coverage.

## Recall (2 minutes)

<p><a href="../Day30/ci-cd-github-actions.html">Day30: A called workflow cannot add permissions its caller withheld</a></p><p>A grants packages: read. C asks for packages: write. What is C’s effective maximum?</p><details><summary>Recall first, then reveal the refresher</summary><p>read. Nested reusable workflows cannot elevate permissions above the caller chain.</p></details><p><a href="../Day18/ci-cd-github-actions.html">Day18: One failed matrix job: cancel siblings or collect evidence?</a></p><p>Next is experimental with continue-on-error true. It fails with fail-fast true. What happens to siblings?</p><details><summary>Recall first, then reveal the refresher</summary><p>They are not canceled by this tolerated failure. The tolerated failure does not trigger fail-fast cancellation. Each job keeps its own policy.</p></details>

## Understand (4 minutes)

Four lab tests run in parallel. If a required safety test fails, you may stop the others to save time. If an optional experiment fails, you still want the required results.

In GitHub Actions, matrix strategy.fail-fast defaults to true. A failure in a non-tolerated matrix job cancels queued and in-progress siblings. Job-level continue-on-error can mark an experimental leg as tolerated so its failure does not trigger those cancellations.



Node 20 on Windows is required and fails: with fail-fast true, later Linux and macOS legs can be cancelled. Node 23 is experimental and has continue-on-error: true: its failure does not cancel the required Node 20 and 22 legs.



## Read the visual

Four concrete matrix legs change state together. Required versus experimental failure controls whether siblings are cancelled, continued, or tolerated.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use matrix failure policy when compatibility tests run across operating systems, runtimes, regions, or deployment variants.

**Practical example.** Test a Java library on supported JDK 17/21 plus an experimental JDK 26 early-access leg.

**How to decide.** Use fail-fast when one required failure makes remaining results low-value and cancellation is safe. Disable it when complete failure evidence matters. Tolerate only clearly labeled experiments; never use continue-on-error to make required coverage green.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
jobs=['linux20','windows20','mac22','linux23-exp']; fail_fast=True
results={'linux20':'pass','windows20':'fail'}
if fail_fast and results['windows20']=='fail': results.update({'mac22':'cancelled','linux23-exp':'cancelled'})
required_green=all(results.get(j)=='pass' for j in ['linux20','windows20','mac22'])
```

1. Define three required legs and one experiment.

   Changed values: `{"jobs": ["linux20", "windows20", "mac22", "linux23-exp"], "fail_fast": true}`

2. A required Windows leg fails early.

   Changed values: `{"results": {"linux20": "pass", "windows20": "fail"}}`

3. Fail-fast cancels siblings that have not completed.

   Changed values: `{"results": {"linux20": "pass", "windows20": "fail", "mac22": "cancelled", "linux23-exp": "cancelled"}}`

4. The required contract remains failed.

   Changed values: `{"required_green": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model assumes a fixed start order and instant failure. GitHub runner availability, already-completed jobs, cancellation latency, expressions, max-parallel, matrix expansion, billing, and step-level continue-on-error are not executed.

## Explore (remaining exploration time)

Choose which leg fails and toggle fail-fast. Watch queued siblings become cancelled or continue while experimental tolerance stays distinct.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model assumes a fixed start order and instant failure. GitHub runner availability, already-completed jobs, cancellation latency, expressions, max-parallel, matrix expansion, billing, and step-level continue-on-error are not executed.

## Quiz (4 minutes)

1. A required matrix leg fails and fail-fast is true. What can happen?
   - Queued and in-progress sibling jobs are cancelled
   - Every sibling is guaranteed to finish
   - The failed job becomes experimental

2. Why put continue-on-error on the experimental job rather than the whole workflow?
   - Tolerance stays scoped to that leg
   - It makes required failures pass
   - It increases matrix size

3. When should fail-fast be false?
   - You need the complete cross-platform failure pattern for diagnosis
   - Any single failure makes all remaining evidence worthless
   - You want to hide required failures

4. Which matrix legs are contractual, and which are explicitly experimental?
5. Would complete failure evidence or saved runner time matter more for this workflow?

<details><summary>Answer key — attempt first</summary>

1. Queued and in-progress sibling jobs are cancelled. A non-tolerated failure triggers matrix-wide fail-fast cancellation.

2. Tolerance stays scoped to that leg. The required compatibility contract remains enforceable.

3. You need the complete cross-platform failure pattern for diagnosis. Full evidence can be worth the extra runner time.

</details>

## Sources

- [GitHub Actions workflow syntax: matrix fail-fast and continue-on-error](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstrategyfail-fast) — Official documentation; checked November 1, 2026; checked 2026-11-01.
- [GitHub Actions: Running variations of jobs in a workflow](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations#handling-failures) — Official documentation; checked November 1, 2026; checked 2026-11-01.
