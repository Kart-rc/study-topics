# Read the labels before opening the boxes: Parquet page skipping

Data engineering · Day11 · 15 minutes

Use small value summaries to avoid reading pages that cannot contain your answer.

## Recall (2 minutes)

<p><a href="../Day3/data-engineering.html">Day3: Adaptive skew joins: split the straggler, not the whole job</a></p><p>Median 43.5 MB, factor 5, threshold 256 MB, partition 240 MB. Is it skewed by this rule?</p><details><summary>Recall first, then reveal the refresher</summary><p>No, because it does not also exceed 256 MB. The partition must exceed both boundaries. It clears 217.5 MB but not 256 MB.</p></details><p><a href="../Day7/data-engineering.html">Day7: Spark Real-Time Mode: eligibility before milliseconds</a></p><p>A Spark 4.1 query adds a keyed rolling count. What should happen before tuning its RTM epoch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Confirm that the stateful graph is supported; otherwise choose another path. Execution-mode eligibility is a correctness constraint, not a latency knob.</p></details>

## Understand (4 minutes)

You need order 42 from a large file. Imagine three boxes with number ranges written on their lids. A box labeled 10–20 cannot contain 42. A box labeled 40–50 might. Reading the label is cheaper than unpacking everything.

Parquet divides column data into pages. An optional page index stores small summaries and locations. For this lesson, each label contains the smallest and largest order ID on a page. A reader can skip a page when the requested ID falls outside that range. This is a promise of absence, not proof that the order exists.

The important distinction: keep a possible match; skip only an impossible match. Order 45 fits the label 40–50, but the page might contain only 40, 42, and 50. It must still be read and filtered. If usable statistics are missing, the safe choice is to read.



Our synthetic file has nine IDs across three pages. For order_id = 42, the labels select only B. Reading B finds exactly one match. For 45, B is still read, but zero rows match. A selected page is a candidate, not a result.

Now scatter the same values across the pages. Their ranges overlap: 10–80, 12–90, and 20–100. All three might contain 42, so all three are read. The result is still correct, but the labels save no work. Ordering data around a frequent filter can make these summaries more useful. Sorting has a cost, so measure bytes read and rewrite cost on your workload.

SELECT * FROM orders WHERE order_id = 42;

The Python walkthrough executes the candidate-selection rule on lists. The browser lab runs that rule again with your chosen ID and page layout. Neither is a Parquet reader or a Spark benchmark.



## Read the visual

Which page ranges can possibly contain the requested ID? Each horizontal interval is a page minimum-to-maximum range on the same ID scale. The vertical target line intersects candidate pages; candidates still need row filtering.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
pages = [[10, 12, 20], [40, 42, 50], [80, 90, 100]]
target = 42
bounds = [(min(page), max(page)) for page in pages]
candidates = [i for i, (lo, hi) in enumerate(bounds) if lo <= target <= hi]
matches = [x for i in candidates for x in pages[i] if x == target]
target = 45
candidates = [i for i, (lo, hi) in enumerate(bounds) if lo <= target <= hi]
matches = [x for i in candidates for x in pages[i] if x == target]
```

1. Start with three groups of IDs and one requested order.

   Changed values: `{"pages": [[10, 12, 20], [40, 42, 50], [80, 90, 100]], "target": 42}`

2. Each page gets a small label: its lowest and highest ID.

   Changed values: `{"bounds": [[10, 20], [40, 50], [80, 100]]}`

3. Only page index 1 could contain 42. Page indexes start at zero.

   Changed values: `{"candidates": [1]}`

4. Read the candidate and apply equality. The answer is 42.

   Changed values: `{"matches": [42]}`

5. 45 keeps the same candidate, but the final result is empty.

   Changed values: `{"target": 45, "matches": []}`

[Full runnable example](examples/data-engineering.py).

Limits: Executes integer range pruning over Python lists. It does not generate Parquet metadata or measure Spark I/O.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>For Spark on object storage, inspect an actual plan and scan metrics. Partition pruning, row-group pruning and page skipping operate at different sizes; support for one does not prove support for the others. Compare the same predicate and result set before interpreting a smaller read count as a speedup.</p>

</details>

## Explore (remaining exploration time)

Predict how many pages will be read for ID 45. Compare grouped and scattered values, then hide the statistics. Explain why correctness stays the same.

Open data-engineering.html for the executable model.

Model limits: An integer-only equality filter with complete, trustworthy bounds. The model omits nulls, NaN, string ordering, compression, byte offsets, remote I/O and engine support. It counts pages, not bytes or milliseconds. Parquet page indexes are optional; verify writer output and reader support before expecting pruning.

## Quiz (4 minutes)

1. Grouped pages, target 45: what happens?
   - Read B; return no rows
   - Skip every page
   - Return 42 because it is close

2. Why does scattering the same nine IDs read more pages for 42?
   - The answer changed
   - More page ranges overlap 42
   - Statistics now prove every row matches

3. A page has no usable statistics. What is safe?
   - Treat it as empty
   - Guess from the previous page
   - Read it and apply the filter

4. Explain why the safer choice works in this example.
5. Change one assumption. What would fail, and what evidence would reveal it?

<details><summary>Answer key — attempt first</summary>

1. Read B; return no rows. 45 lies within B’s bounds, so B must be read. No stored ID equals 45. Skipping B would assume more than the label proves; nearby IDs do not satisfy equality.

2. More page ranges overlap 42. All three ranges contain 42. The values and equality result have not changed; the summaries have become less selective. A range never proves every row matches.

3. Read it and apply the filter. Missing information cannot prove absence. Reading preserves correctness; assuming empty or copying another page’s range may silently lose rows.

</details>

## Sources

- [Apache Parquet: Page Index](https://parquet.apache.org/docs/file-format/pageindex/) — Living format documentation; page last modified 2026-02-24 (site change, not a feature release); checked 2026-10-01.
