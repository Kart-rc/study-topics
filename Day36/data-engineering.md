# Consolidation case: land, evolve, govern, publish changes, and clone one orders feed

Data engineering · Day36 · 30 minutes

Choose the safe order of five controls for one partner-orders pipeline, then map the design honestly to Databricks and Snowflake.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day27/data-engineering.html">Day27: Choose one source winner before MERGE</a></p><p>Why rank source rows before MERGE?</p><details><summary>Recall first, then reveal the refresher</summary><p>To make one deterministic source winner per target key. One target row should not receive competing source actions.</p></details><p><a href="../Day15/data-engineering.html">Day15: Keep the newest fact: Kafka compaction and tombstones</a></p><p>After replaying offset 23, what is O17&#x27;s state?</p><details><summary>Recall first, then reveal the refresher</summary><p>Absent; the null value is a delete marker. The tombstone tells a keyed rebuild to remove O17.</p></details>

## Understand (4 minutes)

A loading dock does not let a new truck drive straight into the shop. It checks who the driver is, inspects new labels, stores the goods, limits who can see each shelf, records what changed, and makes a test copy before risky work.

Use the same order for a partner feed: identity → schema gate → governed table → change cursor → isolated test copy. Each control answers a different question. Passing one does not imply the others passed.



orders_20261026.parquet arrives in S3 with a new coupon_code. Tenant acme may see only its rows. Downstream fulfillment needs only new and changed orders. A QA team needs a safe copy to test the coupon calculation.

The release is safe only if cloud identity is scoped to the prefix, the additive column follows an explicit policy, tenant filtering is at the correct boundary, the change cursor is retained, and the clone does not create a false isolation guarantee.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this sequence when a file-fed data product combines external storage, changing schemas, tenant isolation, incremental consumers, and pre-release testing.

**Practical example.** A marketplace receives partner orders in S3, serves many tenants, publishes fulfillment changes, and validates a pricing patch in QA.

