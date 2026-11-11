# One governed order pipeline must pass every gate—not five isolated demos

Data engineering · Day50 · 30 minutes

Consolidate ingestion rescue, array expansion, join planning, masking, and workload identity into one auditable Databricks/Snowflake delivery path.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day34/data-engineering.html">Day34: A clone starts shared; changed data becomes its own</a></p><p>A zero-copy clone is created and no rows change. What is copied initially?</p><details><summary>Recall first, then reveal the refresher</summary><p>Metadata references; existing data storage is shared. The clone begins by sharing existing immutable storage.</p></details><p><a href="../Day6/data-engineering.html">Day6: Kafka tiered storage: retention is not local disk</a></p><p>A consumer rewinds 24 hours while local retention is six hours and overall retention is seven days. Where is the segment in this model?</p><details><summary>Recall first, then reveal the refresher</summary><p>Remote tier. The offset remains within overall retention but lies beyond the local hot window.</p></details>

## Understand (4 minutes)

A restaurant does not call dinner successful because the ingredients arrived. The order must pass receiving, preparation, assembly, privacy, and delivery.

Our synthetic order pipeline has the same chain: a secretless EKS workload authenticates; malformed rows remain inspectable; valid orders expand into item rows; a small product lookup enriches them; customer email is masked for analysts. Every gate must preserve evidence for the next one.



File orders-50.json contains order o-50 with two items and one malformed record. The pipeline should publish two enriched item rows, retain one error record, and show ***@example.com to the analyst. A valid identity without table grants must still stop before ingestion.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use an end-to-end consolidation case when individual features work but you need evidence that their boundaries compose safely.

**Practical example.** An EKS order service loads semi-structured files, preserves errors, explodes items, enriches from a 12 MB product table, and publishes an analyst-safe view.

**How to decide.** Run the smallest representative case that crosses identity, data quality, transformation, performance, and governance. A unit demo is simpler when only one boundary changed.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

