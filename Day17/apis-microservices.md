# Keyset pagination: continue after a row, not a position

APIs & Microservices · Day17 · 15 minutes

Keep the next API page stable when earlier rows are inserted.

## Recall (2 minutes)

<p><a href="../Day14/apis-microservices.html">Day14: One author query, not three: GraphQL request batching</a></p><p>Three posts have author IDs u1, u2, u1. How many author keys should the request batch fetch?</p><details><summary>Recall first, then reveal the refresher</summary><p>Two unique keys: u1 and u2. The request cache deduplicates the repeated u1 lookup, and the batch fetches u1 and u2 together.</p></details><p><a href="../Day16/apis-microservices.html">Day16: One error shape, stable meaning: RFC 9457 Problem Details</a></p><p>Which field should machine logic use as the primary problem identifier?</p><details><summary>Recall first, then reveal the refresher</summary><p>The type URI. RFC 9457 defines type as the primary problem identifier; detail is human-readable.</p></details>

## Understand (4 minutes)

You bookmark a book with “after the paragraph about B.” Someone inserts a page near the front. Your paragraph bookmark still works; “skip two paragraphs” lands somewhere else.

Offset pagination counts positions. Keyset pagination remembers the last row’s ordering values and asks for rows after them. Use a unique order: here (created_at, id). The ID breaks ties between equal timestamps.

Page 1(10,A), (10,B); cursor=(10,B)

An earlier row arrivesX at time 5 shifts A and B forward

Page 2Offset 2: B,C; after (10,B): C,D



Start with A,B,C,D. Page 1 returns A,B. Insert X before them. Skipping two rows now repeats B. Seeking after (10,B) returns C,D.

SELECT created_at, id FROM events
WHERE (created_at, id) > (:last_time, :last_id)
ORDER BY created_at, id
LIMIT 2;

For this non-null ascending order, a matching composite index supports the seek. The SQL is a reference snippet; the Python replay executes equivalent tuple comparisons on a list.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** A list API has many pages or frequent inserts, and clients mostly move forward through sorted results.

**Practical example.** An event-catalog endpoint returns records after its last (ingested_at, event_id) cursor. Bind cursors to tenant, filters, and ordering, and validate them before querying.

**How to decide.** Choose keyset for forward traversal with a suitable index. Offset is simpler for small static lists and page-number navigation. A consistent full export may also need a snapshot or cutoff: a cursor alone is not a snapshot.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rows = [(10,"A"), (10,"B"), (20,"C"), (30,"D")]
page1 = rows[:2]
cursor = page1[-1]
rows.insert(0, (5,"X"))
offset_page2 = rows[2:4]
keyset_page2 = [row for row in rows if row > cursor][:2]
```

1. The last row becomes bookmark (10,B).

   Changed values: `{"rows": [[10, "A"], [10, "B"], [20, "C"], [30, "D"]], "page1": [[10, "A"], [10, "B"]], "cursor": [10, "B"]}`

2. X changes positions, not bookmark values.

   Changed values: `{"rows": [[5, "X"], [10, "A"], [10, "B"], [20, "C"], [30, "D"]]}`

3. Skipping two repeats B.

   Changed values: `{"offset_page2": [[10, "B"], [20, "C"]]}`

4. Seeking after (10,B) returns C,D.

   Changed values: `{"keyset_page2": [[20, "C"], [30, "D"]]}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executed Python list example, not PostgreSQL. Non-null values, ascending order, simple A–D IDs.

## Explore (remaining exploration time)

Insert X between page requests and compare methods. Then use a one-row first page to see why a timestamp-only cursor skips B.

Open apis-microservices.html for the executable model.

Model limits: JavaScript filters synthetic tuples; it does not execute SQL or sign cursors. Rows inserted behind the cursor can be missed. Changes to sort keys, deletion, null ordering, direction, and collation need explicit treatment in a real API.

## Quiz (4 minutes)

1. After page A,B and insertion of X before A, what does OFFSET 2 return?
   - C,D
   - X,A
   - B,C

2. After a one-row page ends at A with time 10, why include ID?
   - B shares that time and must not be skipped
   - It makes data immutable
   - It encrypts the cursor

3. Will keyset include every later row inserted behind its cursor?
   - Yes
   - No; it is not a snapshot or change stream
   - Only with larger LIMIT

4. Which index and cursor fields suit a tenant-scoped event API?
5. How does a consistent export requirement change your design?

<details><summary>Answer key — attempt first</summary>

1. B,C. Positions shift. B becomes third and is returned again.

2. B shares that time and must not be skipped. Seeking strictly after time 10 skips B. Tuple (10,B) follows (10,A).

3. No; it is not a snapshot or change stream. A seek returns rows beyond the current boundary. Complete export is a separate requirement.

</details>

## Sources

- [GitLab: keyset pagination](https://docs.gitlab.com/development/database/keyset_pagination/) — Living documentation; unique ordering and cursor design; checked 2026-10-07.
- [PostgreSQL 18: LIMIT and OFFSET](https://www.postgresql.org/docs/current/queries-limit.html) — Version 18 documentation; ordering and offset behavior; checked 2026-10-07.
