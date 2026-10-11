# Day21 validation

Checked 2026-10-11.

## Passed locally

- Seven expected tracks, lesson data, standalone HTML pages, Markdown companions, runnable examples, and the daily hub are present.
- All seven recorded Python/Java examples executed and produced the values replayed in the pages.
- All seven JavaScript teaching worlds passed mechanism-specific state-transition and boundary checks.
- Databricks and Snowflake dependency models, product scoring, the Day19 +1 product review, links, quiz/save/export structure, and certification coverage-only state passed repository checks.
- `npm run test:models` passed 15 policy tests and selected Day21 as the complete latest bundle.
- `node scripts/verify-walkthroughs.cjs` passed all 127 historical lessons.
- Day21 is the only bundle with generation key `2026-10-11`; total duration is 120 minutes.

## Browser gate and execution limits

`tests/browser/day21-concepts.spec.cjs` covers desktop and mobile layout, SVG clipping, every concept mechanism, product scoring, persistence, and native answer export. Local execution could not start because no browser binary was installed, and the Playwright Chromium download returned an empty archive. The repository Browser smoke workflow remains the browser gate.

The Databricks SQL, Snowflake SQL, and GitHub Actions YAML are source-aligned examples but were not run against vendor services. The in-page JavaScript interactions are explicitly labeled teaching models, not product emulators. Personal mastery was not assessed.
