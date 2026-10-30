# A workflow_run privilege jump must treat build artifacts as hostile input

CI/CD & GitHub Actions · Day40 · 15 minutes

Separate untrusted tests from privileged publication without turning the artifact bridge into code execution.

## Recall (2 minutes)

<p><a href="../Day29/ci-cd-github-actions.html">Day29: A skipped required workflow can wait forever</a></p><p>Why can a workflow-level path filter block a PR?</p><details><summary>Recall first, then reveal the refresher</summary><p>The required check is never reported and stays Pending. A skipped required workflow does not emit the successful check the rule expects.</p></details><p><a href="../Day17/ci-cd-github-actions.html">Day17: Deployment concurrency: one pending run or a queue?</a></p><p>R1 runs; R2 then R3 wait with default queue and cancel-in-progress:false. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>R2 is canceled; R3 waits. False protects the running job, not the default pending slot.</p></details>

## Understand (4 minutes)

A loading dock may accept a sealed package from outside. The badge that opens the vault must not execute instructions found inside that package.

A workflow triggered by workflow_run can have secrets and write tokens even when the earlier workflow did not. That makes it useful for privilege separation—and dangerous if it checks out untrusted code or executes an artifact from the untrusted run. The privileged workflow must verify the originating run and treat downloaded files as data.



A fork pull request runs tests with read-only permissions and uploads result.json. The privileged follow-up checks the triggering workflow name, successful conclusion, head repository and SHA, downloads the expected artifact, validates its digest/schema, and posts a comment. It never runs a script from the archive.



## Read the visual

The diagram follows bytes across the trust boundary. Each control closes a specific path; the final red node appears only when privileged execution consumes untrusted content.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use workflow_run when an unprivileged build must be followed by a narrowly privileged action such as commenting, labeling, or publication.

**Practical example.** Fork PR tests produce a JSON coverage summary; a later workflow with pull-request write permission posts the number.

**How to decide.** Keep the privileged follow-up tiny. Prefer passing identifiers or strict data. If the second workflow must execute build output, redesign the boundary or rebuild trusted code from a verified commit; do not rely on an artifact filename alone.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
trigger = {'workflow':'PR tests','conclusion':'success','head_repo':'fork','head_sha':'abc123'}
origin_ok = trigger['workflow'] == 'PR tests' and trigger['conclusion'] == 'success' and len(trigger['head_sha']) == 6
artifact = {'coverage': 87}; schema_ok = set(artifact) == {'coverage'} and 0 <= artifact['coverage'] <= 100
execute_artifact = False; privileged_action_allowed = origin_ok and schema_ok and not execute_artifact
```

1. Receive metadata from an unprivileged completed run.

   Changed values: `{"trigger": {"workflow": "PR tests", "conclusion": "success", "head_repo": "fork", "head_sha": "abc123"}}`

2. Apply an explicit origin policy before touching privileged capabilities.

   Changed values: `{"origin_ok": true}`

3. Parse one bounded data field instead of executing a file.

   Changed values: `{"artifact": {"coverage": 87}, "schema_ok": true}`

4. The bridge permits a comment, not artifact code execution.

   Changed values: `{"execute_artifact": false, "privileged_action_allowed": true}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model simplifies GitHub events, permissions, artifact APIs, attestations, branch filters, forks, caches, reusable workflows, and token scopes. It does not execute Actions or prove a workflow secure.

## Explore (remaining exploration time)

Toggle origin verification, artifact validation, and artifact execution. Watch the privilege bridge remain data-only or become a repository compromise path.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model simplifies GitHub events, permissions, artifact APIs, attestations, branch filters, forks, caches, reusable workflows, and token scopes. It does not execute Actions or prove a workflow secure.

## Quiz (4 minutes)

1. Why can workflow_run be more privileged than the triggering workflow?
   - It may access secrets and write tokens unavailable to the earlier run
   - Artifacts automatically grant admin
   - Fork code becomes trusted

2. What is the safest artifact shape for posting a test result?
   - Strictly validated data such as a small JSON document
   - An executable shell script
   - A whole untrusted workspace

3. When is digest checking alone insufficient?
   - The privileged job then executes attacker-controlled bytes with secrets
   - The file is JSON and schema-validated
   - The origin workflow succeeded

4. Which workflows gain secrets or write permissions after consuming another run's output?
5. Can every artifact crossing that boundary be reduced to a strict data schema?

<details><summary>Answer key — attempt first</summary>

1. It may access secrets and write tokens unavailable to the earlier run. The event intentionally supports privilege separation.

2. Strictly validated data such as a small JSON document. A narrow data contract reduces the privileged interpreter surface.

3. The privileged job then executes attacker-controlled bytes with secrets. A matching digest proves identity, not trustworthiness.

</details>

## Sources

- [GitHub Actions: Events that trigger workflows — workflow_run](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run) — Official documentation; checked October 30, 2026; checked 2026-10-30.
- [GitHub Actions secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) — Official security guidance; checked October 30, 2026; checked 2026-10-30.
- [GitHub Actions artifact REST API](https://docs.github.com/en/rest/actions/artifacts) — Official API documentation; checked October 30, 2026; checked 2026-10-30.
