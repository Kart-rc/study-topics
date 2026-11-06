# Deeper installment: explode the items without losing the order

Data engineering · Day46 · 30 minutes

Turn one parent array into child rows while preserving parent identity and choosing null-preserving behavior deliberately.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day32/data-engineering.html">Day32: One table, different rows: query-time row access policies</a></p><p>An east analyst has SELECT on the table. What does the row policy add?</p><details><summary>Recall first, then reveal the refresher</summary><p>It removes rows whose predicate is false. Object privileges allow the query; the row policy narrows its result.</p></details><p><a href="../Day4/data-engineering.html">Day4: Kafka transactions: make the output and offset one decision</a></p><p>The worker writes output, crashes before committing its input offset, then restarts without a transaction. What is likely?</p><details><summary>Recall first, then reveal the refresher</summary><p>The input is processed again and the output can duplicate. The committed position still points to the input, while the first output already exists.</p></details>

## Understand (4 minutes)

A packing slip has one order number and several item lines. If you cut off the item lines without copying the order number onto each one, the pieces become useless.

An explode or flatten operation turns each array element into a row. That changes cardinality: one parent can become many rows. An outer form can also keep a parent whose array is null by emitting one row with a null child.



Order O-10 has items A and B. Order O-11 has a null items field. A normal explode yields two rows, both for O-10. An outer explode yields those same two rows plus O-11, NULL. The extra row is useful only if “an order with no readable items” must remain visible for diagnosis or a later left-side count.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use array expansion when downstream work needs one row per nested child while retaining the parent key.

**Practical example.** A bronze order event contains an items array; silver needs one order-item row for SKU-level revenue and a visible exception for an order with no item array.

