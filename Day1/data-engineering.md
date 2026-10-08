# The commit is the boundary

Data engineering · Day1 · 15 minutes

Two people edit the same table.

## Recall (2 minutes)

<p>No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.</p>

## Understand (4 minutes)

Two people edit the same table. Blue adds file C. Amber adds file D. If Amber saves an old file list after Blue, C can disappear from the table even though the file still exists.

An Iceberg snapshot is the list of files a reader should use. Publishing a new list must check that the starting version is still current. If it changed, refresh the list and check whether your change still makes sense. This is optimistic concurrency: prepare work first, then reject a stale save.

Watch the visual: Why must Amber refresh before publishing?



Start with A and B at version 0. Blue publishes A, B, C at version 1. Amber’s version-0 save fails. Amber reads version 1 and adds D to that list, producing A, B, C, D. This retry is safe for the independent append in our example; it is not a rule to retry every rewrite.



## Read the visual

Blue and Amber both start from version 0 with files A and B. Blue publishes A, B, C as version 1. Amber’s version-0 pointer cannot replace it. Refresh moves Amber’s base to version 1; the append then publishes A, B, C, D. The pinned reader remains on A, B.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use Iceberg’s concurrency controls when independent jobs write to the same table and readers need a consistent view. This matters when a streaming append overlaps a batch load or table maintenance.

**Practical example.** Two Spark jobs add orders to an S3-backed Iceberg table. Blue adds file C first. Amber prepared D from the older A, B snapshot. Amber must refresh and validate before publishing A, B, C, D, so Blue’s orders stay visible.

**How to decide.** Use the table library’s commit protocol rather than replacing a shared file list yourself. Retry compatible appends; replan conflicting rewrites. If conflicts are frequent, reducing overlapping maintenance may be simpler than increasing retries. This protects table publication, not external notifications.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
files = ["A", "B"]; version = 0
amber_base = version; amber_plan = files + ["D"]
files = files + ["C"]; version += 1
amber_can_commit = amber_base == version
amber_plan = files + ["D"]; amber_base = version
files = amber_plan; version += 1
```

1. The current snapshot contains two files.

   Changed values: `{"files": ["A", "B"], "version": 0}`

2. Amber prepares a list from version 0; nothing is published yet.

   Changed values: `{"amber_base": 0, "amber_plan": ["A", "B", "D"]}`

3. Blue publishes C. The shared version changes to 1.

   Changed values: `{"files": ["A", "B", "C"], "version": 1}`

4. The stale-version check returns False. Amber must not overwrite Blue.

   Changed values: `{"amber_can_commit": false}`

5. Amber refreshes and rebuilds this independent append.

   Changed values: `{"amber_base": 1, "amber_plan": ["A", "B", "C", "D"]}`

6. The toy accepts the refreshed proposal; both additions remain.

   Changed values: `{"files": ["A", "B", "C", "D"], "version": 2}`

[Full runnable example](examples/data-engineering.py).

Limits: This list-and-version example is not the Iceberg commit implementation. Its compare and publish steps stand for an atomic catalog operation. Concurrent execution, file validation, and rewrite conflicts need the real table protocol.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A table in object storage is more than a folder. A reader needs a consistent membership list: which files belong to this version? Iceberg records that membership in snapshot metadata. Writers prepare new files and metadata, then publish the update through an atomic metadata-pointer change. A reader using an older snapshot can continue with its original view.</p><p>Concurrent writers use optimistic concurrency. They prepare work independently, then attempt the commit. If another writer has changed the base, the losing writer must refresh and validate its assumptions before trying again. A compatible append can often reuse its prepared files; a conflicting rewrite may be invalid. <a href="https://iceberg.apache.org/docs/latest/reliability/">Iceberg reliability documentation</a>.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A reconciliation table starts with files A and B. Writer Blue prepares C, while writer Amber prepares D. Both began from version 0. Blue publishes version 1: A, B, C. Amber must not overwrite that state with A, B, D, losing C.</p><p>Amber instead refreshes its base, validates that this independent append remains compatible, and proposes A, B, C, D. If the atomic check succeeds, version 2 contains both contributions. The operation that publishes membership is tiny compared with producing a terabyte of new files. This is why commit retry and data recomputation are separate costs.</p><p>Now change the operation: Amber intended to compact A and B. If Blue had removed A, Amber's original plan would no longer have the required inputs. Blindly retrying the old plan would be incorrect. The invariant is more useful than a blanket instruction to retry.</p>

</details>

## Explore (remaining exploration time)

Before clicking, write the expected file list after Blue commits, after Amber fails, and after Amber refreshes and commits. Then explain what a reader pinned to version 0 should see. Spend two minutes describing how you would distinguish a catalog conflict from executor failure in an incident.

Open data-engineering.html for the executable model.

Model limits: This executable model demonstrates compare-and-swap for independent appends only. It does not implement Iceberg manifests, catalog protocols, delete files, isolation options, garbage collection, or real Spark execution. It cannot establish compatibility for a production rewrite.

## Quiz (4 minutes)

1. Blue commits first. Amber uses base 0. What changes?
   - Amber replaces Blue
   - Nothing; Amber detects a conflict
   - Both commits disappear

2. Why can an independent append retry cheaply?
   - Prepared data can often be reused
   - All data is reread
   - No metadata is required

3. A rewrite assumes A exists, but A was removed. What now?
   - Always retry unchanged
   - Ignore A
   - Revalidate and reject or recompute the incompatible plan

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Nothing; Amber detects a conflict. The failed comparison publishes nothing. Amber must refresh before retrying.

2. Prepared data can often be reused. The new base changes metadata planning; compatible prepared data need not be regenerated.

3. Revalidate and reject or recompute the incompatible plan. The original rewrite assumption is false. A commit retry alone cannot repair that.

</details>

## Sources

- [Iceberg reliability](https://iceberg.apache.org/docs/latest/reliability/) — Undated living documentation; checked 2026-09-21.
