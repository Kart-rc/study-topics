# Promote the same declared job—change targets, not production by hand

Data engineering · Day55 · 30 minutes

Keep one reviewed deployment definition while making environment-specific identities, compute, and destinations explicit.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day31/data-engineering.html">Day31: Read only what changed: Delta CDF and Snowflake Streams</a></p><p>A consumer last committed version 100 and version 101 contains an update and insert. What should it read?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only changes after 100, including both operations. The interval begins after the last successful position and preserves operation types.</p></details><p><a href="../Day35/data-engineering.html">Day35: A new column needs an explicit landing policy</a></p><p>A trusted file adds coupon_code, but consumers are not ready for a new table column. Best immediate policy?</p><details><summary>Recall first, then reveal the refresher</summary><p>Preserve it in a rescue/quarantine field and alert. Rescue keeps the data without silently changing the consumer contract.</p></details>

## Understand (4 minutes)

A touring show uses one script in every city. The stage address and local safety rules change; the actors do not improvise a new ending backstage.

Data-platform promotion should work the same way. Put the job, code artifact, dependencies, and permissions in versioned source. Review one change. Then select a named target whose overrides are limited to environment facts. Editing the production job by hand creates drift: the next deployment can erase the edit, and reviewers cannot reconstruct what actually ran.



Job orders-55 uses artifact sha-a55. Dev writes dev.curated.orders on small compute. Production writes prod.curated.orders under a production service identity. A safe promotion keeps sha-a55 and the task graph unchanged. Only declared target values change.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use declared promotion when the same data job must move through development, test, and production with reviewable differences.

**Practical example.** A platform team promotes an orders pipeline across isolated Databricks workspaces or Snowflake accounts after integration checks pass.

**How to decide.** Keep code and resource definitions in source, build an immutable artifact once, declare narrow target overrides, validate before apply, and verify afterward. A one-off console edit is reasonable only for urgent recovery when it is recorded and reconciled immediately.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

