# Optimistic concurrency: make a lost update fail loudly

Software engineering · Day8 · 15 minutes

Two workers read stock 10, each reserve one item, and each write 9.

## Recall (2 minutes)

<p><a href="../Day1/software-engineering.html">Day1: When retries multiply an outage</a></p><p>Four layers each allow two total attempts. Worst-case leaf calls?</p><details><summary>Recall first, then reveal the refresher</summary><p>16. The nested multiplication is 2⁴ = 16.</p></details><p><a href="../Day5/software-engineering.html">Day5: Consistent hashing: move a slice, not the whole keyspace</a></p><p>Why does adding a node disrupt modulo sharding broadly?</p><details><summary>Recall first, then reveal the refresher</summary><p>The divisor changes, so many hash remainders change. Placement depends directly on node count, so changing it changes many assignments.</p></details>

## Understand (4 minutes)

Two workers read stock 10, each reserve one item, and each write 9. Both writes succeed, but one reservation disappears from the stored count.

Optimistic concurrency adds a version check to the write. Save the new quantity only if the version still matches the one you read. A rejected stale writer must reread and recompute. An atomic write alone does not protect an entire read-modify-write sequence.



Both workers read version 7. A stores 9 at version 8. B’s version-7 attempt fails. B refreshes, subtracts from 9, and stores 8 at version 9. The same rule applies to the four-worker example in the lab.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int remaining = 10; int version = 7;
int seenA = version; int seenB = version;
remaining -= 1; version += 1;
boolean allowB = seenB == version;
seenB = version;
remaining -= 1; version += 1;
```

1. The item begins with ten units.

   Changed values: `{"remaining": "10", "version": "7"}`

2. Both workers read the same version.

   Changed values: `{"seenA": "7", "seenB": "7"}`

3. A’s conditional update succeeds.

   Changed values: `{"remaining": "9", "version": "8"}`

4. B’s stale version is rejected.

   Changed values: `{"allowB": "false"}`

5. B rereads the current state.

   Changed values: `{"seenB": "8"}`

6. The refreshed reservation succeeds in this sequential toy.

   Changed values: `{"remaining": "8", "version": "9"}`

[Full runnable example](examples/software-engineering.java).

Limits: This single-threaded Java example stands for an atomic database condition, not safe unsynchronized Java concurrency. Real retries must revalidate business rules; external effects and multi-Region writes need separate reasoning.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>An individual DynamoDB write is atomic, but a read-modify-write workflow spans time: read quantity 10, decide quantity 9, then write 9. If two workers read 10 and both write 9, one decrement disappears even though both atomic writes succeeded. The missing boundary is whether the item is still the version each worker read.</p><p>Optimistic concurrency control stores a version number. A writer sends both its update and a condition such as <code>Version = 41</code>; the successful write sets the new value and increments the version. A stale writer receives <code>ConditionalCheckFailedException</code>, rereads, recomputes, and decides whether retrying is still valid. The conflict is useful information, not an infrastructure error to hide with a blind retry.</p><p>This fits low-contention, inexpensive single-item work. High contention creates retry amplification. Multi-item invariants need transactions or redesign. DynamoDB global tables reconcile concurrent cross-Region updates with last-writer-wins, so a per-item version check in one Region does not provide the same global optimistic-lock guarantee.</p><h3>Original detailed example</h3><p><strong>Worked example:</strong> Four allocators read <code>{remaining: 10, version: 7}</code> and each reserve one unit. Without a condition, every writer stores 9; the final count is 9 even though four reservations were acknowledged. With <code>ConditionExpression: Version = :seen</code>, one write succeeds. The other three conflict, reread versions 8, 9, and 10 over successive rounds, and the final count is 6.</p><pre>SET remaining = :new, Version = :seen + 1
CONDITION Version = :seen</pre><p>That protects the database value. It does not make an external payment, Kafka publish, or warehouse write atomic with the DynamoDB update; those need an idempotent workflow, outbox, or transaction boundary suited to the systems involved.</p>

</details>

## Explore (remaining exploration time)

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
