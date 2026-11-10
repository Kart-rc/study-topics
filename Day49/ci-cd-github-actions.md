# Matrix jobs finish out of order—give each output a unique name

CI/CD & GitHub Actions · Day49 · 15 minutes

Prevent nondeterministic GitHub Actions data loss when matrix jobs publish outputs.

## Recall (2 minutes)

<p><a href="../Day28/ci-cd-github-actions.html">Day28: Write the deployment decision into the run summary</a></p><p>What belongs in a useful job summary?</p><details><summary>Recall first, then reveal the refresher</summary><p>Decision, evidence, and next action. The summary is a concise operational interface.</p></details><p><a href="../Day32/ci-cd-github-actions.html">Day32: Block the newly vulnerable dependency, not the whole history</a></p><p>A PR introduces one high advisory and threshold is high. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>The review job fails. The introduced severity meets the fail threshold.</p></details>

## Understand (4 minutes)

Three runners finish a relay in an unpredictable order. If each writes to the same whiteboard box named digest, the last finisher erases the earlier value.

GitHub does not guarantee matrix job execution order. Matrix job outputs are combined, but duplicate output names overwrite; the last job that runs and sets the name wins. Give every matrix variant a unique output name—or carry many values in artifacts when the payload is not small control data.



Linux, macOS, and Windows each produce a test digest. A shared output named digest might end with whichever job finishes last. Names such as digest_linux, digest_macos, and digest_windows produce a stable map regardless of finish order.



## Read the visual

The same three finish events write either one shared slot or three unique slots, so the nondeterministic overwrite is visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use unique matrix output names when a downstream job must consume one small value from every matrix variant.

**Practical example.** A release gate compares one test-manifest digest from Linux, macOS, and Windows.

**How to decide.** Use named outputs for small control values. Use uniquely named artifacts for files or larger evidence, then aggregate them explicitly in a dependent job.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
finishes=['linux','macos','windows']; values={os:os+'-sha' for os in finishes}
shared={}; [shared.update({'digest':values[os]}) for os in finishes]
unique={}; [unique.update({'digest_'+os:values[os]}) for os in reversed(finishes)]
result={'shared':shared,'unique':unique,'shared_count':len(shared),'unique_count':len(unique)}
```

1. Model one small digest from each successful matrix job.

   Changed values: `{"finishes": ["linux", "macos", "windows"], "values": {"linux": "linux-sha", "macos": "macos-sha", "windows": "windows-sha"}}`

2. Write every value to the same output name in finish order.

   Changed values: `{"shared": {"digest": "windows-sha"}}`

3. Write unique names in a different finish order.

   Changed values: `{"unique": {"digest_windows": "windows-sha", "digest_macos": "macos-sha", "digest_linux": "linux-sha"}}`

4. Compare the one surviving shared value with the stable three-key map.

   Changed values: `{"result": {"shared": {"digest": "windows-sha"}, "unique": {"digest_windows": "windows-sha", "digest_macos": "macos-sha", "digest_linux": "linux-sha"}, "shared_count": 1, "unique_count": 3}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model covers three successful jobs and output-name collision only. It omits skipped/failed jobs, empty values, output size limits, secret redaction, matrix expansion, artifacts, reruns, needs conditions, and real GitHub scheduling.

## Explore (remaining exploration time)

Change finish order and naming strategy. Predict the downstream output map.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model covers three successful jobs and output-name collision only. It omits skipped/failed jobs, empty values, output size limits, secret redaction, matrix expansion, artifacts, reruns, needs conditions, and real GitHub scheduling.

## Quiz (4 minutes)

1. Three matrix jobs set the same output name. Which value survives?
   - The value from the last job that runs and sets it
   - Always the first matrix entry
   - All values as an array

2. Why use unique names?
   - The combined output map keeps one value per variant regardless of finish order
   - It makes jobs execute alphabetically
   - It removes output size limits

3. When should you use artifacts instead?
   - When transporting files or larger evidence rather than small control values
   - When one boolean is needed
   - To guarantee matrix order

4. Which matrix output in your workflows could be silently overwritten today?
5. Would a unique output key or an artifact be the cleaner transport, and why?

<details><summary>Answer key — attempt first</summary>

1. The value from the last job that runs and sets it. Duplicate names overwrite and run order is not guaranteed.

2. The combined output map keeps one value per variant regardless of finish order. Unique keys turn nondeterministic completion into a deterministic map.

3. When transporting files or larger evidence rather than small control values. Job outputs are control messages; artifacts are the file transport.

</details>

## Sources

- [GitHub Actions workflow syntax: matrix job outputs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idoutputs) — Official GitHub documentation; run order is not guaranteed and duplicate names overwrite; checked 2026-11-09.
- [GitHub Actions: passing information between jobs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/pass-job-outputs) — Official GitHub documentation; job outputs flow through needs; checked 2026-11-09.
