# Adaptive skew joins: split the straggler, not the whole job

Data engineering · Day3 · 15 minutes

Most tasks in a join finish quickly, but one task reads a much larger partition.

## Recall (2 minutes)

<p><a href="../Day2/data-engineering.html">Day2: Watermarks: when can a window be forgotten?</a></p><p>With max event time 12 and delay 5, what watermark is used in this model&#x27;s next batch?</p><details><summary>Recall first, then reveal the refresher</summary><p>7. Subtract the allowed delay from the prior maximum: 12 − 5 = 7.</p></details>

## Understand (4 minutes)

Most tasks in a join finish quickly, but one task reads a much larger partition. The whole job waits for that straggler.

Skew means work is unevenly distributed. Spark’s adaptive query execution, or AQE, can use runtime sizes to split eligible oversized join partitions. A partition must be large compared with both its peers and an absolute threshold. Splitting reduces the largest unit of work; it does not remove all overhead.

Watch the visual: Which large task sets the job’s finishing time?



For sizes 40, 42, 43, 44, 45, and 900 MB, the median is 43.5 MB. Five times that is 217.5 MB. The 900 MB partition also exceeds 256 MB. Dividing it toward a 64 MB target gives 15 pieces of about 60 MB.



## Read the visual

Before and after bars use one fixed 0–1200 MB ruler. The oversized partition splits only when it exceeds both boundaries. Its pieces then appear as equal small task bars. This shows smaller maximum input, not a promised wall-clock speedup or an exact Spark partition layout.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
sizes = [40, 42, 43, 44, 45, 900]
median = (sizes[2] + sizes[3]) / 2
threshold = max(5 * median, 256)
skewed = sizes[-1] > threshold
pieces = (sizes[-1] + 63) // 64
piece_mb = sizes[-1] / pieces
```

1. The last partition is much larger than its peers.

   Changed values: `{"sizes": [40, 42, 43, 44, 45, 900]}`

2. The middle pair gives 43.5 MB.

   Changed values: `{"median": 43.5}`

3. Both conditions imply a 256 MB effective threshold.

   Changed values: `{"threshold": 256}`

4. The 900 MB partition qualifies in this toy.

   Changed values: `{"skewed": true}`

5. Round up to 15 pieces at the advisory target.

   Changed values: `{"pieces": 15}`

6. Each idealized piece is 60 MB.

   Changed values: `{"piece_mb": 60.0}`

[Full runnable example](examples/data-engineering.py).

Limits: This is split-size arithmetic, not a Spark scheduler. Actual split boundaries, supported join types, replicated input, spilling, and task overhead affect the plan and runtime.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A sort-merge join can look well provisioned on average while one shuffled partition determines the stage duration. Spark Adaptive Query Execution (AQE) uses runtime statistics to revise a physical plan after a shuffle. Current Spark 4.2 documentation says AQE has been enabled by default since Spark 3.2 and can split skewed sort-merge-join partitions, optionally replicating the matching side.</p><p>For the documented skew rule, a partition is considered skewed only when it is larger than both a factor times the median partition size and an absolute byte threshold. The documented defaults are factor 5 and 256 MB. “Five times median” alone is not the rule.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A customer-fact join produces shuffled partitions of 40, 42, 43, 44, 45, and 900 MB. The median is 43.5 MB. With factor 5, the relative boundary is 217.5 MB; with the 256 MB absolute threshold, the effective boundary is 256 MB. The 900 MB partition clears both tests.</p><p>With a 64 MB advisory target, the calculator divides 900 MB into 15 approximately 60 MB pieces. The largest modeled task input falls from 900 MB to 60 MB. That is a useful intuition for straggler relief, not a 15× runtime promise: reading, shuffling, scheduling, spilling, replication, and downstream work remain.</p><pre>isSkewed = size &gt; factor × median
        AND size &gt; absoluteThreshold
pieces = ceil(size / advisoryTarget)</pre><p>At platform scale, first verify that the skew is real in runtime statistics. Then ask whether a hot key, data-quality default, or tenant concentration is the business cause. AQE treats the physical symptom; key salting, pre-aggregation, or a data-contract repair may be the durable response.</p>

</details>

## Explore (remaining exploration time)

Predict the effective boundary and split count before moving a control. Raise the absolute threshold above the hot partition, then shrink the advisory target. Explain why smaller pieces can add work even when they reduce the longest task.

Open data-engineering.html for the executable model.

Model limits: A size-only deterministic model for one skewed shuffled partition. It is not Spark's planner and does not model join eligibility, skewedPartitionThresholdInBytes being ideally larger than advisory size, small-partition merging, replication of the other join side, spill, network, scheduler overhead, or exact runtimes. Treat the displayed bottleneck as input size, not elapsed time.

## Quiz (4 minutes)

1. Median 43.5 MB, factor 5, threshold 256 MB, partition 240 MB. Is it skewed by this rule?
   - Yes, because it exceeds 5× median
   - No, because it does not also exceed 256 MB
   - Yes, because it exceeds the median

2. Why can splitting a skewed join partition require extra work?
   - The matching data from the other side may be replicated across splits
   - Spark must change the join key
   - AQE disables shuffles

3. AQE removes a recurring hot-key straggler. What remains a sound engineering question?
   - Whether the hot key reflects a data-contract or model problem
   - Whether medians should be banned
   - Whether all joins should use one partition

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. No, because it does not also exceed 256 MB. The partition must exceed both boundaries. It clears 217.5 MB but not 256 MB.

2. The matching data from the other side may be replicated across splits. Splitting one side can require replication of the corresponding other-side data, plus more scheduling and shuffle work.

3. Whether the hot key reflects a data-contract or model problem. Adaptive execution mitigates a physical plan symptom; it does not explain or repair the domain cause.

</details>

## Sources

- [Apache Spark 4.2: SQL performance tuning and Adaptive Query Execution](https://spark.apache.org/docs/latest/sql-performance-tuning.html) — Spark 4.2 living documentation; exact page publication date not stated; checked 2026-09-23.
