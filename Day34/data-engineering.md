# A clone starts shared; changed data becomes its own

Data engineering · Day34 · 30 minutes

Compare copy-on-write clones in Databricks and Snowflake, then choose shallow, deep, or zero-copy behavior deliberately.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day26/data-engineering.html">Day26: Scale for one heavy query—or for many waiting queries</a></p><p>One query spills while there is no queue. First capacity move?</p><details><summary>Recall first, then reveal the refresher</summary><p>Increase per-query/warehouse size. The symptom is one query exceeding its lane, not many queries waiting.</p></details><p><a href="../Day14/data-engineering.html">Day14: One bookmark, no gap: handing a snapshot to CDC</a></p><p>The snapshot is at 100 and streaming starts after 101. What is wrong?</p><details><summary>Recall first, then reveal the refresher</summary><p>LSN 101 is missed. The payment at 101 is neither in the snapshot nor in the replay. That is a gap.</p></details>

## Understand (4 minutes)

A photocopy normally duplicates every page. A data clone can start more like two table-of-contents cards that point to the same sealed pages. Creating it is fast because the pages are not copied. When one side changes, new pages belong only to that side.

This is copy-on-write: share unchanged storage, separate changed storage. The important question is not only “Can I clone?” It is “Which files remain dependencies, which permissions copy, and what happens after the source changes?”



Production has three immutable files: A, B, and C. A test clone initially reads all three. Test updates one order, so its new file D belongs only to test. Production still reads A+B+C. The clone reads the shared files plus D according to its own metadata. Storage grows for the changed portion, not for a second full copy.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a clone to create a fast, isolated test or recovery starting point from an existing table. It fits short-lived QA, migration rehearsal, incident investigation, and controlled data repair.

**Practical example.** Create a test copy of a 10 TB orders table, change 2% of rows, validate a transformation, then discard the clone.

**How to decide.** Choose a sharing clone when speed and low initial storage matter and the source lifecycle is controlled. Choose a deep copy when the target must not depend on source files. Recheck grants, retention, external-table, stream, task, and object-type rules before production use.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

