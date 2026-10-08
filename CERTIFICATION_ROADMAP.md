# Databricks and Snowflake certification path

Target date: **December 31, 2026**. Plan established October 8, 2026. These are proposed first credentials; no existing certification or exam readiness is assumed.

- **Databricks Certified Data Engineer Associate** — current linked guide covers the May 4, 2026 exam version. It fits the immediate goal of validating platform implementation skills. Professional-level design remains optional depth.
- **SnowPro Core (COF-C03)** — current official certification page confirms this exam code. Core supplies the platform breadth needed before deciding on a later Advanced Data Engineer credential.

The goal is two passed exams, not two course-completion badges. Neither lessons delivered nor a high score on repeated questions establishes readiness. Exams are not booked by this program.

## Daily structure: 30 minutes

| Time | What to do | Evidence to look for |
|---|---|---|
| 6 minutes | Recall an earlier idea; understand today's problem and use case | Predict what will change and why |
| 9 minutes | Databricks implementation | Read the visual, follow SQL/PySpark, inspect the outcome |
| 9 minutes | Snowflake implementation | Repeat the business case with the appropriate Snowflake mechanism |
| 6 minutes | Compare, predict, and quiz | Explain the difference and one failure boundary |

The seven-track bundle totals **120 minutes** from Day17. Other tracks remain 15 minutes. Days1–10 stay 75 minutes; Days11–16 stay 105 minutes. SQL comes first; PySpark/Python appears where it explains the actual API. Each product section states prerequisites and whether code ran in a real product, ran as a local model, or is an unexecuted example.

Each week uses five focused concept lessons, one consolidation case, and one retrieval/gap review. Product sections remain present on review days, using earlier examples rather than inventing new topics. Existing 1/3/7/14/30-calendar-day reviews remain in the lesson budget. Product-specific review begins from the date that product material was added, not the older lesson delivery date.

## Coverage map

Databricks weights below are from the official linked guide checked October 8. Snowflake categories below are planning groups based on the **current COF-C03 public overview**, not a claim of exact exam domains, objective IDs, or weights. The full Snowflake study-guide download was not exposed by the accessible page in this run; obtain it from that page and reconcile the map before claiming complete exam coverage. Do not substitute the older COF-C02 blueprint.

| Databricks domain | Weight | Evidence-producing exercise |
|---|---:|---|
| Platform | 6% | Choose appropriate compute and explain storage/catalog responsibilities |
| Ingestion | 21% | Load files incrementally and handle schema changes |
| Transformation/modeling | 22% | Clean, join, deduplicate, and validate a small dataset |
| Lakeflow Jobs | 16% | Build a dependency graph with retry and a trigger |
| CI/CD | 10% | Validate a bundle and explain environment overrides |
| Troubleshooting/optimization | 10% | Use execution evidence to identify a bottleneck |
| Governance/security | 15% | Grant minimum access and verify a restricted read |

| Snowflake planning group | Evidence-producing exercise |
|---|---|
| Architecture and connectivity | Trace a query across services, compute, and storage; explain a client connection |
| Account, warehouse, and access management | Choose roles and warehouse settings for a concrete workload |
| Loading, unloading, and transformation | Stage, load, inspect errors, transform, and export a small dataset |
| Structured, semi-structured, and unstructured data | Explain storage/access differences; flatten a nested JSON example |
| Performance | Inspect Query Profile and distinguish pruning, caching, and compute decisions |
| Collaboration and protection | Compare sharing, cloning, and recovery responsibilities |

Do not force false equivalences. For example, a Snowflake stream is not a Flink network buffer; a virtual warehouse is not simply a renamed Spark cluster. Some objectives need a product-specific lesson while the other product supplies a bounded comparison or review. Include costs, permissions, and edition/runtime requirements when they change the decision.

## Sequence through December

Dates are study milestones, not mastery claims. A missed lesson does not imply failure; use the next review slot for the gap.

| Dates | Focus | Concrete milestone |
|---|---|---|
| Oct 8–11 | Baseline and recovery | Complete Day17; confirm access to authorized sandboxes; take an original diagnostic for each target |
| Oct 12–25 | Platform, compute, loading, and data formats | Build a small receipt/transaction bronze-to-silver pipeline in each product |
| Oct 26–Nov 8 | Transformations, orchestration, schema changes, incremental processing | Rerun safely, inject a failure, explain exactly what is recovered |
| Nov 9–22 | Security, governance, deployment, optimization, and Snowflake collaboration/protection | Diagnose a slow query and a denied read using real evidence; reconcile remaining blueprint gaps |
| Nov 23–29 | Mixed scenarios and weak domains | Complete a timed, unseen practice assessment and an unprompted sandbox repair in each product |
| Nov 30–Dec 13 | First exam window, only when ready | Attempt each exam after its readiness criteria are met; otherwise use the slot for targeted study |
| Dec 14–31 | Remaining exam, remediation, or contingency | Recheck current vendor rules and appointment availability; retake timing is policy-dependent |

At 30 minutes daily, October 8–December 31 provides about **42.5 hours** across both products. Your engineering background helps, but this is a bounded study budget, not a guarantee. Use the actual diagnostic to decide how much familiar material can be shortened. Real sandbox work is necessary; browser models cannot teach every UI, permission, error message, or operational behavior.

Full timed mocks may exceed a 30-minute block. Plan an uninterrupted session explicitly when ready; do not quietly add it to the daily budget or present a paused mock as exam-condition evidence. Official practice exams are available from the vendor portals; questions authored here are original practice, not actual exam questions.

## Readiness gate for each exam

These are coaching criteria, **not official passing scores or a pass guarantee**:

1. Two different, timed, closed-book practice sets at 80% or better; no planning group below 70%. Do not reuse memorized questions as fresh evidence.
2. Explain why each distractor is wrong and redo missed concepts with new inputs after at least three days.
3. Run the core ingestion, transformation, recovery, permission, and performance tasks in an authorized product sandbox without copying the walkthrough verbatim.
4. Reconcile all objectives against the current official guide, including the full COF-C03 guide; mark gaps explicitly.
5. Recheck exam identity, language, delivery requirements, fee, and retake policy before booking. No purchases or registrations are automated.

If the gate is not met, report the gap and revise the target window rather than claim readiness. After a credential is earned, keep useful professional depth in the daily material and stop presenting its foundational track as an uncompleted goal.

## Tracking without publishing personal answers

`certification-plan.json` records the curriculum and which objectives material addresses. It records **delivery coverage only**. Personal quiz exports, scores, weaknesses, certification account identifiers, and booking details stay out of this public repository. The learner can explicitly share answers privately for targeted feedback. No response means “not assessed.”

Day17 adds product recovery on **2026-10-08** while preserving its original delivery key **2026-10-07**. Future recall must use October 8 for the new product material. Day17 is supporting recovery practice, not completion of either ingestion domain. Its original Flink mechanism is labeled enrichment relative to these exams.

## Official sources

Checked **2026-10-08**. Recheck the guides weekly and again before booking; exam scope can change.

- [Databricks certification overview](https://www.databricks.com/learn/certification/data-engineer-associate)
- [Current linked Databricks exam guide — May 4, 2026 version](https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf)
- [SnowPro Core COF-C03 overview and study-guide entry](https://learn.snowflake.com/en/certifications/snowpro-core-c03/)
- [Snowflake certification catalog and practice-exam entry](https://learn.snowflake.com/en/certifications/)
- [Snowflake official hands-on learning paths](https://www.snowflake.com/en/developers/northstar/)

Use the recommended training linked from the current exam pages. A course certificate is not the vendor's proctored certification.
