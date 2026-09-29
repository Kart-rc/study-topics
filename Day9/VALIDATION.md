# Day9 validation

Checked on 2026-09-29 (America/New_York generation date).

## Contract and content

- Five lesson manifests rendered to five standalone HTML pages and five Markdown companions.
- Each lesson is budgeted to 15 minutes: 2 minutes recall, 4 understand, 5 explore, and 4 quiz; the daily index states 75 minutes total inclusive of review.
- Source and check dates appear in every HTML and Markdown lesson. Claims were checked against original Apache Kafka, Amazon/ACM/RFC, AWS, OpenAI, and Nature sources.
- Foundations, a current platform development, harness practice, and a research claim are labeled explicitly.
- Day9's generated review queue is `Day2+7` and `Day7+1`. Each track page contains both source-day refreshers. Later due items remain available to the renderer rather than being marked complete.
- No submitted answers or inferred mastery are present.

## Deterministic functional checks

`node Day9/verify.cjs` passed for all five pages:

- each embedded model executes at its default and a boundary/trade-off input;
- unanswered quizzes are rejected, correct answers score 3/3, and one changed answer scores 2/3;
- explanatory feedback is emitted;
- recall, rationale, boundary response, and attempt history serialize to local storage;
- exported JSON parses and contains the expected Day9 lesson key and attempt history;
- source/check metadata and both spaced-review blocks are present.

An independent HTML-link walk checked 40 internal links across the root index and Day9 pages with zero missing targets. The manifest contains three current/original sources per lesson (15 total). Live retrieval confirmed the substantive claims and canonical destinations; the automated web opener could not directly render the ACM page or DOI resolver, although the canonical records were discoverable and the publisher pages loaded.

## Layout and limits

- The pages include a responsive viewport, fluid grid, narrow-screen media rule, keyboard focus styles, labels, legends, and live regions.
- No Chromium, Chrome, or Firefox executable was available locally, so rendered visual layout, keyboard traversal in a real browser, local-storage persistence across reloads, and the browser's native download prompt were not established. The simulated DOM verifies the code paths, not browser integration.
- The interactive models are intentionally simplified. Each page declares its omissions next to the model; outputs are teaching calculations, not production predictions.
