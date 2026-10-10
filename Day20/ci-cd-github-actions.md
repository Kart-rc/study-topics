# A tag can move; a full commit SHA cannot

CI/CD & GitHub Actions · Day20 · 15 minutes

Pin third-party actions to reviewed immutable code and update explicitly.

## Recall (2 minutes)

<p><a href="../Day16/ci-cd-github-actions.html">Day16: The production secret waits: GitHub deployment environments</a></p><p>Main is allowed but approval is pending. What can the job read?</p><details><summary>Recall first, then reveal the refresher</summary><p>The environment secret is withheld while the job waits. Environment secrets are not available until required protection rules pass.</p></details><p><a href="../Day18/ci-cd-github-actions.html">Day18: One failed matrix job: cancel siblings or collect evidence?</a></p><p>Next is experimental with continue-on-error true. It fails with fail-fast true. What happens to siblings?</p><details><summary>Recall first, then reveal the refresher</summary><p>They are not canceled by this tolerated failure. The tolerated failure does not trigger fail-fast cancellation. Each job keeps its own policy.</p></details>

## Understand (4 minutes)

A street address can keep its name while the building changes. A Git tag such as v1 is also movable. A full commit SHA identifies one exact Git object.

GitHub documents full-length SHA pinning as the only immutable action reference. It prevents silent ref movement but does not deliver fixes automatically.



Monday: vendor/action@v1 points to reviewed aaa…. Tuesday: the tag moves to bbb…. Unchanged workflow text runs different code. @aaa… stays on reviewed bytes until a pull request changes it.

- uses: vendor/action@a824008085750b8e136effc585c3cd6082bd575f



## Read the visual

Two references resolve after a tag move: the tag follows new code while the SHA stays attached to reviewed code.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use for third-party actions with write access, secrets, OIDC, artifacts, or deployment authority.

**Practical example.** Pin a cloud-login action and use controlled dependency updates for new SHAs.

**How to decide.** Pinning stops ref drift. It does not prove code safe or patch dependencies automatically.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
tag="aaa"
pinned="aaa"
tag="bbb"
tag_run=tag
pinned_run=pinned
```

1. Both initially select reviewed code.

   Changed values: `{"tag": "aaa", "pinned": "aaa"}`

2. Movable tag changes.

   Changed values: `{"tag": "bbb"}`

3. Resolve both after the move.

   Changed values: `{"tag_run": "bbb", "pinned_run": "aaa"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executed a Python name model; it did not access GitHub.

## Explore (remaining exploration time)

Move the tag and compare it with a full SHA.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser maps toy labels; it does not inspect Git objects, signatures, or action code.

## Quiz (4 minutes)

1. v1 moves aaa→bbb. @v1 does what?
   - Still aaa
   - Can run bbb without workflow diff
   - Rejects tags

2. Full SHA provides?
   - Immutable identity
   - Auto patches
   - Proof of safety

3. Tradeoff?
   - Explicit reviewed updates
   - Cannot run
   - Secrets public

4. Which deployment actions have highest authority?
5. How will SHA updates be received and tested?

<details><summary>Answer key — attempt first</summary>

1. Can run bbb without workflow diff. Ref resolves at run time.

2. Immutable identity. It fixes the Git object only.

3. Explicit reviewed updates. Patch uptake becomes an explicit path.

</details>

## Sources

- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use) — Living docs; checked 2026-10-10; checked 2026-10-10.
- [GitHub managing custom actions](https://docs.github.com/en/actions/how-tos/create-and-publish-actions/manage-custom-actions) — Living docs; checked 2026-10-10; checked 2026-10-10.
