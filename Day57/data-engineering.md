# Consolidation case: replay the missed customer window, prove one current row, then publish

Data engineering · Day57 · 30 minutes

Recover one missed customer-dimension window without widening the input, duplicating Type-2 history, or exposing unverified data.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day32/data-engineering.html">Day32: One table, different rows: query-time row access policies</a></p><p>An east analyst has SELECT on the table. What does the row policy add?</p><details><summary>Recall first, then reveal the refresher</summary><p>It removes rows whose predicate is false. Object privileges allow the query; the row policy narrows its result.</p></details><p><a href="../Day36/data-engineering.html">Day36: Consolidation case: land, evolve, govern, publish changes, and clone one orders feed</a></p><p>The new column is approved, but the S3 role can read every company bucket. Publish?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; fix the identity/path scope first. Identity and schema are independent controls.</p></details>

## Understand (4 minutes)

A bakery misses the 9:00 delivery. The safe response is not “take every delivery now in the yard.” It is “replay the 9:00–10:00 manifest, count every box, then open the shop shelf.”

Our customer pipeline missed its 09:00–10:00 window. Customer c57 changed from basic to pro at 09:20. A sound recovery carries one fixed window through five controls: select only that interval, apply the Type-2 change once, verify one current row, retain a useful query layout, and publish only after the checks pass. Scheduling, history, performance, sharing, and deployment are one evidence chain—not five independent demos.



Before recovery, c57 | basic | [08:00,∞). The replay reads only [09:00,10:00), closes basic at 09:20, and opens pro. Replaying the same event keeps two historical rows and exactly one current row. Only then does the provider expose the verified object.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this recovery pattern when a scheduled data interval was missed but its source history is still available and consumers need auditable publication.

**Practical example.** An enterprise customer dimension misses one hourly CDC run before downstream risk and reporting teams read it through a governed share.

**How to decide.** Freeze the business interval first. Prove source completeness, deterministic keys/order, one-current-row history, consumer query evidence, and publication state. If the source interval is no longer recoverable, stop and use a separately approved reconciliation or snapshot path.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

