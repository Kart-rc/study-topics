# A restore-key finds an older cache—it does not prove the bytes still fit

CI/CD & GitHub Actions · Day53 · 15 minutes

Use partial cache matches as a performance hint while making the package manager verify and repair restored dependencies.

## Recall (2 minutes)

<p><a href="../Day30/ci-cd-github-actions.html">Day30: A called workflow cannot add permissions its caller withheld</a></p><p>A grants packages: read. C asks for packages: write. What is C’s effective maximum?</p><details><summary>Recall first, then reveal the refresher</summary><p>read. Nested reusable workflows cannot elevate permissions above the caller chain.</p></details><p><a href="../Day34/ci-cd-github-actions.html">Day34: A job must match every runner label</a></p><p>A job lists self-hosted, linux, x64, gpu. Which runner is eligible?</p><details><summary>Recall first, then reveal the refresher</summary><p>One matching all four labels. Array labels are combined as an AND filter.</p></details>

## Understand (4 minutes)

A spare key from last year's office may open the supply closet. It does not prove every item inside matches today's inventory list.

GitHub Actions first searches for an exact cache key. If that misses, restore-keys can select a prefix match, typically the most recently created matching cache. That older cache is a starting point. The package manager must compare it with today's lockfile, download missing versions, and save a new exact cache after a successful job.



Commit sha-53 needs key npm-linux-lock53. The exact key misses, but prefix npm-linux- restores npm-linux-lock51. npm ci verifies the new lockfile, replaces stale packages, and the workflow later saves lock53.



## Read the visual

A lookup path separates exact hit, partial prefix restoration, package-manager verification, and creation of the new exact cache.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use restore-key prefixes when dependency sets evolve incrementally and an older download cache can safely accelerate restoration.

**Practical example.** A Java or Node build reuses previously downloaded immutable package archives, then the package manager resolves the current lockfile.

**How to decide.** Include OS, architecture, tool/runtime, and lockfile hash in the exact key. Use a deliberately broader prefix only for content a trusted resolver can verify. Never treat restored build outputs or unverified executables as compatible merely because the cache matched.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
requested='npm-linux-lock53'; caches=['npm-linux-lock49','npm-linux-lock51']
exact=requested if requested in caches else None; prefix='npm-linux-'
restored=exact or sorted([k for k in caches if k.startswith(prefix)])[-1]
result={'exact_hit':restored==requested,'restored':restored,'verify_lock':'lock53','save_after_success':requested}
```

1. Request a new exact key with two older caches available.

   Changed values: `{"requested": "npm-linux-lock53", "caches": ["npm-linux-lock49", "npm-linux-lock51"]}`

2. Observe the exact miss and declare a fallback prefix.

   Changed values: `{"exact": null, "prefix": "npm-linux-"}`

3. Select the newest synthetic prefix match.

   Changed values: `{"restored": "npm-linux-lock51"}`

4. Require current-lock verification before saving the new exact cache.

   Changed values: `{"result": {"exact_hit": false, "restored": "npm-linux-lock51", "verify_lock": "lock53", "save_after_success": "npm-linux-lock53"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model compares key strings and package sets. It does not call GitHub, implement cache version matching, model branch scope, eviction, trust restrictions, archive extraction, supply-chain attacks, action versions, billing, or package-manager integrity checks.

## Explore (remaining exploration time)

Change the current lock hash and prefix. Predict exact hit, partial restore, verification work, and whether a new cache is saved.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model compares key strings and package sets. It does not call GitHub, implement cache version matching, model branch scope, eviction, trust restrictions, archive extraction, supply-chain attacks, action versions, billing, or package-manager integrity checks.

## Quiz (4 minutes)

1. lock53 misses and restore-keys returns lock51. What should happen next?
   - The package manager verifies lock53 and repairs the cache contents
   - Deploy lock51 without checks
   - Rename the old cache key

2. Why include the lockfile hash in the exact key?
   - Dependency changes produce a new exact cache identity
   - It encrypts the cache
   - It grants cloud permissions

3. What is unsafe to restore broadly?
   - Unverified build outputs that are assumed compatible
   - Download archives checked by a trusted resolver
   - Immutable packages verified against the current lockfile

4. Which cache in your pipelines restores a broad prefix without a verifying consumer?
5. Which dimensions—OS, architecture, runtime, tool, and lockfile—belong in its exact key?

<details><summary>Answer key — attempt first</summary>

1. The package manager verifies lock53 and repairs the cache contents. A partial cache is only a seed; today's dependency contract remains the lockfile.

2. Dependency changes produce a new exact cache identity. The exact key should change when the dependency graph changes.

3. Unverified build outputs that are assumed compatible. A prefix match cannot certify executable compatibility or provenance.

</details>

## Sources

- [GitHub Actions dependency caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching) — Official GitHub documentation; checked November 13, 2026; checked 2026-11-13.
- [GitHub Actions dependency caching concepts](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching) — Official GitHub documentation; checked November 13, 2026; checked 2026-11-13.
