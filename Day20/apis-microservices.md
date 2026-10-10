# Stop routing before the next RPC: gRPC health Watch

APIs & Microservices · Day20 · 15 minutes

Use the standard health stream so clients avoid NOT_SERVING backends.

## Recall (2 minutes)

<p><a href="../Day16/apis-microservices.html">Day16: One error shape, stable meaning: RFC 9457 Problem Details</a></p><p>Which field should machine logic use as the primary problem identifier?</p><details><summary>Recall first, then reveal the refresher</summary><p>The type URI. RFC 9457 defines type as the primary problem identifier; detail is human-readable.</p></details><p><a href="../Day18/apis-microservices.html">Day18: 202 means accepted: give long-running work a status resource</a></p><p>POST returns 202. What may the client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The request was accepted; processing is incomplete. 202 is not a completion guarantee. The client needs a status observation to know the eventual outcome.</p></details>

## Understand (4 minutes)

A restaurant host stops seating guests in a closed room. Waiting for each guest to find the locked door creates needless failures.

gRPC defines a health service. A client can open streaming Watch for a named service. After NOT_SERVING, health-aware routing avoids that backend; calls can resume after SERVING.



Inventory has A and B. B loses database access but its process stays alive. It publishes NOT_SERVING. With client health checking, four new calls go to A. Without it, two still reach B and fail in this toy.

Unary Check suits monitoring; streaming Watch avoids every connected client polling constantly.



## Read the visual

B remains connected but changes readiness and route eligibility, separating transport reachability from service health.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use when gRPC clients choose among multiple addresses and service readiness can change while connections remain open.

**Practical example.** Inventory remains live but cannot query its database, so it reports NOT_SERVING for that service.

**How to decide.** Health guides routing but does not replace deadlines, retries, load shedding, or accurate readiness. Some policies may disable it; UNIMPLEMENTED disables client health checking per the guide.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
backends={"A":"SERVING","B":"SERVING"}
health_checking=True
backends["B"]="NOT_SERVING"
eligible=[n for n,s in backends.items() if s=="SERVING"]
routes=[eligible[i%len(eligible)] for i in range(4)]
```

1. Both begin eligible.

   Changed values: `{"backends": {"A": "SERVING", "B": "SERVING"}, "health_checking": true}`

2. Watch updates B.

   Changed values: `{"backends": {"A": "SERVING", "B": "NOT_SERVING"}}`

3. Route only to serving backends.

   Changed values: `{"eligible": ["A"], "routes": ["A", "A", "A", "A"]}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executed a Python eligibility model, not a gRPC channel.

## Explore (remaining exploration time)

Mark B unhealthy and toggle client health. Predict four routes.

Open apis-microservices.html for the executable model.

Model limits: The toy has no network, stream delay, resolver, backoff, channel state, or gRPC library.

## Quiz (4 minutes)

1. B NOT_SERVING with health enabled?
   - Avoid B
   - Wait for TCP loss
   - Stop forever

2. Why Watch?
   - Streams changes instead of polling
   - Encrypts
   - Retries business calls

3. Key boundary?
   - Replaces deadlines
   - Server health must be accurate and policy must use it
   - SERVING means perfect

4. What condition should report NOT_SERVING?
5. How will stuck-SERVING be detected?

<details><summary>Answer key — attempt first</summary>

1. Avoid B. Health changes eligibility.

2. Streams changes instead of polling. It scales continuous updates.

3. Server health must be accurate and policy must use it. Bad health logic still routes badly.

</details>

## Sources

- [gRPC health checking](https://grpc.io/docs/guides/health-checking/) — Official guide; checked 2026-10-10; checked 2026-10-10.
- [gRPC service config](https://grpc.io/docs/guides/service-config/) — Official guide; checked 2026-10-10; checked 2026-10-10.
