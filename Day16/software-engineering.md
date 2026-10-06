# Both saw a safe world: snapshot-isolation write skew

Software engineering · Day16 · 15 minutes

See how two transactions can update different rows and still break one shared business rule, then understand why serializable isolation may abort one transaction.

## Recall (2 minutes)

<p><a href="../Day7/software-engineering.html">Day7: Deadline propagation: pass the remaining budget</a></p><p>A service spends 140 ms of a 500 ms deadline before a child call. What budget should the child receive?</p><details><summary>Recall first, then reveal the refresher</summary><p>360 ms. Propagation deducts elapsed time from the original end-to-end budget.</p></details><p><a href="../Day1/software-engineering.html">Day1: When retries multiply an outage</a></p><p>Four layers each allow two total attempts. Worst-case leaf calls?</p><details><summary>Recall first, then reveal the refresher</summary><p>16. The nested multiplication is 2⁴ = 16.</p></details>

## Understand (4 minutes)

Two doctors, Alice and Bob, are on call. The rule is simple: at least one doctor must remain available.

Alice and Bob each start a transaction at the same time. Each sees the same snapshot: both doctors are available. Each takes only their own name off the schedule. Because they update different rows, there is no direct row-write conflict.


Alice’s snapshotAlice ✓ · Bob ✓

Bob’s snapshotAlice ✓ · Bob ✓

Both commitAlice ✗ · Bob ✗

Two individually reasonable decisions create one impossible schedule.

This is write skew: transactions write different rows, but their decisions depend on an overlapping set of rows.



Under PostgreSQL Repeatable Read, both transactions can keep their starting snapshots. Alice writes only Alice’s row; Bob writes only Bob’s row. The rule is broken even though neither overwrote the other.

Under Serializable isolation, PostgreSQL tracks read/write dependencies. If both commits would produce a result impossible under any one-at-a-time order, one transaction fails with SQLSTATE 40001. The application must retry the whole transaction. On retry, the loser sees only one doctor left and stays on call.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
snapshot = {'Alice': True, 'Bob': True}
alice_saw_backup = snapshot['Bob']
bob_saw_backup = snapshot['Alice']
repeatable_result = snapshot.copy()
if alice_saw_backup:
    repeatable_result['Alice'] = False
if bob_saw_backup:
    repeatable_result['Bob'] = False
serializable_result = snapshot.copy()
serializable_result['Alice'] = False
bob_aborted = True
if bob_aborted and not serializable_result['Alice']:
    serializable_result['Bob'] = True
repeatable_on_call = sum(repeatable_result.values())
serializable_on_call = sum(serializable_result.values())
```

1. Both transactions read the same two-doctor snapshot.

   Changed values: `{"snapshot": {"Alice": true, "Bob": true}, "alice_saw_backup": true, "bob_saw_backup": true}`

2. Each writes a different row. Snapshot isolation allows the unsafe combination in this toy.

   Changed values: `{"repeatable_result": {"Alice": false, "Bob": false}}`

3. Serializable dependency checking chooses one transaction to abort.

   Changed values: `{"serializable_result": {"Alice": false, "Bob": true}, "bob_aborted": true}`

4. Bob retries, sees Alice already off, and remains on call.

   Changed values: `{"repeatable_on_call": 0, "serializable_on_call": 1}`

[Full runnable example](examples/software-engineering.py).

Limits: The code records the logical anomaly and retry; it does not run PostgreSQL or reproduce its predicate-lock implementation.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>PostgreSQL 18 describes Repeatable Read as snapshot isolation and explicitly allows serialization anomalies. Serializable adds dependency monitoring without making every operation block, but applications must handle serialization failures—normally SQLSTATE <code>40001</code>—with a full retry.</p>

</details>

## Explore (remaining exploration time)

Switch between Repeatable Read and Serializable. Predict whether both transactions commit and how many doctors remain.

Open software-engineering.html for the executable model.

Model limits: This model demonstrates one two-row invariant. Real database behavior depends on the product and isolation level. Serializable can abort transactions that look safe locally, so retry the complete transaction and ignore results from the aborted attempt. Explicit locks or a different data model can also enforce some invariants.

## Quiz (4 minutes)

1. Under the toy Repeatable Read run, what is the final schedule?
   - Both doctors are off call
   - Alice stays on
   - Both transactions must conflict on one row

2. Why can Serializable reject one commit?
   - The combined result has no equivalent one-at-a-time order
   - Serializable always allows only one transaction
   - It detects matching user names

3. What must the application do after SQLSTATE 40001?
   - Retry the entire transaction from a fresh snapshot
   - Commit the old partial result
   - Reuse decisions from the aborted transaction

4. Explain why row-level conflict detection alone misses the on-call rule.
5. When would an explicit lock or redesigned invariant row be preferable to generalized Serializable retries?

<details><summary>Answer key — attempt first</summary>

1. Both doctors are off call. Each transaction changes a different row, so the shared invariant can fail.

2. The combined result has no equivalent one-at-a-time order. Serializable permits only outcomes consistent with some serial order.

3. Retry the entire transaction from a fresh snapshot. PostgreSQL says aborted transaction results must be ignored and the whole transaction retried.

</details>

## Sources

- [PostgreSQL 18: Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) — Living PostgreSQL 18 documentation; Repeatable Read, Serializable, and retries; checked 2026-10-06.
- [PostgreSQL wiki: Serializable Snapshot Isolation](https://wiki.postgresql.org/wiki/SSI) — Foundation; worked write-skew examples; checked 2026-10-06.
