# A saga compensation is a new business action—not a database rewind

APIs & Microservices · Day44 · 15 minutes

Use compensating transactions to restore business intent across service-owned databases while making failed compensation visible.

## Recall (2 minutes)

<p><a href="../Day31/apis-microservices.html">Day31: A null child can erase its non-null parent</a></p><p>A non-null leaf resolves to null. What happens first?</p><details><summary>Recall first, then reveal the refresher</summary><p>A field error propagates to the nearest nullable parent. The non-null contract forces error propagation.</p></details><p><a href="../Day19/apis-microservices.html">Day19: Verify the exact webhook bytes before parsing</a></p><p>Body changes from amount 50 to 500 but header stays the same. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>HMAC mismatch. The secret-backed digest covers the payload bytes; changing them invalidates the old header.</p></details>

## Understand (4 minutes)

A hotel cannot erase yesterday. If a trip is cancelled, it creates a cancellation and refund; it does not rewind every system to an earlier instant.

A saga splits one business transaction into local service transactions. If a later step fails, compensating transactions perform business reversals. Compensation can also fail, so the workflow needs durable state, idempotent commands, retries, and a visible manual-repair path.



Order creates order O-42, Inventory reserves one item, then Payment declines. The orchestrator sends ReleaseInventory and CancelOrder. If release succeeds, the business outcome is cancelled with inventory available. If release fails, the system is not “rolled back”; it is in a repair-required state.



## Read the visual

The three service records remain visible through forward failure and compensation, so the learner sees a new cancelled state rather than a fictional time rewind.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a saga when one business operation spans service-owned databases and holding a distributed lock or global ACID transaction is unavailable or undesirable.

**Practical example.** An order spans Order, Inventory, and Payment services with independent persistence and potentially long-running steps.

**How to decide.** Prefer one local transaction when the data belongs in one service. Use a saga only with explicit compensations, durable orchestration/choreography, idempotency, concurrency rules, observability, and product-approved meanings for partial or irreversible effects.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
order={'id':'O-42','state':'PENDING'}; inventory={'sku':'S-7','state':'AVAILABLE'}
inventory['state']='RESERVED'; order['state']='PAYMENT_PENDING'
payment={'state':'DECLINED'}; compensation_needed=payment['state']=='DECLINED'
inventory['state']='AVAILABLE'; order['state']='CANCELLED'; outcome='compensated, not rewound'
```

1. Start with one order and one available item.

   Changed values: `{"order": {"id": "O-42", "state": "PENDING"}, "inventory": {"sku": "S-7", "state": "AVAILABLE"}}`

2. The inventory service commits its local reservation.

   Changed values: `{"order": {"id": "O-42", "state": "PAYMENT_PENDING"}, "inventory": {"sku": "S-7", "state": "RESERVED"}}`

3. Payment fails after the reservation already exists.

   Changed values: `{"payment": {"state": "DECLINED"}, "compensation_needed": true}`

4. New local transactions release inventory and record cancellation.

   Changed values: `{"order": {"id": "O-42", "state": "CANCELLED"}, "inventory": {"sku": "S-7", "state": "AVAILABLE"}, "outcome": "compensated, not rewound"}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model is a single-order orchestrated saga. It omits message delivery, outbox, duplicate commands, timeouts, concurrent orders, isolation anomalies, refunds, irreversible email/shipping effects, authorization, compensation ordering, workflow durability, and data reconciliation.

## Explore (remaining exploration time)

Fail payment, then fail or succeed inventory release. Follow each service's durable state and identify the exact outcome the customer can be told.

Open apis-microservices.html for the executable model.

Model limits: The model is a single-order orchestrated saga. It omits message delivery, outbox, duplicate commands, timeouts, concurrent orders, isolation anomalies, refunds, irreversible email/shipping effects, authorization, compensation ordering, workflow durability, and data reconciliation.

## Quiz (4 minutes)

1. Payment declines after inventory is reserved. What should happen?
   - Issue a ReleaseInventory compensation and cancel the order
   - Delete every service database
   - Pretend the reserve never happened

2. Inventory release also fails. Is the saga rolled back?
   - No; it needs durable retry or manual repair
   - Yes; all databases return automatically
   - Yes; the payment decline deletes the reservation

3. When is a saga unnecessary complexity?
   - All affected data belongs in one service and one local transaction works
   - Services own separate databases
   - The business process is long-running

4. Which business effects in your platform have a true compensation, and which are irreversible?
5. How will an operator find and repair a saga whose compensation keeps failing?

<details><summary>Answer key — attempt first</summary>

1. Issue a ReleaseInventory compensation and cancel the order. Compensation is a new local business transaction that reverses the reservation's intent.

2. No; it needs durable retry or manual repair. Compensations can fail, leaving an explicit incomplete business state.

3. All affected data belongs in one service and one local transaction works. Keep one atomic boundary when ownership and scale do not require distribution.

</details>

## Sources

- [AWS Prescriptive Guidance: Saga patterns](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html) — Official architecture guidance; checked November 3, 2026; checked 2026-11-03.
- [AWS Prescriptive Guidance: Saga orchestration](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html) — Official implementation guidance; checked November 3, 2026; checked 2026-11-03.
