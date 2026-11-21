# Day60 validation

Checked November 20, 2026.

- `python scripts/walkthrough.py`: executed all 400 synthetic Python and Java lesson examples and captured four-step traces. No vendor service was contacted.
- `node scripts/verify-walkthroughs.cjs`: passed all 400 recorded replays, quiz scoring and retakes, local save/restore, JSON export invocation, standalone links, and Markdown companions. Historical Day17 set ordering and Day39 JVM identity strings were re-rendered locally after the fresh executions so their pages matched the newly observed traces; those historical files are not part of the Day60 publication.
- `node Day60/verify.cjs`: passed all seven Day60 interaction state changes, 3/3 quizzes, 2/2 product questions, save/export hooks, source and local links, 120-minute policy, generation-key uniqueness, due reviews, and certification coverage assertions.
- `npm run test:models`: all 15 bundle and policy tests passed; the browser bundle selected Day60 with seven lessons and eight HTML pages.
- `npx playwright test tests/browser/smoke.spec.cjs --reporter=line`: attempted desktop/mobile browser testing, but Playwright could not launch because `/home/agent/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` is absent. Native layout, focus behavior, and actual download behavior therefore remain unverified in this runtime.

The Databricks SQL, Snowflake SQL, Lakeflow Jobs compute choices, warehouse lifecycle, GitHub Actions workflow, MCP transport, and research system were not executed against their vendor or laboratory environments. Their code is explicitly labeled unexecuted, and the interactive worlds are local JavaScript teaching models. Curriculum coverage is recorded; personal mastery is not assessed.
