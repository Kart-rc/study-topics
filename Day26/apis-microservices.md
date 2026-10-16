# Budget GraphQL breadth before nested lists multiply

APIs & Microservices · Day26 · 15 minutes

Estimate nodes in a nested query, then paginate the level that drives growth.

## Recall (2 minutes)

<p><a href="../Day20/apis-microservices.html">Day20: Stop routing before the next RPC: gRPC health Watch</a></p><p>B NOT_SERVING with health enabled?</p><details><summary>Recall first, then reveal the refresher</summary><p>Avoid B. Health changes eligibility.</p></details><p><a href="../Day22/apis-microservices.html">Day22: One idempotency key, one create effect</a></p><p>Retry k-77 with the same payload. Correct outcome?</p><details><summary>Recall first, then reveal the refresher</summary><p>Return the stored result. The repeated intent maps to the original effect and response.</p></details>

## Understand (4 minutes)

Ordering “ten boxes, each with ten folders, each with ten pages” is not ten things—it is more than a thousand nodes. GraphQL lets clients choose shape, so nested list widths multiply.

Depth alone is not the whole problem. A shallow query with broad connections can still be expensive. Require pagination and apply node, point, time, or custom complexity limits.



A GitHub-style query asks for 10 repositories, 10 issues per repository, and 10 comments per issue: 10 repositories + 100 issues + 1,000 comments = 1,110 returned nodes, before other objects.



## Read the visual

The bars are counts by layer, not latency claims. The comments bar grows from both parent widths, making the multiplicative source visible rather than drawing a generic request arrow.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use query-cost controls on GraphQL APIs that expose nested or expensive fields to varied clients.

**Practical example.** A dashboard asks for repositories, issues, and comments in one request and can accidentally multiply work.

**How to decide.** Set field-aware budgets, require pagination on connections, and return a clear error before expensive execution. Prefer smaller pages for nested queries even when the maximum page size is higher.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
repos=10
issues_each=10
comments_each=10
issue_nodes=repos*issues_each
comment_nodes=issue_nodes*comments_each
total_nodes=repos+issue_nodes+comment_nodes
within_budget=(total_nodes<=1000)
```

1. Set the width of each connection.

   Changed values: `{"repos": 10, "issues_each": 10, "comments_each": 10}`

2. Issues multiply by repository count.

   Changed values: `{"issue_nodes": 100}`

3. Comments multiply again.

   Changed values: `{"comment_nodes": 1000}`

4. The 1,110-node shape exceeds the synthetic budget.

   Changed values: `{"total_nodes": 1110, "within_budget": false}`

[Full runnable example](examples/apis-microservices.py).

Limits: This arithmetic model treats every node equally. Real GraphQL cost depends on resolvers, caches, fan-out, authorization, database plans, federation, timeouts, and provider-specific formulas.

## Explore (remaining exploration time)

Change list widths. The visual calculates each layer and shows which pagination cut reduces the total most.

Open apis-microservices.html for the executable model.

Model limits: This arithmetic model treats every node equally. Real GraphQL cost depends on resolvers, caches, fan-out, authorization, database plans, federation, timeouts, and provider-specific formulas.

## Quiz (4 minutes)

1. 10 repos × 10 issues × 10 comments produces how many comment nodes?
   - 30
   - 100
   - 1000

2. Why is a depth limit alone insufficient?
   - A shallow query can still request broad lists
   - Depth never matters
   - GraphQL has no lists

3. What should the server do before executing an over-budget query?
   - Return a documented cost/limit error
   - Run it forever
   - Ignore authorization

4. Which fields in your schema need higher complexity weights than a plain node count?
5. What partial-data behavior should a client expect after a cost rejection?

<details><summary>Answer key — attempt first</summary>

1. 1000. Nested list widths multiply.

2. A shallow query can still request broad lists. Breadth can dominate even at modest depth.

3. Return a documented cost/limit error. Admission control should reject work before expensive fan-out.

</details>

## Sources

- [GitHub GraphQL rate and query limits](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api) — Living documentation; checked 2026-10-16.
- [GitHub GraphQL pagination guide](https://docs.github.com/en/graphql/guides/using-pagination-in-the-graphql-api) — Living documentation; checked 2026-10-16.
- [GraphQL specification](https://spec.graphql.org/) — Living specification; checked 2026-10-16.
