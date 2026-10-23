# Open the S3 door without handing out AWS keys

Data engineering · Day33 · 30 minutes

Trace credential-free S3 access through Databricks and Snowflake, including the path boundary.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day20/data-engineering.html">Day20: One receipt becomes two item rows: flatten nested data deliberately</a></p><p>R7 has two objects in items. How many item rows should it emit?</p><details><summary>Recall first, then reveal the refresher</summary><p>Two. Flatten counts array elements, not total quantity.</p></details><p><a href="../Day24/data-engineering.html">Day24: A file&#x27;s path is its ticket: retries are safe, overwrites are not</a></p><p>A producer sends the same object-store notification twice. What should durable file-ingestion state normally do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Recognize the path and skip a second file load. Durable state turns notification retries into a path-level no-op.</p></details>

## Understand (4 minutes)

A building badge should open one finance room, not arrive with a copy of the master key. Data platforms need the same design for S3.

The platform keeps a named trust object. That object can assume an AWS IAM role. A second object narrows the usable bucket path. Users receive permission on the platform object instead of receiving long-lived AWS access keys.



The finance pipeline needs s3://company-data/finance/incoming/. The AWS role can read that prefix. The platform object points to the role, and the external-location or stage object points to that exact prefix. A request for hr/payroll/ must fail even if someone guesses its path.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a governed storage trust when jobs or SQL users need cloud files without embedding cloud access keys in notebooks, stages, or connection strings.

**Practical example.** A finance ingestion job reads one S3 prefix in both Databricks and Snowflake while AWS role trust and platform grants stay centrally managed.

**How to decide.** Use a separate role and narrow path for a distinct blast radius. Reuse only when ownership, data sensitivity, lifecycle, and audit expectations match. Managed platform storage is simpler when external ownership is unnecessary.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The visual is a three-link trust chain. It answers exactly where a request stops: caller grant, AWS role trust, or allowed S3 prefix.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
checks = {'platform_grant': True, 'aws_trust': True, 'prefix_allowed': True}
finance_allowed = all(checks.values())
checks['prefix_allowed'] = False
hr_allowed = all(checks.values())
```

1. Represent the three independent gates for the finance request.

   Changed values: `{"checks": {"platform_grant": true, "aws_trust": true, "prefix_allowed": true}}`

2. Finance passes only because every gate is true.

   Changed values: `{"finance_allowed": true}`

3. Change only the requested path to out-of-scope HR.

   Changed values: `{"checks": {"platform_grant": true, "aws_trust": true, "prefix_allowed": false}}`

4. The same caller and role are denied by the path boundary.

   Changed values: `{"hr_allowed": false}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser evaluates three synthetic booleans. It does not call AWS STS, Databricks, Snowflake, S3, IAM policy evaluation, network controls, encryption keys, file formats, or product audit logs. Vendor SQL and CLI examples are sourced but not executed.

## Explore (remaining exploration time)

Choose the requested S3 prefix and turn each trust link on or off. Predict whether all three gates allow the read.

Open data-engineering.html for the executable model.

Model limits: The browser evaluates three synthetic booleans. It does not call AWS STS, Databricks, Snowflake, S3, IAM policy evaluation, network controls, encryption keys, file formats, or product audit logs. Vendor SQL and CLI examples are sourced but not executed.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day22/data-engineering.html">Day22</a>; product material added 2026-10-12.</p><p>Why count quarantined rows?</p><details><summary>Recall first, then reveal the product refresher</summary><p>To preserve reconciliation evidence. A repair must explain every source envelope.</p></details><p>Which product feature alone proves the repaired data is correct?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Neither; explicit business reconciliation is required. Orchestration carries a gate; it does not define the invariant.</p></details>

## Databricks: storage credential → external location · 9 minutes

Databricks represents the IAM role as a Unity Catalog storage credential, then scopes its use to an S3 URL with an external location. The caller still needs Unity Catalog privileges. CLI/SQL is sourced but unexecuted.

