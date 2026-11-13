# Artifact retention is a countdown—not durable storage

CI/CD & GitHub Actions · Day52 · 15 minutes

Set GitHub Actions artifact retention deliberately and keep deployment records in a system designed to outlive the run.

## Recall (2 minutes)

<p><a href="../Day35/ci-cd-github-actions.html">Day35: A failed step silently adds success() to the next condition</a></p><p>Tests fail and upload has if: steps.test.outcome == &#x27;failure&#x27; but no status function. Likely result?</p><details><summary>Recall first, then reveal the refresher</summary><p>The default success() can still skip it. A status function is needed to override the implicit success gate.</p></details><p><a href="../Day23/ci-cd-github-actions.html">Day23: Rollback is another deployment—of the last known-good digest</a></p><p>Why not rebuild the old commit during rollback?</p><details><summary>Recall first, then reveal the refresher</summary><p>It can produce different bytes. The verified object is the immutable prior artifact.</p></details>

## Understand (4 minutes)

A hotel luggage room holds your bag until checkout. It is useful handoff storage, not an archive.

A GitHub Actions artifact stores build output, test evidence, or logs for a limited retention period. A workflow can request retention-days, but it cannot exceed the repository, organization, or enterprise limit. When the artifact expires or is deleted, a later deployment cannot download it. Durable release provenance needs a longer-lived registry or record system.



Build sha-52 uploads dist.zip for 5 days. A production promotion waits 8 days. The workflow run is still visible, but the artifact has expired. The safe design publishes the immutable release to a package/container registry and treats the short-lived artifact as CI handoff evidence.



## Read the visual

A retention countdown combines the workflow request and repository cap, then places the promotion day before or after expiration.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use workflow artifacts for bounded handoff between jobs, debugging, test reports, and short review windows.

**Practical example.** Keep a Spark integration-test report for 14 days while publishing the deployable image by digest to ECR.

**How to decide.** Choose retention from the consumer's maximum delay and organizational limit. Use a package, container, evidence, or records system for durable releases and compliance—not an expired workflow artifact.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
requested_days=5; repository_limit_days=30
effective_days=min(requested_days,repository_limit_days)
promotion_age_days=8; artifact_available=promotion_age_days < effective_days
result={'effective_days':effective_days,'promotion_age_days':promotion_age_days,'artifact_available':artifact_available,'durable_target':'registry digest'}
```

1. Declare workflow and repository retention settings.

   Changed values: `{"requested_days": 5, "repository_limit_days": 30}`

2. Apply the higher-level cap.

   Changed values: `{"effective_days": 5}`

3. Evaluate the later consumer against the countdown.

   Changed values: `{"promotion_age_days": 8, "artifact_available": false}`

4. Route long-lived release distribution to a purpose-built store.

   Changed values: `{"result": {"effective_days": 5, "promotion_age_days": 8, "artifact_available": false, "durable_target": "registry digest"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model compares integer days. It does not call GitHub, upload files, calculate billing, model legal holds, validate action versions, protect artifact integrity, enforce repository settings, sign releases, or prove registry durability.

## Explore (remaining exploration time)

Change requested retention, repository limit, and promotion age. Predict whether the artifact still exists and where the durable release should live.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model compares integer days. It does not call GitHub, upload files, calculate billing, model legal holds, validate action versions, protect artifact integrity, enforce repository settings, sign releases, or prove registry durability.

## Quiz (4 minutes)

1. dist.zip has 5-day retention and promotion waits 8 days. What happens?
   - The artifact may be expired and unavailable
   - The workflow automatically extends retention
   - The runner recreates the exact bytes

2. Why publish the release to a registry by digest?
   - It provides an immutable, purpose-built release identity beyond CI handoff
   - It makes all artifacts permanent for free
   - It removes the need for access control

3. What limits retention-days?
   - The repository, organization, or enterprise retention policy
   - Only the YAML parser
   - The number of jobs in the workflow

4. Which deployment depends on a workflow artifact older than its retention window?
5. What immutable registry or evidence store should own the durable copy?

<details><summary>Answer key — attempt first</summary>

1. The artifact may be expired and unavailable. Retention is a countdown; visibility of the run does not preserve the artifact forever.

2. It provides an immutable, purpose-built release identity beyond CI handoff. A registry and digest separate durable release distribution from temporary workflow storage.

3. The repository, organization, or enterprise retention policy. A workflow request cannot exceed the configured higher-level limit.

</details>

## Sources

- [GitHub Docs: Store and share data with workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data) — Official GitHub documentation; checked November 12, 2026; checked 2026-11-12.
- [GitHub Docs: Artifact and log retention settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository) — Official GitHub documentation; checked November 12, 2026; checked 2026-11-12.
- [GitHub Actions artifact REST API](https://docs.github.com/en/rest/actions/artifacts) — Official API reference; checked November 12, 2026; checked 2026-11-12.
