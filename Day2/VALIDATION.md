# Day2 validation — 2026-09-22

## Content and continuity

- Five distinct tracks, 15 minutes each including recall and assessment; total 75 minutes.
- Day1 same-track retrieval prompts and hidden refreshers included in every lesson; review key `Day1+1`.
- Sources checked against original Apache Spark, Google SRE, Anthropic, Google Research, and arXiv pages on 2026-09-22. Established concepts are labeled foundations. The R4T spotlight distinguishes the 2026-09-15 write-up from the 2026-03-06 paper.
- All example data, model rates, fixtures and retrieval scores are synthetic. Model limitations appear in each HTML page and Markdown companion.
- No submitted learner answers were available. Completion and mastery remain unassessed.

## Passed checks

Run `node Day2/verify.cjs` from the repository root to repeat the embedded-script checks.

- Executed all five actual embedded JavaScript programs using a simulated DOM.
- Watermark replay: previous-batch boundary, late event in retired window, retained later window, longer-delay behavior, reset and replay end bound.
- Queue model: 20 seconds of overload yields 300 queued and 100 rejected items; 15 seconds of spare capacity drains the backlog; cooperative quota accounts for 400 deferred items.
- Canary model: global failure rate 0.139% at 1% exposure masks a cohort regression; 10% exposure yields 0.490%; easy-only traffic leaves the risky path untested.
- Agent grading: claim-only 4/4 versus contract 1/4, including unauthorized-write rejection and fixture inspection.
- Retrieval model: independent relevance yields two distinct facets; novelty bonus 0.2 yields three, with irrelevant candidates excluded.
- All lessons: incomplete-answer guard, correct and incorrect quiz scores, first attempt/retake history, local-save serialization, answer-export JSON, and Day1 refresher presence.
- Parsed all HTML: relative targets exist, IDs are unique, and no external assets are required.
- Confirmed source-check dates, hidden Markdown refresher answers, exactly five lesson HTML files plus the hub, and deterministic rerendering without duplicate review state.
- Python renderer compiles. The scoped renderer change preserves paragraph breaks and hidden refresher answers in newly rendered Markdown; Day1 files were not regenerated.

## Verification limits

- Real browser launch failed because the Playwright browser executable is absent. Layout, mobile rendering, keyboard behavior, actual browser storage permissions, and browser download behavior were not verified. Simulated-DOM checks are not a substitute for browser QA.
- No real Spark job, queue service, production canary, LLM evaluation, or learned retriever was run. The interactions execute the disclosed educational models only.
- Static examples and checks do not establish production safety or learner mastery.
