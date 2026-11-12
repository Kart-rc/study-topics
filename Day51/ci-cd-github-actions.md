# A secret reaches only the reusable workflow you pass it to

CI/CD & GitHub Actions · Day51 · 15 minutes

Model secret propagation across nested GitHub reusable workflows without assuming transitive inheritance.

## Recall (2 minutes)

<p><a href="../Day29/ci-cd-github-actions.html">Day29: A skipped required workflow can wait forever</a></p><p>Why can a workflow-level path filter block a PR?</p><details><summary>Recall first, then reveal the refresher</summary><p>The required check is never reported and stays Pending. A skipped required workflow does not emit the successful check the rule expects.</p></details><p><a href="../Day33/ci-cd-github-actions.html">Day33: Do not paste a pull-request title into a shell script</a></p><p>Why is ${{ github.event.pull_request.title }} dangerous inside run:?</p><details><summary>Recall first, then reveal the refresher</summary><p>GitHub substitutes it into generated shell code. Attacker-controlled text can change the script&#x27;s grammar.</p></details>

## Understand (4 minutes)

Giving a hotel key to your travel coordinator does not automatically give it to the driver they hire.

GitHub reusable-workflow secrets pass only to the directly called workflow. In chain A → B → C, secrets: inherit on A → B makes secrets available to B. B must explicitly pass the required secret to C. Permissions also cannot be elevated as the chain descends.



Workflow A calls deployment workflow B with secrets: inherit. B calls cloud workflow C but passes no aws_role. C sees an empty or unavailable secret and must fail before deployment. The fix is an explicit B → C secret contract, ideally passing only the one value C needs.



## Read the visual

A three-workflow call chain draws each direct secret edge separately; an unchecked B → C edge visibly stops deployment.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use explicit nested secret contracts when a reusable deployment workflow calls another reusable workflow that needs credentials or tokens.

**Practical example.** A product pipeline calls a standard deployment workflow, which calls a cloud-specific AWS workflow requiring an OIDC role name.

**How to decide.** Pass the minimum named secret or input at every direct edge. Avoid broad inherit when a narrow contract works. Prefer OIDC for cloud access so long-lived credentials are not propagated at all.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
A={'aws_role','release_token'}
B=set(A)
C={'aws_role'} if 'aws_role' in B else set()
result={'A':sorted(A),'B':sorted(B),'C':sorted(C),'c_can_deploy':'aws_role' in C}
```

1. Workflow A starts with two available secret names.

   Changed values: `{}`

2. A directly calls B with secrets inherited.

   Changed values: `{}`

3. B explicitly forwards only aws_role to directly called C.

   Changed values: `{}`

4. C receives the one explicit dependency, not every ancestor secret by magic.

   Changed values: `{"result": {"A": ["aws_role", "release_token"], "B": ["aws_role", "release_token"], "C": ["aws_role"], "c_can_deploy": true}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model uses sets of secret names. It does not run GitHub Actions, distinguish secrets from inputs, evaluate environments, mask logs, mint OIDC tokens, enforce repository access, reduce GITHUB_TOKEN permissions, or model organization policies.

## Explore (remaining exploration time)

Toggle A → B inheritance and B → C forwarding. Predict which workflow can read aws_role.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model uses sets of secret names. It does not run GitHub Actions, distinguish secrets from inputs, evaluate environments, mask logs, mint OIDC tokens, enforce repository access, reduce GITHUB_TOKEN permissions, or model organization policies.

## Quiz (4 minutes)

1. A inherits secrets into B, but B passes none to C. What does C receive from A?
   - Nothing automatically
   - Every repository secret
   - A new elevated token

2. Why prefer a named B → C secret contract?
   - It makes least-privilege dependencies explicit
   - It lets C elevate permissions
   - It bypasses environment protection

3. What remains true about permissions through nested calls?
   - They can be maintained or reduced, not elevated
   - C always receives admin
   - Permissions are unrelated to the caller

4. Which nested workflow currently relies on assumed transitive secrets?
5. Can that dependency become an input or OIDC policy instead of a long-lived secret?

<details><summary>Answer key — attempt first</summary>

1. Nothing automatically. Secrets are passed only to a directly called workflow.

2. It makes least-privilege dependencies explicit. A narrow edge shows exactly what the child requires.

3. They can be maintained or reduced, not elevated. Nested reusable workflows cannot increase the caller's granted permissions.

</details>

## Sources

- [GitHub Docs: Reuse workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows) — Official documentation; checked November 11, 2026; checked 2026-11-11.
- [GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) — Official reference; checked November 11, 2026; checked 2026-11-11.
