# A savepoint can undo the optional step—not the whole order

Software engineering · Day26 · 15 minutes

Use a database savepoint when one optional operation may fail inside a larger transaction.

## Recall (2 minutes)

<p><a href="../Day20/software-engineering.html">Day20: A clock can move backward: measure elapsed time with a monotonic source</a></p><p>Wall time jumps back 2000 ms during 250 ms of work. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>A negative duration. End wall time can be earlier than start.</p></details><p><a href="../Day22/software-engineering.html">Day22: The reply happened after the request—even when its wall clock says earlier</a></p><p>B wall=95 receives (100,0). Its next HLC is?</p><details><summary>Recall first, then reveal the refresher</summary><p>(100,1). The received physical value wins and the logical counter advances.</p></details>

## Understand (4 minutes)

A cashier rings up an order, then tries to apply optional loyalty points. If the loyalty step fails, you may want to keep the valid order rather than throw away the whole basket. A savepoint is a bookmark inside the transaction: roll back work after the bookmark, then continue.

In PostgreSQL, an error leaves the transaction unable to continue until you roll back to a savepoint (or roll back the transaction).



The order insert succeeds. The loyalty insert violates a constraint. ROLLBACK TO loyalty_step removes only the loyalty work and clears the error state. The order can still commit, provided that this degraded outcome is allowed by the business contract.



## Read the visual

The required order sits before the bookmark. Only work to the right of the bookmark is erased. If the required order fails, the picture deliberately removes every committed row.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a savepoint when a multi-step database transaction has an explicitly optional sub-step and all work lives in the same transactional database.

**Practical example.** Persist an order even when an optional loyalty-credit write fails, then enqueue a repair record inside the same transaction.

**How to decide.** Use a savepoint only when partial success is a valid business state. Roll back everything when the failed step is required for correctness, money movement, or invariants.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rows=['order:42']
state='active'
savepoint=len(rows)
rows.append('loyalty:+10')
state='failed'
rows=rows[:savepoint]
state='active'
rows.append('repair:loyalty')
committed=(state=='active')
```

1. The required order write succeeds.

   Changed values: `{"rows": ["order:42"], "state": "active"}`

2. Bookmark the transaction, then attempt optional work.

   Changed values: `{"rows": ["order:42", "loyalty:+10"], "savepoint": 1}`

3. Simulate the error and ROLLBACK TO the bookmark.

   Changed values: `{"rows": ["order:42"]}`

4. Record the degraded outcome and commit the still-valid transaction.

   Changed values: `{"rows": ["order:42", "repair:loyalty"], "committed": true}`

[Full runnable example](examples/software-engineering.py).

Limits: The local model is not a database and does not model locks, isolation, JDBC driver behavior, nested savepoints, or external services. A savepoint cannot atomically undo a Kafka publish or HTTP call.

## Explore (remaining exploration time)

Choose where the failure happens and step through the transaction timeline. Watch which rows survive.

Open software-engineering.html for the executable model.

Model limits: The local model is not a database and does not model locks, isolation, JDBC driver behavior, nested savepoints, or external services. A savepoint cannot atomically undo a Kafka publish or HTTP call.

## Quiz (4 minutes)

1. After an optional PostgreSQL statement errors, what enables the transaction to continue?
   - Ignore the error
   - ROLLBACK TO the earlier savepoint
   - Open another browser tab

2. When should the whole transaction roll back?
   - A required invariant failed
   - A cosmetic audit field failed and degradation is approved
   - A savepoint has a short name

3. Can a database savepoint undo an already-sent HTTP request?
   - Yes
   - No
   - Only on Tuesdays

4. Which optional database step in your service has a documented degraded outcome?
5. What external side effect would make a savepoint unsafe here?

<details><summary>Answer key — attempt first</summary>

1. ROLLBACK TO the earlier savepoint. Rolling back to the savepoint restores the transaction state before the optional step.

2. A required invariant failed. Required business invariants must remain atomic.

3. No. The savepoint controls work in that database transaction, not external side effects.

</details>

## Sources

- [PostgreSQL 18 SAVEPOINT](https://www.postgresql.org/docs/current/sql-savepoint.html) — PostgreSQL 18.6 documentation; checked 2026-10-16.
- [PostgreSQL 18 ROLLBACK TO SAVEPOINT](https://www.postgresql.org/docs/current/sql-rollback-to.html) — PostgreSQL 18.6 documentation; checked 2026-10-16.
- [PostgreSQL transactions tutorial](https://www.postgresql.org/docs/current/tutorial-transactions.html) — PostgreSQL 18.6 documentation; checked 2026-10-16.
