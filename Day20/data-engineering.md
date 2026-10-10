# One receipt becomes two item rows: flatten nested data deliberately

Data engineering · Day20 · 30 minutes

Keep the flexible original payload while projecting predictable rows for analytics.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day5/data-engineering.html">Day5: Iceberg partition evolution: new layout, same query</a></p><p>A two-hour query targets data written before the daily-to-hourly cutover. What does the toy planner scan?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old daily file using the old spec. Old data remains in its original layout and is planned with the metadata for that layout.</p></details><p><a href="../Day16/data-engineering.html">Day16: Fewer tiny tasks: Spark AQE coalesces shuffle partitions</a></p><p>With a 32 MB target, which partitions merge first?</p><details><summary>Recall first, then reveal the refresher</summary><p>8, 12, and 3 MB. The first three adjacent partitions total 23 MB, still below the toy target.</p></details>

## Understand (4 minutes)

A paper receipt has one header and several item lines. JSON often uses the same shape: one order contains an items array. A semi-structured VARIANT keeps that nested shape. Flattening turns each array element into a correlated row.

Parse once, preserve the raw record, then project stable columns such as order_id, sku, and qty.



Order R7 contains two items: two units of SKU A and one of SKU B. Switching to item rows repeats R7 while emitting two child rows. That repetition preserves the parent-child relationship.

A malformed payload is different from an empty array. Strict parsing stops it; tolerant parsing can quarantine it, but null must not silently mean “zero items.”



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when producers add optional fields or nested arrays faster than a rigid ingestion schema can evolve.

**Practical example.** Land order JSON in a bronze table, retain the original VARIANT, then flatten items into a silver line-item table.

