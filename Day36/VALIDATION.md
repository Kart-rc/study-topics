# Day36 validation

Checked October 26, 2026.

- Seven lesson records, HTML pages, Markdown companions, recorded examples, and the daily index are present.
- Data engineering is 30 minutes with separate 9-minute Databricks and Snowflake blocks; the other six lessons are 15 minutes each (120 minutes total).
- `node Day36/verify.cjs`, the shared 232-lesson replay suite, and `npm run test:models` passed.
- Local checks exercised each Day36 model state, three-question scoring, two-question product scoring, answer save/export hooks, local links, execution replays, generation-key uniqueness, due review selection, and certification-cycle metadata.
- The Databricks/Snowflake SQL and PySpark snippets are sourced examples and were not run against vendor platforms. Certification mastery remains unassessed.
- Hosted Chromium passed all 16 Day36 desktop/mobile smoke cases for rendering, responsive layout, links, interactions, scoring, save/restore, export/download, disclosures, and navigation. The overall historical workflow remains red only because the pre-existing Day28 concept test imports a missing `openLesson` helper: 218 passed, 2 failed. See [workflow run 40416683327](https://github.com/Kart-rc/study-topics/actions/runs/40416683327).

The browser worlds are declared teaching models. Recorded Python/Java examples were executed locally during the build; their HTML controls replay captured states and do not execute Python or Java in the browser.