**How to decide.** Use all five only when the risks exist. A single internal batch may need fewer controls. Never remove identity, contract, or tenant checks merely because a clone or change feed is convenient.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The five-stage parcel line answers exactly where an order stops. Later stages remain visibly unreached, preventing a green clone check from hiding an earlier IAM or tenant-policy failure.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
gates = {'identity': True, 'schema': True, 'tenant_policy': True, 'cursor_current': True, 'qa_clone': True}
incoming = {'order_id': 'O-42', 'tenant': 'acme', 'coupon_code': 'SAVE10'}
checks = [name for name, passed in gates.items() if passed]
publish = len(checks) == len(gates); result = 'publish O-42' if publish else 'stop'
```

1. Start with five explicit controls.

   Changed values: `{"gates": {"identity": true, "schema": true, "tenant_policy": true, "cursor_current": true, "qa_clone": true}}`

2. One additive field arrives on a synthetic order.

   Changed values: `{"incoming": {"order_id": "O-42", "tenant": "acme", "coupon_code": "SAVE10"}}`

3. Record which controls passed; do not collapse them into one status.

   Changed values: `{"checks": ["identity", "schema", "tenant_policy", "cursor_current", "qa_clone"]}`

4. Publish only after every required control passes.

   Changed values: `{"publish": true, "result": "publish O-42"}`

[Full runnable example](examples/data-engineering.py).

Limits: This local JavaScript teaching model checks five booleans in a fixed sequence. It does not run AWS, Databricks, or Snowflake; validate IAM trust, privileges, editions/runtimes, schema inference, row-policy ownership, CDF/Stream retention, clone metadata, costs, and downstream contracts in authorized sandboxes. Vendor SQL/PySpark is sourced but unexecuted.

## Explore (remaining exploration time)

Toggle each gate. The parcel moves only as far as the first failed control; predict the stopping point before changing a switch.

Open data-engineering.html for the executable model.

Model limits: This local JavaScript teaching model checks five booleans in a fixed sequence. It does not run AWS, Databricks, or Snowflake; validate IAM trust, privileges, editions/runtimes, schema inference, row-policy ownership, CDF/Stream retention, clone metadata, costs, and downstream contracts in authorized sandboxes. Vendor SQL/PySpark is sourced but unexecuted.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day23/data-engineering.html">Day23</a>; product material added 2026-10-13.</p><p>A product lesson exists but no sandbox action ran. What is true?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Curriculum coverage exists; execution skill is unassessed. Delivery is not hands-on evidence.</p></details><p>Which retrieval response is strongest?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Choose a diagnostic and state confirming/disconfirming evidence. Diagnosis needs a falsifiable next observation.</p></details>

## Databricks: separate internal change capture from filtered serving · 9 minutes

Use a scoped external location, explicit schema policy, an internal CDF table, a separately filtered serving object, and a shallow QA clone. Automatic CDF does not support row-filtered tables; vendor commands are unexecuted.

## Snowflake: let policy follow the Stream read, then clone with policy context · 9 minutes

Use a scoped storage integration, governed COPY evolution, a fresh Stream, row-policy evaluation at read time, and a clone whose policy dependencies remain available. Vendor SQL is unexecuted.

## Compare and predict (2 minutes)

| Control | Databricks | Snowflake |
|---|---|---|
| Cloud identity | storage credential + external location | storage integration + stage |
| Drift | Auto Loader policy | COPY evolution gates |
| Tenant + changes | split CDF from filtered serving | policy applies to Stream reads |
| QA | shallow clone | zero-copy clone |

A Databricks design puts an automatic CDF and row filter on the same table. What should you do?

- Separate the internal CDF table from the filtered serving boundary
- Assume both features compose
- Replace IAM with the filter

<details><summary>Reveal after predicting</summary>

Separate the internal CDF table from the filtered serving boundary. Automatic CDF documents this composition limit.

</details>

A Snowflake Stream is current, but its cloned table's policy references an object that was not cloned. Safe?

- No; verify the policy dependency and access path before use
- Yes; clone means every dependency exists
- Yes; Streams bypass row policies

<details><summary>Reveal after predicting</summary>

No; verify the policy dependency and access path before use. Clone boundaries and policy dependencies must be checked explicitly.

</details>

## Certification connection

Consolidates external locations, schema evolution, row filters, change data feed, and shallow clones in one guarded release. Delivered coverage is not mastery. Consolidates storage integration, COPY evolution, row access policies, Streams, and zero-copy cloning. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks external locations](https://docs.databricks.com/aws/en/connect/unity-catalog/cloud-storage/manage-external-locations) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Databricks change data feed](https://docs.databricks.com/aws/en/tables/features/change-data-feed) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Databricks row filters](https://docs.databricks.com/aws/en/tables/row-and-column-filters) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Databricks table clones](https://docs.databricks.com/aws/en/tables/operations/clone) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Snowflake storage integrations](https://docs.snowflake.com/en/sql-reference/sql/create-storage-integration) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Snowflake row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Snowflake streams](https://docs.snowflake.com/en/user-guide/streams-intro) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Snowflake cloning considerations](https://docs.snowflake.com/en/user-guide/object-clone) — Living documentation; checked October 26, 2026; checked 2026-10-26.

## Quiz (4 minutes)

1. The new column is approved, but the S3 role can read every company bucket. Publish?
   - No; fix the identity/path scope first
   - Yes; schema approval covers IAM
   - Yes; a clone removes the risk

2. Why keep a durable consumer cursor?
   - So incremental processing can resume without guessing which changes were handled
   - To authorize tenant rows
   - To create cloud credentials

3. What is the biggest boundary in this consolidation?
   - The five features do not automatically compose or share identical semantics across products
   - Every clone is a backup
   - Row filtering replaces authorization

4. Which five controls exist in your current ingestion path, and where is each enforced?
5. Change one product assumption—retention, policy ownership, or clone type. Which stage fails first?

<details><summary>Answer key — attempt first</summary>

1. No; fix the identity/path scope first. Identity and schema are independent controls.

2. So incremental processing can resume without guessing which changes were handled. The cursor defines progress through a transient change source.

3. The five features do not automatically compose or share identical semantics across products. The architecture must respect product-specific composition limits.

</details>

## Sources

- [Databricks external locations](https://docs.databricks.com/aws/en/connect/unity-catalog/cloud-storage/manage-external-locations) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Databricks change data feed](https://docs.databricks.com/aws/en/tables/features/change-data-feed) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Databricks row filters](https://docs.databricks.com/aws/en/tables/row-and-column-filters) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Databricks table clones](https://docs.databricks.com/aws/en/tables/operations/clone) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Snowflake storage integrations](https://docs.snowflake.com/en/sql-reference/sql/create-storage-integration) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Snowflake row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Snowflake streams](https://docs.snowflake.com/en/user-guide/streams-intro) — Living documentation; checked October 26, 2026; checked 2026-10-26.
- [Snowflake cloning considerations](https://docs.snowflake.com/en/user-guide/object-clone) — Living documentation; checked October 26, 2026; checked 2026-10-26.
