# Build once, promote the same digest

CI/CD & GitHub Actions · Day22 · 15 minutes

Make production run the exact artifact that passed tests instead of rebuilding something merely similar.

## Recall (2 minutes)

<p><a href="../Day19/ci-cd-github-actions.html">Day19: The digest must match: verify build provenance before deployment</a></p><p>The filename matches but digest differs. What should verification do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Block because the attestation names different bytes. The digest binds provenance to exact content; a stable name does not.</p></details><p><a href="../Day14/ci-cd-github-actions.html">Day14: One pipeline contract: reusable GitHub Actions workflows</a></p><p>Where does a reusable workflow declare its caller contract?</p><details><summary>Recall first, then reveal the refresher</summary><p>Under on.workflow_call inputs and secrets. workflow_call is the trigger and contract surface for inputs and secrets.</p></details>

## Understand (4 minutes)

A sealed meal is inspected, labeled, and sent to the dining room. If the kitchen cooks a new meal after inspection, the approval no longer applies.

CI should build an artifact once, compute its digest, test and attest that object, then promote the same digest through environments.



Build produces image digest sha256:aaa. Staging tests it. A production job that rebuilds from the same commit pulls a changed transitive dependency and produces sha256:bbb. The commit matches; the bytes do not. Production is now running an untested artifact.



## Read the visual

The three large digest boxes make artifact identity visible across environments; rebuild mode changes only the production bytes and turns the evidence path red.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use immutable promotion for containers, packages, Lambda bundles, infrastructure plans, and other deployable outputs that cross environments.

**Practical example.** Build an API image, attest and test its digest, then deploy that digest to staging and production with environment approvals.

**How to decide.** Promote immutable content when environments should differ only in configuration. Rebuild only when the target platform truly requires it, and then test/attest the rebuilt target separately.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
import hashlib
build=b"api-v22|locked-deps"
tested=hashlib.sha256(build).hexdigest()
production=build
deployed=hashlib.sha256(production).hexdigest()
verified=(deployed==tested)
```

1. Represent one built artifact.

   Changed values: `{}`

2. Bind test evidence to its digest.

   Changed values: `{"tested": "9e526027740183fdd922f055b73b8a3c3664ddf179bc25989e0bcdce3de3a245"}`

3. Promote the same bytes and compare identity before deploy.

   Changed values: `{"deployed": "9e526027740183fdd922f055b73b8a3c3664ddf179bc25989e0bcdce3de3a245", "verified": true}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executed local SHA-256 over synthetic bytes. It did not upload an artifact, issue an attestation, or deploy through GitHub Actions.

## Explore (remaining exploration time)

Choose promote or rebuild and change the production digest. See whether the staging evidence still applies.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser compares short labels. Real provenance needs trusted builders, registry immutability, attestation verification, permission boundaries, retention, and environment-specific configuration management.

## Quiz (4 minutes)

1. Staging tested digest aaa; production rebuilt digest bbb. What is missing?
   - A commit hash
   - Evidence for artifact bbb
   - A YAML comment

2. What should an environment approval authorize?
   - A named immutable artifact plus deployment context
   - Any future rebuild
   - A branch name forever

3. When can rebuild be reasonable?
   - Never
   - A target platform requires a distinct build, followed by its own verification
   - Whenever caching is slow

4. Where does your pipeline currently rebuild after tests?
5. Which digest should an approver see before authorizing production?

<details><summary>Answer key — attempt first</summary>

1. Evidence for artifact bbb. The staging result applies to aaa, not a new object.

2. A named immutable artifact plus deployment context. The decision must bind to the object being promoted.

3. A target platform requires a distinct build, followed by its own verification. A necessary new artifact needs new evidence.

</details>

## Sources

- [GitHub Actions: workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts) — Living documentation; checked 2026-10-12.
- [GitHub Actions: manage environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) — Living documentation; checked 2026-10-12.
- [GitHub Actions: artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations) — Living documentation; checked 2026-10-12.
