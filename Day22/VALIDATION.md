# Day22 validation

Checked 2026-10-12.

## Passed locally

- Seven expected tracks, lesson data, standalone HTML pages, Markdown companions, runnable examples, and the daily hub are present.
- All seven recorded Python/Java examples executed and produced the values replayed in the pages.
- All seven JavaScript teaching worlds passed mechanism-specific state-transition and boundary checks.
- The Databricks and Snowflake bad-batch repair models, product scoring, the Day17 +3 product review, links, quiz/save/export structure, and certification coverage-only state passed repository checks.
- Day22 is the only bundle with generation key `2026-10-12`; total duration is 120 minutes.

## Browser gate and execution limits

`tests/browser/day22-concepts.spec.cjs` covers desktop and mobile layout, SVG clipping, every concept mechanism, product scoring, persistence, and native answer export. Local execution could not start because the Playwright Chromium executable is not installed. The repository Browser smoke workflow is the browser gate.

The Databricks SQL, Snowflake SQL, and GitHub Actions examples are source-aligned but were not run against vendor services. The in-page JavaScript interactions are explicitly labeled teaching models, not product emulators. Personal mastery was not assessed.
