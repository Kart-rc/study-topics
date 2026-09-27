# Deadline propagation: pass the remaining budget

Software engineering · Day7 · 15 minutes

Trace one end-to-end latency budget across RPC hops and stop work that can no longer help the caller.

## Recall (2 minutes)

<p><a href="../Day4/software-engineering.html">Day4: Protobuf evolution: the field number is the contract</a></p><p>A V2 producer adds tag 3. What does a V1 binary parser do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treats tag 3 as an unknown field. Adding a field is binary wire-safe; old code does not recognize its application meaning.</p></details><p><a href="../Day6/software-engineering.html">Day6: Hedged requests: duplicate only the stragglers</a></p><p>Why delay a hedge instead of sending two copies immediately?</p><details><summary>Recall first, then reveal the refresher</summary><p>To target stragglers and limit extra load. The delay lets ordinary requests finish without paying for a duplicate.</p></details>

## Understand (4 minutes)

A per-hop timeout answers “how long may I wait here?” An end-to-end deadline answers the user-facing question: “after what instant is this result no longer useful?” If every hop starts a fresh 500 ms timeout, a three-hop request can consume far more than the caller's 500 ms budget.

Deadline propagation carries the remaining budget downstream. gRPC implementations can convert an incoming absolute deadline into a timeout with elapsed time deducted, avoiding dependence on synchronized clocks. When the deadline expires, cancellation must propagate—but application code is still responsible for stopping spawned work.



Original teaching case: A lineage UI gives an impact query 500 ms. The API spends 140 ms on authentication and graph planning, then calls a scoring service that needs 420 ms.

remaining budget = 500 − 140 = 360 ms
propagated call: cancel at 360 ms; total ≈ 500 ms
fresh 500 ms hop: finish at 560 ms; caller already left

Propagation does not make the downstream faster. It prevents 60 ms of work that cannot reach the caller, releases a connection sooner, and preserves capacity for requests that can still succeed. The server must observe cancellation inside long CPU loops, database work, and child tasks; otherwise the deadline is only a client-side illusion.



## Explore (5 minutes)

Predict whether the default request succeeds. Disable propagation, then increase pre-work. Explain where useless work appears and what telemetry would reveal it.

Open software-engineering.html for the executable model.

Model limits: One caller, one intermediate service, and one downstream latency with deterministic timing. It omits parallel fan-out, retries, queuing, network variance, clock conversion details, cancellation lag, cleanup cost, partial results, streaming RPCs, database cancellation support, and deadline selection from real latency distributions.

## Quiz (4 minutes)

1. A service spends 140 ms of a 500 ms deadline before a child call. What budget should the child receive?
   - 500 ms
   - 360 ms
   - 640 ms

2. Why is cancellation-aware application code still necessary?
   - The transport cannot automatically stop every spawned computation
   - Deadlines synchronize all clocks
   - Cancellation guarantees a successful response

3. Where does this lesson's model break?
   - Parallel fan-out and retries can spend the shared budget differently
   - A deadline bounds waiting
   - Elapsed time reduces remaining budget

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 360 ms. Propagation deducts elapsed time from the original end-to-end budget.

2. The transport cannot automatically stop every spawned computation. The server must stop its own loops, child tasks, or database work after cancellation.

3. Parallel fan-out and retries can spend the shared budget differently. Real call graphs allocate and coordinate one budget across concurrent and repeated work.

</details>

## Sources

- [gRPC guide: Deadlines](https://grpc.io/docs/guides/deadlines/) — Last modified 2025-07-07; checked 2026-09-27.
- [gRPC guide: Cancellation](https://grpc.io/docs/guides/cancellation/) — Last modified 2024-02-29; checked 2026-09-27.
