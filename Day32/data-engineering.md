# One table, different rows: query-time row access policies

Data engineering · Day32 · 30 minutes

Filter rows by the caller's identity without making a separate table per team.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day25/data-engineering.html">Day25: Share live data without copying it</a></p><p>The provider updates its table from v3 to v4. With access intact, what should a live-share reader query?</p><details><summary>Recall first, then reveal the refresher</summary><p>The current shared data, subject to platform refresh semantics. The share exposes provider-owned data rather than a detached export.</p></details><p><a href="../Day13/data-engineering.html">Day13: Two copies before success: Kafka&#x27;s ISR write gate</a></p><p>Only the leader remains in the ISR. With min.insync.replicas=2 and acks=all, what happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Kafka rejects the write. The current ISR has one member, below the required two, so an acks=all write is rejected.</p></details>

## Understand (4 minutes)

A hotel clerk may open the same booking system as a regional manager, but should see fewer rooms. The table does not change; the visible result changes with the caller.

A row policy is a predicate evaluated at query time. It does not grant table access by itself. First the caller needs ordinary object privileges; then the policy removes rows that are outside that caller's allowed region.



The table contains orders east-42, west-77, and east-99. The group east_analysts receives two east rows. west_analysts receives one west row. A governance administrator may receive all three. The physical rows are unchanged.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use row-level policy when many users query the same governed table but each user or role may see only a subset of rows.

**Practical example.** Regional finance teams share one orders table; east analysts must never receive west customer records.

**How to decide.** Choose a centralized policy when the rule repeats across many tables; use a table-level rule for narrow table-specific logic. Prefer separate datasets when legal or operational isolation requires a stronger physical boundary.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The same three row cards stay in place while the caller changes. Cards become visible or crossed out at the policy boundary, so identity-dependent results are concrete.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rows = [('east-42', 'east'), ('west-77', 'west'), ('east-99', 'east')]
caller_region = 'east'
visible = [order for order, region in rows if region == caller_region]
visible_count = len(visible)
```

1. Use one physical row set.

   Changed values: `{"rows": [["east-42", "east"], ["west-77", "west"], ["east-99", "east"]]}`

2. Represent the authenticated caller's authorized region.

   Changed values: `{"caller_region": "east"}`

3. Apply the policy predicate before results leave the query boundary.

   Changed values: `{"visible": ["east-42", "east-99"]}`

4. The east caller sees two of three rows.

   Changed values: `{"visible_count": 2}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser filters three synthetic rows locally. It does not execute Unity Catalog or Snowflake, prove that identity groups are configured correctly, model policy-owner privileges, prevent inference through every query, or measure policy cost. Vendor SQL is sourced but not executed.

## Explore (remaining exploration time)

Switch the active identity. Predict which order cards survive the policy before revealing the result.

Open data-engineering.html for the executable model.

Model limits: The browser filters three synthetic rows locally. It does not execute Unity Catalog or Snowflake, prove that identity groups are configured correctly, model policy-owner privileges, prevent inference through every query, or measure policy cost. Vendor SQL is sourced but not executed.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day18/data-engineering.html">Day18</a>; product material added 2026-10-08.</p><p>Databricks: SELECT and USE CATALOG exist, but USE SCHEMA is absent. What repairs the modeled read?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Grant USE SCHEMA on study18.sales to orders_readers. The schema gate is missing. Compute size and an unrelated table grant do not supply it. Other effective grants are intentionally excluded in this fixture.</p></details><p>Snowflake: the active role has table and container grants but lacks warehouse USAGE. What is the narrow repair?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Grant USAGE on study_wh to orders_reader. This fresh table query needs usable compute. Warehouse USAGE supplies the missing permission; admin access is unnecessarily broad and retention is unrelated.</p></details>

## Databricks: Unity Catalog row filter UDF · 9 minutes

Databricks uses a row-filter UDF attached to a Unity Catalog table. Rows for which the function returns false are excluded. Prefer ABAC for repeatable tag-driven coverage across many tables. SQL is unexecuted.

## Snowflake: schema-level row access policy · 9 minutes

Snowflake row access policies are reusable schema objects attached to tables or views. Their boolean expression controls which rows appear at query time. They do not independently block inserts or grant object privileges. SQL is unexecuted.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Unit | UDF or ABAC policy | schema-level row policy |
| Identity | account groups | roles/context |
| Scale | ABAC tags | reusable/tag policies |
| Limit | no base grant | no insert/DML prevention |

A new governed table needs the same tagged region rule in Databricks. Which approach reduces missed per-table attachment?

- A centralized ABAC policy
- A local browser filter
- A copy per user

<details><summary>Reveal after predicting</summary>

A centralized ABAC policy. ABAC can apply policies automatically based on governed tags.

</details>

A Snowflake row policy hides west rows from an east role. What must still be controlled separately?

- Object and DML privileges
- Whether SQL has rows
- The role's display name

<details><summary>Reveal after predicting</summary>

Object and DML privileges. Visibility policies do not replace ordinary authorization.

</details>

## Certification connection

Unity Catalog row filters, group-aware predicates, ABAC scaling choice, privileges and performance boundary. Delivered coverage is not mastery. Row access policy object, runtime role context, mapping tables, privileges and DML boundary. Full COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks row filters and column masks](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks) — Updated October 9, 2026; checked 2026-10-22.
- [Databricks ROW FILTER clause](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-row-filter) — Updated September 11, 2026; checked 2026-10-22.
- [Snowflake row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) — Living documentation; checked 2026-10-22.
- [Snowflake CREATE ROW ACCESS POLICY](https://docs.snowflake.com/en/sql-reference/sql/create-row-access-policy) — Living documentation; checked 2026-10-22.

## Quiz (4 minutes)

1. An east analyst has SELECT on the table. What does the row policy add?
   - It removes rows whose predicate is false
   - It creates a new physical table
   - It grants SELECT

2. Why test the policy as multiple identities?
   - The same SQL must yield the intended different row sets
   - Policies run only for admins
   - Identity never affects evaluation

3. What is outside a row policy's boundary?
   - Physical isolation and every side channel
   - Filtering SELECT results
   - Using a row attribute

4. How would you test that a new region cannot see another region's rows after a mapping change?
5. When would you choose separate accounts or catalogs instead of a row policy?

<details><summary>Answer key — attempt first</summary>

1. It removes rows whose predicate is false. Object privileges allow the query; the row policy narrows its result.

2. The same SQL must yield the intended different row sets. The security property is identity-dependent output.

3. Physical isolation and every side channel. A logical query-time filter is not a separate account or storage boundary.

</details>

## Sources

- [Databricks row filters and column masks](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks) — Updated October 9, 2026; checked 2026-10-22.
- [Databricks manual row-filter syntax](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/manually-apply) — Updated October 8, 2026; checked 2026-10-22.
- [Snowflake row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) — Living documentation; checked 2026-10-22.
- [Snowflake CREATE ROW ACCESS POLICY](https://docs.snowflake.com/en/sql-reference/sql/create-row-access-policy) — Living documentation; checked 2026-10-22.
