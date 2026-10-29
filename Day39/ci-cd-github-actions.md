# A low-trust workflow may read the cache; do not let it rewrite the cache

CI/CD & GitHub Actions · Day39 · 15 minutes

Use GitHub Actions cache-mode so untrusted events cannot poison cache contents later restored by privileged jobs.

## Recall (2 minutes)

<p><a href="../Day23/ci-cd-github-actions.html">Day23: Rollback is another deployment—of the last known-good digest</a></p><p>Why not rebuild the old commit during rollback?</p><details><summary>Recall first, then reveal the refresher</summary><p>It can produce different bytes. The verified object is the immutable prior artifact.</p></details><p><a href="../Day27/ci-cd-github-actions.html">Day27: A restore key may return yesterday’s dependencies</a></p><p>A restore prefix returned h1 for requested h2. What next?</p><details><summary>Recall first, then reveal the refresher</summary><p>Run dependency resolution and verification for h2. A partial restore accelerates install but does not establish correctness.</p></details>

## Understand (4 minutes)

A visitor may borrow a shared toolbox. That does not mean the visitor should replace the tools before the owner uses it.

GitHub caches are restored as-is and are not signed. Low-trust triggers that resolve to the default branch receive read-only cache access by default. Explicit cache-mode: write overrides that protection and can let untrusted code plant files that a later privileged workflow executes.



A pull_request_target job restores the default branch's dependency cache. With effective mode read, a save is skipped and the job continues. If the workflow forces write after checking out fork code, the fork can replace cached build tooling for the next trusted deployment.



## Read the visual

The trust-to-capability path shows exactly when restore and save are granted. Selecting write on a low-trust event turns the save node red and exposes the poisoning path.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Set cache access explicitly when workflows run from fork-controlled or otherwise low-trust events, especially reusable workflows and jobs that later handle secrets.

**Practical example.** A fork PR runs tests using a default-branch Maven cache while only a push-to-main workflow refreshes that cache.

**How to decide.** Prefer read-only restore for low-trust jobs and trusted push jobs for writes. Never put secrets in caches. If correctness depends on the cache, the build is already broken—cache miss must remain safe.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
trigger = 'low-trust'; declared_mode = None
effective_mode = 'read' if trigger == 'low-trust' and declared_mode is None else declared_mode
restore_allowed = effective_mode in {'read', 'write'}; save_allowed = effective_mode in {'write', 'write-only'}
poisoning_path = trigger == 'low-trust' and save_allowed
```

1. Start with an untrusted event and no override.

   Changed values: `{"trigger": "low-trust", "declared_mode": null}`

2. GitHub's secure default is read-only for the simplified case.

   Changed values: `{"effective_mode": "read"}`

3. Read mode restores but cannot save.

   Changed values: `{"restore_allowed": true, "save_allowed": false}`

4. No untrusted write path exists unless configuration expands access.

   Changed values: `{"poisoning_path": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model simplifies GitHub's event classification and cache scopes. It does not run Actions, inspect a repository, prove an action is safe, model merge-ref scope, reusable-workflow ceilings, cache eviction, signed artifacts, secrets, or every trigger.

## Explore (remaining exploration time)

Switch event trust and explicit mode. Watch restore/save permissions and the cache-poisoning path.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model simplifies GitHub's event classification and cache scopes. It does not run Actions, inspect a repository, prove an action is safe, model merge-ref scope, reusable-workflow ceilings, cache eviction, signed artifacts, secrets, or every trigger.

## Quiz (4 minutes)

1. A low-trust run uses default cache access. Can it save to default-branch scope?
   - No; effective access is read-only
   - Yes; every cache hit is writable
   - Only if the key has a hash

2. Why is explicit write mode dangerous on low-trust triggers?
   - It can reintroduce cache poisoning for later privileged runs
   - It disables all caches
   - It signs attacker files

3. What must happen on a cache miss?
   - The build reconstructs dependencies safely and correctly
   - Deployment skips tests
   - The job obtains secrets from the cache

4. Which workflows can write caches that deployment jobs later restore?
5. Can every cached path be safely treated as attacker-controlled input?

<details><summary>Answer key — attempt first</summary>

1. No; effective access is read-only. The secure default permits restore, not save.

2. It can reintroduce cache poisoning for later privileged runs. A later workflow may execute restored attacker-controlled files.

3. The build reconstructs dependencies safely and correctly. A cache is an optimization, never the correctness source.

</details>

## Sources

- [GitHub Actions dependency caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching) — Official documentation; checked October 29, 2026; checked 2026-10-29.
- [GitHub Actions workflow syntax: cache-mode](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#cache-mode) — Official documentation; checked October 29, 2026; checked 2026-10-29.