A five-gate pipeline shows the first failed control and the evidence that survives at each stage.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
raw=[{'id':'o-50','email':'ana@example.com','items':[{'sku':'A','qty':1},{'sku':'B','qty':2}]},{'id':None,'raw':'{bad'}]
good=[r for r in raw if r.get('id')]; errors=[r for r in raw if not r.get('id')]
items=[{'order_id':r['id'],'email':r['email'],'pos':i,'sku':x['sku'],'qty':x['qty']} for r in good for i,x in enumerate(r['items'])]
products={'A':'adapter','B':'battery'}; published=[{**x,'product':products[x['sku']],'email':'***@example.com'} for x in items]; result={'good':len(good),'errors':len(errors),'published':len(published),'positions':[x['pos'] for x in published]}
```

1. Receive one valid order and one malformed synthetic record.

   Changed values: `{"raw": [{"id": "o-50", "email": "ana@example.com", "items": [{"sku": "A", "qty": 1}, {"sku": "B", "qty": 2}]}, {"id": null, "raw": "{bad"}]}`

2. Keep usable and inspectable paths separate.

   Changed values: `{"good": [{"id": "o-50", "email": "ana@example.com", "items": [{"sku": "A", "qty": 1}, {"sku": "B", "qty": 2}]}], "errors": [{"id": null, "raw": "{bad"}]}`

3. Expand items while preserving order id and position.

   Changed values: `{"items": [{"order_id": "o-50", "email": "ana@example.com", "pos": 0, "sku": "A", "qty": 1}, {"order_id": "o-50", "email": "ana@example.com", "pos": 1, "sku": "B", "qty": 2}]}`

4. Join the small lookup and apply the analyst-facing mask.

   Changed values: `{"products": {"A": "adapter", "B": "battery"}, "published": [{"order_id": "o-50", "email": "***@example.com", "pos": 0, "sku": "A", "qty": 1, "product": "adapter"}, {"order_id": "o-50", "email": "***@example.com", "pos": 1, "sku": "B", "qty": 2, "product": "battery"}], "result": {"good": 1, "errors": 1, "published": 2, "positions": [0, 1]}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local Python and JavaScript models use three synthetic rows and arithmetic rules. They do not execute Databricks or Snowflake SQL, verify tokens, reproduce optimizer plans, catalog privileges, copy history, costs, cloud storage, encryption, concurrency, lineage, or recovery behavior.

## Explore (remaining exploration time)

Toggle identity, malformed-row handling, lookup size, and analyst role. Predict the first failed gate and the surviving evidence.

Open data-engineering.html for the executable model.

Model limits: The local Python and JavaScript models use three synthetic rows and arithmetic rules. They do not execute Databricks or Snowflake SQL, verify tokens, reproduce optimizer plans, catalog privileges, copy history, costs, cloud storage, encryption, concurrency, lineage, or recovery behavior.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day24/data-engineering.html">Day24</a>; product material added 2026-10-14.</p><p>A corrected source file keeps the already-loaded name. Best cross-product action?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Publish a versioned name, then reconcile business keys. Both products treat file identity as ingestion memory; immutability makes corrections visible.</p></details><p>Two different files contain order O-7. What does file-level deduplication guarantee?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Each unseen file can load once; business-key dedup is separate. The file identity and business identity are different layers.</p></details>

## Databricks: secretless Auto Loader to a masked Unity Catalog view · 9 minutes

Federate the EKS role to a service principal, grant the catalog path, rescue schema surprises, expand items with position, inspect the join plan, and attach a query-time mask. Vendor code not executed.

## Snowflake: WIF service user to validated COPY, FLATTEN, managed join, and masking policy · 9 minutes

Bind WIF to a service user, authorize its role, validate files before a separate load/transform path, flatten arrays with index, inspect the managed join in Query Profile, and attach the masking policy. Vendor code not executed.

## Compare and predict (2 minutes)

Databricks exposes Spark join strategy controls; Snowflake manages the join plan. Both require separate identity and object privileges, product-specific error handling, positional array expansion, and query-time masking.

Snowflake validation mode is combined with a transformed COPY. What happens?

- The statement is unsupported; separate validation from transformation
- It silently broadcasts the lookup
- It creates a masking policy

<details><summary>Reveal after predicting</summary>

The statement is unsupported; separate validation from transformation. The current COPY reference says VALIDATION_MODE does not support load transformations.

</details>

A 12 MB Databricks lookup is hinted for broadcast. What evidence is still needed?

- The actual physical plan and runtime metrics
- Only the source row count
- A Snowflake warehouse size

<details><summary>Reveal after predicting</summary>

The actual physical plan and runtime metrics. A hint and size estimate do not prove the executed plan or safe driver memory.

</details>

## Certification connection

Integrated ingestion, semi-structured transformation, join planning, governance/security, and platform identity from Days45–49. Integrated loading validation, semi-structured data, managed performance, masking, and connectivity/access planning groups. Planning groups only; full COF-C03 IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and recorded example is local Python.

- [Databricks Auto Loader schema and rescued data](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema) — Official Databricks documentation; updated September 11, 2026; checked 2026-11-10.
- [Databricks AQE broadcast joins](https://docs.databricks.com/aws/en/optimizations/aqe) — Official Databricks documentation; checked November 10, 2026; checked 2026-11-10.
- [Databricks column masks](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-column-mask) — Official Databricks SQL reference; checked November 10, 2026; checked 2026-11-10.
- [Databricks AWS workload identity](https://docs.databricks.com/aws/en/dev-tools/auth/provider-aws-iam) — Official Databricks documentation; checked November 10, 2026; checked 2026-11-10.
- [Snowflake COPY INTO table](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table) — Official Snowflake reference; checked November 10, 2026; checked 2026-11-10.
- [Snowflake FLATTEN](https://docs.snowflake.com/en/sql-reference/functions/flatten) — Official Snowflake reference; checked November 10, 2026; checked 2026-11-10.
- [Snowflake Dynamic Data Masking](https://docs.snowflake.com/en/user-guide/security-column-ddm-intro) — Official Snowflake documentation; checked November 10, 2026; checked 2026-11-10.
- [Snowflake workload identity federation](https://docs.snowflake.com/en/user-guide/workload-identity-federation) — Official Snowflake documentation; checked November 10, 2026; checked 2026-11-10.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official guide; May 4, 2026 version; checked 2026-11-10.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official current overview; full IDs and weights remain unverified; checked 2026-11-10.

## Quiz (4 minutes)

1. Identity and grants pass; one record is malformed and rescue is enabled. What survives?
   - Two valid orders continue and one error remains inspectable
   - All rows disappear
   - The malformed row becomes valid

2. Why carry the same order through all five mechanisms?
   - To test composition and hand-off evidence, not isolated feature recall
   - To make products identical
   - To guarantee production readiness

3. What still prevents a readiness claim?
   - No authorized vendor execution, plan evidence, or fresh assessment
   - The example has two items
   - The email is synthetic

4. Which hand-off in your real pipeline has the weakest evidence?
5. What vendor-side observation would turn this case from delivered coverage into practice evidence?

<details><summary>Answer key — attempt first</summary>

1. Two valid orders continue and one error remains inspectable. Rescue separates usability from error evidence.

2. To test composition and hand-off evidence, not isolated feature recall. The case exposes boundaries between controls.

3. No authorized vendor execution, plan evidence, or fresh assessment. Delivered coverage is not observed platform skill or mastery.

</details>

## Sources

- [Databricks Auto Loader schema and rescued data](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema) — Official Databricks documentation; updated September 11, 2026; checked 2026-11-10.
- [Databricks AQE broadcast joins](https://docs.databricks.com/aws/en/optimizations/aqe) — Official Databricks documentation; checked November 10, 2026; checked 2026-11-10.
- [Databricks column masks](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-column-mask) — Official Databricks SQL reference; checked November 10, 2026; checked 2026-11-10.
- [Databricks AWS workload identity](https://docs.databricks.com/aws/en/dev-tools/auth/provider-aws-iam) — Official Databricks documentation; checked November 10, 2026; checked 2026-11-10.
- [Snowflake COPY INTO table](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table) — Official Snowflake reference; checked November 10, 2026; checked 2026-11-10.
- [Snowflake FLATTEN](https://docs.snowflake.com/en/sql-reference/functions/flatten) — Official Snowflake reference; checked November 10, 2026; checked 2026-11-10.
- [Snowflake Dynamic Data Masking](https://docs.snowflake.com/en/user-guide/security-column-ddm-intro) — Official Snowflake documentation; checked November 10, 2026; checked 2026-11-10.
- [Snowflake workload identity federation](https://docs.snowflake.com/en/user-guide/workload-identity-federation) — Official Snowflake documentation; checked November 10, 2026; checked 2026-11-10.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official guide; May 4, 2026 version; checked 2026-11-10.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official current overview; full IDs and weights remain unverified; checked 2026-11-10.
