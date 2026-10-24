# If a map key changes, the entry does not move

Software engineering · Day34 · 15 minutes

See why mutable fields used by equals and hashCode can make a stored Java key unreachable.

## Recall (2 minutes)

<p><a href="../Day26/software-engineering.html">Day26: A savepoint can undo the optional step—not the whole order</a></p><p>After an optional PostgreSQL statement errors, what enables the transaction to continue?</p><details><summary>Recall first, then reveal the refresher</summary><p>ROLLBACK TO the earlier savepoint. Rolling back to the savepoint restores the transaction state before the optional step.</p></details><p><a href="../Day14/software-engineering.html">Day14: Write the recovery note first: WAL before data pages</a></p><p>The crash happens after WAL is flushed but before the data page is written. What restores stock=4?</p><details><summary>Recall first, then reveal the refresher</summary><p>REDO from the WAL record. The durable log contains the committed change, so recovery can redo it.</p></details>

## Understand (4 minutes)

A library puts a book on shelf 2 because its call number begins with B. If someone changes the label to Z without moving the book, the catalog now sends readers to shelf 7. The book still exists, but lookup misses it.

A hash map chooses a bucket from the key's hash code. If a field used by equals or hashCode changes after insertion, the entry stays in its old bucket while a new lookup searches another bucket.



An order-cache key starts as tenant east, order 42, with bucket 1. Code mutates the same key to tenant west. A lookup hashes west:42 to bucket 3. The stored entry did not move, so get can return null.



## Read the visual

The buckets answer why the object can still be present yet unreachable: mutation moves the probe, not the stored entry.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use hash maps for stable identifiers, deduplication keys, caches, and grouping only when the key's equality-defining state will not change while stored.

**Practical example.** A cache uses (tenant, orderId) as the key. Model it as an immutable Java record instead of a mutable request object.

**How to decide.** Prefer immutable records, strings, UUIDs, or copied key objects. If identity really changes, remove the old key before mutation and insert a new key. Do not try to repair a map by relying on an implementation's current bucket layout.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
record OrderKey(String tenant, int orderId) {}
var cache = new java.util.HashMap<OrderKey, String>();
var east42 = new OrderKey("east", 42); cache.put(east42, "shipped");
var lookup = cache.get(new OrderKey("east", 42));
```

1. Define an immutable key whose equality fields cannot change.

   Changed values: `{}`

2. Create the map.

   Changed values: `{"cache": "{}"}`

3. Insert one stable key and value.

   Changed values: `{"cache": "{OrderKey[tenant=east, orderId=42]=shipped}", "east42": "OrderKey[tenant=east, orderId=42]"}`

4. An equal immutable key retrieves shipped.

   Changed values: `{"lookup": "shipped"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser uses a simple four-bucket teaching hash, not Java HashMap's spread function, resizing, tree bins, collisions, or implementation details. The Java replay demonstrates the public Map contract boundary, not guaranteed bucket numbers.

## Explore (remaining exploration time)

Change the tenant after insertion. The visual keeps the entry in its original bucket and moves only the lookup probe.

Open software-engineering.html for the executable model.

Model limits: The browser uses a simple four-bucket teaching hash, not Java HashMap's spread function, resizing, tree bins, collisions, or implementation details. The Java replay demonstrates the public Map contract boundary, not guaranteed bucket numbers.

## Quiz (4 minutes)

1. A key's tenant field affects equals/hashCode and changes after put. What is specified?
   - Map behavior is unspecified
   - The entry moves automatically
   - The map rehashes every get

2. Why can get return null even when iteration still shows the entry?
   - Lookup searches using the new hash while the entry remains stored under the old placement
   - Iteration deletes keys
   - Null means the map is empty

3. Best key for (tenant, orderId)?
   - An immutable record
   - A mutable request DTO
   - A reused StringBuilder

4. Which objects in your services are currently used as map or set keys, and are their identity fields immutable?
5. What test would expose a key mutation bug before it reaches a cache under load?

<details><summary>Answer key — attempt first</summary>

1. Map behavior is unspecified. The Java Map contract warns against equality-affecting key mutation.

2. Lookup searches using the new hash while the entry remains stored under the old placement. The object's current identity and stored location no longer agree.

3. An immutable record. Stable equality and hash state keep lookup behavior coherent.

</details>

## Sources

- [Java SE 21 Map contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html) — Living Java API documentation; checked 2026-10-24.
- [Java SE Object hashCode contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html#hashCode()) — Living Java API documentation; checked 2026-10-24.
