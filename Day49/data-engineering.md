# A short-lived token proves the workload; grants still decide what it may do

Data engineering · Day49 · 30 minutes

Design secretless AWS workload identity for Databricks and Snowflake without confusing authentication with authorization.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day28/data-engineering.html">Day28: Repair the failed branch, not the successful tasks</a></p><p>What does workflow repair usually choose?</p><details><summary>Recall first, then reveal the refresher</summary><p>Which failed tasks restart. The orchestrator chooses the restart point; task logic owns data safety.</p></details><p><a href="../Day32/data-engineering.html">Day32: One table, different rows: query-time row access policies</a></p><p>An east analyst has SELECT on the table. What does the row policy add?</p><details><summary>Recall first, then reveal the refresher</summary><p>It removes rows whose predicate is false. Object privileges allow the query; the row policy narrows its result.</p></details>

## Understand (4 minutes)

A conference badge proves who entered the building. It does not open every room. Workload identity federation works the same way: an AWS role obtains a short-lived signed identity token, a platform policy matches the issuer, audience, and subject, and the platform maps that claim to a non-human identity.

That answers who is calling. SQL grants and platform privileges separately answer what the caller may do. A valid token with no SELECT grant must still be denied.



An EKS service account assumes the AWS role orders-etl. The token says issuer = the account-specific AWS issuer, audience = databricks or the configured Snowflake audience, subject = that role. A matching federation rule authenticates the pipeline. The pipeline can read ops.orders because its platform identity has that grant; it cannot drop the catalog.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use workload identity federation when an unattended AWS workload must call a data platform and you want to remove long-lived platform secrets.

**Practical example.** An EKS-hosted Spark control service triggers a Databricks job and a Snowflake validation query using its AWS identity.

**How to decide.** Federate a stable, narrowly scoped workload identity when the runtime can mint verifiable short-lived tokens. Keep a managed secret only when the product, driver, or identity provider does not support federation, and rotate it explicitly.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The request crosses two labeled gates: token-claim matching, then object privileges. Changing either control shows exactly which gate denies the query.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
token={'iss':'aws-issuer-7','aud':'databricks','sub':'role/orders-etl','ttl_seconds':300}
policy={'iss':'aws-issuer-7','aud':'databricks','sub':'role/orders-etl'}; identity_match=all(token[k]==v for k,v in policy.items())
grants={'select_orders':True,'drop_catalog':False}; requested='select_orders'
authorized=identity_match and grants.get(requested,False); result={'identity_match':identity_match,'requested':requested,'authorized':authorized}
```

1. Receive a short-lived synthetic identity claim.

   Changed values: `{"token": {"iss": "aws-issuer-7", "aud": "databricks", "sub": "role/orders-etl", "ttl_seconds": 300}}`

2. Match issuer, audience, and subject before mapping an identity.

   Changed values: `{"policy": {"iss": "aws-issuer-7", "aud": "databricks", "sub": "role/orders-etl"}, "identity_match": true}`

3. Keep privileges separate from identity proof.

   Changed values: `{"grants": {"select_orders": true, "drop_catalog": false}, "requested": "select_orders"}`

4. Allow only when both the identity and grant gates pass.

   Changed values: `{"authorized": true, "result": {"identity_match": true, "requested": "select_orders", "authorized": true}}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser and Python trace model claim matching and one grant only. They do not mint or verify JWT signatures, call AWS STS, Databricks, or Snowflake, reproduce token exchange, role hierarchy, network policy, SCIM, audit logs, driver versions, account boundaries, or cloud-specific failure modes.

## Explore (remaining exploration time)

Change one claim and one grant. Predict whether the request fails at identity matching or at authorization.

Open data-engineering.html for the executable model.

Model limits: The browser and Python trace model claim matching and one grant only. They do not mint or verify JWT signatures, call AWS STS, Databricks, or Snowflake, reproduce token exchange, role hierarchy, network policy, SCIM, audit logs, driver versions, account boundaries, or cloud-specific failure modes.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day29/data-engineering.html">Day29</a>; product material added 2026-10-19.</p><p>Ten short reader queries queue behind each other. Which lever fits the symptom?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Concurrency scaling after confirming the queue pattern. Waiting readers are a concurrency signal, not automatically a per-query-size signal.</p></details><p>What should cross the live-sharing boundary?</p><details><summary>Recall first, then reveal the product refresher</summary><p>A reconciled certified object with revocable access. The share should expose the narrow published contract, not intermediate state.</p></details>

