# Optimistic concurrency: make a lost update fail loudly

Software engineering · Day8 · 15 minutes

Use versioned conditional writes to turn silent lost updates into explicit conflicts, and know when contention or multi-Region semantics demand another design.

## Recall (2 minutes)

<p><a href="../Day1/software-engineering.html">Day1: When retries multiply an outage</a></p><p>Four layers each allow two total attempts. Worst-case leaf calls?</p><details><summary>Recall first, then reveal the refresher</summary><p>16. The nested multiplication is 2⁴ = 16.</p></details><p><a href="../Day5/software-engineering.html">Day5: Consistent hashing: move a slice, not the whole keyspace</a></p><p>Why does adding a node disrupt modulo sharding broadly?</p><details><summary>Recall first, then reveal the refresher</summary><p>The divisor changes, so many hash remainders change. Placement depends directly on node count, so changing it changes many assignments.</p></details>

## Understand (4 minutes)

An individual DynamoDB write is atomic, but a read-modify-write workflow spans time: read quantity 10, decide quantity 9, then write 9. If two workers read 10 and both write 9, one decrement disappears even though both atomic writes succeeded. The missing boundary is whether the item is still the version each worker read.

Optimistic concurrency control stores a version number. A writer sends both its update and a condition such as Version = 41; the successful write sets the new value and increments the version. A stale writer receives ConditionalCheckFailedException, rereads, recomputes, and decides whether retrying is still valid. The conflict is useful information, not an infrastructure error to hide with a blind retry.

This fits low-contention, inexpensive single-item work. High contention creates retry amplification. Multi-item invariants need transactions or redesign. DynamoDB global tables reconcile concurrent cross-Region updates with last-writer-wins, so a per-item version check in one Region does not provide the same global optimistic-lock guarantee.



Worked example: Four allocators read {remaining: 10, version: 7} and each reserve one unit. Without a condition, every writer stores 9; the final count is 9 even though four reservations were acknowledged. With ConditionExpression: Version = :seen, one write succeeds. The other three conflict, reread versions 8, 9, and 10 over successive rounds, and the final count is 6.

SET remaining = :new, Version = :seen + 1
CONDITION Version = :seen

That protects the database value. It does not make an external payment, Kafka publish, or warehouse write atomic with the DynamoDB update; those need an idempotent workflow, outbox, or transaction boundary suited to the systems involved.



## Explore (5 minutes)

Choose the number of simultaneous writers and decrement size. Predict the silent-loss result, then compare versioned retries and total attempts. Raise contention until the retry cost changes your design choice.

Open software-engineering.html for the executable model.

Model limits: A synchronized-round model where every remaining writer reads the same version and exactly one conditional write wins per round. Real arrivals, backoff, adaptive capacity, partition distribution, SDK retries, consumed capacity, and application merge logic vary. It models one item in one Region; it does not model DynamoDB global-table reconciliation, multi-item transactions, or external side effects.

## Quiz (4 minutes)

1. Two workers read version 12; worker A commits version 13 before worker B writes. What should B's conditional update do?
   - Overwrite A because B read successfully
   - Fail as a conflict so B can reread and recompute
   - Acquire a permanent table lock

2. Why is a generic automatic retry of the same stale payload unsafe?
   - The business decision may need recomputation against the new value
   - DynamoDB does not support retries
   - Conditional writes are never atomic

3. Where does this single-item pattern stop being sufficient?
   - A low-contention update within one Region
   - A read followed by a conditional update
   - A cross-Region global-table invariant or external side effect that must be atomic

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Fail as a conflict so B can reread and recompute. The version mismatch converts the stale decision into an explicit conflict.

2. The business decision may need recomputation against the new value. Retrying must re-establish the precondition; resending the stale new value can still be wrong.

3. A cross-Region global-table invariant or external side effect that must be atomic. The condition is evaluated for one item in one Region; other systems and global reconciliation create wider boundaries.

</details>

## Sources

- [Amazon DynamoDB Developer Guide: optimistic locking with version number](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BestPractices_OptimisticLocking.html) — Living AWS documentation; publication date not stated; checked 2026-09-28.
- [Amazon DynamoDB Developer Guide: handling concurrent updates](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BestPractices_ImplementingVersionControl.html) — Living AWS documentation; publication date not stated; checked 2026-09-28.
- [Amazon DynamoDB Developer Guide: condition expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) — Living AWS documentation; publication date not stated; checked 2026-09-28.
