# Day17 validation — 2026-10-07

## Visual teaching revision — 2026-10-08

Three specialist subagents revised all seven lessons, followed by an independent teaching review. Repeated fact-card diagrams were replaced by representations of the mechanism: temporary/durable checkpoint state through a crash; hash arrows and bit ownership; cumulative effort curves; task-by-trial aggregation; separate charge and energy ledgers; simultaneous queue-policy transitions; and row positions versus a tuple cursor.

Visuals are computed from the live JavaScript toy state. The checkpoint lab now requires save, crash, restore, and individual replay actions, and contrasts both valid snapshot strategies with the deliberately broken one. The evaluation matrix allows changing one trial to expose the ANY/ALL difference. Quantitative diagrams label units and denominators, with text equivalents in Markdown. Existing source/check dates, quiz questions, use cases, captured Python/Java executions, review keys, and generation state are unchanged.

Observed locally after revision: all 99 replay/quiz/save/export/link checks, 15 bundle-policy tests, and seven Day17 mechanism checks passed. Native Chromium installation failed because the downloaded archive was invalid. The new bounded `tests/browser/day17-visuals.spec.cjs` adds seven meaningful visual-state checks at both desktop and mobile viewports and captures diagrams for inspection in CI. The Browser smoke result and screenshot artifacts for the revision commit provide native-browser evidence; this pre-commit note does not claim those checks have already run.

Seven lessons, 15 minutes each, 105 minutes total. The 2/4/5/4-minute structure includes spaced recall, use cases, code replay, live model, and quiz. No completion or mastery was inferred.

## Observed before commit

- Executed six Python examples and one Java example through scripts/walkthrough.py. Each final state matched its asserted expected values. The HTML replays captured execution; Python and Java do not execute in the browser.
- Day17/verify.cjs exercises correct and broken checkpoint recovery, Bloom positives/negatives/collision handling, positive/zero/negative automation payback, repeated-trial summaries, battery energy boundaries, both deployment queue policies and reset, and pagination insertion/tie cases.
- npm run test:models passed all 15 bundle-policy tests and the seven Day17 semantic checks.
- node scripts/verify-walkthroughs.cjs passed for all 99 lessons: replay controls and values, boundaries, quiz scoring, answer history, simulated save/export/restore, and relative links.
- HTML and Markdown companions contain the practical use-case fields. Seven lesson pages and their hub are standalone, with embedded CSS/JS.
- Date key 2026-10-07 occurs once. Review keys are Day2+14, Day8+7, Day14+3, Day16+1. The original five tracks review Day2 and Day8; the two new tracks review Day14 and Day16. Oldest due items are selected under the existing two-prompt-per-track budget; remaining due items carry forward.
- Source contents checked through current official documentation and original publisher material. Sources list check dates and known publication dates. No source URL is treated as evidence merely because it exists.

## Source scope

Flink stable documentation identified version 2.3.0. GitHub's May 7, 2026 announcement and current documentation confirm queue:max, its 100-pending limit, the invalid combination with cancel-in-progress:true, and waiting-arrival ordering rather than commit ordering. PostgreSQL documentation identified version 18.

The battery paper was published September 30, 2026 as an early accepted manuscript. Its publisher abstract and publication metadata were retrieved through search after direct opening returned a retrieval error. The lesson limits paper-specific claims to that abstract; it does not claim to have reproduced or inspected supplementary experimental data. The 10 Ah / 1.4 V example and auxiliary-energy model are explicitly synthetic, distinct from the reported 99.0% and 75.8% efficiencies.

## Native browser gate and limits

Local Chromium is unavailable in this runtime. The existing repository Browser smoke workflow runs after the atomic commit. Its result for the exact commit is the authoritative native-browser evidence; this pre-commit report does not predict that result.

That workflow checks desktop and mobile Chromium: layout overflow and visible controls, actual UI manipulation, replay highlighting and values, expandable explanations, quiz attempts and feedback, local-storage restoration, real downloaded JSON, navigation, local links, browser errors, and unexpected network requests. It also retains synthetic screenshots and checks historical Day1/Day15 use-case sections.

No claim is made about Safari/Firefox, assistive-technology testing, pixel-perfect visual review, or real Flink/Redis/GitHub deployment/database/battery execution. Official external pages may later move; HTTP status and availability for every external source are not covered by the local link tests. No learner answers are stored in the repository.


## Product implementation and certification expansion — 2026-10-08

Data engineering now has a 30-minute budget, including separate nine-minute Databricks and Snowflake subsections; Day17 totals 120 minutes. Original lesson identity, Flink sources/check dates, quiz, code replay, delivery date, and review history are preserved. Added-date product reviews are tracked independently.

Verified locally: all99 original lesson replays and common quiz/save/export serialization; seven Day17 models; Databricks same-query retry15 versus fresh-query30; Snowflake rollback preserves10 then retry commits15, committed retry adds nothing; supplemental quiz gating/scoring; historical duration75/105 versus120 policy; added-date product-review scheduling. Native Chromium checks run in Browser smoke for the publishing commit, including product diagrams, both recovery paths, highlighting, scoring, persistence, and actual JSON download. See the workflow result for observed browser evidence.

Databricks/Snowflake SQL and PySpark snippets were checked against current official documentation, but no authenticated vendor sandbox was available. They were not executed in either product. Browser models are executable JavaScript approximations, not captured vendor traces. Full Snowflake COF-C03 objective IDs/weights remain unverified; the roadmap flags this gap. Automated browser layout checks are not manual screenshot review.