One reviewed definition branches through either a declared target or an invisible console edit, making drift visible at the running job.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
source={'artifact':'sha-a55','tasks':['ingest','publish']} ; dev={'dest':'dev.orders','size':'small'}
prod={'dest':'prod.orders','size':'policy-prod'}
deployed={'artifact':source['artifact'],'tasks':source['tasks'],'target':prod.copy()}
result={'artifact_unchanged':deployed['artifact']=='sha-a55','graph_unchanged':deployed['tasks']==source['tasks'],'declared_destination':deployed['target']['dest']}
```

1. Define one reviewed artifact and development target.

   Changed values: `{"source": {"artifact": "sha-a55", "tasks": ["ingest", "publish"]}, "dev": {"dest": "dev.orders", "size": "small"}}`

2. Declare production-only facts without changing the task graph.

   Changed values: `{"prod": {"dest": "prod.orders", "size": "policy-prod"}}`

3. Promote the same definition to the production target.

   Changed values: `{"deployed": {"artifact": "sha-a55", "tasks": ["ingest", "publish"], "target": {"dest": "prod.orders", "size": "policy-prod"}}}`

4. Verify that source still explains the deployed job.

   Changed values: `{"result": {"artifact_unchanged": true, "graph_unchanged": true, "declared_destination": "prod.orders"}}`

[Full runnable example](examples/data-engineering.py).

Limits: The Python and browser worlds compare one artifact, one job, and two targets. They do not invoke Databricks CLI, Declarative Automation Bundles, Snowflake CLI, DCM, Git, OIDC, approvals, state backends, account objects, rollback, or vendor APIs.

## Explore (remaining exploration time)

Toggle declared promotion versus a production-only edit. Predict whether the reviewed definition still explains the running job.

Open data-engineering.html for the executable model.

Model limits: The Python and browser worlds compare one artifact, one job, and two targets. They do not invoke Databricks CLI, Declarative Automation Bundles, Snowflake CLI, DCM, Git, OIDC, approvals, state backends, account objects, rollback, or vendor APIs.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day25/data-engineering.html">Day25</a>; product material added 2026-10-15.</p><p>A consumer needs current rows but must not own a writable copy. Best common mechanism?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Live read-only share. Both products expose provider-owned data through read-only sharing.</p></details><p>What survives after a recipient exported shared rows before revocation?</p><details><summary>Recall first, then reveal the product refresher</summary><p>The recipient-created export may remain. Revocation stops future shared access; it cannot recall an independent copy already made.</p></details>

## Databricks: one bundle, explicit dev and prod targets · 9 minutes

Recall Day19's separation of logical work and physical target facts. A Declarative Automation Bundle keeps resources and code in source; `databricks bundle validate/deploy -t prod` selects the declared production target. Commands not executed in Databricks.

## Snowflake: validate, deploy, and verify with workload-specific CLI paths · 9 minutes

Recall Day19's evidence boundary. Snowflake documents validate, deploy, and verify stages through workload-specific Snowflake CLI commands. `snowflake.yml` is not a universal declaration for every account object; versioned SQL or IaC may remain necessary. Commands not executed in Snowflake.

## Compare and predict (2 minutes)

Databricks Bundles provide one product-specific project definition with named targets for supported workspace resources. Snowflake CLI offers project definitions and CI/CD commands by workload, plus SQL execution; there is no single exact equivalent covering every account object. Both need immutable source, narrow target differences, least-privilege identity, validation before apply, and verification after apply.

What should a Databricks prod target change?

- Environment facts while preserving reviewed artifact and graph
- The business logic without a new review
- The Git history

<details><summary>Reveal after predicting</summary>

Environment facts while preserving reviewed artifact and graph. Targets make bounded environment differences explicit.

</details>

What is the honest Snowflake comparison?

- Snowflake CLI uses workload-specific plan/deploy/verify paths; not every account object has one bundle equivalent
- snowflake.yml is identical to databricks.yml for all resources
- Console edits are the official promotion state

<details><summary>Reveal after predicting</summary>

Snowflake CLI uses workload-specific plan/deploy/verify paths; not every account object has one bundle equivalent. The mechanisms overlap in intent but not in universal scope.

</details>

## Certification connection

Declarative Automation Bundles, named targets, validate/deploy flow, environment identity, permissions, and drift boundary. Snowflake CLI validate/deploy/verify flow, workload-specific project definitions, DCM or SQL paths, and explicit no-universal-equivalent boundary. Planning groups only; full COF-C03 IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and recorded example is local Python.

- [Databricks: What are Declarative Automation Bundles?](https://docs.databricks.com/aws/en/dev-tools/bundles/) — Official Databricks documentation; updated July 10, 2026; checked November 15, 2026; checked 2026-11-15.
- [Databricks: bundle configuration and targets](https://docs.databricks.com/aws/en/dev-tools/bundles/settings) — Official Databricks documentation; checked November 15, 2026; checked 2026-11-15.
- [Snowflake: Integrating CI/CD with Snowflake CLI](https://docs.snowflake.com/en/developer-guide/snowflake-cli/cicd/integrate-ci-cd) — Official Snowflake documentation; checked November 15, 2026; checked 2026-11-15.
- [Snowflake CLI project definition files](https://docs.snowflake.com/en/developer-guide/snowflake-cli/project-definitions/about) — Official Snowflake documentation; checked November 15, 2026; checked 2026-11-15.

## Quiz (4 minutes)

1. orders-55 uses sha-a55 in dev. What should change for production?
   - Only declared environment facts such as host, identity, compute policy, and destination
   - The reviewed task graph should be rewritten in the console
   - The artifact should be rebuilt without a new digest

2. Why is a console-only production edit dangerous?
   - Source no longer explains the running resource and a later deploy may overwrite the edit
   - Console edits are always slower
   - YAML automatically prevents outages

3. When may an emergency manual edit be acceptable?
   - For urgent recovery with an owner, evidence, expiry, and immediate source reconciliation
   - Whenever production is busy
   - When the edit is too important to review

4. Which production-only setting belongs in a declared target rather than the shared job definition?
5. How will your pipeline detect and reconcile an emergency console edit?

<details><summary>Answer key — attempt first</summary>

1. Only declared environment facts such as host, identity, compute policy, and destination. Promotion preserves the reviewed artifact and declares the environment boundary.

2. Source no longer explains the running resource and a later deploy may overwrite the edit. Drift breaks review, reproducibility, and reconciliation.

3. For urgent recovery with an owner, evidence, expiry, and immediate source reconciliation. A bounded exception can restore service, but it must not become an invisible second configuration system.

</details>

## Sources

- [Databricks: What are Declarative Automation Bundles?](https://docs.databricks.com/aws/en/dev-tools/bundles/) — Official Databricks documentation; updated July 10, 2026; checked November 15, 2026; checked 2026-11-15.
- [Databricks: bundle configuration and targets](https://docs.databricks.com/aws/en/dev-tools/bundles/settings) — Official Databricks documentation; checked November 15, 2026; checked 2026-11-15.
- [Snowflake: Integrating CI/CD with Snowflake CLI](https://docs.snowflake.com/en/developer-guide/snowflake-cli/cicd/integrate-ci-cd) — Official Snowflake documentation; checked November 15, 2026; checked 2026-11-15.
- [Snowflake CLI project definition files](https://docs.snowflake.com/en/developer-guide/snowflake-cli/project-definitions/about) — Official Snowflake documentation; checked November 15, 2026; checked 2026-11-15.
