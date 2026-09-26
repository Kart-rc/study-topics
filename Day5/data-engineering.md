# Iceberg partition evolution: new layout, same query

Data engineering · Day5 · 15 minutes

Predict how one logical time filter is planned across old and new partition specs without rewriting historical files.

## Recall (2 minutes)

<p><a href="../Day2/data-engineering.html">Day2: Watermarks: when can a window be forgotten?</a></p><p>With max event time 12 and delay 5, what watermark is used in this model&#x27;s next batch?</p><details><summary>Recall first, then reveal the refresher</summary><p>7. Subtract the allowed delay from the prior maximum: 12 − 5 = 7.</p></details><p><a href="../Day4/data-engineering.html">Day4: Kafka transactions: make the output and offset one decision</a></p><p>The worker writes output, crashes before committing its input offset, then restarts without a transaction. What is likely?</p><details><summary>Recall first, then reveal the refresher</summary><p>The input is processed again and the output can duplicate. The committed position still points to the input, while the first output already exists.</p></details>

## Understand (4 minutes)

A partition is a physical pruning hint, not part of the business question. Apache Iceberg's hidden partitioning lets a query filter on source columns such as event_time; the table derives the appropriate partition filter. That separation makes the layout evolvable.

When the table changes from day to hour partitioning, existing files stay in their old daily layout and new files use the hourly layout. Iceberg keeps both partition specs in metadata and plans each layout separately. The change is a metadata operation, not an eager rewrite.



Original teaching case: A lineage-events table writes Days 1–7 into one file per day. Query latency for a two-hour incident window is dominated by reading a whole day. On Day 8, the platform changes new writes to hourly partitioning.

The SQL remains WHERE event_time BETWEEN .... For Day 6, the planner maps that predicate to the old day transform and scans one 24-hour file. For Day 10, it maps the same predicate to the new hour transform and scans two one-hour files. If a query crosses the cutover, both planning rules participate.

ALTER TABLE lineage.events
REPLACE PARTITION FIELD day(event_time)
WITH hour(event_time);

No historical rewrite means no immediate migration blast radius, but it also means old files do not magically gain hourly pruning. A deliberate rewrite or compaction can improve them later. Engine/version support, catalog coordination, file sizing, and manifest maintenance still belong in the production plan.



## Explore (5 minutes)

Predict the scanned time for a two-hour query before moving the day across the cutover. Then disable evolution and explain why query text can remain stable while physical pruning changes.

Open data-engineering.html for the executable model.

Model limits: A fourteen-day table with exactly one daily file or twenty-four hourly files per day and perfect predicate pruning. It does not execute Iceberg or Spark, read manifests, model file statistics, residual filters, partition transforms beyond time, compaction, snapshot isolation, catalog support, skew, or object-store request cost.

## Quiz (4 minutes)

1. A two-hour query targets data written before the daily-to-hourly cutover. What does the toy planner scan?
   - Two historical hourly files created automatically
   - The old daily file using the old spec
   - No file because old specs are invalid

2. Why can the SQL continue to filter event_time instead of naming a partition column?
   - Hidden partitioning derives layout-specific pruning from the source-column predicate
   - Every engine rewrites all data first
   - Partition values are ignored

3. What is outside the metadata-only guarantee?
   - Keeping the prior spec metadata
   - Writing new files with the new spec
   - Improving the old files to hourly granularity without a rewrite

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. The old daily file using the old spec. Old data remains in its original layout and is planned with the metadata for that layout.

2. Hidden partitioning derives layout-specific pruning from the source-column predicate. The query states the business predicate; Iceberg translates it for each partition spec.

3. Improving the old files to hourly granularity without a rewrite. Evolution avoids an eager rewrite; changing historical physical granularity still requires rewriting data files.

</details>

## Sources

- [Apache Iceberg 1.11.0 documentation: partition evolution](https://iceberg.apache.org/docs/latest/evolution/#partition-evolution) — Living Apache documentation for latest 1.11.0; page publication date not stated; checked 2026-09-25.