A single recovery token moves through fixed-window selection, Type-2 history, validation, and publication so the learner can see where evidence is lost.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
window=(0,60); events=[{'id':'c57','tier':'pro','minute':20,'event_id':'e57'}]
selected=[e for e in events if window[0] <= e['minute'] < window[1]]
history=[('basic',-60,20,False),('pro',20,None,True)] if selected else [('basic',-60,None,True)]
current_count=sum(r[3] for r in history); published=(len(selected)==1 and current_count==1); result={'selected':len(selected),'rows':len(history),'current_count':current_count,'published':published}
```

1. Freeze the missed 09:00–10:00 interval and its source event.

   Changed values: `{"window": [0, 60], "events": [{"id": "c57", "tier": "pro", "minute": 20, "event_id": "e57"}]}`

2. Select only records inside the half-open recovery window.

   Changed values: `{"selected": [{"id": "c57", "tier": "pro", "minute": 20, "event_id": "e57"}]}`

3. Apply one deterministic Type-2 transition.

   Changed values: `{"history": [["basic", -60, 20, false], ["pro", 20, null, true]]}`

4. Gate publication on source and history checks.

   Changed values: `{"current_count": 1, "published": true, "result": {"selected": 1, "rows": 2, "current_count": 1, "published": true}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local worlds model one customer, one change, one fixed interval, one validation gate, and one publication flag. They do not run Lakeflow Jobs, AUTO CDC, Delta, Snowflake tasks/streams, transactions, clustering, sharing, bundles, SQL warehouses, permissions, costs, late multi-key events, concurrent consumers, or source-retention recovery.

## Explore (remaining exploration time)

Choose fixed-window recovery or wake-time recovery. Predict the selected events, history rows, current-row count, and publication state.

Open data-engineering.html for the executable model.

Model limits: The local worlds model one customer, one change, one fixed interval, one validation gate, and one publication flag. They do not run Lakeflow Jobs, AUTO CDC, Delta, Snowflake tasks/streams, transactions, clustering, sharing, bundles, SQL warehouses, permissions, costs, late multi-key events, concurrent consumers, or source-retention recovery.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day31/data-engineering.html">Day31</a>; product material added 2026-10-21.</p><p>A Snowflake stream is selected but the transaction rolls back. What happens to its offset?</p><details><summary>Recall first, then reveal the product refresher</summary><p>It remains available for retry. Only committed consuming DML advances the stream offset.</p></details><p>A Databricks consumer needs changes that retention already removed. What is the safe response?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Rebuild from a trusted snapshot and reseed progress. A missing interval requires recovery, not silent advancement.</p></details>

## Databricks: carry one run window into AUTO CDC, validation, and sharing · 9 minutes

Recall Day52 trigger-owned intervals and Day56 ordered Type-2 history. Pass a fixed window into a pipeline task, run AUTO CDC, validate, then publish. CLUSTER BY AUTO helps query layout but does not prove correctness. SQL not executed in Databricks.

## Snowflake: stage the recovery set, transact history, inspect task evidence, then share · 9 minutes

Identify a fixed staged recovery set, transact close-and-insert, inspect TASK_HISTORY, validate, then share a secure object. Base-table clustering is a performance choice. There is no direct managed AUTO CDC equivalent. SQL not executed in Snowflake.

## Compare and predict (2 minutes)

Both products need the same evidence chain, but their mechanics differ: parameterized managed AUTO CDC versus explicit staged transactional DML. Layout and sharing happen only after correctness is established.

Which evidence belongs before either product publishes?

- Fixed source window and exactly one current row per key
- Only a successful compute start
- Only a clustering setting

<details><summary>Reveal after predicting</summary>

Fixed source window and exactly one current row per key. Publication needs source and history evidence.

</details>

What does clustering prove?

- Nothing about Type-2 correctness; it can improve supported query pruning
- That the replay selected the right interval
- That consumers are authorized

<details><summary>Reveal after predicting</summary>

Nothing about Type-2 correctness; it can improve supported query pruning. Physical layout and logical correctness are separate controls.

</details>

## Certification connection

Consolidates Lakeflow Jobs trigger parameters, AUTO CDC Type 2, liquid clustering, validation, declared promotion, and governed sharing. Consolidates scheduled/task evidence, fixed recovery staging, transactional Type-2 DML, clustering judgment, secure views, and sharing. Planning groups only; full COF-C03 IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and the recorded example is local Python.

- [Databricks: Dynamic value references](https://docs.databricks.com/aws/en/jobs/dynamic-value-references) — Official Databricks documentation; checked November 17, 2026; checked 2026-11-17.
- [Databricks: AUTO CDC APIs](https://docs.databricks.com/aws/en/ldp/cdc) — Official Databricks documentation; checked November 17, 2026; checked 2026-11-17.
- [Databricks: Liquid clustering](https://docs.databricks.com/aws/en/delta/clustering) — Official Databricks documentation; checked November 17, 2026; checked 2026-11-17.
- [Snowflake: Streams and tasks](https://docs.snowflake.com/en/user-guide/data-pipelines-intro) — Official Snowflake documentation; checked November 17, 2026; checked 2026-11-17.
- [Snowflake: TASK_HISTORY](https://docs.snowflake.com/en/sql-reference/functions/task_history) — Official Snowflake documentation; checked November 17, 2026; checked 2026-11-17.
- [Snowflake: Secure objects for sharing](https://docs.snowflake.com/en/user-guide/data-sharing-secure-views) — Official Snowflake documentation; checked November 17, 2026; checked 2026-11-17.

## Quiz (4 minutes)

1. The 09:00 run wakes at 11:00. Which input should recovery process?
   - The explicitly authorized 09:00–10:00 interval
   - Everything visible at 11:00
   - Only the newest customer row

2. When may the provider expose the repaired dimension?
   - After source, Type-2, and consumer-facing checks pass
   - Immediately after compute starts
   - Whenever the table name exists

3. What invalidates this recovery plan?
   - The source no longer retains the complete missed interval
   - The event has a deterministic sequence
   - The target supports history

4. Which missed interval in your platform could be replayed today without widening its business meaning?
5. What exact checks must block publication of a repaired shared table?

<details><summary>Answer key — attempt first</summary>

1. The explicitly authorized 09:00–10:00 interval. A fixed business interval makes the replay bounded and auditable.

2. After source, Type-2, and consumer-facing checks pass. Publication is a release decision backed by evidence.

3. The source no longer retains the complete missed interval. A replay cannot reconstruct evidence the source no longer has.

</details>

## Sources

- [Databricks: Dynamic value references](https://docs.databricks.com/aws/en/jobs/dynamic-value-references) — Official Databricks documentation; checked November 17, 2026; checked 2026-11-17.
- [Databricks: AUTO CDC APIs](https://docs.databricks.com/aws/en/ldp/cdc) — Official Databricks documentation; checked November 17, 2026; checked 2026-11-17.
- [Databricks: Liquid clustering](https://docs.databricks.com/aws/en/delta/clustering) — Official Databricks documentation; checked November 17, 2026; checked 2026-11-17.
- [Snowflake: Streams and tasks](https://docs.snowflake.com/en/user-guide/data-pipelines-intro) — Official Snowflake documentation; checked November 17, 2026; checked 2026-11-17.
- [Snowflake: TASK_HISTORY](https://docs.snowflake.com/en/sql-reference/functions/task_history) — Official Snowflake documentation; checked November 17, 2026; checked 2026-11-17.
- [Snowflake: Secure objects for sharing](https://docs.snowflake.com/en/user-guide/data-sharing-secure-views) — Official Snowflake documentation; checked November 17, 2026; checked 2026-11-17.
