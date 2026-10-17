# A restore key may return yesterday’s dependencies

CI/CD & GitHub Actions · Day27 · 15 minutes

Treat a partial cache hit as a starting point, then reinstall and verify from the lockfile.

## Recall (2 minutes)

<p><a href="../Day17/ci-cd-github-actions.html">Day17: Deployment concurrency: one pending run or a queue?</a></p><p>R1 runs; R2 then R3 wait with default queue and cancel-in-progress:false. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>R2 is canceled; R3 waits. False protects the running job, not the default pending slot.</p></details><p><a href="../Day21/ci-cd-github-actions.html">Day21: Do not run fork code inside a trusted pull_request_target job</a></p><p>What completes the vulnerable pattern after checking out fork code?</p><details><summary>Recall first, then reveal the refresher</summary><p>Executing its build/test/configuration. Execution gives attacker-controlled files the job’s authority.</p></details>

## Understand (4 minutes)

A hotel key that says “Floor 4” may open the hallway, but it does not identify your exact room. A GitHub Actions cache restore key is similar: a broad prefix can return the newest related cache, not the exact dependency set for today’s lockfile.

Cache is an optimization. The lockfile and build remain the source of truth.



The job requests linux-gradle-h2. No exact cache exists, but restore prefix linux-gradle- returns linux-gradle-h1. The job must run Gradle dependency resolution/verification against lockfile h2. After success, it can save an immutable h2 cache.



## Read the visual

The visual separates requested identity, restored bytes, installation, and build truth. That prevents the common mental shortcut “something restored, therefore dependencies are correct.”

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use restore keys when an older dependency cache can safely accelerate installation without deciding correctness.

**Practical example.** A Gradle lockfile changes one library; yesterday’s cache supplies most jars while the build verifies and fetches the changed artifact.

**How to decide.** Put OS/tool/lockfile hash in the exact key. Keep prefixes narrow. On anything except an exact hit, run the normal deterministic install and verification.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
requested='linux-gradle-h2'
available=['linux-gradle-h1']
exact=requested in available
restored='linux-gradle-h1' if not exact else requested
install_required=(restored!=requested)
build_input='lockfile-h2'
```

1. The exact lockfile-hash key is absent.

   Changed values: `{"requested": "linux-gradle-h2", "available": ["linux-gradle-h1"]}`

2. The exact lookup fails.

   Changed values: `{"exact": false}`

3. The broad restore prefix returns the most recent related cache.

   Changed values: `{"restored": "linux-gradle-h1"}`

4. The job reinstalls/verifies because the cache is only a partial starting point.

   Changed values: `{"install_required": true, "build_input": "lockfile-h2"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: This browser does not run Actions or model eviction, cache scopes, branch fallback, quotas, poisoning, compression, platform paths, or package-manager verification. Never cache secrets.

## Explore (remaining exploration time)

Choose which caches exist. Follow exact match, prefix fallback, install, and immutable save as separate states.

Open ci-cd-github-actions.html for the executable model.

Model limits: This browser does not run Actions or model eviction, cache scopes, branch fallback, quotas, poisoning, compression, platform paths, or package-manager verification. Never cache secrets.

## Quiz (4 minutes)

1. A restore prefix returned h1 for requested h2. What next?
   - Run dependency resolution and verification for h2
   - Call it exact
   - Edit the lockfile back

2. What belongs in an exact dependency cache key?
   - OS/tool plus lockfile hash
   - A secret token
   - Only the word cache

3. Why can a cache not be the source of truth?
   - It may be stale, partial, evicted, or poisoned
   - Caches are always empty
   - Lockfiles are optional

4. How narrow should your restore-key prefix be to avoid unsafe cross-project reuse?
5. What verification step would detect a stale or poisoned dependency cache?

<details><summary>Answer key — attempt first</summary>

1. Run dependency resolution and verification for h2. A partial restore accelerates install but does not establish correctness.

2. OS/tool plus lockfile hash. The key should identify the dependency input and relevant platform.

3. It may be stale, partial, evicted, or poisoned. The deterministic build inputs must decide correctness.

</details>

## Sources

- [GitHub Actions dependency caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching) — Living documentation; checked 2026-10-17.
- [GitHub Actions cache dependencies guide](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows) — Living documentation; checked 2026-10-17.
- [actions/cache repository](https://github.com/actions/cache) — Official action repository; checked 2026-10-17.
