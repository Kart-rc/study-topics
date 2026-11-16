# Cancel the old deployment only when every completed step is safe to leave behind

CI/CD & GitHub Actions · Day55 · 15 minutes

Use GitHub Actions concurrency without mistaking workflow cancellation for transactional rollback.

## Recall (2 minutes)

<p><a href="../Day31/ci-cd-github-actions.html">Day31: Attest the digest, not the tag</a></p><p>Why attest a digest rather than a tag?</p><details><summary>Recall first, then reveal the refresher</summary><p>A digest identifies the artifact bytes. A mutable name can be reused; a content digest changes with the bytes.</p></details><p><a href="../Day35/ci-cd-github-actions.html">Day35: A failed step silently adds success() to the next condition</a></p><p>Tests fail and upload has if: steps.test.outcome == &#x27;failure&#x27; but no status function. Likely result?</p><details><summary>Recall first, then reveal the refresher</summary><p>The default success() can still skip it. A status function is needed to override the implicit success gate.</p></details>

## Understand (4 minutes)

Stopping a painter halfway does not restore the wall. The first coat is still there.

GitHub Actions concurrency groups limit running and pending jobs. cancel-in-progress: true asks GitHub to cancel the older member when a newer one enters the same group. That controls workflow execution; it does not reverse cloud, database, or Kubernetes changes already made. Production steps must be interrupt-safe, resumable, or explicitly compensated.



Run deploy-54 creates schema version 55, then waits before switching traffic. Run deploy-55 arrives and cancels it. The schema remains at 55. If the new run assumes a clean pre-deploy state, cancellation created a mixed release.



## Read the visual

A durable schema step remains below a canceled run, separating execution control from external rollback.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a deployment concurrency group when overlapping releases to the same environment would conflict.

**Practical example.** A GitHub Actions workflow serializes production deployments for one EKS namespace and shared database.

**How to decide.** Queue production releases when ordering matters. Cancel older CI builds freely when they have no durable effects; cancel deployments only after proving every completed step is idempotent, forward-compatible, or compensated.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
schema=54; traffic='v54'; run='deploy-54'
schema=55
cancel_in_progress=True; cancelled=cancel_in_progress
result={'cancelled':cancelled,'schema':schema,'traffic':traffic,'rolled_back_by_github':False}
```

1. Start from one aligned production release.

   Changed values: `{"schema": 54, "traffic": "v54", "run": "deploy-54"}`

2. The first run applies a durable schema step.

   Changed values: `{"schema": 55}`

3. A newer run cancels workflow execution before traffic switches.

   Changed values: `{"cancel_in_progress": true, "cancelled": true}`

4. Inspect the persistent mixed state.

   Changed values: `{"result": {"cancelled": true, "schema": 55, "traffic": "v54", "rolled_back_by_github": false}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model tracks one schema integer and two runs. It does not call GitHub Actions, deliver real cancellation signals, model queue ordering, environment rules, Kubernetes rollout, SQL transactions, cloud APIs, signal handlers, compensation, or race timing.

## Explore (remaining exploration time)

Choose queue or cancel for two production runs. Predict which durable schema state survives when the first run stops after step one.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model tracks one schema integer and two runs. It does not call GitHub Actions, deliver real cancellation signals, model queue ordering, environment rules, Kubernetes rollout, SQL transactions, cloud APIs, signal handlers, compensation, or race timing.

## Quiz (4 minutes)

1. deploy-54 changes the schema and is then canceled. What happens automatically?
   - The schema change remains unless the deployment mechanism reverses it
   - GitHub rolls the database back
   - The concurrency group deletes the environment

2. When is cancel-in-progress safe for a deployment?
   - When every completed effect is safe to leave, retry, or compensate
   - Whenever a newer commit exists
   - Whenever the job has an environment name

3. When should production runs queue instead?
   - When order matters or partial effects are not safely interruptible
   - Whenever CI is slow
   - Only for pull requests

4. Which deployment step in your pipeline leaves a durable partial state if cancellation arrives immediately afterward?
5. Would queueing, idempotent resume, or explicit compensation be the simplest control for that step?

<details><summary>Answer key — attempt first</summary>

1. The schema change remains unless the deployment mechanism reverses it. Workflow cancellation is not a transaction over external systems.

2. When every completed effect is safe to leave, retry, or compensate. Interrupt safety is a property of deployment effects, not the YAML keyword.

3. When order matters or partial effects are not safely interruptible. Serialization avoids an unsafe overlap but still requires idempotent retries and verification.

</details>

## Sources

- [GitHub Actions: Control workflow concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency) — Official GitHub documentation; checked November 15, 2026; checked 2026-11-15.
- [GitHub Actions: Control deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments) — Official GitHub documentation; checked November 15, 2026; checked 2026-11-15.
