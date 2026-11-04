# An OIDC token states who asked; the AWS trust policy decides who enters

CI/CD & GitHub Actions · Day44 · 15 minutes

Bind GitHub Actions cloud access to exact audience and subject claims, including the current immutable subject format.

## Recall (2 minutes)

<p><a href="../Day31/ci-cd-github-actions.html">Day31: Attest the digest, not the tag</a></p><p>Why attest a digest rather than a tag?</p><details><summary>Recall first, then reveal the refresher</summary><p>A digest identifies the artifact bytes. A mutable name can be reused; a content digest changes with the bytes.</p></details><p><a href="../Day19/ci-cd-github-actions.html">Day19: The digest must match: verify build provenance before deployment</a></p><p>The filename matches but digest differs. What should verification do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Block because the attestation names different bytes. The digest binds provenance to exact content; a stable name does not.</p></details>

## Understand (4 minutes)

A building badge states a person's identity. The door's access list decides whether that identity may enter.

GitHub's OIDC token carries claims such as aud and sub. AWS evaluates those claims in the role trust policy. For repositories created after July 15, 2026, or older repositories that opt in, the default subject includes immutable owner and repository IDs. A trust policy written for the old name-only format will not match that token.



The production role requires audience sts.amazonaws.com and subject repo:acme@12/payments@34:ref:refs/heads/main. The main job matches. A feature branch and another repository receive valid GitHub tokens but AWS denies them because their subjects differ.



## Read the visual

The side-by-side subject comparison makes token identity and AWS authorization separate gates, and exposes format drift immediately.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use GitHub OIDC when workflows need short-lived AWS credentials without storing long-lived cloud secrets.

**Practical example.** Only the payments repository's protected main deployment may assume an EKS production-deployer role.

**How to decide.** Match audience and a narrow subject in AWS. Confirm whether the repository uses mutable or immutable subject format before rollout, update cloud trust before changing GitHub's template, and add environment protection when the subject references an environment.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
token={'aud':'sts.amazonaws.com','sub':'repo:acme@12/payments@34:ref:refs/heads/main'}
trust={'aud':'sts.amazonaws.com','sub':'repo:acme@12/payments@34:ref:refs/heads/main'}
audience_ok=token['aud']==trust['aud']; subject_ok=token['sub']==trust['sub']
assume_role=audience_ok and subject_ok; permissions='separate least-privilege policy'
```

1. Model an immutable-format token from the production branch.

   Changed values: `{"token": {"aud": "sts.amazonaws.com", "sub": "repo:acme@12/payments@34:ref:refs/heads/main"}}`

2. Require an exact audience and subject in the AWS role trust policy.

   Changed values: `{"trust": {"aud": "sts.amazonaws.com", "sub": "repo:acme@12/payments@34:ref:refs/heads/main"}}`

3. Evaluate both claims rather than trusting token issuance alone.

   Changed values: `{"audience_ok": true, "subject_ok": true}`

4. Trust permits the session; a separate IAM policy limits its capabilities.

   Changed values: `{"assume_role": true, "permissions": "separate least-privilege policy"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model compares two strings. It does not mint or validate JWTs, verify issuer/signature/time, model custom claims, GitHub Enterprise Server, environment protection, IAM permissions policies, role sessions, forks, reusable workflows, Dependabot, AWS STS, or compromise scenarios.

## Explore (remaining exploration time)

Switch the token source and trust-policy format. Observe that token issuance is not AWS authorization and that a stale name-only policy denies an immutable token.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model compares two strings. It does not mint or validate JWTs, verify issuer/signature/time, model custom claims, GitHub Enterprise Server, environment protection, IAM permissions policies, role sessions, forks, reusable workflows, Dependabot, AWS STS, or compromise scenarios.

## Quiz (4 minutes)

1. A feature-branch token has the right audience but a different subject. What does AWS do?
   - Deny the role assumption
   - Allow because GitHub signed it
   - Rewrite the branch to main

2. Why can an old trust policy fail after immutable-subject opt-in?
   - The token now includes owner and repository IDs in sub
   - OIDC stops signing tokens
   - AWS removes the audience

3. What is still required after the trust policy allows the role?
   - An IAM permissions policy limiting what the role may do
   - A permanent access key
   - A wildcard subject

4. Which repositories, refs, or environments can assume each production role today?
5. How will you migrate cloud trust before enabling immutable subjects or changing a claim template?

<details><summary>Answer key — attempt first</summary>

1. Deny the role assumption. The trust policy requires both the expected audience and subject.

2. The token now includes owner and repository IDs in sub. The exact subject string changes; GitHub recommends updating cloud trust before the token template.

3. An IAM permissions policy limiting what the role may do. Trust controls who may assume the role; permissions control the resulting session's actions.

</details>

## Sources

- [GitHub Docs: Configuring OIDC in AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws) — Official documentation; checked November 3, 2026; checked 2026-11-03.
- [GitHub Docs: OpenID Connect reference](https://docs.github.com/en/actions/reference/security/oidc) — Official documentation including immutable subjects; checked November 3, 2026; checked 2026-11-03.
- [AWS IAM: create a role for OIDC federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html) — Official AWS documentation; checked November 3, 2026; checked 2026-11-03.
