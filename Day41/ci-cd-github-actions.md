# Job outputs are small control messages, not an artifact transport

CI/CD & GitHub Actions · Day41 · 15 minutes

Keep GitHub Actions job outputs bounded and non-secret; move large files through artifacts instead of the needs context.

## Recall (2 minutes)

<p><a href="../Day24/ci-cd-github-actions.html">Day24: A merge queue needs tests for the merge group</a></p><p>Which event makes Actions run for a GitHub merge queue candidate?</p><details><summary>Recall first, then reveal the refresher</summary><p>merge_group. The merge_group event targets the temporary queued candidate.</p></details><p><a href="../Day28/ci-cd-github-actions.html">Day28: Write the deployment decision into the run summary</a></p><p>What belongs in a useful job summary?</p><details><summary>Recall first, then reveal the refresher</summary><p>Decision, evidence, and next action. The summary is a concise operational interface.</p></details>

## Understand (4 minutes)

A baggage tag tells the next worker which suitcase to fetch. It is not the suitcase.

GitHub job outputs pass small strings to dependent jobs through needs. GitHub documents a 1 MB maximum per job and 50 MB total per workflow run, approximated with UTF-16 encoding. Outputs that may contain secrets can be redacted and not sent. Large reports, binaries, and datasets belong in workflow artifacts.



A build job emits image_digest=sha256:… and artifact_name=service-linux as outputs. The 18-MB binary is uploaded as an artifact. The deploy job reads the two identifiers, downloads the artifact, and verifies the digest.



## Read the visual

The diagram measures the payload on the documented UTF-16 scale and routes it to control-message, artifact, or blocked-secret handling.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use job outputs for small routing decisions, IDs, digests, versions, booleans, and artifact names needed by dependent jobs.

**Practical example.** A matrix build returns one image digest per platform while artifacts carry SBOMs and test bundles.

**How to decide.** If downstream logic needs file contents, upload an artifact. If the value is sensitive, use the appropriate secret mechanism and minimize propagation. Treat output size limits as ceilings, not targets.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
image_digest='sha256:abc123'; artifact_name='service-linux'
binary_size_mb=18; output_limit_mb=1
binary_channel='artifact' if binary_size_mb>output_limit_mb else 'job-output'
downstream={'digest':image_digest,'download':artifact_name,'binary_channel':binary_channel}
```

1. Create two small control values.

   Changed values: `{"image_digest": "sha256:abc123", "artifact_name": "service-linux"}`

2. Compare a real file-sized payload with the per-job ceiling.

   Changed values: `{"binary_size_mb": 18, "output_limit_mb": 1}`

3. Move the binary through the file channel.

   Changed values: `{"binary_channel": "artifact"}`

4. The next job receives identifiers, then verifies downloaded content.

   Changed values: `{"downstream": {"digest": "sha256:abc123", "download": "service-linux", "binary_channel": "artifact"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model approximates UTF-16 as two bytes per character and one job. GitHub's real approximation, masking heuristics, matrix-output behavior, artifact retention, permissions, compression, and billing are not executed.

## Explore (remaining exploration time)

Change payload size and secret-likeness. Watch the model select output, artifact, or blocked propagation.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model approximates UTF-16 as two bytes per character and one job. GitHub's real approximation, masking heuristics, matrix-output behavior, artifact retention, permissions, compression, and billing are not executed.

## Quiz (4 minutes)

1. An 18-MB report must reach the next job. Use what?
   - A workflow artifact
   - One job output
   - A secret-looking output

2. Why can a secret-like output disappear?
   - GitHub may redact it on the runner and not send it
   - needs decrypts it later
   - Artifacts require YAML

3. What belongs in a job output?
   - A digest or artifact name
   - A compiled binary
   - A database export

4. Which workflows pass files or large JSON blobs through job outputs today?
5. What minimal digest, ID, or artifact name can replace each large output?

<details><summary>Answer key — attempt first</summary>

1. A workflow artifact. Outputs are for small strings; artifacts carry files.

2. GitHub may redact it on the runner and not send it. Potential secret outputs are skipped rather than propagated.

3. A digest or artifact name. Small control metadata is the intended shape.

</details>

## Sources

- [GitHub Actions workflow syntax: job outputs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idoutputs) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [GitHub Actions: Passing information between jobs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/pass-job-outputs) — Official documentation; checked October 31, 2026; checked 2026-10-31.
- [GitHub Actions: Workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts) — Official documentation; checked October 31, 2026; checked 2026-10-31.
