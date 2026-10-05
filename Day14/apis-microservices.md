# One author query, not three: GraphQL request batching

APIs & Microservices · Day14 · 15 minutes

Remove a GraphQL N+1 query pattern by batching repeated author lookups once per request.

## Recall (2 minutes)

<p><a href="../Day11/apis-microservices.html">Day11: Write the order form down: an OpenAPI request contract</a></p><p>A body contains only sku: MUG. Both required settings are present. What fails?</p><details><summary>Recall first, then reveal the refresher</summary><p>The required quantity field check. The body exists, so its presence check passes. The object lacks quantity. A properties declaration neither requires a field nor inserts a default.</p></details><p><a href="../Day13/apis-microservices.html">Day13: Add, migrate, remove: evolve an API field safely</a></p><p>Why does replacing name with display_name break an old v1 client?</p><details><summary>Recall first, then reveal the refresher</summary><p>The client still reads name, which disappeared. A rename is remove-plus-add. The old client&#x27;s expected field is gone.</p></details>

## Understand (4 minutes)

A waiter does not walk to the kitchen separately for every item on one table’s order. The waiter gathers the slips and makes one trip.

GraphQL field resolvers run independently. If three posts each resolve an author by calling the database, you can get one query for posts plus three author queries. That is the N+1 problem.

Posts query1 database call

Three resolversu1, u2, u1

Request loaderbatch [u1, u2] in 1 call

Naive: 4 calls · batched: 2 calls



The response contains posts P1, P2, and P3. Their author IDs are u1, u2, and u1.

Fetch the posts: one query.Each resolver calls loader.load(authorId).The loader collects keys for the same execution turn.It fetches unique authors u1 and u2 in one database call and returns results in key order.userLoader = new DataLoader(ids => getUsersByIds(ids))
resolve(post, _, ctx) {
  return ctx.userLoader.load(post.authorId)
}

Create the loader per request. A long-lived cross-user cache can return stale data or leak information across authorization contexts.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
posts = [{'id': 'P1', 'author': 'u1'}, {'id': 'P2', 'author': 'u2'}, {'id': 'P3', 'author': 'u1'}]
naive_author_calls = len(posts)
naive_total_calls = 1 + naive_author_calls
batch_keys = list(dict.fromkeys(post['author'] for post in posts))
batched_author_calls = 1 if batch_keys else 0
batched_total_calls = 1 + batched_author_calls
```

1. Use three posts with one repeated author.

   Changed values: `{"posts": [{"id": "P1", "author": "u1"}, {"id": "P2", "author": "u2"}, {"id": "P3", "author": "u1"}]}`

2. Without coordination, each field resolver performs its own author lookup.

   Changed values: `{"naive_author_calls": 3, "naive_total_calls": 4}`

3. The request loader keeps first-seen order and removes duplicate u1.

   Changed values: `{"batch_keys": ["u1", "u2"]}`

4. One posts query plus one author batch reduces four calls to two.

   Changed values: `{"batched_author_calls": 1, "batched_total_calls": 2}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executes Python call-count arithmetic. It does not run GraphQL.js, DataLoader, a database, asynchronous scheduling, or authorization checks.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Batching is not a license for unbounded <code>IN</code> queries. Cap batch size, keep authorization in the data access path, expose per-operation database-call metrics, and combine batching with GraphQL operation complexity controls.</p>

</details>

## Explore (remaining exploration time)

Add or remove posts. Compare naive resolver calls with one request-scoped batch, including repeated author IDs.

Open apis-microservices.html for the executable model.

Model limits: The model counts logical database calls. It does not model SQL limits, batching windows, async scheduling, authorization, cache invalidation, errors per key, or the required result ordering in a real DataLoader batch function.

## Quiz (4 minutes)

1. Three posts have author IDs u1, u2, u1. How many author keys should the request batch fetch?
   - Three separate keys including duplicate u1
   - Two unique keys: u1 and u2
   - No author keys

2. Why create a DataLoader per request?
   - To keep caching scoped to the request and its authorization context
   - Because GraphQL forbids arrays
   - To make every cache permanent

3. What contract must the batch function preserve?
   - Results correspond to input keys in the same order
   - Every key must return the same user
   - The database must use GraphQL internally

4. Explain why independent resolvers create N+1 without coordination.
5. If u2 is forbidden for this caller, where should authorization be enforced?

<details><summary>Answer key — attempt first</summary>

1. Two unique keys: u1 and u2. The request cache deduplicates the repeated u1 lookup, and the batch fetches u1 and u2 together.

2. To keep caching scoped to the request and its authorization context. Request scope avoids unintended reuse across users and limits staleness.

3. Results correspond to input keys in the same order. DataLoader requires each output position to line up with the corresponding input key.

</details>

## Sources

- [GraphQL.js: Solving the N+1 Problem with DataLoader](https://www.graphql-js.org/docs/n1-dataloader/) — Living GraphQL.js documentation; checked 2026-10-04; checked 2026-10-04.
- [DataLoader repository and API](https://github.com/graphql/dataloader) — Primary open-source implementation documentation; living source; checked 2026-10-04.
