# Day35 validation

Checked October 25, 2026.

## Passed locally

- Seven lesson records, seven standalone lesson pages, seven Markdown companions, the daily index, and seven runnable examples are present.
- All seven recorded execution replays were produced by running the synthetic Python/Java examples during the build; replay state matches `lessons.json`.
- Day35 semantic interaction checks pass for every concept model, the two product models, 3/3 lesson scoring, 2/2 product scoring, local save, JSON export, and local links.
- Repository bundle/model tests pass and select Day35 as the latest complete bundle.
- The day policy resolves to 30 minutes for data engineering plus six 15-minute lessons: 120 minutes total.
- Normal spaced review resolves to `Day21+7` and `Day25+3`. Product review resolves from the real addition date to `Day19/data-engineering+products+7`.
- The generation key `2026-10-25` is unique. Certification coverage is recorded as cycle 3 position 5 (`focused`), product lab execution is `not_run`, and mastery is `not_assessed`.

## Execution boundaries

- Databricks PySpark and Snowflake SQL are sourced examples and were not run against vendor platforms.
- The browser models are labeled local JavaScript teaching models and state their simplifications.
- The local Playwright attempt could not launch because the pinned Chromium executable is absent. The repository-hosted browser workflow is the native layout/download check.

## Hosted browser result

- GitHub Actions run [`40242680313`](https://github.com/Kart-rc/study-topics/actions/runs/40242680313) installed the pinned Chromium build and ran the complete browser suite.
- All 18 Day35 desktop/mobile cases passed: latest-day navigation, the daily hub, seven lesson pages, responsive layout/no horizontal overflow, local links, disclosures, interactive controls, replay stepping, empty/partial/0/2/3 quiz paths, product scoring, save/restore, real JSON downloads, and back/forward navigation.
- Overall historical result: 218 passed, 2 failed. Both failures are the already-known Day28 test-helper error, `openLesson is not a function`, in desktop and mobile. No Day35 browser case failed.
- Synthetic browser evidence was retained by the workflow for seven days. No learner answers were persisted in repository content or artifacts.