## Databricks: map the AWS role to a service principal, then grant only the data path · 9 minutes

Configure an account-level service-principal federation policy for the AWS issuer, audience, and role ARN. Then grant only the required Unity Catalog path. SQL and token exchange were not run in Databricks.

## Snowflake: bind the AWS identity to a SERVICE user, then assign a least-privilege role · 9 minutes

Create a `TYPE=SERVICE` user with an AWS workload identity, then give its role only the required warehouse and table privileges. The documented JWT-based AWS connector path requires connector 4.7.1 or later. Not executed in Snowflake.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Identity | Service principal | SERVICE user |
| AWS proof | Federation policy | WORKLOAD_IDENTITY |
| Authorization | Workspace + UC privileges | Role + object privileges |
| Boundary | Account-level setup | Driver/version and user setup |

A Databricks federation policy matches, but the principal lacks USE SCHEMA. What fails?

- The table query at authorization
- AWS token signature generation
- The platform identity mapping

<details><summary>Reveal after predicting</summary>

The table query at authorization. Authentication can succeed while Unity Catalog denies the object path.

</details>

What must accompany a Snowflake SERVICE user that authenticates with WIF?

- A role with the required warehouse and object privileges
- A human password
- ACCOUNTADMIN as the default role

<details><summary>Reveal after predicting</summary>

A role with the required warehouse and object privileges. WIF proves identity; RBAC authorizes operations.

</details>

## Certification connection

Databricks Intelligence Platform and governance/security: AWS workload identity federation, service-principal policy matching, Unity Catalog grants, token lifetime, and account-level setup limits. Architecture/connectivity plus account access/security planning groups: AWS workload identity federation, SERVICE users, connector requirements, RBAC, and warehouse/object grants. Planning groups only; no complete COF-C03 objective map claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks AWS workload identity federation](https://docs.databricks.com/aws/en/dev-tools/auth/provider-aws-iam) — Official Databricks documentation; updated October 13, 2026; checked 2026-11-09.
- [Databricks federation policies](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-federation-policy) — Official Databricks documentation; updated October 2, 2026; checked 2026-11-09.
- [Snowflake workload identity federation](https://docs.snowflake.com/en/user-guide/workload-identity-federation) — Official Snowflake documentation; current AWS WIF and service-user guidance; checked 2026-11-09.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Official guide; May 4, 2026 version; checked 2026-11-09.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official current exam overview; full objective IDs and weights remain unverified; checked 2026-11-09.

## Quiz (4 minutes)

1. The token claims the expected role, but SELECT is not granted. What happens?
   - Authentication succeeds and the query is denied
   - The query is automatically allowed
   - The token adds the grant

2. Why bind issuer, audience, and subject?
   - To constrain which signed workload identity can map to the platform identity
   - To speed up SQL joins
   - To replace network controls

3. When is this model insufficient?
   - When you need to validate signatures, token exchange, role hierarchy, network policy, and audit evidence
   - When one table is read
   - When a token expires quickly

4. Which production workload still owns a long-lived data-platform secret, and what identity could replace it?
5. Which grant would you test separately after authentication succeeds?

<details><summary>Answer key — attempt first</summary>

1. Authentication succeeds and the query is denied. Identity proof does not confer object privileges.

2. To constrain which signed workload identity can map to the platform identity. All three claims narrow the acceptable token context.

3. When you need to validate signatures, token exchange, role hierarchy, network policy, and audit evidence. Production identity needs cryptographic, authorization, and operational controls beyond three string comparisons.

</details>

## Sources

- [Databricks AWS workload identity federation](https://docs.databricks.com/aws/en/dev-tools/auth/provider-aws-iam) — Official Databricks documentation; updated October 13, 2026; checked 2026-11-09.
- [Databricks federation policies](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-federation-policy) — Official Databricks documentation; updated October 2, 2026; checked 2026-11-09.
- [Snowflake workload identity federation](https://docs.snowflake.com/en/user-guide/workload-identity-federation) — Official Snowflake documentation; current AWS WIF and service-user guidance; checked 2026-11-09.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Official guide; May 4, 2026 version; checked 2026-11-09.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official current exam overview; full objective IDs and weights remain unverified; checked 2026-11-09.
