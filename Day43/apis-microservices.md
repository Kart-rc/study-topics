# Let one service own each write; copy facts for cross-service reads

APIs & Microservices · Day43 · 15 minutes

Use service-owned persistence to reduce schema coupling while making distributed queries and consistency costs explicit.

## Recall (2 minutes)

<p><a href="../Day25/apis-microservices.html">Day25: A field mask says exactly what PATCH may change</a></p><p>Payload contains alerts=false, but update_mask is timezone. What happens to alerts?</p><details><summary>Recall first, then reveal the refresher</summary><p>It stays unchanged. Only paths named in the mask participate in the update.</p></details><p><a href="../Day29/apis-microservices.html">Day29: gRPC retries stop when response headers commit the RPC</a></p><p>When does gRPC consider the RPC committed for retry purposes?</p><details><summary>Recall first, then reveal the refresher</summary><p>When response headers are received. After response headers, no further automatic retries are attempted.</p></details>

## Understand (4 minutes)

Two households can share a fence, but one should not rearrange the other household's kitchen cupboards.

With database-per-service, each service owns its persistent data and exposes it through an API or published facts. Another service does not reach into its tables. This reduces schema and deployment coupling, but cross-service transactions and joins become harder; API composition, CQRS read models, events, or sagas carry that cost.



Order Service owns orders.total. Shipping Service needs the amount to choose insurance. If it queries the table directly, renaming total breaks Shipping. If Order publishes a versioned OrderPriced fact, Shipping stores order_total in its own read model and evolves against the event contract.



## Read the visual

The ownership diagram makes the hidden shared-schema contract break on rename while the explicit event-built read model remains locally readable.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use service-owned data when teams need independent deployment, scaling, security boundaries, or different persistence technology.

**Practical example.** Order writes Aurora while Shipping stores a DynamoDB read model built from order events.

**How to decide.** Keep a shared database for a genuinely single bounded system or early small application when independent ownership is not needed. Split ownership only with a plan for cross-service queries, transactions, schema evolution, replay, and operational support.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
order_table={'order_id':'O-42','total':50}; shipping_sql_column='total'
order_table={'order_id':'O-42','amount':50}; direct_read=order_table.get(shipping_sql_column)
event={'type':'OrderPriced.v1','order_id':'O-42','order_total':50}; shipping_view={event['order_id']:event['order_total']}
shipping_quote=shipping_view['O-42']*0.02; consistency='eventual'
```

1. Both services initially depend on one table column.

   Changed values: `{"order_table": {"order_id": "O-42", "total": 50}, "shipping_sql_column": "total"}`

2. Order renames its private column; the hidden consumer gets no value.

   Changed values: `{"order_table": {"order_id": "O-42", "amount": 50}, "direct_read": null}`

3. An explicit event contract builds a Shipping-owned read model.

   Changed values: `{"event": {"type": "OrderPriced.v1", "order_id": "O-42", "order_total": 50}, "shipping_view": {"O-42": 50}}`

4. Shipping reads locally, with asynchronous consistency as the declared tradeoff.

   Changed values: `{"shipping_quote": 1.0, "consistency": "eventual"}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model uses one event and one schema rename. It does not implement delivery guarantees, outbox, ordering, replay, authorization, transactions, schema registry, deletions, privacy propagation, lag, or reconciliation.

## Explore (remaining exploration time)

Toggle direct table access versus a copied read model, then rename the Order column. Watch which contract breaks and which data may become stale.

Open apis-microservices.html for the executable model.

Model limits: The model uses one event and one schema rename. It does not implement delivery guarantees, outbox, ordering, replay, authorization, transactions, schema registry, deletions, privacy propagation, lag, or reconciliation.

## Quiz (4 minutes)

1. Order renames a private column while Shipping queries it directly. What happens?
   - Shipping can break despite no Shipping deployment
   - The database rewrites Shipping automatically
   - The API contract protects the SQL query

2. Why copy an OrderPriced fact into Shipping's read model?
   - Shipping can read locally against an explicit event contract
   - It creates a distributed ACID transaction
   - It removes all consistency lag

3. When may one shared database be the simpler choice?
   - A small single bounded system without independent ownership needs
   - Whenever services have different compliance boundaries
   - When every team must deploy independently

4. Which current database table has writers or direct readers from more than one service?
5. What replay, lag, deletion, and reconciliation obligations would a copied read model add?

<details><summary>Answer key — attempt first</summary>

1. Shipping can break despite no Shipping deployment. Direct table access makes the private schema a hidden cross-service contract.

2. Shipping can read locally against an explicit event contract. Local reads and explicit contracts reduce coupling, while accepting asynchronous consistency work.

3. A small single bounded system without independent ownership needs. Splitting persistence adds real operational and consistency cost; do it for a clear boundary.

</details>

## Sources

- [AWS Prescriptive Guidance: Database-per-service pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/database-per-service.html) — Official architecture guidance; checked November 2, 2026; checked 2026-11-02.
- [AWS Prescriptive Guidance: Data persistence patterns for microservices](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/) — Official pattern catalog; checked November 2, 2026; checked 2026-11-02.
