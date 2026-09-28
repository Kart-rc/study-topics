# Engineering field notes

Five 15-minute lessons per day for an experienced data/platform engineering leader: data engineering, software engineering, Distinguished Engineer judgment, GenAI engineering, and technology breakthroughs.

## Read

Download or clone this repository and open `index.html` in a browser. Choose a Day folder, then a lesson. GitHub's file view displays HTML source; download the repository ZIP from **Code → Download ZIP** to use the interactions locally. No build, API key, account, or external JavaScript is needed to read a lesson.

Each lesson includes 2 minutes of recall, 4 minutes of explanation and worked example, 5 minutes of interactive exploration, and 4 minutes of assessment. Total daily study time is 75 minutes. Sources have dates and a checked date. Established foundations are labeled separately from new research.

## Daily generation

A ChatGPT automation runs at **6:50 PM America/New_York**, including daylight-saving changes. It researches and commits the next complete `DayN` bundle. The schedule starts generation; browsing and validation take additional time. This repository does not run an LLM or contain API credentials. `study-state.json` records the automation ID and generated bundles. `DAILY_TASK.md` contains the execution contract.

Day numbers count generated bundles, not completed study sessions. There is at most one new bundle per New York calendar date. Retries repair or reuse that day's bundle. Missing dates do not create empty folders or a multi-day catch-up backlog. Commit the five lessons and updated state together.

## Recall and feedback

Review intervals are 1, 3, 7, 14, and 30 calendar days after delivery. Each later lesson embeds due questions from the same track. Missed intervals are collected in the next generated bundle, with duplicate topic prompts consolidated. Keep recall within two minutes by selecting a few high-value questions when many topics are due; carry uncovered reviews forward explicitly.

Each lesson has three scored prediction/rationale/boundary questions and two written responses. Answers and attempt history can be saved in the browser or exported as JSON. Upload an export in ChatGPT for feedback and targeted refreshers. Local files do not automatically submit answers. Generation and opening a page do not establish completion or mastery.

This is a public repository. Keep personal assessment answers and confidential work examples out of commits; all bundled examples use synthetic data.

## Browser validation

The [Browser smoke workflow](.github/workflows/browser-smoke.yml) runs on pull
requests, pushes to `main`, and manual dispatch. It selects the highest numeric
`DayN` directory, checks that its five lessons are complete, and runs its existing
`verify.cjs` when present. A partial newest bundle fails instead of silently
testing an older day.

Playwright then opens every HTML page in that bundle and tests root-to-day
navigation in headless Chromium at desktop (1280×800) and mobile (390×844)
viewports. It checks JavaScript/console errors, failed local resources, local
links and fragments, horizontal overflow, disclosures, model controls, quiz
gating and scoring, persistence after reload, and real JSON downloads including
attempt history. Day7 also has explicit browser assertions for its model
boundaries; future bundles retain generic interaction tests and their own
`verify.cjs` checks. New model-specific browser assertions belong in
`tests/browser/smoke.spec.cjs`, not in lesson content.

Run locally with Node.js 22+ and Python 3:

```sh
npm ci --ignore-scripts
npx playwright install --with-deps chromium
npm test
```

The runner starts its own loopback HTTP server on port 4173. Close other servers
on that port first. To run only one viewport:
`npm run test:browser -- --project=chromium-mobile`.

The job is capped at 12 minutes, the browser suite at five minutes, and each test
at 30 seconds, with one worker, no retries, and a three-failure cutoff. Discovery
allows at most 12 HTML pages in the newest bundle. Each page checks at most 200
distinct local links; old linked targets are checked but not recursively crawled.
External source links are not fetched. Unexpected external page requests fail.

Only hard-coded synthetic responses are entered into fresh, disposable browser
contexts. No personal browser profile, answer export, saved storage state, or
secret is loaded. Downloads are parsed and deleted; answer files are not uploaded.
Reports, viewport screenshots, and failure traces are retained for seven days in
Actions (and ignored by git locally). They contain only synthetic test activity.

This is a functional/layout smoke gate, not pixel-perfect visual regression,
accessibility certification, real-device coverage, or a Safari/Firefox test. It
uses HTTP; browser-specific `file://` persistence is not established. See the
workflow run for current evidence. Historical `DayN/VALIDATION.md` reports describe
what was observed when written and are not rewritten by CI.

## Files

- `DayN/index.html`: daily hub.
- `DayN/<track>.html`: standalone interactive lesson.
- `DayN/<track>.md`: readable explanation, exercises, and hidden answer key.
- `DayN/lessons.json`: editable lesson content and small executable teaching models.
- `study-state.json`: dates, generation keys, review intervals, and automation identity.
- `scripts/render.py`: render a reviewed lesson bundle, without network access or LLM calls.

To rebuild a reviewed bundle: `python3 scripts/render.py Day1`. New content requires researched lesson data; the renderer is not a content generator. Model simplifications appear inside each lesson.

The lesson approach draws on the [Geoffrey Litt skillpack](https://github.com/Kart-rc/nlah-agent-repo/tree/main/harness/skillpacks/geoffreylitt): intuition before code, small executable worlds, and comprehension checks. The user explicitly requested retaining these learning artifacts. Quiz completion does not block the approved daily generation schedule.
