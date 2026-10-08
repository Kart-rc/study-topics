# Replace one route at a time

Distinguished Engineer · Day10 · 15 minutes

Break a large system replacement into small ownership decisions with visible evidence.

## Recall (2 minutes)

<p><a href="../Day6/distinguished-engineer.html">Day6: Decision velocity: match governance to reversibility</a></p><p>Why is a deployment rollback button insufficient evidence of reversibility?</p><details><summary>Recall first, then reveal the refresher</summary><p>Data and external contracts may remain changed. True reversal must account for state and commitments beyond the binary.</p></details><p><a href="../Day8/distinguished-engineer.html">Day8: Fault injection: bound the experiment before you create the fault</a></p><p>A stop alarm needs three 60-second breaching periods. What should the experiment owner assume?</p><details><summary>Recall first, then reveal the refresher</summary><p>Potentially harmful exposure continues while evidence accumulates. The evaluation window is part of the blast-radius budget, not a grace period without impact.</p></details>

## Understand (4 minutes)

You need to replace an order system, but a single cutover would move every customer at once. Put a small routing layer in front of the old and new systems. The router sends each type of request to its current owner.

This is the strangler fig pattern: the new system gradually takes over useful pieces of the old one. A route is a request path, such as /tracking. A facade is the stable entry point that hides which system serves it.

Start with a narrow capability whose behavior you can compare. Keeping order writes in one place makes ownership easier to reason about while you move a read-only tracking page.



Order A100 is written by the old system. The new tracking service receives a read-only copy. First compare its output with the old tracking page without changing the customer response. Check status accuracy, delay, errors, and latency. Give one team responsibility for discrepancies.

Once that evidence is acceptable, route /tracking to the new service. Keep /orders and /returns with the old system. If tracking fails, the router can send tracking requests back—but only if the old system can still read the current data.

The leadership decision is not “is the new service deployed?” It is “who owns this route and its data, what evidence permits the move, and who can reverse it?”



## Read the visual

A route table maps each stable customer path to exactly one owner. Only /tracking changes owner. Each owner’s readiness is shown beside that path: the new service must be healthy; the old service must still read current data. Sending a request highlights its row and displays the actual result, so switching ownership is distinct from restoring compatibility.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
owners = {"/orders": "old", "/tracking": "old", "/returns": "old"}
owners["/tracking"] = "new"
order_owner = owners["/orders"]; tracking_owner = owners["/tracking"]
new_healthy = False; old_data_compatible = True
owners["/tracking"] = "old" if old_data_compatible else "recovery required"
fallback_owner = owners["/tracking"]
```

1. Every route begins with one old-system owner.

   Changed values: `{"owners": {"/orders": "old", "/tracking": "old", "/returns": "old"}}`

2. Move only the tracking route.

   Changed values: `{"owners": {"/orders": "old", "/tracking": "new", "/returns": "old"}}`

3. Order writes stay old while tracking goes new.

   Changed values: `{"order_owner": "old", "tracking_owner": "new"}`

4. The new tracking service fails; the old reader is still compatible.

   Changed values: `{"new_healthy": false, "old_data_compatible": true}`

5. The compatible fallback can restore the old route.

   Changed values: `{"owners": {"/orders": "old", "/tracking": "old", "/returns": "old"}}`

6. The routing decision is visible in state.

   Changed values: `{"fallback_owner": "old"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is a routing decision table, not a proxy or a data synchronization system. A safe move still requires behavior checks, compatible state, capacity, and a named owner.

## Explore (remaining exploration time)

Move /tracking to the new service, then request all three routes. Break the new tracking service and request tracking again. Move tracking back to old, then turn off old-data compatibility and observe why fallback is no longer safe.

Open distinguished-engineer.html for the executable model.

Model limits: This model routes three synthetic requests. It does not measure latency, synchronize databases, perform shadow traffic, or handle write ownership. A real facade can become a bottleneck or shared failure point. Migration needs explicit data contracts, observability, and a retirement plan; a route toggle alone is not a safe migration.

## Quiz (4 minutes)

1. Only /tracking moves. Who handles /orders in this example?
   - Both systems write it
   - The new system automatically
   - The old system

2. What evidence should precede moving the tracking route?
   - A service deployment alone
   - Matching behavior and acceptable errors, latency, and data delay
   - The number of new code files

3. The old reader cannot understand new data. Is routing back enough?
   - No; compatibility must be restored or another recovery used
   - Yes; any old binary can read it
   - Yes; the router rewrites the database automatically

4. Name the owner and evidence gate you would require before moving /tracking.
5. If the router fails, which customers are affected, and how would you reduce that risk?

<details><summary>Answer key — attempt first</summary>

1. The old system. The routing decision is per capability. Moving tracking does not transfer order-write ownership or require two writers.

2. Matching behavior and acceptable errors, latency, and data delay. Deployment proves software exists, not that it serves correct data. Compare behavior and operational signals before transferring responsibility.

3. No; compatibility must be restored or another recovery used. Routing changes the destination, not the data format. A recovery plan must account for what the destination can actually read.

</details>

## Sources

- [AWS: Strangler fig pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/strangler-fig.html) — Living guidance; publication date not stated; checked 2026-09-29.
