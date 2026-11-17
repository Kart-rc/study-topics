# gRPC health is scoped to a service name—not every dependency behind it

APIs & Microservices · Day56 · 15 minutes

Publish and consume health status at the same service boundary the client actually calls.

## Recall (2 minutes)

<p><a href="../Day37/apis-microservices.html">Day37: 202 Accepted means queued, not completed</a></p><p>Server returns 202 for exp-42. What can the client claim?</p><details><summary>Recall first, then reveal the refresher</summary><p>The request was accepted for processing, not that the export succeeded. 202 is intentionally noncommittal.</p></details><p><a href="../Day25/apis-microservices.html">Day25: A field mask says exactly what PATCH may change</a></p><p>Payload contains alerts=false, but update_mask is timezone. What happens to alerts?</p><details><summary>Recall first, then reveal the refresher</summary><p>It stays unchanged. Only paths named in the mask participate in the update.</p></details>

## Understand (4 minutes)

A mall can be open while one shop is closed. A sign at the parking lot and a sign at the shop answer different questions.

The standard gRPC health service accepts a service name. An empty string can represent the whole server; a named value such as orders.v1.Orders represents that service. Client-side health checking uses the streaming Watch RPC and can stop sending calls when the selected service reports NOT_SERVING. Your application is responsible for updating the status, including shutdown.



The process is alive and the catalog service is healthy, but the orders service has lost its database. Server-wide health remains SERVING; orders.v1.Orders must report NOT_SERVING. An orders client watching only the empty name would keep sending doomed calls.



## Read the visual

One process contains a healthy catalog and unhealthy orders service, while the watched name selects the correct routing decision.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use standard gRPC health checking when clients or load balancers need a protocol-level signal before routing RPCs.

**Practical example.** An EKS gRPC orders service removes only unhealthy orders backends while catalog RPCs on the same process remain available.

**How to decide.** Report the narrowest meaningful service status, wire it to real readiness evidence, update it before shutdown, and test Watch behavior. Keep Kubernetes liveness separate so a downstream outage does not cause pointless process restarts.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
health={'':'SERVING','catalog.v1.Catalog':'SERVING','orders.v1.Orders':'NOT_SERVING'}
watched=''
send_orders=health[watched]=='SERVING'
result={'broad_watch_sends':send_orders,'orders_watch_sends':health['orders.v1.Orders']=='SERVING'}
```

1. Publish server-wide and named-service states.

   Changed values: `{"health": {"": "SERVING", "catalog.v1.Catalog": "SERVING", "orders.v1.Orders": "NOT_SERVING"}}`

2. Configure a client to watch only whole-server health.

   Changed values: `{"watched": ""}`

3. The broad signal incorrectly permits orders traffic.

   Changed values: `{"send_orders": true}`

4. Compare the two routing decisions.

   Changed values: `{"result": {"broad_watch_sends": true, "orders_watch_sends": false}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model has one process and two named services. It does not run gRPC, Health.Check/Watch, service config, load balancing, backoff, Kubernetes probes, TLS, database checks, shutdown races, or language-specific implementations.

## Explore (remaining exploration time)

Switch the watched name from whole server to orders. Predict whether calls continue during an orders-only database failure.

Open apis-microservices.html for the executable model.

Model limits: The model has one process and two named services. It does not run gRPC, Health.Check/Watch, service config, load balancing, backoff, Kubernetes probes, TLS, database checks, shutdown races, or language-specific implementations.

## Quiz (4 minutes)

1. The process is healthy but orders lost its DB. What should orders health say?
   - NOT_SERVING for the orders service name
   - SERVING because the process runs
   - UNIMPLEMENTED for every service

2. Why use Watch for client-side health checking?
   - It streams status changes and lets clients pause/resume routing
   - It authorizes the RPC
   - It replaces deadlines

3. What remains separate from service health?
   - Liveness, authorization, request deadlines, and dependency-specific behavior
   - The service name
   - The health library

4. Which gRPC process in your platform needs health split by service name?
5. Which dependency failures should change readiness without triggering liveness restarts?

<details><summary>Answer key — attempt first</summary>

1. NOT_SERVING for the orders service name. Health should match the routing boundary the client calls.

2. It streams status changes and lets clients pause/resume routing. Watch avoids constant fleet polling and drives routing state.

3. Liveness, authorization, request deadlines, and dependency-specific behavior. Health is one routing signal, not a complete resilience policy.

</details>

## Sources

- [gRPC: Health Checking](https://grpc.io/docs/guides/health-checking/) — Official gRPC documentation; checked November 16, 2026; checked 2026-11-16.
- [gRPC health checking protocol](https://github.com/grpc/grpc-proto/blob/master/grpc/health/v1/health.proto) — Official gRPC protocol definition; checked November 16, 2026; checked 2026-11-16.
