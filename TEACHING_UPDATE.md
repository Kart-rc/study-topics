# Days 1–10: clearer explanations and code you can follow

Approved approach: everyday example, plain-language explanation, rendered visual, short code, step-by-step execution, failure/fix or boundary, and quiz.

## What changed

- Days 1–9 now open with simpler explanations and shorter worked examples. The previous technical explanations and examples remain in optional expanded sections.
- All 50 lessons, including Day10, include a topic-specific code walkthrough. Each step highlights the statement, explains its purpose, and shows which values were created, changed, or left unchanged.
- Forty Python and ten Java examples were executed to generate the displayed states. The HTML buttons replay those captured executions; they do not run Python or Java in the browser. The separate existing JavaScript labs still let the learner vary inputs.
- Python examples use the standard library. Java examples use standard library features and were run with Java 17's source launcher. Day10 data engineering includes an actual SQLite transaction; its Kafka list remains a clearly labeled simulation.
- Leadership examples make decisions and assumptions visible. Research examples demonstrate only the stated arithmetic or analogy; they do not claim to implement or validate the underlying research system.
- The five-minute exploration block is divided into roughly two minutes of code replay and three minutes of lab use. Optional deeper sections are outside the core 15-minute lesson.
- The daily execution contract now requires this format for future material.

## Preserved

All 50 topic titles and slugs, all scored quiz questions/options/answer keys, source links, original interactive models, generation dates, review keys, automation identity, and assessment state were preserved. No new Day folder was allocated. No personal quiz answers were added. Historical source-check dates were retained: this is an editorial/code revision, not a fresh review of every linked paper.

## Checks actually performed

1. Executed all 40 Python and 10 Java examples and checked their final-state expectations. Java output and Python state capture supply the replay records.
2. Checked all 50 HTML replay controls against every captured frame: forward, previous, reset, initial boundary, final boundary, statement notes, and displayed state.
3. Checked incomplete quiz gating, 3/3 and 2/3 scores, synthetic local saving/restoration, export payloads, attempt histories, and download filenames in a simulated DOM.
4. Re-ran existing Day2–Day10 interaction checks. Added Day1 checks for commit conflicts, retry multiplication, error-budget exhaustion, handoff reset/recovery, and invalid tool-chain dependencies.
5. Checked internal links, unique DOM IDs, Markdown code/step content, and absence of remote runtime dependencies.
6. Compared original and revised content to confirm topics, scored quizzes, source links, lab code, and study history remain intact.

## Verification limits

No real browser executable was available in this workspace. Earlier Chromium installation attempts failed with invalid or truncated downloads. Responsive CSS stacks the code and state panels on narrow screens, but actual mobile layout, keyboard behavior, native browser downloads, and storage persistence across real browser sessions remain unverified. Simulated DOM tests are not a substitute for those checks. The examples contact no production systems, execute no model inference, and operate on no personal answers.

## Reproduce

```sh
python3 scripts/walkthrough.py
# Render each requested day, for example:
python3 scripts/render.py Day10
node scripts/verify-walkthroughs.cjs
node Day10/verify.cjs
```

Set `STUDY_JAVA` to a Java executable only if Java is not on PATH. Rendering existing captured traces and reading the lessons require no Java installation. To run an individual downloaded example, use `python3 DayN/examples/<track>.py` or `java DayN/examples/software-engineering.java`.
