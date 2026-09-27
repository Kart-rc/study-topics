# Load shedding: protect useful work past the breaking point

Distinguished Engineer · Day7 · 15 minutes

Choose an admission policy that preserves critical throughput when demand exceeds safe capacity instead of maximizing accepted requests.

## Recall (2 minutes)

<p><a href="../Day4/distinguished-engineer.html">Day4: Static stability: survive first, repair second</a></p><p>Three zones each carry capacity equal to 50% of demand. One fails. What remains?</p><details><summary>Recall first, then reveal the refresher</summary><p>100%. Two surviving zones each contribute 50%, so existing capacity still meets demand.</p></details><p><a href="../Day6/distinguished-engineer.html">Day6: Decision velocity: match governance to reversibility</a></p><p>Why is a deployment rollback button insufficient evidence of reversibility?</p><details><summary>Recall first, then reveal the refresher</summary><p>Data and external contracts may remain changed. True reversal must account for state and commitments beyond the binary.</p></details>

## Understand (4 minutes)

Once demand exceeds safe capacity, the system cannot fully serve every request. Letting all work enter a deep queue converts overload into high latency, timeouts, retries, and sometimes a collapse in useful throughput. Load shedding makes the loss explicit: reject some work early and cheaply so the service continues completing the work it admits.

The Distinguished Engineer decision is which work to protect. Cost and value both matter. Health checks, authentication, interactive reads, bulk refreshes, and speculative retries should not automatically compete as equals. Google SRE recommends testing beyond the breaking point; AWS describes load shedding as an overload control. The policy needs product ownership because it encodes whose work survives scarcity.



Original teaching case: A lineage service has 100 compute units/s. Interactive incident queries demand 60 units; background graph refresh demands 80. Accepting all 140 units creates a queue and risks timeout retries. A priority-aware admission policy accepts all 60 critical units and 40 background units, rejecting the other 40 before expensive graph traversal.

safe capacity = 100 units/s
demand = 60 critical + 80 background
priority admission = 60 critical + 40 background + 40 rejected

Do not hard-code “critical wins” without fairness and abuse controls. Validate the overload signal, reserve capacity for recovery/control-plane work, return retry guidance where appropriate, and measure accepted useful work—not merely rejection rate. Load-test gradual and impulse traffic because caches and autoscaling respond differently.



## Explore (5 minutes)

Raise optional demand past capacity with priority off, then turn it on. Explain who benefits, who is rejected, and which governance review should own that tradeoff.

Open distinguished-engineer.html for the executable model.

Model limits: A one-second, unit-cost admission model with two traffic classes and fixed safe capacity. It omits variable request cost, queues, autoscaling, cache effects, fairness within a class, retries, admission latency, distributed limiters, regional failover, tenant quotas, abuse, and errors in the overload signal.

## Quiz (4 minutes)

1. Demand is 140 units/s and safe capacity is 100. What must a stable admission policy do?
   - Accept all and hide the queue
   - Reject or degrade at least 40 units of work
   - Retry every rejected request immediately

2. Why should traffic priority be a product and governance decision?
   - It determines whose outcomes survive overload
   - It removes the need for load testing
   - It makes every request equal

3. Which observation would invalidate the toy policy?
   - Background requests cost ten times more than critical requests
   - Demand can exceed capacity
   - Early rejection is observable

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Reject or degrade at least 40 units of work. The system cannot create capacity by accepting work; scarcity must become explicit.

2. It determines whose outcomes survive overload. Technical admission rules encode business value, fairness, and customer impact.

3. Background requests cost ten times more than critical requests. The model assumes equal unit cost; variable cost requires cost-aware admission.

</details>

## Sources

- [AWS Builders' Library: Using load shedding to avoid overload](https://builder.aws.com/content/3Eun1EEyX6p2e3VYNyRLSJzLuMV/using-load-shedding-to-avoid-overload) — Updated 2026-06-12; checked 2026-09-27.
- [Google SRE Book, Chapter 22: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) — Foundational living edition; original book published 2016; checked 2026-09-27.
