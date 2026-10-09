# The digest must match: verify build provenance before deployment

CI/CD & GitHub Actions · Day19 · 15 minutes

Block a substituted binary even when its filename and release tag look correct.

## Recall (2 minutes)

<p><a href="../Day17/ci-cd-github-actions.html">Day17: Deployment concurrency: one pending run or a queue?</a></p><p>R1 runs; R2 then R3 wait with default queue and cancel-in-progress:false. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>R2 is canceled; R3 waits. False protects the running job, not the default pending slot.</p></details><p><a href="../Day12/ci-cd-github-actions.html">Day12: Speed aid or handoff record? Cache vs artifact</a></p><p>The dependency cache misses. What should the build do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Download or regenerate dependencies, then continue. GitHub&#x27;s guidance says jobs should be able to recreate cached files when the cache is unavailable.</p></details>

## Understand (4 minutes)

A sealed shipping label says which factory packed a box and identifies the exact contents. If someone swaps the contents, the box name stays the same but its fingerprint changes. A build attestation similarly links an artifact digest to build provenance.

Verification must check the downloaded artifact’s digest, the attestation’s signature and the signer identity or repository policy. Merely finding an attestation with the same filename is not enough.



The trusted build emits service.bin with digest sha256:aaa and an attestation for that digest. A registry tag later points to bytes with digest sha256:bbb. Verification fails before deployment even though the filename and tag still look familiar.

permissions:
  id-token: write
  contents: read
  attestations: write
steps:
  - uses: actions/attest@v4
    with:
      subject-path: dist/service.bin
# consumer gate
$ gh attestation verify dist/service.bin -R acme/service

This snippet follows current GitHub documentation but is not run here. Private/internal availability depends on plan; the lesson source lists current documented conditions.



## Read the visual

A three-stage gate shows digest identity, signer policy and final deployment decision. A stable filename is deliberately held constant.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when binaries or container images cross a trust boundary from build to registry to deployment.

**Practical example.** A deployment job downloads service.bin and verifies its provenance against the expected repository before promoting it.

**How to decide.** Attestation complements dependency review, protected workflows, SBOMs and signing policy. It does not prove the source is safe or the build system uncompromised.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
attested = {"digest": "aaa", "repo": "acme/service"}
downloaded = {"name": "service.bin", "digest": "bbb"}
digest_ok = downloaded["digest"] == attested["digest"]
repo_ok = attested["repo"] == "acme/service"
deploy = digest_ok and repo_ok
```

1. The release name looks right, but bytes were substituted.

   Changed values: `{"attested": {"digest": "aaa", "repo": "acme/service"}, "downloaded": {"name": "service.bin", "digest": "bbb"}}`

2. Evaluate content identity and signer policy separately.

   Changed values: `{"digest_ok": false, "repo_ok": true}`

3. Deployment remains blocked despite the familiar filename.

   Changed values: `{"deploy": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executed Python equality checks. No cryptographic signature or GitHub attestation is verified.

## Explore (remaining exploration time)

Switch the downloaded digest and signer repository. Predict which verification condition fails and whether deployment proceeds.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser compares strings and booleans; it does not sign, query GitHub, validate Sigstore material or run gh. Real verification must validate cryptography, timestamps and signer identity.

## Quiz (4 minutes)

1. The filename matches but digest differs. What should verification do?
   - Pass because the tag is trusted
   - Block because the attestation names different bytes
   - Rename the file

2. Digest matches but signer is outside policy. What is missing?
   - Artifact bytes
   - Trusted builder identity
   - A larger runner

3. What does a valid provenance attestation prove?
   - The software has no vulnerabilities
   - Where/how the attested artifact was built under verified claims
   - Every dependency is licensed

4. Which repository or workflow identities would your deployment policy trust?
5. What supply-chain risk remains after provenance verification passes?

<details><summary>Answer key — attempt first</summary>

1. Block because the attestation names different bytes. The digest binds provenance to exact content; a stable name does not.

2. Trusted builder identity. Content identity alone does not establish who produced it under which workflow.

3. Where/how the attested artifact was built under verified claims. Provenance is valuable evidence about origin, not a blanket quality, vulnerability or licensing guarantee.

</details>

## Sources

- [GitHub Docs: artifact attestations for builds](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations) — Living docs; actions/attest v4 checked 2026-10-09; checked 2026-10-09.
- [GitHub Docs: artifact attestation concept](https://docs.github.com/en/actions/concepts/security/artifact-attestations) — Living docs; checked 2026-10-09; checked 2026-10-09.
