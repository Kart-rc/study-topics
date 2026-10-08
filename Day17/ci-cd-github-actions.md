# Deployment concurrency: one pending run or a queue?

CI/CD & GitHub Actions · Day17 · 15 minutes

Choose whether a newer deployment replaces a waiting one or preserves it.

## Recall (2 minutes)

<p><a href="../Day14/ci-cd-github-actions.html">Day14: One pipeline contract: reusable GitHub Actions workflows</a></p><p>Where does a reusable workflow declare its caller contract?</p><details><summary>Recall first, then reveal the refresher</summary><p>Under on.workflow_call inputs and secrets. workflow_call is the trigger and contract surface for inputs and secrets.</p></details><p><a href="../Day16/ci-cd-github-actions.html">Day16: The production secret waits: GitHub deployment environments</a></p><p>Main is allowed but approval is pending. What can the job read?</p><details><summary>Recall first, then reveal the refresher</summary><p>The environment secret is withheld while the job waits. Environment secrets are not available until required protection rules pass.</p></details>

## Understand (4 minutes)

A building has one loading bay. One truck unloads; others wait. Two rules matter: how many trucks can unload together, and what happens to trucks already waiting when another arrives.

A GitHub Actions concurrency group permits one running job or workflow at a time. By default it keeps one pending run. A newer arrival replaces the pending run. cancel-in-progress: false protects the running job, but does not keep every waiting job.

R1 is running. R2 waits. Now R3 arrives.What changes?Default single pending slotqueue: maxRunningR1 → still R1R1 → still R1WaitingR2 → R3R2 → R2, then R3RemovedR2 canceledNo oneThe pending area changes; the running area does not. That is why protecting R1 does not protect R2.queue: max can keep up to 100 pending jobs or runs. Combining it with cancel-in-progress: true is invalid.



R1 is deploying. R2 starts waiting, then R3. By default R2 is canceled and R3 remains. With queue: max, both wait. Current ordering is FIFO by when runs start waiting on the group, not commit or dispatch order.

concurrency:
  group: production-deploy
  cancel-in-progress: false
  queue: max

This YAML fragment is not executed by this page. The Python replay executes queue bookkeeping.



## Read the visual

Two stacked queue diagrams receive the same arrival and completion events. Each separates a single running deployment target, the pending area, a canceled tray, and completed runs. After R2 then R3 arrive, the default lane moves R2 to the canceled tray and retains R3. The max lane retains R2 then R3. Finishing R1 visibly moves R3 into one target and R2 into the other. The distinction is pending-job retention, not a change to the one-running-job limit. Panels compare hypothetical policies; they are not two live deployment groups.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Two workflows modify one deployment target, and overlapping changes would conflict.

**Practical example.** Use the same production group for workflows in one repository sharing a target. Preserve every operation only when each must run; a latest-version deployment might deliberately replace stale pending versions.

**How to decide.** Choose by operation semantics. Required migrations still need sequence checks and queue-overflow monitoring. The group is not a cross-repository lock or a rollback mechanism.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
running = "R1"
single_pending = []
max_pending = []
canceled = []
single_pending.append("R2")
max_pending.append("R2")
canceled.extend(single_pending)
single_pending = ["R3"]
max_pending.append("R3")
next_single = single_pending.pop(0)
next_max = max_pending.pop(0)
```

1. R1 holds the shared deployment target.

   Changed values: `{"running": "R1", "single_pending": [], "max_pending": [], "canceled": []}`

2. R2 waits under both policies.

   Changed values: `{"single_pending": ["R2"], "max_pending": ["R2"]}`

3. R3 replaces R2 only in the single-pending queue.

   Changed values: `{"single_pending": ["R3"], "max_pending": ["R2", "R3"], "canceled": ["R2"]}`

4. When R1 finishes, R3 goes next in one policy; R2 in the other.

   Changed values: `{"single_pending": [], "max_pending": ["R3"], "next_single": "R3", "next_max": "R2"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executed Python bookkeeping, not a GitHub workflow. No external deployment effects.

## Explore (remaining exploration time)

Both lanes receive the same arrival. Click “Next arrival” once: R2 waits. Before the second click, predict which lane will keep R2. Click again and point to where R2 went in each lane. Then finish R1: why do different jobs enter the deployment target?

Open ci-cd-github-actions.html for the executable model.

Model limits: JavaScript models one group with three runs and fixed waiting-arrival order. It makes no GitHub calls and omits runner availability, approvals, the 100-item cap, and deployment side effects. Cancellation cannot undo work already applied.

## Quiz (4 minutes)

1. R1 runs; R2 then R3 wait with default queue and cancel-in-progress:false. What happens?
   - R1 is canceled
   - R2 is canceled; R3 waits
   - All three run

2. Which setting preserves R2 and R3?
   - queue:max and cancel-in-progress:false
   - queue:max and cancel-in-progress:true
   - A unique group per run

3. Does max guarantee commit order?
   - Yes, across repositories
   - Yes, before workflows start
   - No; order uses when runs begin waiting on the group

4. When is keeping only the latest pending deployment appropriate?
5. How would you stop a migration running before its prerequisite?

<details><summary>Answer key — attempt first</summary>

1. R2 is canceled; R3 waits. False protects the running job, not the default pending slot.

2. queue:max and cancel-in-progress:false. True with max is invalid. Unique groups remove mutual exclusion.

3. No; order uses when runs begin waiting on the group. Different preparation times can change waiting order. Sequence checks can still matter.

</details>

## Sources

- [GitHub Docs: control workflow concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency) — Living documentation; queue values and ordering verified; checked 2026-10-07.
- [GitHub Changelog: larger concurrency queues](https://github.blog/changelog/2026-05-07-github-actions-concurrency-groups-now-allow-larger-queues/) — Published 2026-05-07; checked 2026-10-07.
