# One lock order breaks the deadlock cycle

Software engineering · Day25 · 15 minutes

Prevent a two-resource deadlock by requiring every transaction to acquire locks in the same order.

## Recall (2 minutes)

<p><a href="../Day21/software-engineering.html">Day21: Publish one configuration snapshot, not three changing fields</a></p><p>Reader sees {1000,0,B}. What does that prove?</p><details><summary>Recall first, then reveal the refresher</summary><p>It combined separately published fields. That tuple exists in neither v1 nor v2.</p></details><p><a href="../Day9/software-engineering.html">Day9: Merkle trees: localize replica drift before repairing it</a></p><p>Two replicas have equal Merkle roots built from the same canonical range. What is the useful inference?</p><details><summary>Recall first, then reveal the refresher</summary><p>Their summarized contents match with the assurance of the hash. The root summarizes current canonical contents; it says nothing about history or future drift.</p></details>

## Understand (4 minutes)

Two people enter a narrow hallway from opposite ends. Each waits for the other to move. A database deadlock is the same shape: transaction A holds account 7 and waits for 9; transaction B holds 9 and waits for 7.

A consistent lock order removes the circle. If every transfer locks the smaller account ID first, only one transaction can enter the pair; the other waits without holding the second half of a cycle.



Transfer T1 moves $10 from account 7 to 9. Transfer T2 moves $5 from 9 to 7. The broken version locks “from” first and deadlocks. The fixed version locks min(7,9) then max(7,9).



## Read the visual

In the broken view, trace the arrows 7 → T1 → 9 → T2 → 7. Ordering both requests as 7 then 9 removes the circular wait; waiting can remain, but the cycle cannot.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a lock-order rule when transactions routinely lock more than one shared row or object and deadlocks appear under concurrency.

**Practical example.** Two account transfers touch the same pair in opposite directions.

**How to decide.** Prefer a simple global order when the lock set is known. Still catch and retry deadlock victims because dynamic queries, indexes and other code paths can introduce cycles.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int t1First=7; int t1Second=9;
int t2First=9; int t2Second=7;
boolean cycle=(t1First==t2Second && t2First==t1Second);
int orderedFirst=Math.min(7,9);
int orderedSecond=Math.max(7,9);
boolean sameOrder=(orderedFirst==7 && orderedSecond==9);
```

1. The broken paths request the same rows in opposite orders.

   Changed values: `{"t1First": "7", "t1Second": "9", "t2First": "9", "t2Second": "7"}`

2. Each holds what the other wants, forming a cycle.

   Changed values: `{"cycle": "true"}`

3. Both transactions now request 7 before 9.

   Changed values: `{"orderedFirst": "7", "orderedSecond": "9"}`

4. One may wait, but it waits before holding the second half of a cycle.

   Changed values: `{"sameOrder": "true"}`

[Full runnable example](examples/software-engineering.java).

Limits: This deterministic browser schedule illustrates one interleaving. A real database chooses locks from query plans and may deadlock through indexes, predicates or unrelated code. Consistent ordering reduces a class of deadlocks; it does not replace bounded retries.

## Explore (remaining exploration time)

Toggle ordered locking and step through both transfers. Find the exact wait-for cycle.

Open software-engineering.html for the executable model.

Model limits: This deterministic browser schedule illustrates one interleaving. A real database chooses locks from query plans and may deadlock through indexes, predicates or unrelated code. Consistent ordering reduces a class of deadlocks; it does not replace bounded retries.

## Quiz (4 minutes)

1. T1 holds 7 and waits for 9; T2 holds 9 and waits for 7. What exists?
   - A queue only
   - A wait-for cycle
   - A read skew

2. Which rule prevents this two-row cycle?
   - Lock the source account first
   - Both lock the smaller account ID first
   - Sleep before commit

3. Why keep retry logic?
   - Deadlocks can still arise through other lock paths
   - Ordering makes commits optional
   - Retries unlock rows

4. Where would you enforce a lock-order contract in a large codebase?
5. What retry limit and metric would reveal that prevention is incomplete?

<details><summary>Answer key — attempt first</summary>

1. A wait-for cycle. Each transaction waits for a resource held by the other.

2. Both lock the smaller account ID first. A shared total order prevents opposite acquisition order.

3. Deadlocks can still arise through other lock paths. The rule covers only lock paths that follow it; databases may find other cycles.

</details>

## Sources

- [PostgreSQL explicit locking and deadlocks](https://www.postgresql.org/docs/current/explicit-locking.html) — PostgreSQL current documentation; checked 2026-10-15.
- [PostgreSQL LOCK](https://www.postgresql.org/docs/current/sql-lock.html) — PostgreSQL current documentation; checked 2026-10-15.
