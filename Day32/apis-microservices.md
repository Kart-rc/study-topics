# Wait for ready, but never wait past the deadline

APIs & Microservices · Day32 · 15 minutes

Queue a gRPC call through transient connection failure without making it unbounded.

## Recall (2 minutes)

<p><a href="../Day25/apis-microservices.html">Day25: A field mask says exactly what PATCH may change</a></p><p>Payload contains alerts=false, but update_mask is timezone. What happens to alerts?</p><details><summary>Recall first, then reveal the refresher</summary><p>It stays unchanged. Only paths named in the mask participate in the update.</p></details><p><a href="../Day13/apis-microservices.html">Day13: Add, migrate, remove: evolve an API field safely</a></p><p>Why does replacing name with display_name break an old v1 client?</p><details><summary>Recall first, then reveal the refresher</summary><p>The client still reads name, which disappeared. A rename is remove-plus-add. The old client&#x27;s expected field is gone.</p></details>

## Understand (4 minutes)

An elevator is temporarily between floors. You can leave immediately and take the stairs, or wait—provided you still leave by your appointment time. gRPC's Wait-for-Ready makes the same choice for an RPC created while the channel is in transient failure.

Without it, the call fails immediately. With it, the call waits for the channel to become ready. The deadline still applies and stops the wait.



A batch worker creates ReconcileOrder while the channel is in TRANSIENT_FAILURE. The service recovers after 3 seconds. With a 5-second deadline and Wait-for-Ready, the request is sent with 2 seconds remaining. With a 2-second deadline, it ends before recovery.



## Read the visual

The channel timeline uses the same clock for readiness and deadline, making the race and remaining budget visible rather than describing a generic retry.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use Wait-for-Ready for batch or startup flows where a short transient connection failure should be absorbed and the caller has a meaningful deadline.

**Practical example.** A scheduled reconciliation worker starts while the gRPC service is rolling and can wait a few seconds before sending its idempotent request.

**How to decide.** Enable it selectively, always set deadlines, and bound queue/memory pressure. Prefer immediate failure for interactive requests that need fast fallback or when waiting would hide a sustained outage.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
ready_after_s = 3
deadline_s = 5
sent = ready_after_s < deadline_s
remaining_budget_s = deadline_s - ready_after_s if sent else 0
```

1. The channel will recover after three seconds.

   Changed values: `{"ready_after_s": 3}`

2. The caller's total patience is five seconds.

   Changed values: `{"deadline_s": 5}`

3. Wait-for-Ready sends only if readiness arrives before expiry.

   Changed values: `{"sent": true}`

4. Waiting consumes deadline budget; it does not reset it.

   Changed values: `{"remaining_budget_s": 2}`

[Full runnable example](examples/apis-microservices.py).

Limits: This local state model does not create a gRPC channel, model resolver/load-balancer states, backoff, permanent failures, cancellation races, retries, hedging, queue limits, streaming, or language-specific APIs.

## Explore (remaining exploration time)

Set recovery time and deadline. Watch the RPC remain queued, send with remaining budget, or expire.

Open apis-microservices.html for the executable model.

Model limits: This local state model does not create a gRPC channel, model resolver/load-balancer states, backoff, permanent failures, cancellation races, retries, hedging, queue limits, streaming, or language-specific APIs.

## Quiz (4 minutes)

1. Ready at 3s, deadline at 5s, Wait-for-Ready enabled. What happens?
   - The RPC sends with about 2s remaining
   - It fails at t=0
   - The deadline resets

2. Why keep a deadline?
   - It bounds waiting during sustained failure
   - It guarantees the server recovers
   - It enables authorization

3. When is fail-fast often better?
   - An interactive request has a faster fallback
   - A bounded batch can wait through rollout
   - The channel is already ready

4. Which RPCs in your service may safely wait through startup, and which need fast fallback?
5. What queue, deadline, and idempotency signals would reveal harmful Wait-for-Ready use?

<details><summary>Answer key — attempt first</summary>

1. The RPC sends with about 2s remaining. The call waits, but the original deadline keeps counting.

2. It bounds waiting during sustained failure. Wait-for-Ready without a useful bound can wait too long.

3. An interactive request has a faster fallback. User-facing latency and fallback strategy may favor immediate failure.

</details>

## Sources

- [gRPC Wait-for-Ready guide](https://grpc.io/docs/guides/wait-for-ready/) — Living documentation; checked 2026-10-22.
- [gRPC deadlines guide](https://grpc.io/docs/guides/deadlines/) — Living documentation; checked 2026-10-22.
- [gRPC service config](https://grpc.io/docs/guides/service-config/) — Living documentation; checked 2026-10-22.
