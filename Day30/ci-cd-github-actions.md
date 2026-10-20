# A called workflow cannot add permissions its caller withheld

CI/CD & GitHub Actions · Day30 · 15 minutes

Design reusable workflow chains so token authority only stays the same or shrinks.

## Recall (2 minutes)

<p><a href="../Day24/ci-cd-github-actions.html">Day24: A merge queue needs tests for the merge group</a></p><p>Which event makes Actions run for a GitHub merge queue candidate?</p><details><summary>Recall first, then reveal the refresher</summary><p>merge_group. The merge_group event targets the temporary queued candidate.</p></details><p><a href="../Day12/ci-cd-github-actions.html">Day12: Speed aid or handoff record? Cache vs artifact</a></p><p>The dependency cache misses. What should the build do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Download or regenerate dependencies, then continue. GitHub&#x27;s guidance says jobs should be able to recreate cached files when the cache is unavailable.</p></details>

## Understand (4 minutes)

A manager can lend a badge with fewer doors, but the recipient cannot draw a new door on it. Reusable GitHub Actions workflows work the same way.

In a chain A → B → C, token permissions can be maintained or reduced, not elevated. If A grants contents: read and no packages: write, B or C cannot create that missing permission by declaring it later.



The application workflow A calls build workflow B, which calls publish workflow C. A grants contents: read only. C requests packages: write. Publication fails because the upstream caller never delegated that authority. The fix is not broad write-all; split build and publish, and grant the publish caller exactly the required scope.



## Read the visual

The badge chain keeps the caller’s ceiling visible. Each hop can retain or remove doors; none can invent a new one.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this model when central reusable workflows call other workflows across repositories and need cloud, package, release, or repository permissions.

**Practical example.** A shared build workflow is read-only, while a separate trusted release workflow publishes an image to GitHub Packages.

**How to decide.** Draw the permission chain from the original caller. Put privileged publishing behind a distinct trusted caller/environment, and grant only the exact scopes needed. Treat secrets and token permissions as separate concerns.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rank={'none':0,'read':1,'write':2}
caller='read'
build_request='read'
build=min(rank[caller],rank[build_request])
publish=min(build,rank['write'])
```

1. Order the toy permission levels.

   Changed values: `{"rank": {"none": 0, "read": 1, "write": 2}}`

2. The caller delegates only read authority.

   Changed values: `{"caller": "read", "build_request": "read"}`

3. The build receives at most what the caller granted.

   Changed values: `{"build": 1}`

4. The publisher asks for write but remains capped at read.

   Changed values: `{"publish": 1}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: This browser models two scopes and three workflows. Real GitHub rules also depend on repository settings, event, fork, actor, secret inheritance, environment protection, OIDC, organization policy, and the exact called-workflow syntax.

## Explore (remaining exploration time)

Change the caller’s package permission. Watch the effective scope shrink through A → B → C even when C asks for write.

Open ci-cd-github-actions.html for the executable model.

Model limits: This browser models two scopes and three workflows. Real GitHub rules also depend on repository settings, event, fork, actor, secret inheritance, environment protection, OIDC, organization policy, and the exact called-workflow syntax.

## Quiz (4 minutes)

1. A grants packages: read. C asks for packages: write. What is C’s effective maximum?
   - read
   - write
   - admin

2. Why split build and publish callers?
   - The common build stays read-only while a trusted release path gets narrow write authority
   - To hide logs
   - To make every workflow write-all

3. Do inherited secrets automatically grant token permissions?
   - No; secrets and GITHUB_TOKEN permissions are separate
   - Yes, always
   - Only on weekends

4. Which reusable workflow chain currently relies on an implicit permission you have not traced from the caller?
5. Where should a privileged publish workflow be separated from untrusted build execution?

<details><summary>Answer key — attempt first</summary>

1. read. Nested reusable workflows cannot elevate permissions above the caller chain.

2. The common build stays read-only while a trusted release path gets narrow write authority. Separation keeps routine code away from publishing authority.

3. No; secrets and GITHUB_TOKEN permissions are separate. Passing a secret does not manufacture a missing GITHUB_TOKEN scope.

</details>

## Sources

- [GitHub: Reuse workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows) — Living documentation checked October 20, 2026; checked 2026-10-20.
- [GitHub: Reusing workflow configurations](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations) — Living documentation checked October 20, 2026; checked 2026-10-20.
- [GitHub workflow syntax permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions) — Living documentation checked October 20, 2026; checked 2026-10-20.
