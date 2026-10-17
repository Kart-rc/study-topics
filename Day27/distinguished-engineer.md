# Standardize the guardrail—not every implementation

Distinguished Engineer · Day27 · 15 minutes

Create a paved road with mandatory evidence and a time-limited escape hatch.

## Recall (2 minutes)

<p><a href="../Day10/distinguished-engineer.html">Day10: Replace one route at a time</a></p><p>Only /tracking moves. Who handles /orders in this example?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old system. The routing decision is per capability. Moving tracking does not transfer order-write ownership or require two writers.</p></details><p><a href="../Day17/distinguished-engineer.html">Day17: Automation payback: include the work that remains</a></p><p>24 build hours; 3 net hours saved weekly. When is effort equal?</p><details><summary>Recall first, then reveal the refresher</summary><p>Week 8. 24/3 = 8. Counting all 5 manual hours as savings ignores remaining work.</p></details>

## Understand (4 minutes)

A building code requires safe exits, but it does not require every building to use the same floor plan. A good internal platform works the same way: standardize outcomes such as ownership, security checks, SLOs, traceability, and deployment evidence—without forcing a Spark job and a Java API into identical scaffolding.



The Spark pipeline uses a Databricks job template. The Java service uses a container template. Both must publish an owner, SLO, dependency record, vulnerability scan, and rollback plan. A rare exception can bypass one template only with an owner, reason, and expiration date.



## Read the visual

Two independent paths stay visibly separate until the production gate. The gate checks shared evidence; the exception is a labeled detour with an expiry, not a hidden bypass.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a platform contract when many teams need safe defaults but their workloads legitimately require different implementation paths.

**Practical example.** A data pipeline and a low-latency API both need production readiness evidence even though their runtimes differ.

**How to decide.** Mandate a small set of observable outcomes. Offer opinionated templates. Keep an explicit, expiring exception path for cases the platform cannot yet serve.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
required={'owner','slo','scan','rollback'}
spark={'owner','slo','scan','rollback'}
service={'owner','slo','scan'}
spark_gaps=required-spark
service_gaps=required-service
decision='pass' if not spark_gaps and not service_gaps else 'block'
```

1. Define evidence every production workload must provide.

   Changed values: `{}`

2. Two implementations produce evidence through different templates.

   Changed values: `{}`

3. Evaluate outcomes rather than comparing implementation internals.

   Changed values: `{}`

4. The Java service is blocked only because rollback evidence is missing.

   Changed values: `{"decision": "block"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is a governance teaching model, not a complete control framework. Real contracts require threat models, audit evidence, versioning, platform SLOs, ownership, feedback loops, and a funded process for exceptions.

## Explore (remaining exploration time)

Toggle a missing control in either lane. The shared gate blocks only the evidence gap, not the different implementation.

Open distinguished-engineer.html for the executable model.

Model limits: This is a governance teaching model, not a complete control framework. Real contracts require threat models, audit evidence, versioning, platform SLOs, ownership, feedback loops, and a funded process for exceptions.

## Quiz (4 minutes)

1. What should the shared platform contract standardize?
   - Observable safety and operability outcomes
   - One runtime for every workload
   - Team names

2. What makes an escape hatch healthy?
   - Owner, reason, scope, and expiry
   - Permanent silent bypass
   - No evidence

3. Why not force one template everywhere?
   - Different workload constraints can make one implementation harmful
   - Templates are always wrong
   - Security is optional

4. Which four outcomes would form the smallest useful platform contract in your organization?
5. What evidence would prove an exception can now be removed?

<details><summary>Answer key — attempt first</summary>

1. Observable safety and operability outcomes. Common outcomes allow different valid implementations.

2. Owner, reason, scope, and expiry. Exceptions need accountability and a closing condition.

3. Different workload constraints can make one implementation harmful. The contract should preserve legitimate design variation.

</details>

## Sources

- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/) — Living documentation; checked 2026-10-17.
- [CNCF Platforms Working Group whitepaper](https://tag-app-delivery.cncf.io/whitepapers/platforms/) — Living whitepaper; checked 2026-10-17.
- [AWS Prescriptive Guidance: platform engineering](https://docs.aws.amazon.com/prescriptive-guidance/latest/platform-engineering/what-is-platform-engineering.html) — Living guidance; checked 2026-10-17.
