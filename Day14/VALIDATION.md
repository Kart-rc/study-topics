# Day14 validation

Checked on 2026-10-04.

## Observed checks

- Executed all seven synthetic examples with scripts/walkthrough.py; each produced four recorded state frames and matched its declared final values.
- Ran node Day14/verify.cjs; all seven interactive mechanisms passed their normal and failure/boundary scenarios.
- Ran node scripts/verify-walkthroughs.cjs; all 78 lessons passed recorded-replay, quiz scoring and retake, local-save serialization, answer export, relative-link, standalone-resource, and Markdown companion checks.
- Confirmed Day14 has seven tracks, 105 minutes total, one 2026-10-04 generation key, and review keys Day5+7, Day9+3, Day11+3, and Day13+1.
- Confirmed every lesson includes a plain-language example, rendered HTML visual, short code walkthrough, four recorded execution frames, interactive lab, explicit model limit, three scored questions, two written prompts, primary-source links, and a 2026-10-04 source-check date.
- Rechecked the cited primary documentation and original Nature paper through web retrieval before authoring.

## Verification limit

The Node checks execute the page scripts against a simulated DOM. Playwright is installed, but its Chromium executable is not available in this runtime, so native browser rendering, responsive layout, focus behavior, and real download behavior were not observed. The pages contain no remote runtime dependencies and are designed to open from disk.

## Concept-specific visual revision — 2026-10-08

Revised this historical bundle in the Days 11–16 tranche. Each interactive visual now represents the lesson’s actual mechanism, with a text explanation in the Markdown companion. Sources, source-check dates, quizzes, code replays, use cases, delivery dates, and study state are preserved.

Local verification passed: protected-field comparison, actual model execution, replay/quiz/save/export serialization, and local links. Native Chromium desktop/mobile interaction, download, and layout checks are recorded by the **Historical visual tranches** GitHub Actions workflow for the publishing commit. Automated layout checks do not substitute for manual visual inspection.
