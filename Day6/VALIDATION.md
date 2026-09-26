# Day6 validation

Checked 2026-09-26.

## Passed

- Five tracks, five HTML lessons, five Markdown companions, the daily hub, and `lessons.json` are present.
- Each lesson contains a 2/4/5/4-minute flow, one executable model, three scored questions, two written responses, hidden answer guidance, original synthetic examples, source dates, source check dates, and explicit model limits.
- Day3 three-day and Day5 one-day retrieval prompts appear in every same-track lesson. `study-state.json` records `Day3+3` and `Day5+1` only.
- `node Day6/verify.cjs` executed every embedded model in a simulated DOM and covered:
  - Kafka local, remote, and expired rewind paths with hot/retained capacity estimates
  - delayed, eager, and late hedged requests with duplicate-attempt accounting
  - lightweight, staged, and heavyweight decision-governance paths
  - filesystem, network, credential, and scoped-proxy agent boundaries
  - synthetic prevalence, sensitivity, specificity, false-positive, and PPV behavior
- The same check observed the incomplete-quiz guard, 3/3 and 2/3 scoring, attempt history, local serialization, and JSON export payload for every lesson.
- Python HTML parsing succeeded for the daily pages; all relative links resolve.
- The manifest has one `2026-09-26` generation key, Day6 is the last day, the exact two review keys are recorded, and the root index links to Day6.
- Primary sources were checked on 2026-09-26. The FDA lesson distinguishes advisory-panel votes from FDA approval, reports the vote counts from the 24-hour summary, and uses only synthetic calculator inputs rather than product performance claims or clinical advice.
- No submitted personal answers are present in the public repository.

## Actual limit

No system browser or Playwright browser executable is available. Real-browser layout, native download behavior, and mobile rendering were not observed. The HTML is responsive by inspection, and JavaScript behavior was verified with the dependency-free simulated DOM above.
