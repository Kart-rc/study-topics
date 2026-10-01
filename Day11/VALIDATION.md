# Day11 validation

Generated and sources checked October 1, 2026. Generation key: `2026-10-01`.
Seven lessons × 15 minutes = 105 minutes, including recall and quizzes. No study completion or mastery is inferred.

## Deliverables and teaching

Seven standalone HTML pages, Markdown companions, recorded lesson data, seven runnable examples, a daily hub, two downloadable YAML examples, and updated root index/state. Each lesson uses a familiar problem, a rendered visual, a worked example, a highlighted code replay, an interactive model, model limits, three scored questions, and two written questions. Two minutes of the five-minute exploration block are allocated to code; three to the lab. Optional detail does not expand the core budget.

Six Python examples and one Java example were executed locally to capture the displayed states. The HTML replays those records; it does not run Python or Java. The separate labs execute JavaScript in the browser. No production service, deployment, LLM, database restore or quantum device is contacted. All inputs are synthetic.

The Geoffrey Litt code-explainers, micro-worlds and understanding-quizzes skills informed the teaching. Existing user approval covers retaining these artifacts and generating without a quiz-completion gate.

## Observed checks

- `node Day11/verify.cjs`: all seven embedded scripts executed in a simulated DOM; mechanisms and failure/boundary cases passed.
- Parquet: grouped candidate with no matching row; scattered ranges; missing statistics; empty candidate set. Compared results against a full scan for every integer 0–110, both layouts and both statistics settings (444 cases).
- Token bucket: immediate five-request burst admits three; half-second refill admits one more; long waits cap tickets at three; active work can exceed capacity; finishing work does not refill tickets; reset works.
- Recovery: baseline meets both timing targets; old data fails RPO alone; longer restore fails RTO; failed integrity blocks a positive decision even with good timing.
- Prompt cache: first miss, stable-prefix hit despite changed question, policy-version miss, repeated timestamp-prefix misses and clear/reset.
- Detection analogy: all four classical bit states checked. Both single flips alarm; 11 passes the agreement check despite differing from reference 00.
- Actions: failed test skips the dependent chain; successful tests permit it; removing dependencies lets package/deploy succeed despite test failure. No real workflow is installed or run.
- API: valid request, missing quantity, zero, numeric string, unknown field, absent body, null body, blank SKU, boolean, fractional number and integer-valued 2.0 checked. Passing shape never creates an order.
- `node scripts/verify-walkthroughs.cjs`: 57 lessons passed replay next/back/reset, recorded state display, incomplete quiz guard, correct/incorrect scoring, local-save serialization, restore, export payload/filename and attempt-history checks. Only synthetic responses were used; none are published as personal assessments.
- Both YAML files parsed with PyYAML. Checked workflow event and dependency edges; checked OpenAPI version, required body, required fields, quantity type/minimum and unknown-field policy. This was not full OpenAPI document validation; a full JSON Schema validator was unavailable.
- Relative links resolve, HTML IDs are unique, no remote runtime dependencies, daily count is seven/105 minutes, and exactly one October 1 generation key exists. Historical day records and files are preserved.

## Source verification

Primary source content was read through web retrieval on October 1:

- Apache Parquet page-index format documentation (page modified February 24, 2026; its displayed modification is a site change, not a feature release date).
- AWS API Gateway HTTP throttling and AWS Well-Architected recovery objectives/recovery testing pages (living documentation; publication dates not shown).
- Claude Platform prompt-caching documentation (living documentation; the lesson teaches exact-prefix reuse, without relying on model names, prices or a universal token threshold).
- Ainley et al., *Error Correction in a Distributed Quantum Computer*, arXiv v1 September 11, 2026. Primary PDF text retrieved and reviewed, including the distinction between detection with restart and active correction of a specific Bell state. The abstract/HTML endpoints were unavailable; the PDF source was accessible. The lesson is labeled a preprint and its lab a classical detection analogy, not experimental reproduction.
- GitHub Actions job-dependency documentation (canonical redirected URL; living documentation).
- OpenAPI 3.1.1, published October 24, 2024, and the official JSON Schema object guide. 3.1.1 is the chosen teaching version, not a claim about the latest version.

All exact source links and source/check dates are embedded in the lessons. Established foundations are labeled separately from the September research claim.

## Review allocation

The two oldest pending bundles are `Day3+7` and `Day7+3`, both due September 30. Each of the original five tracks includes its matching retrieval question and hidden refresher from both days. The two new tracks have no earlier material and start with prediction prompts.

`Day9+1` (due September 30), `Day4+7`, `Day8+3`, and `Day10+1` (due October 1) remain queued. The 14- and 30-day windows are not due yet. Day11 starts the new tracks' actual review history. Review allocation does not depend on assumed mastery.

## Actual verification limits

Playwright launch failed because the Chromium executable is absent. Real-browser visual layout, keyboard traversal, browser-session localStorage persistence and native downloads were not tested. Responsive CSS, embedded controls and focus styles are present, but their presence is not a visual test result. No browser installation was claimed. Simulated DOM tests do not reproduce browser rendering or security policies.

The code and source checks verify these bounded teaching examples. They do not benchmark Spark, prove an AWS recovery guarantee, reproduce provider cache behavior, run a GitHub deployment, establish full OpenAPI conformance or reproduce quantum experiments.

## Reproduce

Open `index.html` after downloading the repository. GitHub displays HTML source. From the repository root:

```sh
node Day11/verify.cjs
node scripts/verify-walkthroughs.cjs
python3 scripts/render.py Day11
```

Runnable Python examples are in `examples/`; run each with Python 3. The Java example can be run with a source-launch-capable JDK (Java 17 used here). To regenerate only this day's execution records, import `scripts/walkthrough.py`, call `execute('Day11', lesson)` for each lesson, save `lessons.json`, then render. `workflow-demo.yml` is lesson material and is not in `.github/workflows`.
