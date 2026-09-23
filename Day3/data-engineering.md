# Adaptive skew joins: split the straggler, not the whole job

Data engineering · Day3 · 15 minutes

Predict when Spark marks a shuffled partition as skewed, then reason about splitting, replication, and the remaining bottleneck.

## Recall (2 minutes)

<p><a href="../Day2/data-engineering.html">Day2: Watermarks: when can a window be forgotten?</a></p><p>With max event time 12 and delay 5, what watermark is used in this model&#x27;s next batch?</p><details><summary>Recall first, then reveal the refresher</summary><p>7. Subtract the allowed delay from the prior maximum: 12 − 5 = 7.</p></details>

## Understand (4 minutes)

A sort-merge join can look well provisioned on average while one shuffled partition determines the stage duration. Spark Adaptive Query Execution (AQE) uses runtime statistics to revise a physical plan after a shuffle. Current Spark 4.2 documentation says AQE has been enabled by default since Spark 3.2 and can split skewed sort-merge-join partitions, optionally replicating the matching side.

For the documented skew rule, a partition is considered skewed only when it is larger than both a factor times the median partition size and an absolute byte threshold. The documented defaults are factor 5 and 256 MB. “Five times median” alone is not the rule.



Original teaching case: A customer-fact join produces shuffled partitions of 40, 42, 43, 44, 45, and 900 MB. The median is 43.5 MB. With factor 5, the relative boundary is 217.5 MB; with the 256 MB absolute threshold, the effective boundary is 256 MB. The 900 MB partition clears both tests.

With a 64 MB advisory target, the calculator divides 900 MB into 15 approximately 60 MB pieces. The largest modeled task input falls from 900 MB to 60 MB. That is a useful intuition for straggler relief, not a 15× runtime promise: reading, shuffling, scheduling, spilling, replication, and downstream work remain.

isSkewed = size > factor × median
        AND size > absoluteThreshold
pieces = ceil(size / advisoryTarget)

At platform scale, first verify that the skew is real in runtime statistics. Then ask whether a hot key, data-quality default, or tenant concentration is the business cause. AQE treats the physical symptom; key salting, pre-aggregation, or a data-contract repair may be the durable response.



## Explore (5 minutes)

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