**How to decide.** Use VARIANT for genuine flexibility and typed columns for stable high-value fields. Flatten only needed paths because row counts can grow quickly.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The visual changes one parent into two correlated children and keeps malformed input separate from an empty array.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
receipt={"order_id":"R7","items":[{"sku":"A","qty":2},{"sku":"B","qty":1}]}
rows=[{"order_id":receipt["order_id"],**item} for item in receipt["items"]]
row_count=len(rows)
unit_count=sum(r["qty"] for r in rows)
```

1. Define one nested order.

   Changed values: `{"receipt": {"order_id": "R7", "items": [{"sku": "A", "qty": 2}, {"sku": "B", "qty": 1}]}}`

2. Emit one correlated row per item.

   Changed values: `{"rows": [{"order_id": "R7", "sku": "A", "qty": 2}, {"order_id": "R7", "sku": "B", "qty": 1}]}`

3. Count child rows separately from quantity.

   Changed values: `{"row_count": 2, "unit_count": 3}`

[Full runnable example](examples/data-engineering.py).

Limits: Executed local Python only; no vendor SQL ran.

## Explore (remaining exploration time)

Predict the row count for R7. Switch between nested, flattened, and malformed states; explain what each preserves.

Open data-engineering.html for the executable model.

Model limits: The browser uses one hand-authored receipt. It does not parse JSON, infer schema, run a distributed plan, or reproduce product errors.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day18/data-engineering.html">Day18</a>; product material added 2026-10-08.</p><p>Databricks: SELECT and USE CATALOG exist, but USE SCHEMA is absent. What repairs the modeled read?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Grant USE SCHEMA on study18.sales to orders_readers. The schema gate is missing. Compute size and an unrelated table grant do not supply it. Other effective grants are intentionally excluded in this fixture.</p></details><p>Snowflake: the active role has table and container grants but lacks warehouse USAGE. What is the narrow repair?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Grant USAGE on study_wh to orders_reader. This fresh table query needs usable compute. Warehouse USAGE supplies the missing permission; admin access is unnecessarily broad and retention is unrelated.</p></details>

## Databricks: parse VARIANT, then explode only items · 9 minutes

Authorized DBR 15.4 LTS+ sandbox; SQL unexecuted.

```sql
CREATE TABLE study20.bronze_orders (raw VARIANT);
INSERT INTO study20.bronze_orders SELECT parse_json('{"order_id":"R7","items":[{"sku":"A","qty":2},{"sku":"B","qty":1}]}');
SELECT raw:order_id::STRING, item.value:sku::STRING, item.value:qty::INT FROM study20.bronze_orders, LATERAL variant_explode(raw:items) item;
```

The model stores one R7 row and emits two child rows. Preserve malformed raw input; VARIANT has operation limits.

## Snowflake: correlate VARIANT with LATERAL FLATTEN · 9 minutes

Authorized Snowflake sandbox with active warehouse; SQL unexecuted.

```sql
CREATE TABLE study20.bronze_orders (raw VARIANT);
INSERT INTO study20.bronze_orders SELECT PARSE_JSON('{"order_id":"R7","items":[{"sku":"A","qty":2},{"sku":"B","qty":1}]}');
SELECT raw:order_id::STRING, item.value:sku::STRING, item.value:qty::INT FROM study20.bronze_orders, LATERAL FLATTEN(input => raw:items) item;
```

The model stores one R7 row and emits two item rows. Parse failure, SQL NULL, and empty array are distinct.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Flexible value | VARIANT | VARIANT |
| Parse | parse_json | PARSE_JSON |
| Child rows | variant_explode | LATERAL FLATTEN |
| Tolerant parse | try_parse_json | TRY_PARSE_JSON |

Databricks: R7 has two item objects. variant_explode emits?

- One parent
- Two children correlated with R7
- Three rows from qty

<details><summary>Reveal after predicting</summary>

Two children correlated with R7. It counts elements, not units.

</details>

Snowflake: TRY_PARSE_JSON returns SQL NULL. Meaning?

- Definitely empty items
- Parsing failed or input was NULL; handle explicitly
- Already flattened

<details><summary>Reveal after predicting</summary>

Parsing failed or input was NULL; handle explicitly. Do not collapse malformed input into empty business data.

</details>

## Certification connection

Focused VARIANT ingestion and projection; not complete domain coverage. Focused VARIANT and FLATTEN planning groups; full C03 objective IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks VARIANT](https://docs.databricks.com/aws/en/semi-structured/variant) — Updated 2026-09-11; checked 2026-10-10.
- [Databricks parse_json](https://docs.databricks.com/aws/en/sql/language-manual/functions/parse_json) — Updated 2026-09-11; checked 2026-10-10.
- [Snowflake semi-structured queries](https://docs.snowflake.com/en/user-guide/querying-semistructured) — Living docs; checked 2026-10-10.
- [Snowflake FLATTEN](https://docs.snowflake.com/en/sql-reference/functions/flatten) — Living docs; checked 2026-10-10.

## Quiz (4 minutes)

1. R7 has two objects in items. How many item rows should it emit?
   - One
   - Two
   - Three

2. Tolerant parsing returns null. What is safe?
   - Assume no items
   - Treat it as a parse/NULL state requiring explicit handling
   - Assume valid

3. Why keep raw VARIANT after typed projection?
   - Guaranteed speed
   - Controlled reprocessing and audit of unprojected fields
   - No governance

4. Which fields become typed silver columns first?
5. How will parse failures remain replayable?

<details><summary>Answer key — attempt first</summary>

1. Two. Flatten counts array elements, not total quantity.

2. Treat it as a parse/NULL state requiring explicit handling. Parse failure and an empty array are distinct.

3. Controlled reprocessing and audit of unprojected fields. Raw data supports later projection but does not replace contracts.

</details>

## Sources

- [Databricks: query VARIANT data](https://docs.databricks.com/aws/en/semi-structured/variant) — Updated 2026-09-11; checked 2026-10-10.
- [Snowflake: query semi-structured data](https://docs.snowflake.com/en/user-guide/querying-semistructured) — Living docs; checked 2026-10-10.
