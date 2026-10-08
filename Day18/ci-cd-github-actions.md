# One failed matrix job: cancel siblings or collect evidence?

CI/CD & GitHub Actions · Day18 · 15 minutes

Separate fail-fast cancellation from an experimental job’s allowed failure.

## Recall (2 minutes)

<p><a href="../Day11/ci-cd-github-actions.html">Day11: Make the next job wait: GitHub Actions needs</a></p><p>With needs links and test failing, what ultimately happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Package and deploy are skipped. Default dependency conditions require success. Failure propagates as skips down this chain. File order creates no retry loop.</p></details><p><a href="../Day15/ci-cd-github-actions.html">Day15: A temporary cloud badge: GitHub Actions OIDC to AWS</a></p><p>What does id-token: write allow?</p><details><summary>Recall first, then reveal the refresher</summary><p>The job may request an OIDC token. GitHub states that this permission enables token requests; the cloud trust and role policy still decide access.</p></details>

## Understand (4 minutes)

A school tests a recipe in three ovens. If a required oven fails, the cook can stop the rest to save time, or finish every test to learn all the problems. A GitHub Actions matrix creates job variations. strategy.fail-fast controls cancellation of sibling matrix jobs when a non-tolerated job fails.

continue-on-error answers another question: is this job’s failure allowed? An experimental variation can fail without triggering fail-fast cancellation of the required variations. Turning fail-fast off gathers more results; it does not make a required failure acceptable.



Our three synthetic jobs are J17 (required), J21 (required), and Next (experimental). We make one job fail while the others are pending or running. The visual fixes that order so the policy difference is visible; GitHub does not promise this order.

# Job fragment: application setup and test steps omitted
continue-on-error: ${{ matrix.experimental }}
strategy:
  fail-fast: true
  matrix:
    include:
      - { lane: J17, experimental: false }
      - { lane: J21, experimental: false }
      - { lane: Next, experimental: true }



## Read the visual

A matrix table keeps every lane visible. Changing the failing lane changes whether sibling cells become canceled; fail-fast does not alter the original failure.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this for runtime or operating-system compatibility matrices where some lanes are required and others are exploratory.

**Practical example.** A Java library must support J17/J21 but probes a future runtime in a separately labeled experimental lane.

**How to decide.** Keep required lanes strict. Disable fail-fast temporarily when a full compatibility picture is worth extra runner time. Do not make all lanes experimental to obtain a green badge.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
jobs = {"J17": "running", "J21": "queued", "Next": "queued"}
fail_fast = True
jobs["J17"] = "failed"
experimental = False
cancel_siblings = fail_fast and not experimental
jobs = {name: ("canceled" if cancel_siblings and state in ["running", "queued"] else state) for name, state in jobs.items()}
```

1. All three variations exist; none has completed.

   Changed values: `{"jobs": {"J17": "running", "J21": "queued", "Next": "queued"}, "fail_fast": true}`

2. This failure belongs to a required lane.

   Changed values: `{"jobs": {"J17": "failed", "J21": "queued", "Next": "queued"}, "experimental": false, "cancel_siblings": true}`

3. Cancel unfinished siblings, while retaining the original failure.

   Changed values: `{"jobs": {"J17": "failed", "J21": "canceled", "Next": "canceled"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executed Python policy fixture, not a GitHub workflow scheduler. Real timing can leave already completed siblings unaffected.

## Explore (remaining exploration time)

First fail the experimental lane with fail-fast on. Then fail a required lane. Finally turn fail-fast off and compare sibling states, not just the failed job.

Open ci-cd-github-actions.html for the executable model.

Model limits: The JavaScript model fixes completion order and assumes sibling jobs have not finished. Real cancellation races with completion. This is not a workflow run and does not model branch-protection rules or downstream deployment gates.

## Quiz (4 minutes)

1. Next is experimental with continue-on-error true. It fails with fail-fast true. What happens to siblings?
   - They must be canceled
   - They are not canceled by this tolerated failure
   - They all become experimental

2. J17 fails with fail-fast false. Is the required failure erased?
   - No; other jobs can finish but the failure remains
   - Yes
   - Only if J21 passes

3. Why might you temporarily disable fail-fast?
   - To guarantee deployment
   - To serialize every job
   - To see all compatibility failures in one run

4. Which lanes would be required in your compatibility matrix and why?
5. How would you prevent tolerated experimental failures from hiding a required deployment gate?

<details><summary>Answer key — attempt first</summary>

1. They are not canceled by this tolerated failure. The tolerated failure does not trigger fail-fast cancellation. Each job keeps its own policy.

2. No; other jobs can finish but the failure remains. fail-fast governs cancellation, not whether a required failure is acceptable.

3. To see all compatibility failures in one run. Completing the matrix can reveal multiple independent failures, at additional runner cost. It does not authorize deployment or serialize jobs.

</details>

## Sources

- [GitHub Actions: running variations of jobs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations) — Living documentation; publication date not stated; checked 2026-10-08.
