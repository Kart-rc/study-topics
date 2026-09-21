# The commit is the boundary

Data engineering · Day1 · 15 minutes

Predict what readers see when two Iceberg writers race, and explain why retrying a commit is different from rewriting all data.

## Recall (2 minutes)

No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.

## Understand (4 minutes)

A table in object storage is more than a folder. A reader needs a consistent membership list: which files belong to this version? Iceberg records that membership in snapshot metadata. Writers prepare new files and metadata, then publish the update through an atomic metadata-pointer change. A reader using an older snapshot can continue with its original view.Concurrent writers use optimistic concurrency. They prepare work independently, then attempt the commit. If another writer has changed the base, the losing writer must refresh and validate its assumptions before trying again. A compatible append can often reuse its prepared files; a conflicting rewrite may be invalid. Iceberg reliability documentation.

Original teaching case: A reconciliation table starts with files A and B. Writer Blue prepares C, while writer Amber prepares D. Both began from version 0. Blue publishes version 1: A, B, C. Amber must not overwrite that state with A, B, D, losing C.Amber instead refreshes its base, validates that this independent append remains compatible, and proposes A, B, C, D. If the atomic check succeeds, version 2 contains both contributions. The operation that publishes membership is tiny compared with producing a terabyte of new files. This is why commit retry and data recomputation are separate costs.Now change the operation: Amber intended to compact A and B. If Blue had removed A, Amber's original plan would no longer have the required inputs. Blindly retrying the old plan would be incorrect. The invariant is more useful than a blanket instruction to retry.

## Explore (5 minutes)

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
