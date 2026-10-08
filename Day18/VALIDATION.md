# Day18 validation — 2026-10-08

## Completed locally

- Executed all seven recorded examples: six Python examples and one Java 17 semaphore example. Stored source and captured states beside the lessons. Browser controls replay those values; they do not execute Python/Java.
- Seven semantic model checks cover expected outcomes and failure boundaries. Product models separately check missing schema/warehouse grants, highlighted statement progression and reset.
- Reused replay/quiz/save/export/link verification passed across 106 lessons. This uses a simulated DOM and does not establish native browser behavior.
- Bundle policy tests passed: seven tracks, 30 + 6×15 = 120 minutes, one October 8 generation key, no historical day/date/assessment changes.
- Sources were opened from original vendor documentation, RFC 9110, AWS guidance, Anthropic engineering and the ICML paper. Dates are recorded per source. The speculative-decoding lesson is a foundational research deep dive, not a new October announcement.
- Review allocation: original five tracks recall Day3+14 and Day9+7; new tracks recall Day11+7 and Day15+3. Older due reviews take priority under the existing two-prompt budget. Remaining keys carry forward. No 30-day material is old enough yet.
- Day17 product additions and Day18 product material both begin October 8. No product review is due today. Coverage is delivery evidence, not personal mastery.

## Native-browser gate

The repository Browser smoke workflow runs Chromium desktop (1280px) and mobile (390px) after publication. It checks native controls, code replay, quizzes, save/reload, JSON downloads, local links, errors and page overflow. Day18 adds eight tests per viewport for seven mechanism predictions plus product grants, highlighting, scoring and private export. It captures synthetic-only mechanism screenshots and checks SVG label bounds. Consult the workflow result for the commit; a test specification alone is not a passing result.

The local runtime has no installed Chromium executable. Native checks run in CI; screenshots are not manually reviewed in this environment. Browser automation cannot establish that every explanation is intuitive to every reader.

## Execution and scope limits

- Databricks and Snowflake SQL has **not** been run on either vendor platform. The product sections state the required prepared sandbox, identities, grants, compute and costs. Modeled results are teaching predictions, not real authorization evidence.
- Java/Python and browser fixtures use synthetic data. No LLM, database service, GitHub matrix, HTTP server implementation or inference benchmark is run by the lesson models.
- Full SnowPro COF-C03 objective IDs and weights remain unverified, as recorded in certification-plan.json. No exam readiness or score is inferred.
- No personal answers or scores are published. Browser tests use disposable synthetic answers.
