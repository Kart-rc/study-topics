# An artifact name identifies one immutable v4 upload—publish a new name for the next stage

CI/CD & GitHub Actions · Day60 · 15 minutes

Pass build outputs across GitHub Actions jobs without pretending a later job can mutate an existing artifact.

## Recall (2 minutes)

<p><a href="../Day39/ci-cd-github-actions.html">Day39: A low-trust workflow may read the cache; do not let it rewrite the cache</a></p><p>A low-trust run uses default cache access. Can it save to default-branch scope?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; effective access is read-only. The secure default permits restore, not save.</p></details><p><a href="../Day11/ci-cd-github-actions.html">Day11: Make the next job wait: GitHub Actions needs</a></p><p>With needs links and test failing, what ultimately happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Package and deploy are skipped. Default dependency conditions require success. Failure propagates as skips down this chain. File order creates no retry loop.</p></details>

## Understand (4 minutes)

A sealed evidence bag can be read later, but adding another item means creating a new sealed bag. Reusing the label does not turn the first bag into a workspace.

GitHub's upload-artifact@v4 treats an uploaded artifact as immutable. A downstream job downloads it, transforms the files, and uploads a new artifact name. Artifacts are handoff snapshots with retention—not a shared mutable directory or durable package registry.



The build job uploads orders-raw. The signing job downloads it and creates orders-signed. Uploading the transformed bytes again as orders-raw is the wrong mental model; the two names preserve provenance between stages.



## Read the visual

Two sealed artifact snapshots retain different names and digests, joined by a download-transform-upload arrow.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use workflow artifacts when later jobs need exact files from an earlier job or a human needs a bounded run output.

**Practical example.** A Java build on Linux publishes a JAR, then a protected signing job downloads and signs the same bytes.

**How to decide.** Use distinct stage names and digests. Use a package registry or object store for durable distribution; use caches only for replaceable acceleration inputs.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
raw={'name':'orders-raw','digest':'abc'}
signed_bytes_digest='def'
signed={'name':'orders-signed','digest':signed_bytes_digest,'input_digest':raw['digest']}
result={'artifacts':[raw['name'],signed['name']],'raw_unchanged':raw['digest']=='abc','lineage':signed['input_digest']+'->'+signed['digest']}
```

1. Record the immutable build snapshot.

   Changed values: `{"raw": {"name": "orders-raw", "digest": "abc"}}`

2. The protected job transforms the downloaded bytes.

   Changed values: `{"signed_bytes_digest": "def"}`

3. Publish a second immutable snapshot with its input relationship.

   Changed values: `{"signed": {"name": "orders-signed", "digest": "def", "input_digest": "abc"}}`

4. Confirm that the first snapshot remains unchanged.

   Changed values: `{"result": {"artifacts": ["orders-raw", "orders-signed"], "raw_unchanged": true, "lineage": "abc->def"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model tracks names and digests only. It omits GitHub service calls, compression, permissions, retention policy, hidden files, attestations, storage quotas, cross-run tokens, and action-version pinning.

## Explore (remaining exploration time)

Switch the signing stage between a new artifact name and attempted overwrite. Predict whether provenance remains clear.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model tracks names and digests only. It omits GitHub service calls, compression, permissions, retention policy, hidden files, attestations, storage quotas, cross-run tokens, and action-version pinning.

## Quiz (4 minutes)

1. How should the signing job publish transformed bytes?
   - Upload a new artifact name such as orders-signed
   - Mutate orders-raw in place
   - Write into the cache and call it release evidence

2. What should connect raw and signed artifacts?
   - Stage names plus verified digests and workflow provenance
   - Only a shared filename
   - Nothing

3. When is an artifact the wrong long-term destination?
   - Consumers need durable versioned distribution beyond run retention
   - The next job needs one file
   - A tester needs a run log

4. Which pipeline output is currently treated like a mutable artifact?
5. Where should durable release distribution live instead?

<details><summary>Answer key — attempt first</summary>

1. Upload a new artifact name such as orders-signed. v4 artifacts are immutable snapshots.

2. Stage names plus verified digests and workflow provenance. Identity and integrity must survive the handoff.

3. Consumers need durable versioned distribution beyond run retention. Use a package registry or durable store for release distribution.

</details>

## Sources

- [GitHub Docs: store and share data with workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data) — Official GitHub documentation; checked November 20, 2026; checked 2026-11-20.
- [actions/upload-artifact v4](https://github.com/actions/upload-artifact) — Official GitHub-maintained action repository; checked November 20, 2026; checked 2026-11-20.
