# Share live data without copying it

Data engineering · Day25 · 30 minutes

Explain provider-owned live sharing, then compare Databricks OpenSharing with Snowflake Secure Data Sharing.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day21/data-engineering.html">Day21: Publish only after the quality gate: make dependencies carry the rule</a></p><p>Validation fails for B21. What should publish do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Stay blocked. The dependency is the business gate, not a timing hint.</p></details><p><a href="../Day9/data-engineering.html">Day9: Kafka&#x27;s consumer protocol: reassign incrementally, not behind a global barrier</a></p><p>One member changes in a large group. What is the core advantage of incremental reconciliation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Partitions whose ownership is unchanged can continue processing. The protocol narrows disruption to ownership that must move instead of imposing a group-wide synchronization barrier.</p></details>

## Understand (4 minutes)

Think of a library card. The library keeps one book; readers receive permission to read it. A shared table works the same way: the provider keeps the governed data and grants read access. The recipient queries the provider-owned data instead of receiving a frozen export.

This removes scheduled copy jobs, but it does not remove authorization, query cost, egress, schema-change risk, or the need to know who may see each row.



The fraud team owns risk.daily_scores. A partner needs current scores for five regions. A nightly CSV is twelve hours stale and becomes an unmanaged copy. A share keeps one provider-owned table current; a dynamic view can expose only approved rows and columns.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use live sharing when another team or organization needs current governed data but should not own an independent extract pipeline.

**Practical example.** A bank shares daily risk scores with a claims partner while keeping the source table, policy and audit trail under provider control.

**How to decide.** Choose a live share when freshness and centralized revocation outweigh cross-region egress and provider coupling. Use a materialized export when the recipient needs isolation, offline processing or a stable historical snapshot.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Follow the ownership line: there is one provider table, one permission gate, and a recipient query. Moving the version slider changes the shared object, not a copied dataset.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
provider={'version':3,'rows':120}
grant=True
recipient_version=provider['version'] if grant else None
provider['version']=4
recipient_version=provider['version'] if grant else None
grant=False
after_revoke=provider['version'] if grant else None
```

1. Start with one provider-owned table and an active read grant.

   Changed values: `{"provider": {"version": 3, "rows": 120}, "grant": true}`

2. The recipient resolves the provider version; no table copy is created.

   Changed values: `{"recipient_version": 3}`

3. A provider update becomes the version the reader sees.

   Changed values: `{"provider": {"version": 4, "rows": 120}, "recipient_version": 4}`

4. Revocation stops the next read; it does not delete data the recipient previously exported.

   Changed values: `{"grant": false, "after_revoke": null}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser model represents one table version and one grant. Real sharing adds identity federation, object eligibility, regions/clouds, billing, auditing, schema evolution and product-specific limitations. Vendor SQL below was not executed.

## Explore (remaining exploration time)

Change the provider version, access state and region. Predict whether the reader sees current rows, stale rows, or no rows.

Open data-engineering.html for the executable model.

Model limits: The browser model represents one table version and one grant. Real sharing adds identity federation, object eligibility, regions/clouds, billing, auditing, schema evolution and product-specific limitations. Vendor SQL below was not executed.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day19/data-engineering.html">Day19</a>; product material added 2026-10-09.</p><p>Databricks: after enabling liquid clustering, what operation rewrites existing data layout in this lesson?</p><details><summary>Recall first, then reveal the product refresher</summary><p>OPTIMIZE (FULL for the explicit full rewrite shown). OPTIMIZE performs clustering work. FULL explicitly forces full reclustering on supported runtimes; VACUUM and grants solve different problems.</p></details><p>Snowflake: does a table need a user clustering key before any micro-partition pruning can occur?</p><details><summary>Recall first, then reveal the product refresher</summary><p>No; metadata is automatic, while a key can improve layout for suitable large tables. Snowflake records micro-partition metadata automatically. User clustering keys are selective optimizations and are unsupported for hybrid tables.</p></details>

## Databricks: share a Unity Catalog object · 9 minutes

SQL is unexecuted vendor practice. Create a share, add the governed object, create the recipient, and grant access. OpenSharing works across platforms; Databricks-to-Databricks uses Unity Catalog identities. Prefer OIDC over copied bearer tokens where supported.

## Snowflake: a share becomes a read-only imported database · 9 minutes

SQL is unexecuted vendor practice. The provider creates a share and grants objects; the consumer creates an imported read-only database. No storage copy is created by the share. The consumer pays query compute.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Owner | provider UC object | provider DB object |
| Recipient | open protocol or D2D | imported read-only DB |
| Writes | no | no |
| Boundary | identity and egress | one DB/share; consumer compute |

A consumer needs current rows but must not own a writable copy. Best common mechanism?

- Live read-only share
- Nightly attachment
- Grant ownership

<details><summary>Reveal after predicting</summary>

Live read-only share. Both products expose provider-owned data through read-only sharing.

</details>

What survives after a recipient exported shared rows before revocation?

- Nothing anywhere
- The recipient-created export may remain
- The provider table is deleted

<details><summary>Reveal after predicting</summary>

The recipient-created export may remain. Revocation stops future shared access; it cannot recall an independent copy already made.

</details>

## Certification connection

Focused OpenSharing ownership, recipient identity, revocation and egress decisions; not complete governance coverage. Focused Secure Data Sharing provider/consumer and read-only database decisions; planning group only because full COF-C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks OpenSharing overview](https://docs.databricks.com/aws/en/opensharing/) — Living documentation; checked 2026-10-15.
- [Databricks OpenSharing concepts](https://docs.databricks.com/aws/en/opensharing/index.html) — Living documentation; checked 2026-10-15.
- [Snowflake Secure Data Sharing introduction](https://docs.snowflake.com/en/user-guide/data-sharing-intro) — Living documentation; checked 2026-10-15.
- [Snowflake data providers](https://docs.snowflake.com/en/user-guide/data-sharing-provider) — Living documentation; checked 2026-10-15.

## Quiz (4 minutes)

1. The provider updates its table from v3 to v4. With access intact, what should a live-share reader query?
   - The old CSV forever
   - The current shared data, subject to platform refresh semantics
   - A private copy it owns

2. Why can live sharing improve governance?
   - The provider can centralize grants and revoke access
   - The recipient automatically becomes owner
   - Network cost disappears

3. When is an export a better fit?
   - The consumer needs an isolated historical snapshot
   - The provider wants immediate revocation
   - Freshness must be near real time

4. What operational dependency does a live share introduce for the recipient?
5. Which access and egress evidence would you require before sharing regulated data?

<details><summary>Answer key — attempt first</summary>

1. The current shared data, subject to platform refresh semantics. The share exposes provider-owned data rather than a detached export.

2. The provider can centralize grants and revoke access. One governed object and provider-controlled grants reduce unmanaged copies.

3. The consumer needs an isolated historical snapshot. A materialized snapshot decouples the consumer from later provider changes.

</details>

## Sources

- [Databricks OpenSharing overview](https://docs.databricks.com/aws/en/opensharing/) — Living documentation; checked 2026-10-15.
- [Databricks OpenSharing concepts](https://docs.databricks.com/aws/en/opensharing/index.html) — Living documentation; checked 2026-10-15.
- [Snowflake Secure Data Sharing introduction](https://docs.snowflake.com/en/user-guide/data-sharing-intro) — Living documentation; checked 2026-10-15.
- [Snowflake data providers](https://docs.snowflake.com/en/user-guide/data-sharing-provider) — Living documentation; checked 2026-10-15.
