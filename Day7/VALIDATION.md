# Day7 validation

Checked 2026-09-27.

## Passed

- Five tracks, five HTML lessons, five Markdown companions, the daily hub, and `lessons.json` are present.
- Each lesson contains a 2/4/5/4-minute flow, one executable model, three scored questions, two written responses, hidden answer guidance, original worked examples, source dates, source check dates, and explicit model limits.
- Day4 three-day and Day6 one-day retrieval prompts appear in every same-track lesson. `study-state.json` records `Day4+3` and `Day6+1` only.
- `node Day7/verify.cjs` executed every embedded model in a simulated DOM and covered:
  - eligible, stateful-ineligible, and capacity-saturated Spark 4.1 RTM scenarios
  - propagated deadlines, fresh per-hop timeouts, expired work, and successful completion
  - priority-aware and proportional load shedding plus a no-overload path
  - verified agent completion, budget exhaustion, stall detection, and unverified self-report
  - arm-qubit simulated gate time and an explicitly simplified independent-error composition model
- The same check observed the incomplete-quiz guard, 3/3 and 2/3 scoring, attempt history, local serialization, and JSON export payload for every lesson.
- Python HTML parsing succeeded for the daily pages; all relative links resolve.
- The manifest has one `2026-09-27` generation key, Day7 is the last day, the exact two review keys are recorded, and the root index links to Day7.
- Primary sources were checked on 2026-09-27. The Spark lesson separates current 4.1 support limits from synthetic capacity estimates. The arm-qubit lesson labels the reported gate results as simulations and identifies fabrication as future work.
- No submitted personal answers are present in the public repository.

## Actual limit

No system browser or Playwright browser executable is available. Real-browser layout, native download behavior, and mobile rendering were not observed. The HTML is responsive by inspection, and JavaScript behavior was verified with the dependency-free simulated DOM above.

## Plain-language and execution-walkthrough revision

This day now has five executed code examples with recorded state replays and highlighted statements. Core explanations were simplified for Days 1–9; original technical detail is optional. Topic identities, scored quizzes, sources, original lab behavior, and study history were retained. Python/Java execution, replay controls, quiz/save/restore/export checks, and local links passed. Real-browser layout and native behavior remain unverified. See [TEACHING_UPDATE.md](../TEACHING_UPDATE.md) for scope, commands, and exact verification limits.

## Concept-specific visual revision — 2026-10-08

Revised this historical bundle in the Days 6–10 tranche. Each interactive visual now represents the lesson’s actual mechanism, with a text explanation in the Markdown companion. Sources, source-check dates, quizzes, code replays, use cases, delivery dates, and study state are preserved.

Local verification passed: protected-field comparison, actual model execution, replay/quiz/save/export serialization, and local links. Native Chromium desktop/mobile interaction, download, and layout checks are recorded by the **Historical visual tranches** GitHub Actions workflow for the publishing commit. Automated layout checks do not substitute for manual visual inspection.