The file tiles answer what is physically shared after cloning and why later writes increase storage.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
source_files = ['A', 'B', 'C']
clone_shared = list(source_files)
clone_owned = ['D']; clone_visible = clone_shared + clone_owned
source_visible = list(source_files); shared_count = len([f for f in source_files if f in clone_visible])
```

1. Production starts with three immutable files.

   Changed values: `{"source_files": ["A", "B", "C"]}`

2. A sharing clone initially references the same three files.

   Changed values: `{"clone_shared": ["A", "B", "C"]}`

3. The clone writes one new file after its update.

   Changed values: `{"clone_owned": ["D"], "clone_visible": ["A", "B", "C", "D"]}`

4. Production remains unchanged while three files are still shared.

   Changed values: `{"source_visible": ["A", "B", "C"], "shared_count": 3}`

[Full runnable example](examples/data-engineering.py).

Limits: The browser counts synthetic 100 GB files. It does not run either vendor, calculate compressed bytes, model metadata, retention, VACUUM, Time Travel, Iceberg, external storage, grants, streams, tasks, masking policies, or billing. SQL is sourced but unexecuted.

## Explore (remaining exploration time)

Change the clone percentage and storage mode. Watch which files stay shared and which side owns the changed files.

Open data-engineering.html for the executable model.

Model limits: The browser counts synthetic 100 GB files. It does not run either vendor, calculate compressed bytes, model metadata, retention, VACUUM, Time Travel, Iceberg, external storage, grants, streams, tasks, masking policies, or billing. SQL is sourced but unexecuted.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day24/data-engineering.html">Day24</a>; product material added 2026-10-14.</p><p>A corrected source file keeps the already-loaded name. Best cross-product action?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Publish a versioned name, then reconcile business keys. Both products treat file identity as ingestion memory; immutability makes corrections visible.</p></details><p>Two different files contain order O-7. What does file-level deduplication guarantee?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Each unseen file can load once; business-key dedup is separate. The file identity and business identity are different layers.</p></details>

## Databricks: choose SHALLOW or DEEP CLONE · 9 minutes

Databricks shallow clone references source files; deep clone copies data and metadata. Source and target metadata histories diverge, but shallow readers still depend on readable source files. SQL is sourced and unexecuted.

## Snowflake: zero-copy clone, then copy-on-write · 9 minutes

Snowflake zero-copy clones initially share micro-partitions. Later DML creates table-owned partitions. Review object-specific clone and grant behavior; SQL is sourced and unexecuted.

## Compare and predict (2 minutes)

| Question | Databricks | Snowflake |
|---|---|---|
| Fast form | shallow clone | zero-copy clone |
| Full independent copy | deep clone | deliberate materialization/copy; no direct deep-clone keyword |
| Changes | new files/metadata diverge | new micro-partitions diverge |
| Boundary | source-file lifecycle | object/grant/retention rules |

A Databricks shallow clone must survive source-file cleanup. Best change?

- Use a deep clone or preserve the source lifecycle
- Run VACUUM sooner
- Drop the clone metadata

<details><summary>Reveal after predicting</summary>

Use a deep clone or preserve the source lifecycle. A shallow clone depends on readable source files.

</details>

A Snowflake zero-copy clone updates 2% of rows. What grows?

- Storage for new/replaced micro-partitions, not an automatic second full copy
- Every shared partition is duplicated immediately
- No storage can ever grow

<details><summary>Reveal after predicting</summary>

Storage for new/replaced micro-partitions, not an automatic second full copy. Copy-on-write separates changed storage.

</details>

## Certification connection

Shallow versus deep clone, source-file dependency, independent metadata history, and use-case tradeoffs. Delivered coverage is not mastery. Zero-copy cloning, shared micro-partitions, copy-on-write storage, and object-specific boundaries. Complete COF-C03 coverage is not claimed. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run.

- [Databricks table cloning](https://docs.databricks.com/aws/en/tables/operations/clone) — Checked October 24, 2026; checked 2026-10-24.
- [Databricks CLONE syntax](https://docs.databricks.com/aws/en/sql/language-manual/delta-clone) — Checked October 24, 2026; checked 2026-10-24.
- [Snowflake cloning considerations](https://docs.snowflake.com/en/user-guide/object-clone) — Checked October 24, 2026; checked 2026-10-24.
- [Snowflake CREATE CLONE](https://docs.snowflake.com/en/sql-reference/sql/create-clone) — Checked October 24, 2026; checked 2026-10-24.

## Quiz (4 minutes)

1. A zero-copy clone is created and no rows change. What is copied initially?
   - Metadata references; existing data storage is shared
   - Every data block
   - Only deleted rows

2. Why can clone storage grow later?
   - New or rewritten data belongs to the table that changed
   - The clone silently becomes a backup
   - SELECT duplicates files

3. When is a deep copy safer?
   - The target must not depend on source files or lifecycle
   - The target is always temporary
   - You want copied grants automatically

4. Which tables in your platform are safe to clone for QA, and which contain data that should be masked first?
5. What evidence would prove that a clone can survive the source cleanup policy?

<details><summary>Answer key — attempt first</summary>

1. Metadata references; existing data storage is shared. The clone begins by sharing existing immutable storage.

2. New or rewritten data belongs to the table that changed. Copy-on-write creates separate storage for changed portions.

3. The target must not depend on source files or lifecycle. Independence can justify the higher copy time and storage.

</details>

## Sources

- [Databricks: Clone a table](https://docs.databricks.com/aws/en/tables/operations/clone) — Living documentation; checked October 24, 2026; checked 2026-10-24.
- [Databricks SQL CREATE TABLE CLONE](https://docs.databricks.com/aws/en/sql/language-manual/delta-clone) — Living documentation; checked October 24, 2026; checked 2026-10-24.
- [Snowflake cloning considerations](https://docs.snowflake.com/en/user-guide/object-clone) — Living documentation; checked October 24, 2026; checked 2026-10-24.
- [Snowflake storage costs and zero-copy cloning](https://docs.snowflake.com/en/user-guide/cost-understanding-data-storage) — Living documentation; checked October 24, 2026; checked 2026-10-24.
