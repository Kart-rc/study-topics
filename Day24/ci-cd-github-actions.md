# A merge queue needs tests for the merge group

CI/CD & GitHub Actions · Day24 · 15 minutes

Configure GitHub Actions so required checks run on the exact candidate the merge queue intends to merge.

## Recall (2 minutes)

<p><a href="../Day15/ci-cd-github-actions.html">Day15: A temporary cloud badge: GitHub Actions OIDC to AWS</a></p><p>What does id-token: write allow?</p><details><summary>Recall first, then reveal the refresher</summary><p>The job may request an OIDC token. GitHub states that this permission enables token requests; the cloud trust and role policy still decide access.</p></details><p><a href="../Day19/ci-cd-github-actions.html">Day19: The digest must match: verify build provenance before deployment</a></p><p>The filename matches but digest differs. What should verification do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Block because the attestation names different bytes. The digest binds provenance to exact content; a stable name does not.</p></details>

## Understand (4 minutes)

Two musicians can sound fine alone and clash when they play together. A pull request test checks one musician; a merge-group test checks the temporary combination queued for the branch.

When required checks protect a branch that uses GitHub merge queue, the workflow must listen for merge_group. Otherwise the required status may never be reported for the queued candidate, or the combined changes may go untested.



PR A changes a schema and PR B changes a client. Each passes against main. The merge queue forms one temporary SHA containing both; its contract test fails. Testing only pull_request misses the interaction.



## Read the visual

The first two boxes are individually tested PRs; the third is a new combined SHA. Only the second trigger choice connects the required check to that candidate.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use <code>merge_group</code> when a protected branch requires checks and GitHub merge queue is enabled.

**Practical example.** A busy monorepo queues multiple approved PRs whose generated clients and schemas can interact.

**How to decide.** Run the same required check name on both pull-request and merge-group events; ensure checkout and caches key off the event SHA, and avoid assuming PR-only fields exist.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
events={'pull_request'}
merge_group_sha='mg-A-B'
required_reported='merge_group' in events
events.add('merge_group')
required_reported='merge_group' in events
tested_sha=merge_group_sha if required_reported else None
```

1. Start with a PR-only workflow and a queued combined SHA.

   Changed values: `{"merge_group_sha": "mg-A-B"}`

2. The queued event does not match the workflow.

   Changed values: `{"required_reported": false}`

3. Add the event so the exact merge-group SHA is tested.

   Changed values: `{"required_reported": true, "tested_sha": "mg-A-B"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executed local Python set membership, not GitHub's event engine or a workflow.

## Explore (remaining exploration time)

Switch the workflow trigger set and see whether the required check reaches the merge-group SHA.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser models event matching only. It does not parse YAML, create a queue, run GitHub Actions, verify permissions or reproduce concurrency and cancellation.

## Quiz (4 minutes)

1. Which event makes Actions run for a GitHub merge queue candidate?
   - push only
   - merge_group
   - workflow_dispatch only

2. Why can two green PR checks still produce a red merge group?
   - Combined changes can interact
   - GitHub deletes tests
   - YAML cannot have two events

3. What should checkout test in a merge-group run?
   - A random PR head
   - The event's merge-group SHA
   - Last release tag

4. Which workflow fields in your CI assume a pull_request payload?
5. How will cache keys prevent artifacts from one SHA being mistaken for another?

<details><summary>Answer key — attempt first</summary>

1. merge_group. The merge_group event targets the temporary queued candidate.

2. Combined changes can interact. The candidate contains a composition not tested by either PR alone.

3. The event's merge-group SHA. Required status must describe the exact queued candidate.

</details>

## Sources

- [GitHub Docs: merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue) — Official documentation; checked 2026-10-14.
- [GitHub Docs: merge_group event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#merge_group) — Official documentation; checked 2026-10-14.
