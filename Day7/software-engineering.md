# Deadline propagation: pass the remaining budget

Software engineering · Day7 · 15 minutes

A user gives a request 500 milliseconds.

## Recall (2 minutes)

<p><a href="../Day4/software-engineering.html">Day4: Protobuf evolution: the field number is the contract</a></p><p>A V2 producer adds tag 3. What does a V1 binary parser do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treats tag 3 as an unknown field. Adding a field is binary wire-safe; old code does not recognize its application meaning.</p></details><p><a href="../Day6/software-engineering.html">Day6: Hedged requests: duplicate only the stragglers</a></p><p>Why delay a hedge instead of sending two copies immediately?</p><details><summary>Recall first, then reveal the refresher</summary><p>To target stragglers and limit extra load. The delay lets ordinary requests finish without paying for a duplicate.</p></details>

## Understand (4 minutes)

A user gives a request 500 milliseconds. The API spends 140 ms before calling the next service. Giving that next call a fresh 500 ms exceeds the user’s original budget.

A deadline is the time by which the whole operation must finish. Pass the remaining budget to downstream work. A timeout controls how long one call waits; resetting it at every hop can keep work running after the caller has left.



After 140 ms, 360 ms remain. The downstream operation needs 420 ms, so it cannot finish in time. If it observes cancellation, the propagated deadline limits total work to about 500 ms instead of 560.



## Read the visual

A shared timeline locates pre-work and downstream work against the original caller deadline. Passing the remaining budget ends the child at that deadline; a fresh timeout can extend the child beyond it. Pre-work that already exceeds the deadline is not recovered by propagation.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
int totalBudgetMs = 500;
int spentMs = 140;
int remainingMs = Math.max(0, totalBudgetMs - spentMs);
int downstreamNeedMs = 420;
int totalWithDeadline = spentMs + Math.min(remainingMs, downstreamNeedMs);
int totalWithFreshTimeout = spentMs + downstreamNeedMs;
```

1. The caller sets the end-to-end budget.

   Changed values: `{"totalBudgetMs": "500"}`

2. Authentication and planning consume part of it.

   Changed values: `{"spentMs": "140"}`

3. Only 360 ms remain.

   Changed values: `{"remainingMs": "360"}`

4. The downstream work needs longer than that.

   Changed values: `{"downstreamNeedMs": "420"}`

5. Observed cancellation caps the modeled total at 500 ms.

   Changed values: `{"totalWithDeadline": "500"}`

6. A fresh-hop timeout allows 560 ms of work.

   Changed values: `{"totalWithFreshTimeout": "560"}`

[Full runnable example](examples/software-engineering.java).

Limits: This uses known durations, not real network calls. Deadlines only reduce server work when cancellation reaches the running operations. Clock handling, queues, and cleanup also matter.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A per-hop timeout answers “how long may I wait here?” An end-to-end deadline answers the user-facing question: “after what instant is this result no longer useful?” If every hop starts a fresh 500 ms timeout, a three-hop request can consume far more than the caller's 500 ms budget.</p><p>Deadline propagation carries the remaining budget downstream. gRPC implementations can convert an incoming absolute deadline into a timeout with elapsed time deducted, avoiding dependence on synchronized clocks. When the deadline expires, cancellation must propagate—but application code is still responsible for stopping spawned work.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A lineage UI gives an impact query 500 ms. The API spends 140 ms on authentication and graph planning, then calls a scoring service that needs 420 ms.</p><pre>remaining budget = 500 − 140 = 360 ms
propagated call: cancel at 360 ms; total ≈ 500 ms
fresh 500 ms hop: finish at 560 ms; caller already left</pre><p>Propagation does not make the downstream faster. It prevents 60 ms of work that cannot reach the caller, releases a connection sooner, and preserves capacity for requests that can still succeed. The server must observe cancellation inside long CPU loops, database work, and child tasks; otherwise the deadline is only a client-side illusion.</p>

</details>

## Explore (remaining exploration time)

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