## Snowflake: storage integration → external stage · 9 minutes

Snowflake stores its generated cloud identity, AWS role ARN, and allowed prefixes in a storage integration. External stages reference it and must use an aligned URL. SQL is sourced but unexecuted.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Identity | storage credential | storage integration |
| Path | external location | external stage + allowed locations |
| Caller control | UC grants/bindings | object privileges |
| Sharp edge | role trust/overbroad reuse | external ID after recreation |

Databricks has a working IAM role, but a user lacks CREATE EXTERNAL TABLE on the external location. What happens?

- The platform denies table creation
- AWS permissions override Unity Catalog
- The user receives AWS keys

<details><summary>Reveal after predicting</summary>

The platform denies table creation. Cloud trust and platform authorization are separate gates.

</details>

A Snowflake stage URL points to hr/payroll while the integration allows only finance/incoming. Result?

- The stage URL is rejected or cannot access that location
- The allowed list expands automatically
- The role ARN is ignored

<details><summary>Reveal after predicting</summary>

The stage URL is rejected or cannot access that location. Stage URLs must align with STORAGE_ALLOWED_LOCATIONS.

</details>

## Certification connection

Unity Catalog storage credentials, external locations, IAM-role trust, path scoping and privileges. Delivered coverage is not mastery. Storage integrations, generated identity, allowed locations, external stages and trust boundaries. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks credentials reference](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-storage-credentials) — Checked October 23, 2026; checked 2026-10-23.
- [Databricks S3 external locations](https://docs.databricks.com/aws/en/connect/unity-catalog/cloud-storage/s3/s3-external-location-manual) — Checked October 23, 2026; checked 2026-10-23.
- [Snowflake CREATE STORAGE INTEGRATION](https://docs.snowflake.com/en/sql-reference/sql/create-storage-integration) — Checked October 23, 2026; checked 2026-10-23.
- [Snowflake configure S3 integration](https://docs.snowflake.com/en/user-guide/data-load-s3-config-storage-integration) — Checked October 23, 2026; checked 2026-10-23.

## Quiz (4 minutes)

1. The caller has a platform grant and the path is finance, but AWS does not trust the platform identity. Result?
   - The read is denied at role assumption
   - The platform grant overrides AWS
   - S3 returns every prefix

2. Why keep the usable prefix narrower than the IAM role when possible?
   - It adds a second governed scope and limits mistakes
   - It makes S3 strongly consistent
   - It removes the need for object grants

3. What is outside this lesson's proof?
   - Real STS, IAM, KMS, network and vendor execution
   - The three-gate teaching decision
   - A denied synthetic HR request

4. How would you divide roles and prefixes among finance, HR, and shared reference data?
5. Which real audit events would prove that a read used the intended role and path?

<details><summary>Answer key — attempt first</summary>

1. The read is denied at role assumption. Every link must allow the request; a platform grant cannot replace the AWS trust policy.

2. It adds a second governed scope and limits mistakes. Narrow scopes reduce the blast radius of a bad grant or guessed path.

3. Real STS, IAM, KMS, network and vendor execution. The local model is not evidence from either product or AWS.

</details>

## Sources

- [Databricks storage credentials and external locations](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-storage-credentials) — Living documentation; checked October 23, 2026; checked 2026-10-23.
- [Databricks S3 external-location setup](https://docs.databricks.com/aws/en/connect/unity-catalog/cloud-storage/s3/s3-external-location-manual) — Living documentation; checked October 23, 2026; checked 2026-10-23.
- [Snowflake CREATE STORAGE INTEGRATION](https://docs.snowflake.com/en/sql-reference/sql/create-storage-integration) — Living documentation; checked October 23, 2026; checked 2026-10-23.
- [Snowflake S3 storage-integration setup](https://docs.snowflake.com/en/user-guide/data-load-s3-config-storage-integration) — Living documentation; checked October 23, 2026; checked 2026-10-23.
