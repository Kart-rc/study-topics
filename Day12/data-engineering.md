# Cross out one exact row: Iceberg position deletes

Data engineering · Day12 · 15 minutes

See how a file path plus a zero-based row position hides one row without rewriting the whole data file.

## Recall (2 minutes)

<p><a href="../Day9/data-engineering.html">Day9: Kafka&#x27;s consumer protocol: reassign incrementally, not behind a global barrier</a></p><p>One member changes in a large group. What is the core advantage of incremental reconciliation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Partitions whose ownership is unchanged can continue processing. The protocol narrows disruption to ownership that must move instead of imposing a group-wide synchronization barrier.</p></details><p><a href="../Day4/data-engineering.html">Day4: Kafka transactions: make the output and offset one decision</a></p><p>The worker writes output, crashes before committing its input offset, then restarts without a transaction. What is likely?</p><details><summary>Recall first, then reveal the refresher</summary><p>The input is processed again and the output can duplicate. The committed position still points to the input, while the first output already exists.</p></details>

## Understand (4 minutes)

A warehouse file contains three orders: O10, O11, and O12. You need to remove O11. Rewriting the whole file works, but it can be expensive. A smaller option is to publish a separate note that says: “in this exact file, hide row 1.”

That note is a position delete. It identifies a row with two values: the data file path and the row’s position inside that file. Positions start at zero, so O11 is position 1. Readers combine the data file and its applicable delete records to produce the visible table.

The file name matters. Position 1 in orders-B.parquet is a different row. The snapshot metadata tells a reader which data files and delete files belong together.



The reader scans A. For every row it asks whether (file_path, position) appears in the delete set. The pair (orders-A.parquet, 1) matches O11, so the reader skips it. O10 and O12 remain.

deleted = (file_path, row_position) in position_deletes
if not deleted:
    return row

If the data file is rewritten, row positions can change. A maintenance operation must publish new snapshot metadata and reconcile applicable deletes; copying the old number onto an unrelated file can delete the wrong row.

Version boundary: Iceberg v2 introduced row-level delete files. In v3, new position delete files are prohibited in favor of deletion vectors, although existing position delete files remain valid after an upgrade.



## Read the visual

Why does position 1 in another file stay visible? The delete marker points to one file-and-position pair. Original rows remain in their file, while the reader output omits only that exact address. A rewrite would require valid markers for the new file.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
files = {"orders-A.parquet": ["O10", "O11", "O12"],
         "orders-B.parquet": ["O20", "O21"]}
position_deletes = {("orders-A.parquet", 1)}
visible = {name: [row for pos, row in enumerate(rows)
                  if (name, pos) not in position_deletes]
           for name, rows in files.items()}
wrong_file_same_position = files["orders-B.parquet"][1]
```

1. Start with two files. Each file numbers its own rows from zero.

   Changed values: `{"files": {"orders-A.parquet": ["O10", "O11", "O12"], "orders-B.parquet": ["O20", "O21"]}}`

2. Create one marker for row 1 in file A.

   Changed values: `{}`

3. The reader removes only a row whose file and position both match.

   Changed values: `{"visible": {"orders-A.parquet": ["O10", "O12"], "orders-B.parquet": ["O20", "O21"]}}`

4. Position 1 in file B is O21, proving that the number alone is not an identity.

   Changed values: `{"wrong_file_same_position": "O21"}`

[Full runnable example](examples/data-engineering.py).

Limits: Executes pair matching over Python lists. It does not read an Iceberg table or model snapshot sequence rules.

## Explore (remaining exploration time)

Predict which order disappears. Change the file and position, then compare the visible rows in both files.

Open data-engineering.html for the executable model.

Model limits: A small snapshot-aware reader over two in-memory files. It does not parse Iceberg manifests, sequence numbers, Parquet, equality deletes, deletion vectors, compaction, or engine compatibility. Never apply a position without the exact file identity and snapshot rules.

## Quiz (4 minutes)

1. Which pair hides O11 in the example?
   - orders-A.parquet and position 1
   - orders-A.parquet and position 2
   - Any file and position 1

2. Why is position 1 alone unsafe?
   - Positions are encrypted
   - Each data file has its own position 1
   - Iceberg rows never have positions

3. What changes for an Iceberg v3 writer?
   - It should add new position delete files
   - It must ignore all existing deletes
   - It uses deletion vectors for new position deletes; existing v2 files can remain valid

4. Explain why the file path and row position must travel together.
5. A compaction rewrites orders-A.parquet. What must be reconciled before publishing the new snapshot?

<details><summary>Answer key — attempt first</summary>

1. orders-A.parquet and position 1. Positions start at zero, and the file path is part of the identity. O11 is row 1 only in orders-A.parquet.

2. Each data file has its own position 1. The same number names a different row in every file. A position delete needs the exact data file path too.

3. It uses deletion vectors for new position deletes; existing v2 files can remain valid. The specification prohibits adding new position delete files to v3 tables and retains existing ones from upgraded v2 tables.

</details>

## Sources

- [Apache Iceberg table specification: delete formats](https://iceberg.apache.org/spec/) — Living specification; v2/v3 delete requirements reviewed; checked 2026-10-02.
