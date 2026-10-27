# One deployment at a time is not a rollback

CI/CD & GitHub Actions · Day37 · 15 minutes

Use a concurrency group to prevent overlap while keeping cancellation and production recovery as separate designs.

## Recall (2 minutes)

<p><a href="../Day22/ci-cd-github-actions.html">Day22: Build once, promote the same digest</a></p><p>Staging tested digest aaa; production rebuilt digest bbb. What is missing?</p><details><summary>Recall first, then reveal the refresher</summary><p>Evidence for artifact bbb. The staging result applies to aaa, not a new object.</p></details><p><a href="../Day26/ci-cd-github-actions.html">Day26: Give every matrix job its own artifact name</a></p><p>Why is one name unsafe across v4 matrix uploads?</p><details><summary>Recall first, then reveal the refresher</summary><p>Artifacts are immutable and parallel jobs collide. Each job should create its own artifact.</p></details>

## Understand (4 minutes)

A one-lane bridge prevents two trucks from colliding. It does not tow the first truck back if its engine fails halfway across.

A GitHub Actions concurrency group can limit overlapping production jobs. cancel-in-progress can cancel an older run, but cancellation of workflow steps does not guarantee reversal of external effects already applied to Kubernetes, Databricks, or another target.



Run A starts deploying image v2. Run B for v3 arrives. With cancellation enabled, GitHub stops A's remaining steps. If A already changed half the services, production is mixed until an explicit rollback or a safe v3 reconciliation completes.



## Read the visual

The four-stage deployment state separates workflow cancellation from production state. The rollback box stays red when the external-change switch is on, even though Run A is successfully canceled.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use deployment concurrency when two releases to the same environment could race, overwrite state, or produce confusing approval and observability signals.

**Practical example.** Two merges trigger production updates to the same EKS namespace or Databricks job bundle within one minute.

**How to decide.** Give each target environment a stable concurrency key. Queue when every release must run; cancel only when deployment steps are interruption-safe or reconciliatory. Design rollback, health checks, and artifact identity separately.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
run_a_external_change = True
run_b_arrives = True; cancel_in_progress = True
run_a_canceled = run_b_arrives and cancel_in_progress
production_rolled_back = False; state = 'canceled run; external recovery still required'
```

1. Run A has already changed production.

   Changed values: `{"run_a_external_change": true}`

2. A newer deployment enters the same concurrency group.

   Changed values: `{"run_b_arrives": true, "cancel_in_progress": true}`

3. GitHub can stop the older workflow run.

   Changed values: `{"run_a_canceled": true}`

4. Keep workflow state separate from target state.

   Changed values: `{"production_rolled_back": false, "state": "canceled run; external recovery still required"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model shows two runs and one external flag. It does not call GitHub, guarantee queue order, model multiple pending runs, environment protection, reusable workflows, signal handling, cloud deployment semantics, rollback automation, or runner termination timing.

## Explore (remaining exploration time)

Choose queue or cancel, then move Run A past its external side effect. Watch cancellation stop workflow execution without undoing production.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model shows two runs and one external flag. It does not call GitHub, guarantee queue order, model multiple pending runs, environment protection, reusable workflows, signal handling, cloud deployment semantics, rollback automation, or runner termination timing.

## Quiz (4 minutes)

1. Run A is canceled after applying a database migration. What is guaranteed?
   - Only remaining workflow work is canceled; external recovery still needs a design
   - The migration is rolled back
   - Run B sees pristine state

2. Why use a target-specific concurrency key?
   - To serialize jobs that can affect the same environment
   - To encrypt secrets
   - To attest an image

3. When is queueing safer than canceling?
   - When every release must complete or interruption can leave partial effects
   - Whenever tests are fast
   - Only for pull requests

4. Which deployment steps can be interrupted safely, and which require compensation or reconciliation?
5. What concurrency key uniquely identifies each real deployment target in your workflows?

<details><summary>Answer key — attempt first</summary>

1. Only remaining workflow work is canceled; external recovery still needs a design. Workflow cancellation is not transactional rollback.

2. To serialize jobs that can affect the same environment. The group defines which runs conflict.

3. When every release must complete or interruption can leave partial effects. Interruption semantics determine the policy.

</details>

## Sources

- [GitHub Docs: control workflow concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency) — Living documentation; checked October 27, 2026; checked 2026-10-27.
- [GitHub Docs: control deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments) — Living documentation; checked October 27, 2026; checked 2026-10-27.
