# A temporary cloud badge: GitHub Actions OIDC to AWS

CI/CD & GitHub Actions · Day15 · 15 minutes

Replace stored AWS access keys with short-lived credentials whose token claims name the exact repository context.

## Recall (2 minutes)

<p><a href="../Day12/ci-cd-github-actions.html">Day12: Speed aid or handoff record? Cache vs artifact</a></p><p>The dependency cache misses. What should the build do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Download or regenerate dependencies, then continue. GitHub&#x27;s guidance says jobs should be able to recreate cached files when the cache is unavailable.</p></details><p><a href="../Day14/ci-cd-github-actions.html">Day14: One pipeline contract: reusable GitHub Actions workflows</a></p><p>Where does a reusable workflow declare its caller contract?</p><details><summary>Recall first, then reveal the refresher</summary><p>Under on.workflow_call inputs and secrets. workflow_call is the trigger and contract surface for inputs and secrets.</p></details>

## Understand (4 minutes)

A contractor should receive a temporary badge for one building, not a copied master key that works forever.


GitHub Actions can request a signed OpenID Connect token for a job. AWS Security Token Service checks the token's audience and subject against an IAM trust policy, then returns short-lived credentials.


Workflowrequests signed token

AWS trustchecks aud + sub

Temporary roleexpires automatically

No long-lived AWS key stored in GitHub



A production job uses an environment named prod. Its trust policy must match that context.

permissions:
  id-token: write
  contents: read


For repositories created after July 15, 2026, or opted into immutable subject claims, GitHub documents subjects with immutable owner and repository IDs, for example:


repo:octo-org@123456/octo-repo@456789:environment:prod


A copied workflow from another repository gets a different subject and should be denied. id-token: write permits requesting an OIDC token; it does not itself grant AWS access.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
token = {'aud': 'sts.amazonaws.com', 'sub': 'repo:octo-org@123456/octo-repo@456789:environment:prod'}
trust = {'aud': 'sts.amazonaws.com', 'sub': 'repo:octo-org@123456/octo-repo@456789:environment:prod'}
audience_matches = token['aud'] == trust['aud']
subject_matches = token['sub'] == trust['sub']
temporary_credentials_issued = audience_matches and subject_matches
```

1. Represent the two claims this lesson's trust policy evaluates.

   Changed values: `{"token": {"aud": "sts.amazonaws.com", "sub": "repo:octo-org@123456/octo-repo@456789:environment:prod"}}`

2. The IAM role trust names one audience and one immutable repository/environment subject.

   Changed values: `{"trust": {"aud": "sts.amazonaws.com", "sub": "repo:octo-org@123456/octo-repo@456789:environment:prod"}}`

3. Evaluate each boundary separately so a denial explains the mismatch.

   Changed values: `{"audience_matches": true, "subject_matches": true}`

4. Issue a short-lived role session only when both conditions match.

   Changed values: `{"temporary_credentials_issued": true}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: Executes dictionary comparisons. It does not mint or verify a JWT, contact GitHub, call AWS STS, or evaluate IAM permissions.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Pin third-party actions to full commit SHAs, keep <code>contents: read</code> and other GitHub permissions minimal, bind AWS trust to the narrowest subject that works, and restrict the assumed role's permissions. OIDC removes stored cloud keys; it does not make a compromised workflow harmless.</p>

</details>

## Explore (remaining exploration time)

Change the token audience, repository subject, and environment. See which claim mismatch blocks role assumption.

Open ci-cd-github-actions.html for the executable model.

Model limits: The lab compares two token claims as strings. Real AWS validates token signature, issuer, expiry, audience, subject conditions, role policy, session policy, and action version. Legacy and immutable subject formats differ; inspect your repository's actual token claims before changing trust.

## Quiz (4 minutes)

1. What does id-token: write allow?
   - The job may request an OIDC token
   - The job can edit every AWS resource
   - The token never expires

2. Why constrain both aud and sub?
   - To bind the token to AWS STS and the expected repository context
   - To make the YAML shorter
   - To preserve a long-lived access key

3. What changed for certain repositories after July 15, 2026?
   - GitHub documents immutable owner and repository IDs in the subject claim
   - AWS stopped supporting OIDC
   - Every branch automatically became prod

4. Trace the successful token exchange from workflow permission to temporary AWS credentials.
5. A repository is renamed or transferred. How do immutable IDs change the trust-policy risk and migration plan?

<details><summary>Answer key — attempt first</summary>

1. The job may request an OIDC token. GitHub states that this permission enables token requests; the cloud trust and role policy still decide access.

2. To bind the token to AWS STS and the expected repository context. Audience limits the intended recipient; subject limits which workflow context may assume the role.

3. GitHub documents immutable owner and repository IDs in the subject claim. New or opted-in repositories can use immutable IDs, so trust policies must match their actual format.

</details>

## Sources

- [GitHub Docs: Configuring OIDC in AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws) — Living 2026 documentation; AWS audience, subject conditions, and immutable IDs; checked 2026-10-05.
- [AWS IAM: Create an OIDC identity provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html) — Living AWS documentation; issuer, JWKS, audience, and temporary role trust; checked 2026-10-05.
