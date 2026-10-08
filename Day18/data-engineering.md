# A table grant is only one key: follow the access path

Data engineering · Day18 · 30 minutes

Diagnose a blocked read without giving an analyst administrator access.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day9/data-engineering.html">Day9: Kafka&#x27;s consumer protocol: reassign incrementally, not behind a global barrier</a></p><p>One member changes in a large group. What is the core advantage of incremental reconciliation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Partitions whose ownership is unchanged can continue processing. The protocol narrows disruption to ownership that must move instead of imposing a group-wide synchronization barrier.</p></details><p><a href="../Day3/data-engineering.html">Day3: Adaptive skew joins: split the straggler, not the whole job</a></p><p>Median 43.5 MB, factor 5, threshold 256 MB, partition 240 MB. Is it skewed by this rule?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, because it does not also exceed 256 MB. The partition must exceed both boundaries. It clears 217.5 MB but not 256 MB.</p></details>

## Understand (4 minutes)

A visitor has a key to a filing cabinet, but cannot enter the building. Giving them a bigger cabinet key will not help. Reading a governed table has the same shape: permission to reach its containers and permission to read its data are separate.

Today, analyst Maya needs the orders table, not payroll. We will find the missing permission, add only that permission, then prove payroll still stays closed. Least privilege means granting the access needed for the task, with no unrelated powers.



Our synthetic database has two orders, worth 20 and 30. The intended query returns 50. An access denial returns no result; it does not mean the sum is zero. The important question is not “Does Maya have SELECT somewhere?” It is “Does her effective identity have every required permission on this path?”

Use the product diagrams below to watch that path open one gate at a time. The access checks are simplified conjunctions, not a claim about the order in which either engine reports errors.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when a new analyst or pipeline can see an object name but cannot query it, or an access request proposes a broad administrator role.

**Practical example.** A finance analyst needs read-only sales totals in a shared data platform. The platform team grants a named group or role access to the orders table and its containers.

**How to decide.** Start with a dedicated reader identity and inspect its effective grants. Avoid adding all privileges to cure one missing container grant. Validate both the allowed query and a denied neighboring table.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

