# One fetch, many callers: request coalescing

Software engineering · Day12 · 15 minutes

Let concurrent callers for the same key share one in-flight operation without pretending it is a persistent cache.

## Recall (2 minutes)

<p><a href="../Day9/software-engineering.html">Day9: Merkle trees: localize replica drift before repairing it</a></p><p>Two replicas have equal Merkle roots built from the same canonical range. What is the useful inference?</p><details><summary>Recall first, then reveal the refresher</summary><p>Their summarized contents match with the assurance of the hash. The root summarizes current canonical contents; it says nothing about history or future drift.</p></details><p><a href="../Day4/software-engineering.html">Day4: Protobuf evolution: the field number is the contract</a></p><p>A V2 producer adds tag 3. What does a V1 binary parser do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treats tag 3 as an unknown field. Adding a field is binary wire-safe; old code does not recognize its application meaning.</p></details>

## Understand (4 minutes)

Three checkout requests ask for the same price at nearly the same time. If all three call the slow catalog service, one burst becomes three identical calls. Instead, the first caller starts the fetch. The other two wait for that same result.

This is request coalescing, often called singleflight: one operation is in flight for a key at a time. Callers for a different key may run in parallel.

Caller A · MUGStarts the catalog fetch

Caller B · MUGWaits for A

Caller C · PLATEStarts a separate fetch

MUG → one shared result · PLATE → another result

It is not a lasting cache. After the MUG fetch finishes and leaves the in-flight map, a later MUG request may call the catalog again.



At time 0, A asks for MUG and becomes the leader. At time 1, B asks for MUG and becomes a waiter. At time 2, C asks for PLATE and becomes another leader because the key differs. When MUG finishes, A and B receive the same value.

value, error, shared = group.do(key, load)

The result includes failures. If the leader times out, current waiters see that same error. Coalescing reduces duplicate load; it does not make an unreliable dependency reliable. Add appropriate deadlines, retry policy, and a real cache separately.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
requests = ["MUG", "MUG", "PLATE"]
leaders = []
for key in requests:
    if key not in leaders:
        leaders.append(key)
loader_calls = len(leaders)
results = [f"price:{key}" for key in requests]
shared = [requests.count(key) > 1 for key in requests]
```

1. Three callers overlap; two use the same key.

   Changed values: `{"requests": ["MUG", "MUG", "PLATE"]}`

2. The first occurrence of each key becomes a leader.

   Changed values: `{"leaders": ["MUG", "PLATE"], "key": "PLATE"}`

3. Only two underlying loads run: MUG and PLATE.

   Changed values: `{"loader_calls": 2}`

4. Both MUG callers receive the same logical result; PLATE is not shared.

   Changed values: `{"results": ["price:MUG", "price:MUG", "price:PLATE"], "shared": [true, true, false]}`

[Full runnable example](examples/software-engineering.py).

Limits: Executes grouping, not concurrent threads. It demonstrates key scope and shared results only.

## Explore (remaining exploration time)

Choose three request keys and decide whether the loader succeeds. Predict the number of actual loads before running the batch.

Open software-engineering.html for the executable model.

Model limits: A deterministic batch model, not real threads. It groups requests that overlap in one teaching window. It omits cancellation, per-caller deadlines, memory cleanup, retries, cache TTLs, and fairness. A shared error is still an error.

## Quiz (4 minutes)

1. A and B request MUG together; C requests PLATE. How many loads start?
   - One
   - Two
   - Three

2. The MUG leader times out. What do current MUG waiters receive?
   - The same timeout result
   - A guaranteed success
   - A stale value from singleflight

3. A new MUG request arrives after the first call finished. What is guaranteed?
   - It always reuses the old result
   - It may start a new load
   - It is rejected forever

4. Explain why coalescing by product key reduces a burst without serializing every product.
5. What per-caller deadline problem appears when one slow leader has many waiters?

<details><summary>Answer key — attempt first</summary>

1. Two. One MUG leader and one PLATE leader run. Only callers with the same key share work.

2. The same timeout result. Waiters receive the original call's result, including its error. Singleflight is not a cache or retry engine.

3. It may start a new load. Once no call is in flight, coalescing alone retains no persistent value. A later request may execute again.

</details>

## Sources

- [Go x/sync/singleflight package documentation](https://pkg.go.dev/golang.org/x/sync/singleflight) — Living official package documentation; checked 2026-10-02.
