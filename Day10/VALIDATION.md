# Day10 validation

Prepared September 29, 2026 for September 30 at the user's request. Generation key: `2026-09-30`. Five lessons × 15 minutes = 75 minutes, including recall and quizzes. Generation is not evidence of study completion.

## What changed in the teaching

Each lesson starts with a concrete situation, defines unfamiliar words, and uses a rendered HTML diagram. The lab changes named state that the learner can inspect. Each has a worked example, predictions, failure or boundary cases, and three scored plus two written questions. Diagrams, styles, scripts, and questions are embedded for offline use. Markdown companions contain the same teaching and source links; use HTML for interaction.

The Geoffrey Litt micro-worlds, code-explainers, and understanding-quizzes skillpack informed the executable examples and prediction questions. Existing approval permits retaining the lesson artifacts and generating without quiz completion.

## Checks performed

Run `python Day10/build.py` to rebuild and `node Day10/verify.cjs` to check the generated bundle.

- All five embedded scripts executed against a simulated DOM.
- Outbox: no send without a ticket; saved order/ticket survive relay restart; crash loses relay acknowledgement; retry produces two Kafka copies; stable event ID protection yields one shipment; unprotected processing yields two.
- Circuit breaker: three failures open it; the next call is blocked; failed probe reopens it; successful probe closes it.
- Migration: tracking ownership changes without moving order ownership; new-service failure is visible; fallback succeeds only with compatible old data.
- Tool contract: positive but wrong-unit input is blocked; unauthorized order and invalid range fail; validation does not mutate the balance; safe execution changes it once; replay is blocked in this session.
- Optical memory: selected level differs from stored level; programming needs power; retention survives removal of programming power; reading needs its own light/detector; 0.6 × 10/15 gives 0.4.
- Incomplete quiz guard, correct and incorrect scores, local-save serialization, export JSON and attempt history checked with synthetic responses only. No personal answers are committed.
- Local navigation targets exist; IDs are unique; no remote runtime dependencies; exactly one September 30 generation key.
- Source URLs and content were checked September 29 using original AWS, Microsoft, Anthropic, JSON Schema, and Nature sources. Living sources are identified as such. The Nature article's primary-source abstract was retrieved through indexed search; direct publisher access redirected to an unavailable identity endpoint. No claim is made that full experimental methods were reviewed.

## Review allocation

The two-minute recall budget uses the two oldest due bundles: `Day6+3` and `Day8+1`, both due September 29. Every track includes its matching question and a hidden explanation from those days. `Day3+7`, `Day7+3`, and `Day9+1`, due September 30, remain queued. The 14- and 30-day intervals are not due yet. This follows the existing renderer's overdue-first, two-bundle cap; the budget stays 75 minutes.

## Actual limits

Chromium was absent. Both available Playwright browser installation attempts failed with invalid/truncated downloads. No real-browser layout, keyboard traversal, localStorage persistence across browser sessions, or native download behavior was verified. CSS includes responsive stacking and visible keyboard focus, but those are implementation properties, not a visual test result. Simulated DOM checks do not reproduce browser rendering or browser security policies. No production Kafka, database, service, AI tool, or physical device was contacted by the models.

## Plain-language and execution-walkthrough revision

This day now has five executed code examples with recorded state replays and highlighted statements. Core explanations were simplified for Days 1–9; original technical detail is optional. Topic identities, scored quizzes, sources, original lab behavior, and study history were retained. Python/Java execution, replay controls, quiz/save/restore/export checks, and local links passed. Real-browser layout and native behavior remain unverified. See [TEACHING_UPDATE.md](../TEACHING_UPDATE.md) for scope, commands, and exact verification limits.
