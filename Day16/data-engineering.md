# Fewer tiny tasks: Spark AQE coalesces shuffle partitions

Data engineering · Day16 · 15 minutes

Explain how Spark can begin with many shuffle partitions, observe their real sizes, and merge neighboring small partitions before the next stage runs.

## Recall (2 minutes)

<p><a href="../Day7/data-engineering.html">Day7: Spark Real-Time Mode: eligibility before milliseconds</a></p><p>A Spark 4.1 query adds a keyed rolling count. What should happen before tuning its RTM epoch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Confirm that the stateful graph is supported; otherwise choose another path. Execution-mode eligibility is a correctness constraint, not a latency knob.</p></details><p><a href="../Day1/data-engineering.html">Day1: The commit is the boundary</a></p><p>Blue commits first. Amber uses base 0. What changes?</p><details><summary>Recall first, then reveal the refresher</summary><p>Nothing; Amber detects a conflict. The failed comparison publishes nothing. Amber must refresh before retrying.</p></details>

## Understand (4 minutes)

Imagine a warehouse that prepared 200 delivery boxes before knowing how much each order would contain. After packing, many boxes hold only one small item. Sending one truck per box wastes time.


A Spark shuffle does something similar. It writes buckets of data for the next stage. The planned bucket count is chosen before Spark knows the exact output sizes.


Adaptive Query Execution (AQE) waits for the map tasks to finish, reads the actual bucket sizes, and can combine neighboring small buckets into fewer tasks.


Planned8 · 12 · 3 · 64 · 5 MB

Observedreal map-output sizes

Next stage23 · 64 · 5 MB

AQE merges adjacent small partitions; it does not reshuffle their keys.



Suppose a shuffle produces five partitions: [8, 12, 3, 64, 5] MB. Our toy target is 32 MB.

8 + 12 + 3 = 23 MB, so those neighbors become one task.Adding the next 64 MB partition would exceed the target, so 23 MB closes.The 64 MB partition stays alone. The final 5 MB partition also stays alone.The next stage starts three tasks instead of five. That reduces task-launch overhead. It does not fix the 64 MB partition; skew splitting is a separate AQE feature.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use AQE coalescing when a Spark SQL batch stage creates many tiny shuffle tasks and task-launch overhead becomes noticeable. Check the Spark UI for actual partition sizes before changing settings.

**Practical example.** Your daily order report starts with many shuffle partitions for peak volume. On a quiet day, the observed sizes are [8, 12, 3, 64, 5] MB. In this lesson’s model, combining adjacent small partitions produces [23, 64, 5] MB: three tasks instead of five, with the same 92 MB of data.

**How to decide.** Try it on representative busy and quiet runs; compare stage duration and available parallelism. If one hot customer produces the large partition, investigate skew handling. Coalescing small neighbors does not split that hot partition.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
sizes_mb = [8, 12, 3, 64, 5]
target_mb = 32
groups = []
current = 0
for size in sizes_mb:
    if current and current + size > target_mb:
        groups.append(current)
        current = 0
    current += size
if current:
    groups.append(current)
task_reduction = len(sizes_mb) - len(groups)
total_before = sum(sizes_mb)
total_after = sum(groups)
```

1. Start with actual map-output sizes and a synthetic 32 MB advisory target.

   Changed values: `{"sizes_mb": [8, 12, 3, 64, 5], "target_mb": 32}`

2. Prepare the output groups and one open group.

   Changed values: `{"groups": [], "current": 0}`

3. Scan in order. Close a group before the next partition would cross the target.

   Changed values: `{"groups": [23, 64, 5], "current": 5, "size": 5}`

4. We removed two task launches without changing the number of bytes.

   Changed values: `{"task_reduction": 2, "total_before": 92, "total_after": 92}`

[Full runnable example](examples/data-engineering.py).

Limits: The runnable code implements only the lesson’s contiguous greedy model. Spark’s production rule also considers minimum sizes, initial partition count, cluster parallelism, and other AQE decisions.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Spark 4.2 documents AQE as enabled by default. Coalescing requires both AQE and <code>spark.sql.adaptive.coalescePartitions.enabled</code>. The default <code>parallelismFirst=true</code> can prioritize cluster parallelism over the advisory target; Spark recommends considering <code>false</code> on a busy cluster to avoid many small tasks. Validate with the final adaptive plan and SQL UI statistics, not configuration alone.</p>

</details>

## Explore (remaining exploration time)

Predict the task groups, then change the advisory size. Watch task count fall while the original total bytes stay constant.

Open data-engineering.html for the executable model.

Model limits: This is a greedy teaching model, not Spark’s exact coalescing algorithm. Spark uses map-output statistics and configuration bounds; the advisory size is a target, not a guarantee. Coalescing works on contiguous shuffle partitions. It does not remove a shuffle, fix every skewed key, or guarantee faster execution when fewer tasks reduce useful parallelism.

## Quiz (4 minutes)

1. With a 32 MB target, which partitions merge first?
   - 8, 12, and 3 MB
   - 3 and 64 MB
   - 64 and 5 MB

2. Why can AQE make this decision better than the original plan?
   - It sees runtime map-output sizes
   - It guesses from file names
   - It changes every key

3. What remains unsolved in this example?
   - The 64 MB partition may still need skew handling
   - All data ordering is lost
   - The shuffle is removed

4. Why should a busy shared cluster start with enough partitions and let AQE coalesce rather than begin with too few?
5. When might coalescing make a stage slower even though it launches fewer tasks?

<details><summary>Answer key — attempt first</summary>

1. 8, 12, and 3 MB. The first three adjacent partitions total 23 MB, still below the toy target.

2. It sees runtime map-output sizes. AQE uses statistics produced while the query is running.

3. The 64 MB partition may still need skew handling. Coalescing small partitions and splitting skewed partitions solve different problems.

</details>

## Sources

- [Apache Spark 4.2: SQL Performance Tuning](https://spark.apache.org/docs/latest/sql-performance-tuning.html) — Living 4.2 documentation; AQE and post-shuffle coalescing; checked 2026-10-06.
- [Apache Spark 4.2: SQL configuration](https://spark.apache.org/docs/latest/configuration.html#spark-sql) — Living 4.2 configuration reference; checked 2026-10-06.
