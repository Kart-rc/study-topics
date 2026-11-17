# A readable action tag can move; the lockfile chooses the commit that runs

CI/CD & GitHub Actions · Day56 · 15 minutes

Keep review-friendly GitHub Actions references while executing the exact reviewed dependency commits.

## Recall (2 minutes)

<p><a href="../Day37/ci-cd-github-actions.html">Day37: One deployment at a time is not a rollback</a></p><p>Run A is canceled after applying a database migration. What is guaranteed?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only remaining workflow work is canceled; external recovery still needs a design. Workflow cancellation is not transactional rollback.</p></details><p><a href="../Day25/ci-cd-github-actions.html">Day25: A rerun keeps the run ID but increments the attempt</a></p><p>What changes when the same workflow run is rerun?</p><details><summary>Recall first, then reveal the refresher</summary><p>GITHUB_RUN_ATTEMPT. Attempt increments; run ID and the rerun SHA/ref stay the same.</p></details>

## Understand (4 minutes)

A restaurant menu can keep the friendly name “house soup,” but the kitchen needs the exact recipe version approved for today.

GitHub Actions workflow dependency lockfiles, generally available on October 28, 2026, let workflow YAML retain readable tag or branch references while the runner executes recorded commits. Onboarded workflows require dependencies in .github/workflows/actions.lock. Dependabot can update the reference and lock entry together. The lockfile reduces unexpected movement; it does not prove the locked code is safe.



The workflow says uses: vendor/scan@v3. Yesterday the lock maps it to commit abc56. The tag later moves to bad99. With a current enforced lock, the run still executes abc56; without it, the tag resolves to the moved code.



## Read the visual

One friendly YAML reference splits into moved-tag and locked-commit resolution paths, making execution identity explicit.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use workflow lockfiles when many actions and transitive dependencies make manual SHA pinning hard to review and maintain.

**Practical example.** An enterprise data-platform repository runs third-party build, scan, and cloud-auth actions before production deployment.

**How to decide.** Review dependencies before locking, enforce lockfiles in stages, verify staleness in CI, let Dependabot update both files, and retain SHA/policy controls where lockfile coverage has exceptions—especially reusable-workflow dependency boundaries.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
yaml_ref='vendor/scan@v3'; tag_now='bad99'
lock={'vendor/scan@v3':'abc56'}
enforced=True; executed=lock[yaml_ref] if enforced else tag_now
result={'yaml_ref':yaml_ref,'tag_now':tag_now,'executed':executed,'safety_proven':False}
```

1. Let the readable tag move after review.

   Changed values: `{"yaml_ref": "vendor/scan@v3", "tag_now": "bad99"}`

2. Record the reviewed commit.

   Changed values: `{"lock": {"vendor/scan@v3": "abc56"}}`

3. Resolve through the enforced lock.

   Changed values: `{"enforced": true, "executed": "abc56"}`

4. Fix identity without claiming the code is safe.

   Changed values: `{"result": {"yaml_ref": "vendor/scan@v3", "tag_now": "bad99", "executed": "abc56", "safety_proven": false}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model resolves one direct action. It does not run GitHub Actions, generate a real lockfile, cover transitive graphs, reusable-workflow exceptions, policy enforcement, Dependabot, repository compromise, immutable releases, attestations, or vulnerability analysis.

## Explore (remaining exploration time)

Move the v3 tag while keeping or removing the lock entry. Predict the executed commit.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model resolves one direct action. It does not run GitHub Actions, generate a real lockfile, cover transitive graphs, reusable-workflow exceptions, policy enforcement, Dependabot, repository compromise, immutable releases, attestations, or vulnerability analysis.

## Quiz (4 minutes)

1. v3 moves after review. What does an enforced current lock do?
   - Runs the recorded commit abc56
   - Runs both commits
   - Proves abc56 is vulnerability-free

2. Why keep readable tags in YAML?
   - Humans see intended version while the lock records execution identity
   - Tags become immutable automatically
   - SHA collisions are impossible

3. What important boundary remains?
   - Lock coverage has exceptions such as reusable-workflow dependencies, and locked code can still be unsafe
   - Lockfiles remove all supply-chain risk
   - Dependabot is no longer useful

4. Which production workflow has the largest unreviewed action dependency graph?
5. Which reusable-workflow or policy exception needs a separate pinning control?

<details><summary>Answer key — attempt first</summary>

1. Runs the recorded commit abc56. Resolution is fixed; safety still requires review.

2. Humans see intended version while the lock records execution identity. Intent and exact resolution live in complementary files.

3. Lock coverage has exceptions such as reusable-workflow dependencies, and locked code can still be unsafe. Locking controls movement, not trustworthiness or every dependency shape.

</details>

## Sources

- [GitHub Actions workflow lockfiles are generally available](https://github.blog/changelog/2026-10-28-github-actions-workflow-lockfiles-are-generally-available/) — Official GitHub changelog; published October 28, 2026; checked November 16, 2026; checked 2026-11-16.
- [GitHub Actions: Workflow dependency lockfiles](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles) — Official GitHub documentation; checked November 16, 2026; checked 2026-11-16.
- [GitHub Actions: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) — Official GitHub documentation; checked November 16, 2026; checked 2026-11-16.
