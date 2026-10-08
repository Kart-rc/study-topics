# Day15 validation

Checked on 2026-10-05.

## Practical use-case revision · 2026-10-07

All seven lessons now include a visible “Use case: when to use this” section in HTML and Markdown: when the idea fits, a concrete example, and an adoption boundary or simpler alternative. It is included in the existing four-minute explanation; each lesson remains 15 minutes and Day15 remains 105 minutes.

The new guidance was checked against the original primary sources. Existing source dates, questions, answer choices, code, recorded execution frames, and generation/review state were compared with the published baseline and preserved. The separate `use_case_checked_on` field records this revision's research check.

The Day15 mechanism verifier, all 92 repository lesson replay/quiz/save/export/link checks, and the bundle-policy tests passed locally. The `historical-use-cases.spec.cjs` browser regression explicitly covers all seven Day15 pages on desktop and mobile, because the main smoke suite otherwise selects only the newest day. Native verification runs in the repository's Browser smoke workflow; see the result attached to this revision commit. Local Chromium remains unavailable. This regression checks content visibility, JavaScript errors, and horizontal layout, not a full accessibility audit or Safari/Firefox behavior.

## Observed checks

- Executed all seven synthetic examples with `scripts/walkthrough.py`; each produced four recorded state frames and matched its declared final values.
- Ran `node Day15/verify.cjs`; all seven interactive mechanisms passed normal, failure, and boundary scenarios.
- Ran `node scripts/verify-walkthroughs.cjs`; all 85 lessons passed recorded-replay, quiz scoring and retake, local-save serialization, answer export, relative-link, standalone-resource, and Markdown companion checks.
- Ran `npm run test:models`; all 15 bundle-policy regression tests and the Day15 semantic verifier passed.
- Confirmed Day15 has seven tracks, 105 minutes total, one `2026-10-05` generation key, and review keys `Day6+7`, `Day10+3`, `Day12+3`, and `Day14+1`.
- Confirmed every lesson includes a plain-language example, rendered HTML visual, short code walkthrough, four recorded execution frames, interactive lab, explicit model limit, three scored questions, two written prompts, primary-source links, and a 2026-10-05 source-check date.
- Rechecked the cited official documentation and original Nature research article through web retrieval before authoring.

## Verification limit

The Node checks execute the page scripts against a simulated DOM. The Playwright package installed successfully, but the runtime had no Chromium executable. A bounded browser-install attempt returned truncated zero-byte archives, so native rendering, responsive layout, focus behavior, and real download behavior were not observed locally. The repository's browser-smoke workflow remains the native-browser gate after push. The pages contain no remote runtime dependencies and are designed to open from disk.

## Concept-specific visual revision — 2026-10-08

Revised this historical bundle in the Days 11–16 tranche. Each interactive visual now represents the lesson’s actual mechanism, with a text explanation in the Markdown companion. Sources, source-check dates, quizzes, code replays, use cases, delivery dates, and study state are preserved.

Local verification passed: protected-field comparison, actual model execution, replay/quiz/save/export serialization, and local links. Native Chromium desktop/mobile interaction, download, and layout checks are recorded by the **Historical visual tranches** GitHub Actions workflow for the publishing commit. Automated layout checks do not substitute for manual visual inspection.
