# Speed aid or handoff record? Cache vs artifact

CI/CD & GitHub Actions · Day12 · 15 minutes

Use a cache to make rebuilding faster and an artifact to carry the exact output a later job must consume.

## Recall (2 minutes)

<p><a href="../Day11/ci-cd-github-actions.html">Day11: Make the next job wait: GitHub Actions needs</a></p><p>With needs links and test failing, what ultimately happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Package and deploy are skipped. Default dependency conditions require success. Failure propagates as skips down this chain. File order creates no retry loop.</p></details>

## Understand (4 minutes)

A kitchen keeps common flour in a pantry and puts today’s finished cake in a labeled delivery box. Missing pantry flour is inconvenient—you can buy more. Missing the labeled cake means delivery cannot continue.

A CI cache is the pantry. It reuses dependencies or expensive intermediate files across runs to save time. A job must still work after a cache miss by downloading or regenerating them.

An artifact is the delivery box. It stores files produced by a job, such as a tested binary, report, or log. Another job can download that exact output.

Cachenpm packagesKeyed by lockfileMiss → download again

Build jobTests commit abc123Produces app.zip

Artifactapp.zip from this runDeploy downloads it



Run 1 has no dependency cache, so dependencies download. The build creates app-abc123.zip and uploads it as an artifact. Deploy downloads that artifact.

Run 2 with the same lockfile may hit the cache and install faster, but it still builds a new artifact for the new commit. If the cache is absent, rebuild. If the required artifact is absent, stop deployment rather than rebuilding a possibly different output.

- uses: actions/cache@v4
  with:
    key: deps-${{ hashFiles('**/lockfile') }}
- uses: actions/upload-artifact@v4
  with:
    name: tested-app
    path: app.zip

Restored caches are untrusted input. Never put secrets in them; use precise keys and low-trust workflow restrictions.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
cache = set()
lock_key = "lock-v1"
artifact = None
cache_hit = lock_key in cache
if not cache_hit:
    cache.add(lock_key)
dependencies = "ready"
artifact = "app-abc123.zip"
deploy_input = artifact
deploy_ok = deploy_input is not None
```

1. Start a run without a cache or artifact.

   Changed values: `{"lock_key": "lock-v1", "artifact": null}`

2. A cache miss triggers a download, then dependencies become ready.

   Changed values: `{"cache_hit": false, "dependencies": "ready"}`

3. The build creates the exact output for this synthetic commit.

   Changed values: `{"artifact": "app-abc123.zip"}`

4. Deploy consumes the run artifact. It does not depend on the cache as the release handoff.

   Changed values: `{"deploy_input": "app-abc123.zip", "deploy_ok": true}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executes Python sets and strings. It does not call GitHub Actions, store files, or deploy anything.

## Explore (remaining exploration time)

Change the lockfile key, toggle artifact upload, and run build then deploy. Predict which missing object slows the pipeline and which blocks the handoff.

Open ci-cd-github-actions.html for the executable model.

Model limits: A local state machine, not a GitHub Actions run. It omits cache scopes, restore keys, retention, quotas, immutable artifact details, attestations, permissions, fork policies, and action-version pinning. No workflow is installed.

## Quiz (4 minutes)

1. The dependency cache misses. What should the build do?
   - Fail forever
   - Download or regenerate dependencies, then continue
   - Deploy an old binary

2. Which object should carry the tested app.zip to deploy?
   - A workflow artifact
   - A secret
   - Only a dependency cache

3. Why treat a restored cache as untrusted?
   - Caches can never contain files
   - A readable or poisoned cache can influence later execution
   - Artifacts automatically encrypt every dependency

4. Explain why a cache miss should cost time while a required artifact miss should stop deployment.
5. What would you include in a cache key for a Java or Node build, and why?

<details><summary>Answer key — attempt first</summary>

1. Download or regenerate dependencies, then continue. GitHub's guidance says jobs should be able to recreate cached files when the cache is unavailable.

2. A workflow artifact. Artifacts persist files produced by a job and pass them between jobs. They identify the run output being handed off.

3. A readable or poisoned cache can influence later execution. GitHub warns that cache contents may be read or poisoned across relevant scopes and low-trust triggers. Do not store secrets; validate what executes.

</details>

## Sources

- [GitHub Docs: Workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts) — Living official documentation; checked 2026-10-02.
- [GitHub Docs: Dependency caching](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching) — Living official documentation; includes cache security guidance; checked 2026-10-02.
