# Rollback safety: old code must survive new state

Distinguished Engineer · Day9 · 15 minutes

Design deployments so rollback is a compatibility transition, not merely a reversal of binaries, especially when new writers have already changed durable state.

## Recall (2 minutes)

<p><a href="../Day7/distinguished-engineer.html">Day7: Load shedding: protect useful work past the breaking point</a></p><p>Demand is 140 units/s and safe capacity is 100. What must a stable admission policy do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject or degrade at least 40 units of work. The system cannot create capacity by accepting work; scarcity must become explicit.</p></details><p><a href="../Day2/distinguished-engineer.html">Day2: Canaries: small exposure, useful evidence</a></p><p>At 1% exposure, canary 4%, control 0.1%, what is the overall failure rate?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.139%. 0.01 × 4% + 0.99 × 0.1% = 0.139%. Aggregation hides a severe cohort regression.</p></details>

## Understand (4 minutes)

A deployment rollback replaces new code with old code; it does not rewind databases, messages, object formats, caches, or external side effects. If new writers emit a field, enum, schema, or protocol that old readers cannot understand, the rollback can deepen the outage. The real invariant is bidirectional compatibility across the overlap window.

The robust sequence is expand, migrate, contract. First deploy readers that tolerate both old and new forms. Next introduce writers that preserve the old representation or dual-write while migration runs. Observe and backfill. Only after every rollback target can consume the remaining state do you remove the old representation. AWS describes the complementary ordering as readers before writers on the way forward and writers before readers when rolling back.

At Distinguished Engineer scope, rollback readiness is an architectural property: define the supported version matrix, preserve rollback artifacts, test upgrade-downgrade paths with production-shaped data, and decide when a forward fix is safer because a destructive contract step has crossed the point of no return.



Worked example: Version 1 reads full_name. Version 2 introduces given_name and family_name. During expansion, V2 readers accept both and V2 writers dual-write all three fields. If 40% of records are written by V2 and you roll back, V1 still reads 100% because full_name remains. If V2 stops writing full_name before backfill and contract readiness, those new records become unreadable to V1.

safe rollback = old reader still understands every durable form
unsafe rollback = binary restored, state compatibility lost

The same pattern applies to Kafka event schemas, protobuf enums, checkpoint formats, feature flags, and IAM policy shape. “The deploy tool can roll back” is not evidence that the system can.



## Explore (5 minutes)

Move through migration phases, change the fraction of records touched by new writers, and toggle dual-write and backfill. Predict old-reader success after rollback and identify the first irreversible contract step.

Open distinguished-engineer.html for the executable model.

Model limits: A synthetic record-compatibility model. It assumes 1,000 independent records, a single old required field, and complete success for dual-write or backfill. Real systems have partial failures, replicas, caches, transactions, event history, schema registries, mixed binaries, long-lived clients, and side effects. A 100% toy read rate does not prove semantic equivalence or safe operational rollback.

## Quiz (4 minutes)

1. Why can a successful binary rollback still fail?
   - New code may already have written durable state the old code cannot read
   - Rollback always deletes monitoring
   - Old binaries cannot start twice

2. What is the safe forward order for a format change?
   - Contract old fields, then update readers
   - Deploy compatible readers, then writers, migrate, and contract last
   - Deploy writers and readers in one untested wave

3. When should leaders consider a forward fix instead of rollback?
   - Whenever a dashboard is green
   - After an incompatible or destructive state transition makes the old version unsafe
   - Only when source control is unavailable

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. New code may already have written durable state the old code cannot read. Deployment state and durable data evolve on different timelines.

2. Deploy compatible readers, then writers, migrate, and contract last. Readers must understand a form before writers can safely produce it.

3. After an incompatible or destructive state transition makes the old version unsafe. Past the compatibility boundary, restoring old binaries can compound failure.

</details>

## Sources

- [AWS Builders' Library: Ensuring rollback safety during deployments](https://builder.aws.com/content/3F04j2yRAAMBuPSPs50xwXZqg01/ensuring-rollback-safety-during-deployments) — AWS Builders' Library article; publication date not stated on page; checked 2026-09-29.
- [AWS Builders' Library PDF: Ensuring rollback safety during deployments](https://d1.awsstatic.com/builderslibrary/pdfs/ensuring-rollback-safety-during-deployments.pdf) — AWS primary-source PDF; retrieved 2026-09-29; checked 2026-09-29.
- [AWS Well-Architected Reliability Pillar: automated change management](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_tracking_change_management_automated_changemgmt.html) — Living AWS documentation; publication date not stated; checked 2026-09-29.
