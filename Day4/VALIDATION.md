# Day4 validation

Checked 2026-09-24.

## Passed

- Five tracks, five HTML lessons, five Markdown companions, the daily hub, and lessons.json are present.
- Each lesson contains a 2/4/5/4-minute flow, one executable model, three scored questions, two written responses, hidden answer guidance, source dates, source check dates, and explicit model limits.
- Day1 three-day and Day3 one-day retrieval prompts appear in every same-track lesson. study-state.json records Day1+3 and Day3+1 only.
- node Day4/verify.cjs executed every embedded model in a simulated DOM and covered:
  - independent and transactional Kafka output/offset commits with both consumer isolation choices
  - additive Protobuf evolution, lossy JSON relay, and unsafe field-number reuse
  - pre-provisioned and reactive zonal capacity with control-plane failure
  - coupled and decoupled agent recovery after sandbox and harness failures
  - sample-reward and target-distribution objectives
- The same check observed the incomplete-quiz guard, 3/3 and 2/3 scoring, attempt history, local serialization, and JSON export payload for every lesson.
- Python HTML parsing succeeded for the daily pages; all relative links resolve.
- The manifest has one 2026-09-24 generation key, Day4 is the last day, and the root index links to Day4.
- Primary source URLs and claims were checked on 2026-09-24. MaD-RL statements are labeled as research-author claims and its calculator is explicitly not the published algorithm.
- No submitted personal answers are present in the public repository.

## Actual limit

The Playwright package is installed, but its Chromium executable is not, and no system browser is available. Real-browser layout, native download behavior, and mobile rendering were not observed. The HTML is responsive by inspection, and JavaScript behavior was verified with the dependency-free simulated DOM above.

