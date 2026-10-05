# Keep serving with the last good map: control plane vs data plane

Distinguished Engineer · Day12 · 15 minutes

Separate configuration changes from request serving so existing traffic can continue during a control-plane outage.

## Recall (2 minutes)

<p><a href="../Day9/distinguished-engineer.html">Day9: Rollback safety: old code must survive new state</a></p><p>Why can a successful binary rollback still fail?</p><details><summary>Recall first, then reveal the refresher</summary><p>New code may already have written durable state the old code cannot read. Deployment state and durable data evolve on different timelines.</p></details><p><a href="../Day4/distinguished-engineer.html">Day4: Static stability: survive first, repair second</a></p><p>Three zones each carry capacity equal to 50% of demand. One fails. What remains?</p><details><summary>Recall first, then reveal the refresher</summary><p>100%. Two surviving zones each contribute 50%, so existing capacity still meets demand.</p></details>

## Understand (4 minutes)

A restaurant has a printed seating map. The manager updates the map; hosts use the latest approved copy to seat guests. If the manager’s laptop fails, hosts cannot accept a new layout—but they can keep seating guests with the last good map.

The manager’s work is the control plane: create or change configuration. Seating guests is the data plane: do the daily work using that configuration.

Control planePropose route changesValidate and publish

Last good snapshotorders → cell-apayments → cell-b

Data planeRoute every request locally

The key is not merely two boxes. The serving path has a local, durable-enough copy of everything it needs. An outage can delay updates without stopping already-working routes.



The route snapshot says orders → cell-a. A request arrives while the control plane is healthy: the data plane reads its local snapshot and routes to cell-a. Now publishing goes down. A proposed move to cell-c cannot be accepted, but orders still go to cell-a.

The broken design asks the control plane where to send every request. That turns a configuration outage into a customer outage.

route = last_good_snapshot[service]  # serving path
publish(candidate)                    # change path

This is a deeper static-stability installment: survive with pre-positioned state first; repair or change the state after the control plane recovers.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
last_good = {"orders": "cell-a"}
control_plane_up = True
first_route = last_good["orders"]
control_plane_up = False
proposed = "cell-c"
publish_accepted = control_plane_up
route_during_outage = last_good["orders"]
request_succeeds = route_during_outage == "cell-a"
```

1. Start with one published route and a healthy change path.

   Changed values: `{"last_good": {"orders": "cell-a"}, "control_plane_up": true}`

2. Serving reads the local snapshot, not the publisher.

   Changed values: `{"first_route": "cell-a"}`

3. The publisher fails, so the proposed route is not accepted.

   Changed values: `{"control_plane_up": false, "proposed": "cell-c", "publish_accepted": false}`

4. The next request still uses cell-a and succeeds in this bounded model.

   Changed values: `{"route_during_outage": "cell-a", "request_succeeds": true}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executes a dictionary lookup. It proves no availability target and models neither endpoint health nor state propagation.

## Explore (remaining exploration time)

Toggle the control plane, route requests, and attempt a change. Then enable the broken per-request dependency and observe the blast radius.

Open distinguished-engineer.html for the executable model.

Model limits: A route-table decision model. It omits stale-state limits, leases, authentication, propagation, split brain, endpoint health, capacity, rollback, and emergency change channels. Some control-plane failures require data-plane fail-closed behavior for safety.

## Quiz (4 minutes)

1. The control plane fails after cell-a was published. In the stable design, where does the next order go?
   - cell-a
   - Nowhere
   - A random cell

2. Which operation should fail during the outage?
   - Every existing request
   - Publishing the new cell-c route
   - Reading the local route

3. When might serving the old snapshot be unsafe?
   - When policy requires an immediate revoke
   - Whenever the route has a name
   - Only on Tuesdays

4. Explain the difference between delayed change and failed service in this example.
5. Name one control-plane fact your data plane must pre-position before an outage.

<details><summary>Answer key — attempt first</summary>

1. cell-a. The data plane keeps the last good snapshot and continues using the known route.

2. Publishing the new cell-c route. Changes require the control plane. Existing data-plane work should not take that dependency when static stability is the goal.

3. When policy requires an immediate revoke. Some security or safety changes must take effect immediately. The architecture needs an explicit staleness and fail-closed policy.

</details>

## Sources

- [AWS Builders' Library: Static stability using Availability Zones](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) — Living architecture guidance; checked 2026-10-02.
