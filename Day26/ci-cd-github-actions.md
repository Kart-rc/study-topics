# Give every matrix job its own artifact name

CI/CD & GitHub Actions · Day26 · 15 minutes

Prevent immutable artifact-name collisions when parallel jobs upload results.

## Recall (2 minutes)

<p><a href="../Day20/ci-cd-github-actions.html">Day20: A tag can move; a full commit SHA cannot</a></p><p>v1 moves aaa→bbb. @v1 does what?</p><details><summary>Recall first, then reveal the refresher</summary><p>Can run bbb without workflow diff. Ref resolves at run time.</p></details><p><a href="../Day22/ci-cd-github-actions.html">Day22: Build once, promote the same digest</a></p><p>Staging tested digest aaa; production rebuilt digest bbb. What is missing?</p><details><summary>Recall first, then reveal the refresher</summary><p>Evidence for artifact bbb. The staging result applies to aaa, not a new object.</p></details>

## Understand (4 minutes)

Four travelers cannot check four suitcases under one claim ticket and expect to retrieve the right bag. A matrix workflow has the same problem. Each job must upload to a unique artifact name.

With upload-artifact@v4, artifacts are immutable. Uploading multiple jobs to the same name is not a safe way to merge their files.



Linux and Windows jobs both upload test-results. The shared name collides. Use test-results-${{ matrix.os }}; a later aggregation job downloads each named artifact and combines reports explicitly.



## Read the visual

Each box is one parallel uploader. Red boxes repeat the same claim ticket; green boxes include the matrix value so the later collector can name every input.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use matrix-qualified artifact names whenever parallel GitHub Actions jobs upload logs, binaries, coverage, or test reports.

**Practical example.** Three operating-system jobs publish JUnit XML before one report job aggregates them.

**How to decide.** Treat each job output as immutable evidence. Name it with matrix dimensions and optionally run attempt; aggregate in a separate job rather than writing concurrently.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
oses=['ubuntu','windows','macos']
unsafe=['test-results' for os in oses]
unsafe_unique=len(set(unsafe))
safe=[f'test-results-{os}' for os in oses]
safe_unique=len(set(safe))
```

1. All parallel jobs choose the same artifact name.

   Changed values: `{"oses": ["ubuntu", "windows", "macos"], "unsafe": ["test-results", "test-results", "test-results"]}`

2. Three jobs collapse to one name.

   Changed values: `{"unsafe_unique": 1}`

3. Include the matrix dimension.

   Changed values: `{"safe": ["test-results-ubuntu", "test-results-windows", "test-results-macos"]}`

4. Each immutable upload now has a distinct name.

   Changed values: `{"safe_unique": 3}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser does not run Actions or upload files. Real limits include retention, permissions, hidden files, compression, artifact IDs, action-version behavior, and naming constraints.

## Explore (remaining exploration time)

Change the matrix size and naming policy. Watch duplicate names collapse into one collision group.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser does not run Actions or upload files. Real limits include retention, permissions, hidden files, compression, artifact IDs, action-version behavior, and naming constraints.

## Quiz (4 minutes)

1. Why is one name unsafe across v4 matrix uploads?
   - Artifacts are immutable and parallel jobs collide
   - YAML forbids dashes
   - Artifacts execute automatically

2. Best matrix name?
   - test-results
   - test-results-${{ matrix.os }}
   - results-${{ secrets.TOKEN }}

3. How should reports be combined?
   - Concurrent writes to one artifact
   - A later aggregation job downloads named artifacts
   - Delete all but one

4. Which matrix dimensions belong in your artifact identity?
5. How will the aggregation job detect a missing artifact rather than silently publish a partial report?

<details><summary>Answer key — attempt first</summary>

1. Artifacts are immutable and parallel jobs collide. Each job should create its own artifact.

2. test-results-${{ matrix.os }}. The matrix dimension creates predictable uniqueness without exposing secrets.

3. A later aggregation job downloads named artifacts. Aggregation should be an explicit downstream step.

</details>

## Sources

- [GitHub Actions: store and share data with workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data) — Living documentation; v4 immutability; checked 2026-10-16.
- [GitHub Actions contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts) — Living documentation; checked 2026-10-16.
- [actions/upload-artifact](https://github.com/actions/upload-artifact) — Official action repository; checked 2026-10-16.
