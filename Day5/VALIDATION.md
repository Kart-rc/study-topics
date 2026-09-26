# Day5 validation

Checked 2026-09-25.

## Passed

- Five tracks, five HTML lessons, five Markdown companions, the daily hub, and `lessons.json` are present.
- Each lesson contains a 2/4/5/4-minute flow, one executable model, three scored questions, two written responses, hidden answer guidance, original synthetic examples, source dates, source check dates, and explicit model limits.
- Day2 three-day and Day4 one-day retrieval prompts appear in every same-track lesson. `study-state.json` records `Day2+3` and `Day4+1` only.
- `node Day5/verify.cjs` executed every embedded model in a simulated DOM and covered:
  - old and new Iceberg partition specs with stable logical filters
  - consistent-hash and modulo remapping as nodes join
  - shared and isolated concurrency during dependency slowdown
  - transcript-tail and structured agent context compaction
  - multimodal injection paths stopped by capability and protected-policy gates
- The same check observed the incomplete-quiz guard, 3/3 and 2/3 scoring, attempt history, local serialization, and JSON export payload for every lesson.
- Python HTML parsing succeeded for the daily pages; all relative links resolve.
- The manifest has one `2026-09-25` generation key, Day5 is the last day, the exact two review keys are recorded, and the root index links to Day5.
- Primary source pages were checked on 2026-09-25. The Repeat-After-Me metrics are identified as research-author claims, and its model does not reproduce or operationalize an attack.
- No submitted personal answers are present in the public repository.

## Actual limit

No system browser or Playwright browser executable is available. Real-browser layout, native download behavior, and mobile rendering were not observed. The HTML is responsive by inspection, and JavaScript behavior was verified with the dependency-free simulated DOM above.
