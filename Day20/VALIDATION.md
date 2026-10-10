# Day20 validation

Checked 2026-10-10.

## Passed locally

- Seven expected tracks, lesson data, standalone HTML pages, Markdown companions, runnable examples, and the daily hub are present.
- All seven recorded Python/Java examples executed and produced the values replayed in the pages.
- All seven JavaScript teaching worlds passed mechanism-specific state-transition checks.
- Databricks and Snowflake product models, product scoring, review scheduling, links, quiz/save/export structure, and certification coverage-only state passed repository checks.
- `npm run test:models` passed 15 policy tests and selected Day20 as the complete latest bundle.
- `node scripts/verify-walkthroughs.cjs` passed all 120 historical lessons.
- Day20 is the only bundle with generation key `2026-10-10`; total duration is 120 minutes.

## Browser gate

`tests/browser/day20-concepts.spec.cjs` exercises desktop and mobile layout, SVG clipping, each meaningful interaction, product scoring, persistence, and native answer export in the repository Browser smoke workflow. The generated vendor SQL was not executed in Databricks or Snowflake. Local JavaScript models are teaching models, not product emulators.
