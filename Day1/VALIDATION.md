# Day1 validation

## Practical use-case revision · 2026-10-07

All five lessons now include a visible “Use case: when to use this” section in HTML and Markdown: when the idea fits, a concrete example, and an adoption boundary or simpler alternative. It is included in the existing four-minute explanation; each lesson remains 15 minutes and Day1 remains 75 minutes.

The new guidance was checked against the original primary sources. Existing source dates, questions, answer choices, code, recorded execution frames, and generation/review state were compared with the published baseline and preserved. The separate `use_case_checked_on` field records this revision's research check.

All 92 repository lesson replay, quiz, save/export, and local-link checks passed locally, along with the bundle-policy tests. The `historical-use-cases.spec.cjs` browser regression explicitly covers all five Day1 pages on desktop and mobile, because the main smoke suite otherwise selects only the newest day. Native verification runs in the repository's Browser smoke workflow; see the result attached to this revision commit. Local Chromium remains unavailable. This regression checks content visibility, JavaScript errors, and horizontal layout, not a full accessibility audit or Safari/Firefox behavior.

## Plain-language and execution-walkthrough revision

This day now has five executed code examples with recorded state replays and highlighted statements. Core explanations were simplified for Days 1–9; original technical detail is optional. Topic identities, scored quizzes, sources, original lab behavior, and study history were retained. Python/Java execution, replay controls, quiz/save/restore/export checks, and local links passed. Real-browser layout and native behavior remain unverified. See [TEACHING_UPDATE.md](../TEACHING_UPDATE.md) for scope, commands, and exact verification limits.
