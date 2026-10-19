# A skipped required workflow can wait forever

CI/CD & GitHub Actions · Day29 · 15 minutes

Keep the required check present even when expensive jobs are irrelevant to the changed paths.

## Recall (2 minutes)

<p><a href="../Day18/ci-cd-github-actions.html">Day18: One failed matrix job: cancel siblings or collect evidence?</a></p><p>Next is experimental with continue-on-error true. It fails with fail-fast true. What happens to siblings?</p><details><summary>Recall first, then reveal the refresher</summary><p>They are not canceled by this tolerated failure. The tolerated failure does not trigger fail-fast cancellation. Each job keeps its own policy.</p></details><p><a href="../Day22/ci-cd-github-actions.html">Day22: Build once, promote the same digest</a></p><p>Staging tested digest aaa; production rebuilt digest bbb. What is missing?</p><details><summary>Recall first, then reveal the refresher</summary><p>Evidence for artifact bbb. The staging result applies to aaa, not a new object.</p></details>

## Understand (4 minutes)

A building guard expects a stamped form. If the form office stays closed because your delivery is “documents only,” the guard does not interpret that as approval. The stamp never arrives.

GitHub behaves similarly: if path filtering skips an entire required workflow, its associated check can remain Pending and block the pull request. A skipped job, by contrast, reports Success. Keep a stable required gate job present on every relevant pull request and conditionally skip only the expensive work.



ci is required. A docs-only pull request does not match paths: src/**, so the entire workflow never runs and ci waits. Fix the shape: trigger the workflow for every pull request, detect changed paths inside it, run build only when needed, and have a small final required-gate job report success when work is irrelevant or verify all needed jobs when relevant.



## Read the visual

The visual distinguishes three facts that logs often blur: whether a workflow exists, whether expensive tests run, and whether the required check receives a terminal status.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this pattern when branch rules require a GitHub Actions check but some file changes do not need the expensive test/deploy jobs.

**Practical example.** Documentation-only changes should skip a 20-minute integration suite without leaving the required CI check pending.

**How to decide.** Keep the required check name and workflow trigger stable. Put conditional logic at job/step level, and test docs-only, code-only, mixed, and merge-queue events.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
change='docs'
workflow_path_filter=True
workflow_created=not (change=='docs' and workflow_path_filter)
required_check='SUCCESS' if workflow_created else 'PENDING'
fixed_check='SUCCESS'  # always-triggered gate; expensive job may skip
```

1. A docs-only change does not match the whole-workflow filter.

   Changed values: `{"change": "docs", "workflow_path_filter": true}`

2. The filtered workflow is never created.

   Changed values: `{"workflow_created": false}`

3. No workflow means no successful required check.

   Changed values: `{"required_check": "PENDING"}`

4. A stable gate reports the deliberate no-op outcome.

   Changed values: `{"fixed_check": "SUCCESS"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser models one required check and two change types. Real rulesets match exact check names and apps, path filters have diff limits, merge queues require merge_group, and needs/always() semantics matter. Test the actual repository rules and event payloads.

## Explore (remaining exploration time)

Switch between workflow-level path filtering and an always-triggered gate. The PR check changes from Pending to Success.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser models one required check and two change types. Real rulesets match exact check names and apps, path filters have diff limits, merge queues require merge_group, and needs/always() semantics matter. Test the actual repository rules and event payloads.

## Quiz (4 minutes)

1. Why can a workflow-level path filter block a PR?
   - The required check is never reported and stays Pending
   - Docs always fail tests
   - GitHub deletes the branch

2. What should remain stable?
   - The required gate check name and eligible trigger
   - The runner IP
   - Every log line

3. A merge queue requires this Actions check. Which event also matters?
   - merge_group
   - issues
   - release only

4. Which required checks in your repositories can be skipped by a workflow-level filter today?
5. How will you test the same gate under pull_request and merge_group?

<details><summary>Answer key — attempt first</summary>

1. The required check is never reported and stays Pending. A skipped required workflow does not emit the successful check the rule expects.

2. The required gate check name and eligible trigger. Rulesets need a predictable check producer.

3. merge_group. GitHub documents merge_group as the merge-queue trigger for required checks.

</details>

## Sources

- [GitHub: troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks) — Living documentation checked October 19, 2026; checked 2026-10-19.
- [GitHub Actions workflow syntax: path filters](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions) — Living documentation checked October 19, 2026; checked 2026-10-19.
- [GitHub Actions events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) — Living documentation checked October 19, 2026; checked 2026-10-19.
