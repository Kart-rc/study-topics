# Mask the value at query time—do not make a second, stale copy

Data engineering · Day48 · 30 minutes

Choose query-time column masking for governed access and compare how Databricks and Snowflake attach policy to a column.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day33/data-engineering.html">Day33: Open the S3 door without handing out AWS keys</a></p><p>The caller has a platform grant and the path is finance, but AWS does not trust the platform identity. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>The read is denied at role assumption. Every link must allow the request; a platform grant cannot replace the AWS trust policy.</p></details><p><a href="../Day5/data-engineering.html">Day5: Iceberg partition evolution: new layout, same query</a></p><p>A two-hour query targets data written before the daily-to-hourly cutover. What does the toy planner scan?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old daily file using the old spec. Old data remains in its original layout and is planned with the metadata for that layout.</p></details>

## Understand (4 minutes)

A hotel receptionist may see the last four digits of a guest's card while the fraud team sees the full value. The row is the same; the visible value changes with the viewer.

Dynamic column masking evaluates a policy when a query reads the protected column. The stored value remains unchanged. That centralizes policy and avoids an independently refreshed “safe” copy, but every path must query through the governed object.



The stored email is alex@example.com. A privileged incident responder sees the full value; an analyst sees a***@example.com. A policy bug that returns NULL for an unknown role can silently break joins, so the default branch must be deliberate and tests must cover every role class.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use dynamic masking when multiple roles need the same governed table but should see different representations of a sensitive column.

**Practical example.** A customer-360 table serves support, fraud, and analytics; only fraud may see full email and phone values.

**How to decide.** Prefer one query-time policy when access is role- or attribute-dependent and all reads pass through the governed platform. Use irreversible tokenization or a physically separate dataset when data must remain protected outside that control plane.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

One stored value flows through visibly different policy branches into three role-specific results. The diagram makes the control boundary—and the default branch—concrete.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
stored='alex@example.com'; roles=['fraud','analyst','unknown']
def mask(role): return stored if role=='fraud' else 'a***@example.com' if role=='analyst' else '***'
visible={role:mask(role) for role in roles}
result={'stored':stored,'visible':visible}
```

1. Keep one stored value and three viewer classes.

   Changed values: `{"stored": "alex@example.com", "roles": ["fraud", "analyst", "unknown"]}`

2. Apply a fail-closed policy branch at read time.

   Changed values: `{}`

3. The same row produces role-specific query results.

   Changed values: `{"visible": {"fraud": "alex@example.com", "analyst": "a***@example.com", "unknown": "***"}}`

4. The stored value remains unchanged.

   Changed values: `{"result": {"stored": "alex@example.com", "visible": {"fraud": "alex@example.com", "analyst": "a***@example.com", "unknown": "***"}}}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser and Python trace are local policy models, not Databricks or Snowflake authorization engines. They omit privileges, group/role hierarchy, ABAC tags, view interactions, policy ownership, joins, optimizer behavior, external access, audit logs, editions, and performance.

## Explore (remaining exploration time)

Switch roles and policy defaults. Predict the returned value before revealing which branch executed.

Open data-engineering.html for the executable model.

Model limits: The browser and Python trace are local policy models, not Databricks or Snowflake authorization engines. They omit privileges, group/role hierarchy, ABAC tags, view interactions, policy ownership, joins, optimizer behavior, external access, audit logs, editions, and performance.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day27/data-engineering.html">Day27</a>; product material added 2026-10-17.</p><p>What should cross the source/target boundary?</p><details><summary>Recall first, then reveal the product refresher</summary><p>One ranked winner per business key. Both products are safer when MERGE receives one deterministic source row per key.</p></details><p>Snowflake strict nondeterministic-merge checking errors. Best fix?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Deduplicate/rank the source by the business rule. Define the winner instead of disabling the guardrail.</p></details>

## Databricks: a Unity Catalog SQL UDF becomes the column mask · 9 minutes

Create a Unity Catalog SQL UDF and attach it with `ALTER COLUMN ... SET MASK`. Use ABAC when one policy must govern many tables. SQL not run in Databricks.

## Snowflake: a schema-level masking policy is attached to a matching column type · 9 minutes

Create a schema-level masking policy, then attach it to a matching table/view column. Dynamic Data Masking requires Enterprise Edition or higher. SQL not run in Snowflake.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Policy object | SQL UDF or ABAC | Schema-level masking policy |
| Attach | `SET MASK` | `SET MASKING POLICY` |
| Context | User/group | Role/context |
| Limit | Query-time boundary | Enterprise feature; query-time boundary |

Which Databricks mechanism scales one mask rule across many tagged tables?

- ABAC policy
- A copied redacted table
- A broadcast hint

<details><summary>Reveal after predicting</summary>

ABAC policy. Databricks recommends ABAC for consistent policy across many tables.

</details>

What does Snowflake masking preserve?

- The stored value while rewriting query-visible values
- Only masked values on disk
- A second table for each role

<details><summary>Reveal after predicting</summary>

The stored value while rewriting query-visible values. Dynamic Data Masking evaluates policy at query runtime.

</details>

## Certification connection

Databricks Intelligence Platform and governance/security: Unity Catalog column masks, UDF attachment, ABAC scaling, role/group context, and query-boundary limits. Account Access and Security plus Data Protection and Data Sharing planning groups: dynamic masking policies, segregation of duties, role context, edition limit, and query-time enforcement. Planning groups only; no complete COF-C03 objective map claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks row filters and column masks](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks) — Official Databricks documentation; checked November 8, 2026; checked 2026-11-08.
- [Databricks manual column masks](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/manually-apply) — Official Databricks documentation; checked November 8, 2026; checked 2026-11-08.
- [Snowflake Dynamic Data Masking](https://docs.snowflake.com/en/user-guide/security-column-ddm-intro) — Official Snowflake documentation; checked November 8, 2026; checked 2026-11-08.
- [Snowflake CREATE MASKING POLICY](https://docs.snowflake.com/en/sql-reference/sql/create-masking-policy) — Official Snowflake SQL reference; checked November 8, 2026; checked 2026-11-08.

## Quiz (4 minutes)

1. What does dynamic masking change?
   - The value returned at query time
   - The stored value for every user
   - The number of rows

2. Why is an unknown-role default important?
   - A missing branch can expose data or break consumers
   - It changes physical partitioning
   - It creates a new table

3. When is masking alone insufficient?
   - When data leaves the governed query boundary and must remain protected
   - When two roles share a table
   - When SQL contains a projection

4. Which column in your platform needs role-dependent representation rather than row denial?
5. What is the safest default for a role the policy does not recognize?

<details><summary>Answer key — attempt first</summary>

1. The value returned at query time. Column masking transforms the visible value while preserving the stored data.

2. A missing branch can expose data or break consumers. Fail-closed behavior and explicit compatibility are part of policy design.

3. When data leaves the governed query boundary and must remain protected. Exported plaintext is no longer protected by a query-time policy.

</details>

## Sources

- [Databricks row filters and column masks](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks) — Official Databricks documentation; checked November 8, 2026; checked 2026-11-08.
- [Databricks manual column masks](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/manually-apply) — Official Databricks documentation; checked November 8, 2026; checked 2026-11-08.
- [Snowflake Dynamic Data Masking](https://docs.snowflake.com/en/user-guide/security-column-ddm-intro) — Official Snowflake documentation; checked November 8, 2026; checked 2026-11-08.
- [Snowflake CREATE MASKING POLICY](https://docs.snowflake.com/en/sql-reference/sql/create-masking-policy) — Official Snowflake SQL reference; checked November 8, 2026; checked 2026-11-08.
