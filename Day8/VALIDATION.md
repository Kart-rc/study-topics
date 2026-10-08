# Day8 validation

Checked 2026-09-28 (America/New_York).

## Contract and content

- Five tracks are present, each labeled as a 15-minute lesson with a 2/4/5/4-minute recall, explanation, exploration, and quiz structure.
- The daily hub reports 75 minutes total, inclusive of review.
- Each lesson includes an intuitive mechanism, an original worked example, one executable micro-world, an explicit model boundary, three scored prediction/rationale/boundary questions, and two written responses.
- Day1+7 and Day5+3 are the two oldest due review bundles selected under the two-minute cap. Day7+1 remains unrecorded and therefore carries forward.
- No submitted personal assessment answers were present or added.
- Source claims were checked against Apache Spark documentation/JIRA, AWS DynamoDB and FIS documentation, the 2026-07-28 MCP specification and MCP project blog, and the peer-reviewed Nature Chemical Engineering article. Every cited URL resolved in retrieval on the check date.

## Executed checks

`node Day8/verify.cjs` executed every embedded lesson script in a simulated DOM and observed:

- Spark foreground-byte comparison, bounded replay, and a reversed tradeoff.
- DynamoDB lost-update behavior, versioned retries, and contention growth.
- FIS alarm/recovery delay, stop behavior, and the no-breach full-duration case.
- MCP trusted and untrusted annotation paths, composed-risk blocking, approval, and retry policy.
- Bioresorbable-battery load/runtime behavior and the research caveat.
- Incomplete-answer guard, 3/3 scoring, 2/3 retake behavior, answer feedback, first-attempt/retake history, local serialization, and JSON export on all five pages.
- Two spaced-review refreshers per lesson from Day1 and Day5.

A dependency-free structural pass also checked all six HTML files for unique IDs, viewport metadata, and resolvable relative links. The lesson data passed schema, source-count, and quiz answer-index checks. `lessons.json` parsed successfully.

## Verification limit

No Chromium, Chrome, or Firefox executable was available. Responsive CSS and viewport metadata were inspected and local links were resolved, but visual mobile layout, native browser storage, accessibility behavior, and actual download UI were not tested in a real browser. The simulated DOM validates JavaScript behavior, not rendering.

## Plain-language and execution-walkthrough revision

This day now has five executed code examples with recorded state replays and highlighted statements. Core explanations were simplified for Days 1–9; original technical detail is optional. Topic identities, scored quizzes, sources, original lab behavior, and study history were retained. Python/Java execution, replay controls, quiz/save/restore/export checks, and local links passed. Real-browser layout and native behavior remain unverified. See [TEACHING_UPDATE.md](../TEACHING_UPDATE.md) for scope, commands, and exact verification limits.

## Concept-specific visual revision — 2026-10-08

Revised this historical bundle in the Days 6–10 tranche. Each interactive visual now represents the lesson’s actual mechanism, with a text explanation in the Markdown companion. Sources, source-check dates, quizzes, code replays, use cases, delivery dates, and study state are preserved.

Local verification passed: protected-field comparison, actual model execution, replay/quiz/save/export serialization, and local links. Native Chromium desktop/mobile interaction, download, and layout checks are recorded by the **Historical visual tranches** GitHub Actions workflow for the publishing commit. Automated layout checks do not substitute for manual visual inspection.