**How to decide.** Use ordinary expansion when null parents should disappear. Use outer expansion when parent preservation is part of the contract. Measure input parents, output children, and null-child rows so fan-out does not silently inflate aggregates.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The parent boxes visibly fan out into child rows, so the learner can see both cardinality growth and the one parent that disappears without outer semantics.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
orders=[{'order_id':'O-10','items':['A','B']},{'order_id':'O-11','items':None}]
normal=[{'order_id':o['order_id'],'item':item} for o in orders for item in (o['items'] or [])]
outer=[{'order_id':o['order_id'],'item':item} for o in orders for item in (o['items'] if o['items'] is not None else [None])]
normal_parents=len({r['order_id'] for r in normal}); outer_parents=len({r['order_id'] for r in outer}); outer_rows=len(outer)
```

1. Start with two parents: one two-item array and one null array.

   Changed values: `{"orders": [{"order_id": "O-10", "items": ["A", "B"]}, {"order_id": "O-11", "items": null}]}`

2. Normal expansion emits children only where elements exist.

   Changed values: `{"normal": [{"order_id": "O-10", "item": "A"}, {"order_id": "O-10", "item": "B"}]}`

3. Outer expansion emits one null child for the null array.

   Changed values: `{"outer": [{"order_id": "O-10", "item": "A"}, {"order_id": "O-10", "item": "B"}, {"order_id": "O-11", "item": null}]}`

4. Reconcile both row count and retained parent count.

   Changed values: `{"normal_parents": 1, "outer_parents": 2, "outer_rows": 3}`

[Full runnable example](examples/data-engineering.py).

Limits: The local model expands two fixed arrays. It does not parse VARIANT values, distinguish missing from JSON null, recurse through multiple arrays, model skew, shuffle cost, malformed children, permissions, warehouse size, or vendor execution.

## Explore (remaining exploration time)

Choose normal or outer behavior and inspect exactly which order-item rows survive. Predict the parent count and output count first.

Open data-engineering.html for the executable model.

Model limits: The local model expands two fixed arrays. It does not parse VARIANT values, distinguish missing from JSON null, recurse through multiple arrays, model skew, shuffle cost, malformed children, permissions, warehouse size, or vendor execution.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day28/data-engineering.html">Day28</a>; product material added 2026-10-18.</p><p>What must you inspect before pressing repair/retry?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Partial outputs and side effects of restarted tasks. A retry is safe only if repeated task effects are safe.</p></details><p>Which Snowflake identifier ties retry attempts to the original graph run?</p><details><summary>Recall first, then reveal the product refresher</summary><p>GRAPH_RUN_GROUP_ID. The retry shares the graph-run group and increments the attempt number.</p></details>

## Databricks: use a table-valued explode and keep the parent key · 9 minutes

Use a table-valued `explode` on modern runtimes and retain the parent key. `explode_outer` preserves a null collection with one null child. The SQL was not executed in Databricks.

## Snowflake: correlate each FLATTEN row back to its parent · 9 minutes

Correlate Snowflake `LATERAL FLATTEN` output to the parent alias. `OUTER => TRUE` preserves a zero-row expansion with a null-valued row. SQL was not executed.

## Compare and predict (2 minutes)

| Decision | Databricks | Snowflake |
|---|---|---|
| Expand | `explode` | `LATERAL FLATTEN` |
| Preserve outer parent | `explode_outer` | `OUTER => TRUE` |
| Position | `posexplode` | `INDEX` |

On a modern Databricks runtime, what is the recommended invocation shape?

- Use explode as a table reference
- Hide it in a string
- Use only the deprecated select-list form

<details><summary>Reveal after predicting</summary>

Use explode as a table reference. Databricks documents table-reference invocation for SQL and Runtime 12.2 LTS and above.

</details>

What must accompany Snowflake f.value in the child result?

- The parent key from the correlated source
- A new random order id
- Only the warehouse name

<details><summary>Reveal after predicting</summary>

The parent key from the correlated source. The lateral output needs its parent identity to remain meaningful.

</details>

## Certification connection

Data Transformation and Modeling: exploding arrays, preserving keys, and validating row grain. Structured and semi-structured data plus loading/transformation planning groups: lateral FLATTEN, outer behavior, and output columns. Planning groups only; no complete COF-C03 map claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks SQL explode](https://docs.databricks.com/aws/en/sql/language-manual/functions/explode) — Official documentation updated September 11, 2026; checked November 5, 2026; checked 2026-11-05.
- [Databricks SQL explode_outer](https://docs.databricks.com/aws/en/sql/language-manual/functions/explode_outer) — Official documentation; checked November 5, 2026; checked 2026-11-05.
- [Snowflake FLATTEN](https://docs.snowflake.com/en/sql-reference/functions/flatten) — Official SQL reference; checked November 5, 2026; checked 2026-11-05.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf) — Official guide for exam version May 4, 2026; rechecked November 5, 2026; checked 2026-11-05.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview rechecked November 5, 2026; full objective IDs and weights remain unverified; checked 2026-11-05.

## Quiz (4 minutes)

1. O-10 has two items and O-11 has a null array. What does outer expansion produce?
   - Three rows, including O-11 with a null child
   - Two rows and no O-11
   - One row per input file

2. Why copy order_id onto every child row?
   - To preserve the relationship after fan-out
   - To prevent all shuffles
   - To make every child unique automatically

3. What still needs a guard after expansion?
   - Fan-out counts and aggregate grain
   - Only the SQL spelling
   - The browser color

4. Which nested array in your platform should become a child table, and what is its correct grain?
5. Which parent-level measure could be double-counted after fan-out, and what reconciliation would catch it?

<details><summary>Answer key — attempt first</summary>

1. Three rows, including O-11 with a null child. Outer semantics preserve the null parent with one null child row.

2. To preserve the relationship after fan-out. The parent key is the join and grouping context for each emitted child.

3. Fan-out counts and aggregate grain. A many-child parent can multiply rows and double-count parent-level measures.

</details>

## Sources

- [Databricks SQL explode](https://docs.databricks.com/aws/en/sql/language-manual/functions/explode) — Official documentation updated September 11, 2026; checked November 5, 2026; checked 2026-11-05.
- [Databricks SQL explode_outer](https://docs.databricks.com/aws/en/sql/language-manual/functions/explode_outer) — Official documentation; checked November 5, 2026; checked 2026-11-05.
- [Snowflake FLATTEN](https://docs.snowflake.com/en/sql-reference/functions/flatten) — Official SQL reference; checked November 5, 2026; checked 2026-11-05.
