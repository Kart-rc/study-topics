# Day12 validation

Generated and sources checked October 2, 2026. Generation key: `2026-10-02`.
Seven lessons × 15 minutes = 105 minutes, including recall and quizzes. No completion or mastery is inferred.

## Deliverables and teaching

Day12 contains seven standalone HTML lessons, seven Markdown companions, seven runnable Python examples, recorded execution data, and the daily hub. Every lesson begins with a familiar example, renders a state visual, steps through short executed code, provides an interactive JavaScript model, states a precise limit, and ends with three scored and two written questions. The HTML replays execution captured from the Python examples; it does not run Python in the browser.

The Geoffrey Litt code-explainers, micro-worlds, and understanding-quizzes guidance shaped the structure. The two newer tracks continue as focused lessons rather than being folded into the older tracks.

## Observed checks

- `node Day12/verify.cjs`: all seven embedded scripts executed in a simulated DOM. Success and failure/boundary states passed for exact-file position deletes, same-key coalescing, control-plane outage behavior, connected and orphaned spans, change-event amplitude, cache/artifact handoff, and stale HTTP writes.
- `node scripts/verify-walkthroughs.cjs`: 64 lessons passed replay next/back/reset, recorded state display, incomplete-quiz guard, correct and incorrect scoring, first-attempt/retake history, local-save serialization/restore, export payload/filename, and local-link checks. Synthetic answers only were used.
- Every Day12 Python example executed successfully. JSON files parse. Day12 has seven lessons and a 105-minute hub. Exactly one `2026-10-02` generation key exists.
- Relative HTML and example links resolve. Source URLs use HTTPS. The renderer includes no remote runtime dependency.
- Spaced review is track-aware. The original five tracks cover `Day9+1` and `Day4+7`; CI/CD and APIs cover their actual first due material, `Day11+1`. Other overdue review keys remain available for later bundles.

## Source verification

Primary or official material was retrieved and read on October 2:

- Apache Iceberg specification: a position delete identifies the target data file and a row position starting at zero. Position delete files are a v2 mechanism; v3 prohibits adding new ones, retains existing upgraded files, and adds deletion vectors.
- Go `x/sync/singleflight` official package documentation: one execution is in flight per key; duplicate callers wait and receive the same result.
- AWS Builders' Library: control planes change configuration; data planes perform ongoing work. A statically stable data plane keeps existing state and continues during a control-plane impairment.
- OpenTelemetry GenAI agent-span conventions: status is Development; agent, model, plan, workflow, and tool spans have explicit relationships and operation names. The lesson follows the guidance not to invent a conversation ID when none is readily available.
- Zhao et al., *Nature Materials*, published September 30, 2026: the publisher record and abstract report temporal-contrast detection and analogue amplitude control in a single organic mixed ionic–electronic active layer. The lesson is labeled as a research claim and its calculator as an original analogy.
- GitHub Actions official documentation: caches speed regeneration and must be optional for correctness; artifacts retain job outputs and pass them between jobs. Cache contents are treated as untrusted input.
- RFC 9110, published June 2022: `If-Match` is evaluated before a state-changing method; a false condition prevents the method and may be reported as 412, addressing lost updates.

Exact source links and check dates are embedded in each lesson.

## Actual verification limits

No Chromium, Chrome, or other browser executable is installed in the runtime. Real-browser rendering, responsive layout, keyboard traversal, persistent `localStorage`, and native file downloads were not tested. The simulated DOM checks JavaScript behavior and generated structure but is not a visual or browser-security-policy test.

No real Iceberg table, Go concurrency, AWS control plane, OpenTelemetry backend, sensor device, GitHub Actions run, or HTTP server was contacted. The code and labs verify bounded teaching models, not production performance or research reproduction.

## Reproduce

After downloading the repository, open `Day12/index.html` in a browser. From the repository root:

```sh
node Day12/verify.cjs
node scripts/verify-walkthroughs.cjs
python3 scripts/render.py Day12
```

## Concept-specific visual revision — 2026-10-08

Revised this historical bundle in the Days 11–16 tranche. Each interactive visual now represents the lesson’s actual mechanism, with a text explanation in the Markdown companion. Sources, source-check dates, quizzes, code replays, use cases, delivery dates, and study state are preserved.

Local verification passed: protected-field comparison, actual model execution, replay/quiz/save/export serialization, and local links. Native Chromium desktop/mobile interaction, download, and layout checks are recorded by the **Historical visual tranches** GitHub Actions workflow for the publishing commit. Automated layout checks do not substitute for manual visual inspection.
