# Make the next job wait: GitHub Actions needs

CI/CD & GitHub Actions · Day11 · 15 minutes

See why writing jobs in order does not make them wait for one another.

## Recall (2 minutes)

<p>No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.</p>

## Understand (4 minutes)

A bakery should inspect a cake before boxing it, then box it before sending it out. Writing those tasks on three lines does not force three workers to wait. The workers need explicit dependencies.

A GitHub Actions workflow is an automation definition. It contains jobs, each with steps that run on a runner. Separate jobs can run independently unless you connect them. needs says which job must succeed first.

Our delivery chain is test, package, deploy. Package needs test; deploy needs package. With the default success conditions, failed or skipped dependencies cause downstream jobs to be skipped. Listing deploy last is not the dependency. The needs links are.

testRun checksFailure stops this path

packageneeds: testOnly after successful checks

deployneeds: packageOnly after successful packaging



The YAML deliberately makes test fail. Package and deploy are skipped. Remove both needs lines and the two echo jobs no longer depend on test; they can run even though test fails. These are harmless demonstration commands, not a release pipeline.

name: Study job dependencies
on: workflow_dispatch
permissions: {}
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: exit 1 # deliberately fail the demonstration
  package:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Would package the tested revision"
  deploy:
    needs: package
    runs-on: ubuntu-latest
    steps:
      - run: echo "Would deploy; this demo changes nothing"


The lab shows job states as you advance the scheduler. Fix the test result and keep dependencies on: all three jobs succeed in sequence. Then remove dependencies and fail test again. Package and deploy can still finish. For production, a job dependency also does not transfer a built artifact; that requires explicit artifact handling, which is a later lesson.

Download the harmless YAML demonstration. It is stored as lesson material, not installed as a repository workflow.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
status = {"test": "pending", "package": "pending", "deploy": "pending"}
status["test"] = "failure"
status["package"] = "success" if status["test"] == "success" else "skipped"
status["deploy"] = "success" if status["package"] == "success" else "skipped"
```

1. Three separate jobs start without a result.

   Changed values: `{"status": {"test": "pending", "package": "pending", "deploy": "pending"}}`

2. The demonstration test exits unsuccessfully.

   Changed values: `{"status": {"test": "failure", "package": "pending", "deploy": "pending"}}`

3. Package requires a successful test, so it is skipped.

   Changed values: `{"status": {"test": "failure", "package": "skipped", "deploy": "pending"}}`

4. Deploy requires successful packaging, so it is skipped too.

   Changed values: `{"status": {"test": "failure", "package": "skipped", "deploy": "skipped"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Python model of the displayed workflow’s completed dependency outcomes. It does not interpret YAML or run GitHub Actions.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Later lessons will cover artifact identity, permissions, trusted events and environment controls. A correct job graph is only one part of a safe delivery process. This example intentionally has no checkout, external action, secret or cloud access.</p>

</details>

## Explore (remaining exploration time)

Before advancing, predict package and deploy when test fails. Compare dependencies on and off. Then pass the tests and replay the chain.

Open ci-cd-github-actions.html for the executable model.

Model limits: A deterministic three-job scheduler with default success conditions. No workflow is submitted to GitHub, no runner is started and no deployment occurs. Real scheduling can overlap jobs and includes cancellation, conditions, matrices and runner availability. Dependencies order jobs; they do not enforce repository merge rules or transfer artifacts.

## Quiz (4 minutes)

1. With needs links and test failing, what ultimately happens?
   - Package and deploy succeed because they appear later
   - Package and deploy are skipped
   - Deploy retries test forever

2. Why add needs rather than just list deploy last?
   - Jobs are independent unless dependencies connect them
   - YAML indentation automatically creates a release lock
   - It transfers the packaged file

3. You add if: always() to deploy. Is the original default-success model still enough?
   - Yes, all jobs must still succeed
   - No; explicit conditions change the rule and need review
   - Yes, always() merely renames the job

4. Explain why the safer choice works in this example.
5. Change one assumption. What would fail, and what evidence would reveal it?

<details><summary>Answer key — attempt first</summary>

1. Package and deploy are skipped. Default dependency conditions require success. Failure propagates as skips down this chain. File order creates no retry loop.

2. Jobs are independent unless dependencies connect them. needs creates the ordering relationship. Position does not, and artifacts are a separate concern.

3. No; explicit conditions change the rule and need review. always() can run a job after failed dependencies. This may suit reporting or cleanup; it should not casually bypass a release safety condition.

</details>

## Sources

- [GitHub Docs: use jobs and prerequisite jobs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-jobs) — Living official documentation; publication date not shown; checked 2026-10-01.
