# A rerun keeps the run ID but increments the attempt

CI/CD & GitHub Actions · Day25 · 15 minutes

Name logs and deployment evidence with both GitHub Actions run identity and attempt identity.

## Recall (2 minutes)

<p><a href="../Day21/ci-cd-github-actions.html">Day21: Do not run fork code inside a trusted pull_request_target job</a></p><p>What completes the vulnerable pattern after checking out fork code?</p><details><summary>Recall first, then reveal the refresher</summary><p>Executing its build/test/configuration. Execution gives attacker-controlled files the job’s authority.</p></details><p><a href="../Day16/ci-cd-github-actions.html">Day16: The production secret waits: GitHub deployment environments</a></p><p>Main is allowed but approval is pending. What can the job read?</p><details><summary>Recall first, then reveal the refresher</summary><p>The environment secret is withheld while the job waits. Environment secrets are not available until required protection rules pass.</p></details>

## Understand (4 minutes)

A support ticket keeps the same ticket number when reopened, but the reopen count changes. GitHub Actions reruns follow that shape: GITHUB_RUN_ID stays the same, while GITHUB_RUN_ATTEMPT starts at 1 and increments.

If an external dashboard keys only by run ID, a rerun can overwrite the first failure and erase useful evidence.



Run 815 fails on attempt 1, then passes on attempt 2. Store evidence as 815/1 and 815/2. The commit SHA stays the same for the rerun, so the comparison isolates environment or nondeterminism rather than a code change.



## Read the visual

Run ID is the outer box; attempts are immutable observations inside it. The unsafe key points both attempts at one location, while the compound key preserves the sequence.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use attempt-aware keys whenever workflow reruns publish logs, test reports, metrics or deployment evidence outside GitHub.

**Practical example.** A flaky integration job fails, is rerun, and passes without a new commit.

**How to decide.** Keep run ID for the logical workflow execution and append attempt for immutable observations. Do not treat a passing rerun as proof that the first failure was harmless.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
run_id=815
attempt=1
keys=[]
keys.append(f'{run_id}/{attempt}')
attempt+=1
keys.append(f'{run_id}/{attempt}')
preserved=(keys==['815/1','815/2'])
```

1. Start the logical run at attempt 1.

   Changed values: `{"run_id": 815, "attempt": 1, "keys": []}`

2. Persist the first observation with both identifiers.

   Changed values: `{"keys": ["815/1"]}`

3. A rerun keeps run ID and increments attempt.

   Changed values: `{"attempt": 2, "keys": ["815/1", "815/2"]}`

4. Both failed and passing attempts remain addressable.

   Changed values: `{"preserved": true}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser does not run GitHub Actions. Retention, artifact naming conflicts, APIs and permissions differ by workflow. A unique attempt key preserves evidence but does not diagnose why attempts disagree.

## Explore (remaining exploration time)

Select an attempt and compare the unsafe run-only key with the safe run/attempt key.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser does not run GitHub Actions. Retention, artifact naming conflicts, APIs and permissions differ by workflow. A unique attempt key preserves evidence but does not diagnose why attempts disagree.

## Quiz (4 minutes)

1. What changes when the same workflow run is rerun?
   - GITHUB_RUN_ID
   - GITHUB_RUN_ATTEMPT
   - The triggering SHA

2. Best external evidence key?
   - run_id only
   - run_id/run_attempt
   - branch name

3. A rerun passes. What can you conclude?
   - The first failure never happened
   - The same commit passed on a later attempt; investigate the disagreement
   - The commit SHA changed

4. Which observability backend keys currently collapse reruns in your pipelines?
5. What policy should a deployment gate apply when attempt 1 fails and attempt 2 passes?

<details><summary>Answer key — attempt first</summary>

1. GITHUB_RUN_ATTEMPT. Attempt increments; run ID and the rerun SHA/ref stay the same.

2. run_id/run_attempt. It preserves each attempt under the same logical run.

3. The same commit passed on a later attempt; investigate the disagreement. A later pass does not erase earlier evidence or explain nondeterminism.

</details>

## Sources

- [GitHub Actions variables reference](https://docs.github.com/en/actions/reference/workflows-and-actions/variables) — Living documentation; checked 2026-10-15.
- [Re-running workflows and jobs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs) — Living documentation; checked 2026-10-15.
