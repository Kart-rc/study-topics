# Rollback is another deployment—of the last known-good digest

CI/CD & GitHub Actions · Day23 · 15 minutes

Restore a known artifact through the same protected path instead of rebuilding or bypassing controls.

## Recall (2 minutes)

<p><a href="../Day18/ci-cd-github-actions.html">Day18: One failed matrix job: cancel siblings or collect evidence?</a></p><p>Next is experimental with continue-on-error true. It fails with fail-fast true. What happens to siblings?</p><details><summary>Recall first, then reveal the refresher</summary><p>They are not canceled by this tolerated failure. The tolerated failure does not trigger fail-fast cancellation. Each job keeps its own policy.</p></details><p><a href="../Day20/ci-cd-github-actions.html">Day20: A tag can move; a full commit SHA cannot</a></p><p>v1 moves aaa→bbb. @v1 does what?</p><details><summary>Recall first, then reveal the refresher</summary><p>Can run bbb without workflow diff. Ref resolves at run time.</p></details>

## Understand (4 minutes)

A restaurant recalls today’s sauce and reopens yesterday’s sealed batch. It does not try to recreate yesterday’s sauce from memory during the incident.

A rollback selects the last known-good immutable digest and deploys it through the production environment gate. It records a new deployment event. It does not erase history.



Production runs sha256:bad23. Error rate crosses the rollback threshold. The workflow selects recorded digest sha256:good22, requires production approval, deploys it, and verifies recovery. Rebuilding commit 22 could create different bytes.



## Read the visual

The curved arrow points from the failing deployment to the exact prior digest; compatibility changes whether that arrow is green or blocked.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use artifact rollback when the previous version remains compatible with current data, schema, and external contracts.

**Practical example.** Restore the prior API container after a new image raises 5xx errors.

**How to decide.** Rollback code only when backward compatibility holds. Use roll-forward or explicit data repair when migrations or irreversible side effects make the old artifact unsafe.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
history=[{"digest":"good22","healthy":True},{"digest":"bad23","healthy":False}]
schema_compatible=True
candidate=next(x for x in reversed(history) if x["healthy"])
decision={"action":"DEPLOY_EXISTING_DIGEST","digest":candidate["digest"]} if schema_compatible else {"action":"ROLL_FORWARD"}
```

1. Record immutable deployment history and state compatibility.

   Changed values: `{"history": [{"digest": "good22", "healthy": true}, {"digest": "bad23", "healthy": false}], "schema_compatible": true}`

2. Select the last known-good artifact.

   Changed values: `{"candidate": {"digest": "good22", "healthy": true}}`

3. Choose rollback only when the old artifact can run against current state.

   Changed values: `{"decision": {"action": "DEPLOY_EXISTING_DIGEST", "digest": "good22"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executed local Python over synthetic history. It did not trigger GitHub Actions or deploy an artifact.

## Explore (remaining exploration time)

Toggle schema compatibility and choose rollback or roll-forward. Watch whether the previous digest is actually safe.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser models artifact selection and compatibility as two values. Production rollback needs health criteria, deployment history, approvals, credentials, traffic strategy, data checks, and post-restore verification.

## Quiz (4 minutes)

1. Why not rebuild the old commit during rollback?
   - It can produce different bytes
   - Git forbids it
   - Approvals disappear

2. Destructive schema migration broke old-code compatibility. Best default?
   - Deploy old code anyway
   - Roll forward or repair compatibility first
   - Delete history

3. What should GitHub environment history show?
   - Only the original deployment
   - A new rollback deployment and its result
   - No record

4. Which data migration would make your last release unsafe to restore?
5. Where is the exact last known-good digest recorded today?

<details><summary>Answer key — attempt first</summary>

1. It can produce different bytes. The verified object is the immutable prior artifact.

2. Roll forward or repair compatibility first. Artifact rollback cannot undo incompatible state.

3. A new rollback deployment and its result. Rollback is an auditable production action.

</details>

## Sources

- [GitHub Actions deployment management](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments) — Living documentation; checked 2026-10-13.
- [GitHub deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments) — Living documentation; checked 2026-10-13.