Nested boundaries show that a table grant can exist inside a closed parent. The requested table changes independently of the parent gate.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
grants = {"container": False, "orders_select": True}
result = None
allowed = all(grants.values())
grants["container"] = True
allowed = all(grants.values())
result = 20 + 30 if allowed else None
```

1. The table grant exists, but the parent gate is closed.

   Changed values: `{"grants": {"container": false, "orders_select": true}, "result": null}`

2. Both permissions are required; the result remains absent.

   Changed values: `{"allowed": false}`

3. Grant the missing permission. The original orders now sum to 50.

   Changed values: `{"grants": {"container": true, "orders_select": true}, "result": 50, "allowed": true}`

[Full runnable example](examples/data-engineering.py).

Limits: Original Python truth-table example; neither vendor authorization engine is called.

## Explore (remaining exploration time)

Predict whether SELECT alone is enough. Add the container permission, then switch the requested table to payroll. Explain why it should remain blocked.

Open data-engineering.html for the executable model.

Model limits: This browser model runs JavaScript, not a database. It assumes authentication, compute access and the outer container are already available; it omits ownership, inherited grants, row policies and network rules.


</details>

## Databricks: open the catalog, schema and table gates · 9 minutes

Use case. Maya belongs to the account group orders_readers. She needs one managed Unity Catalog table for a sales report. She does not need to create tables or read payroll.

Before a real lab: use an authorized sandbox with a Unity Catalog-enabled workspace, a pre-existing catalog study18, schema sales, and tables orders(amount) and payroll. An owner prepares orders with two synthetic rows, 20 and 30. Use a dedicated reader with no other effective data grants; owners and broad group grants would invalidate the denial test. The reader also needs workspace access and permission to run queries on the chosen SQL warehouse, such as CAN USE. That compute permission is separate from the three data grants below. Warehouse use can incur charges.

9-minute route: first minute: recall or predict whether SELECT alone suffices; next three: follow the nested boundaries; next three: step through the SQL and test the missing-grant case; final two: explain the payroll denial and remaining assumptions.

The SQL is not executed in Databricks. The buttons execute a local JavaScript authorization model. Statements 1–3 represent an authorized grant administrator. Statement 4 is run in a separate reader session as Maya; the model does not impersonate a real account.


```sql
GRANT SELECT ON TABLE study18.sales.orders TO `orders_readers`;
GRANT USE CATALOG ON CATALOG study18 TO `orders_readers`;
GRANT USE SCHEMA ON SCHEMA study18.sales TO `orders_readers`;
SELECT SUM(amount) FROM study18.sales.orders;
```

Step outcomes: SELECT only → blocked; add USE CATALOG → still blocked; add USE SCHEMA → path open; reader SELECT → expected sum 50. Omit USE SCHEMA and the read stays denied. These are local-model predictions, not vendor execution results.

Failure and fix. SELECT alone leaves two closed container gates. Add the narrow USE grants. In the model all three gates are open after statement 3; statement 4 produces the sum. The SQL engine’s actual error-reporting order is not represented.

Boundary. USE CATALOG and USE SCHEMA allow reaching the table; neither grants its SELECT. Revoking one direct table grant may not remove effective access if another group or inherited grant supplies it. Use an isolated reader for this demonstration and inspect real effective grants before drawing conclusions.

Optional: why the grant’s scope mattersUnity Catalog can inherit applicable privileges from a catalog or schema. A schema-wide SELECT can reach more tables than the one-table need here. That may be intentional for a curated data product; it is broader than this request. This lesson does not cover ownership transfer, row filters, masks or external-location permissions.



## Snowflake: give the active role both data and compute access · 9 minutes

Use case. The same analyst needs the same two-row sales total. Here privileges are granted to a Snowflake account role, orders_reader. The user must be able to activate that role; simply creating a role is not enough.

Before a real lab: an authorized sandbox owner creates database study18, schema sales, tables orders(amount) and payroll, and puts 20 and 30 in orders. An authorized administrator creates orders_reader, grants it to the test user, and makes an existing study_wh available. Use no inherited or PUBLIC privileges that bypass the intended denial test. This example relies on ordinary tables and a virtual warehouse, not edition-specific masking. A resumed warehouse consumes credits; use an agreed small sandbox with cost controls.

9-minute route: first minute: predict which role and warehouse are used; next three: inspect the permission matrix; next three: advance the SQL and remove the warehouse grant; final two: compare the failure with the Databricks case.

The SQL is not executed in Snowflake. Buttons run a local JavaScript teaching model. Steps 1–4 are grant-administrator actions. Step 5 starts the reader session: activate the already assigned role, disable secondary roles for this isolated test, and select its warehouse. Step 6 reads the table.


```sql
GRANT SELECT ON TABLE study18.sales.orders TO ROLE orders_reader;
GRANT USAGE ON DATABASE study18 TO ROLE orders_reader;
GRANT USAGE ON SCHEMA study18.sales TO ROLE orders_reader;
GRANT USAGE ON WAREHOUSE study_wh TO ROLE orders_reader;
USE ROLE orders_reader;
USE SECONDARY ROLES NONE;
USE WAREHOUSE study_wh;
SELECT SUM(amount) FROM study18.sales.orders;
```

Step outcomes: table grant → missing containers; database/schema grants → missing compute; warehouse grant → role can use compute; activate role and warehouse → prerequisites ready; reader SELECT → expected sum 50. Omit warehouse USAGE and the reader cannot use it. These are local-model predictions, not vendor execution results.

Failure and fix. A table SELECT plus database and schema USAGE still does not provide warehouse access for this fresh table query. Add warehouse USAGE to the intended role and activate it in the reader session. In the missing-warehouse branch, USE WAREHOUSE itself may fail; the model shows the unmet requirement, not an exact vendor error string.

Boundary. We choose USAGE as the narrow container permission for this reader. Real Snowflake access can include role inheritance, secondary roles, ownership and other qualifying container privileges. A database role cannot hold warehouse privileges in the way this account-role example does. This is not a complete policy evaluator.

Optional: objects and compute are separateThe warehouse executes the query; it does not contain the database. Our matrix deliberately gives warehouse access its own row rather than drawing the table inside the warehouse. Increasing warehouse size does not repair a missing table grant.



## Compare and predict (2 minutes)

| Requirement | Databricks | Snowflake |
|---|---|---|
| Reader identity | Account group | Active account role |
| Containers | USE CATALOG, USE SCHEMA | Database and schema USAGE |
| Table | SELECT | SELECT |
| Compute | SQL warehouse ACL, assumed available | Warehouse USAGE, modeled |

The same business need does not imply identical identity or compute permission mechanisms.

Databricks: SELECT and USE CATALOG exist, but USE SCHEMA is absent. What repairs the modeled read?

- Grant USE SCHEMA on study18.sales to orders_readers
- Increase warehouse size
- Grant SELECT on payroll

<details><summary>Reveal after predicting</summary>

Grant USE SCHEMA on study18.sales to orders_readers. The schema gate is missing. Compute size and an unrelated table grant do not supply it. Other effective grants are intentionally excluded in this fixture.

</details>

Snowflake: the active role has table and container grants but lacks warehouse USAGE. What is the narrow repair?

- Activate an unrelated administrator role
- Grant USAGE on study_wh to orders_reader
- Increase the table retention period

<details><summary>Reveal after predicting</summary>

Grant USAGE on study_wh to orders_reader. This fresh table query needs usable compute. Warehouse USAGE supplies the missing permission; admin access is unnecessarily broad and retention is unrelated.

</details>

## Certification connection

Focused governance/security practice: table-read grants, required container privileges and compute separation. Guide version May 4, 2026; not full domain coverage. Focused account/warehouse/access planning group: active account role and narrow data/compute grants. Full C03 objective IDs and weights remain unverified; this is not a complete blueprint mapping. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Unity Catalog privileges](https://docs.databricks.com/aws/en/data-governance/unity-catalog/access-control/privileges-reference) — Privilege model 1.0; updated 2026-10-08; checked 2026-10-08.
- [Databricks SQL warehouse ACLs](https://docs.databricks.com/aws/en/security/auth/access-control/) — Living reference; checked 2026-10-08; checked 2026-10-08.
- [Snowflake access-control configuration](https://docs.snowflake.com/en/user-guide/security-access-control-configure) — Living reference; no publication date stated; checked 2026-10-08.
- [Snowflake access-control overview](https://docs.snowflake.com/en/user-guide/security-access-control-overview) — Living reference; no publication date stated; checked 2026-10-08.
- [Databricks: manage privileges](https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/) — Living reference; checked 2026-10-08; checked 2026-10-08.
- [Snowflake: USE SECONDARY ROLES](https://docs.snowflake.com/en/sql-reference/sql/use-secondary-roles) — Living reference; checked 2026-10-08; checked 2026-10-08.

## Quiz (4 minutes)

1. Maya has SELECT on orders but lacks its required container permission. What happens?
   - The read is denied
   - The result is zero
   - The read succeeds

2. Which is the best repair for the missing container grant?
   - Give administrator access
   - Grant the required container permission to the intended reader
   - Grant write access to orders

3. The modeled query works. What have you proved?
   - Every user can query it
   - Production security is complete
   - Only this modeled identity and access path succeed

4. Describe a positive and a negative access test for Maya.
5. What inherited privilege could make your negative test unexpectedly succeed?

<details><summary>Answer key — attempt first</summary>

1. The read is denied. SELECT protects the table operation; it does not replace required container access. A denied query is not an empty result.

2. Grant the required container permission to the intended reader. The narrow missing permission repairs this case. Admin access adds unrelated powers; write access does not open a parent container.

3. Only this modeled identity and access path succeed. A small positive test does not prove all identities or policies are correct. Add negative tests and inspect real effective grants.

</details>

## Sources

- [Unity Catalog privilege reference](https://docs.databricks.com/aws/en/data-governance/unity-catalog/access-control/privileges-reference) — Updated 2026-10-08; privilege model 1.0; checked 2026-10-08.
- [Snowflake: configuring access control](https://docs.snowflake.com/en/user-guide/security-access-control-configure) — Living documentation; publication date not stated; checked 2026-10-08.
