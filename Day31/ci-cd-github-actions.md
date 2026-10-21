# Attest the digest, not the tag

CI/CD & GitHub Actions · Day31 · 15 minutes

Bind build provenance to immutable artifact bytes and verify before promotion.

## Recall (2 minutes)

<p><a href="../Day19/ci-cd-github-actions.html">Day19: The digest must match: verify build provenance before deployment</a></p><p>The filename matches but digest differs. What should verification do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Block because the attestation names different bytes. The digest binds provenance to exact content; a stable name does not.</p></details><p><a href="../Day23/ci-cd-github-actions.html">Day23: Rollback is another deployment—of the last known-good digest</a></p><p>Why not rebuild the old commit during rollback?</p><details><summary>Recall first, then reveal the refresher</summary><p>It can produce different bytes. The verified object is the immutable prior artifact.</p></details>

## Understand (4 minutes)

A luggage tag saying “release-latest” can be moved to another suitcase. A fingerprint of the suitcase contents cannot. Container tags and filenames are convenient names; a SHA-256 digest identifies the actual bytes.

GitHub artifact attestations establish where and how an artifact was built. The workflow grants the attestation action the needed permissions and signs provenance for a subject digest. Verification checks the downloaded bytes against that evidence.



A workflow builds service.tar.gz, computes SHA-256 abc…, and attests that digest. Someone later replaces the file but keeps the name. The new digest is def…. Verification fails because the attestation is about abc…, not the reusable filename.



## Read the visual

The chain ties three concrete objects together: built bytes, the attested subject digest, and the bytes presented for promotion. The failure is visible exactly where the digest diverges.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use artifact attestations when binaries or images cross trust boundaries, enter release environments, or need auditable build provenance.

**Practical example.** A reusable release workflow builds a Kafka connector image, attests its digest, and a deployment gate verifies provenance before production promotion.

**How to decide.** Attest after the final artifact bytes are produced and verify the exact promoted subject. Keep least-privilege permissions, protected builders, dependency controls, and environment approvals; an attestation does not prove the code is safe.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
import hashlib
original = b'release-v1'
attested_digest = hashlib.sha256(original).hexdigest()
promoted = b'release-v2'
verified = hashlib.sha256(promoted).hexdigest() == attested_digest
```

1. Create synthetic artifact bytes.

   Changed values: `{}`

2. Bind provenance to the SHA-256 digest.

   Changed values: `{"attested_digest": "1976556c304df3c0f2c4ddd63643e572f97ae73ecdf178fce5e0d4d3eb84e565"}`

3. Simulate a same-name artifact whose bytes changed.

   Changed values: `{}`

4. Verification rejects the substituted bytes.

   Changed values: `{"verified": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser compares short synthetic digests. The Python replay computes real SHA-256 values for two byte strings, but it does not invoke GitHub Actions, actions/attest, OIDC, Sigstore, gh attestation verify, or a policy engine.

## Explore (remaining exploration time)

Change one artifact byte. Watch the digest change and the provenance check reject the substituted subject.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser compares short synthetic digests. The Python replay computes real SHA-256 values for two byte strings, but it does not invoke GitHub Actions, actions/attest, OIDC, Sigstore, gh attestation verify, or a policy engine.

## Quiz (4 minutes)

1. Why attest a digest rather than a tag?
   - A digest identifies the artifact bytes
   - Tags cannot be displayed
   - Digests grant deployment permission

2. Which permission is needed for GitHub OIDC token issuance?
   - id-token: write
   - issues: write
   - pages: write

3. What does a valid provenance attestation not prove?
   - That the source and dependencies are free of vulnerabilities
   - Which artifact digest was attested
   - Which workflow created the evidence

4. Where in your pipeline can artifact bytes still change after attestation?
5. What verification policy should a deployment gate enforce in addition to digest provenance?

<details><summary>Answer key — attempt first</summary>

1. A digest identifies the artifact bytes. A mutable name can be reused; a content digest changes with the bytes.

2. id-token: write. The official workflow requires id-token: write along with attestation permissions.

3. That the source and dependencies are free of vulnerabilities. Provenance answers origin and process questions, not complete software safety.

</details>

## Sources

- [GitHub artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations) — Living documentation; checked 2026-10-21.
- [GitHub artifact attestation concepts](https://docs.github.com/en/actions/concepts/security/artifact-attestations) — Living documentation; checked 2026-10-21.
