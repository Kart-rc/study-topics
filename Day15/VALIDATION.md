# Day15 validation

Checked on 2026-10-05.

## Observed checks

- Executed all seven synthetic examples with `scripts/walkthrough.py`; each produced four recorded state frames and matched its declared final values.
- Ran `node Day15/verify.cjs`; all seven interactive mechanisms passed normal, failure, and boundary scenarios.
- Ran `node scripts/verify-walkthroughs.cjs`; all 85 lessons passed recorded-replay, quiz scoring and retake, local-save serialization, answer export, relative-link, standalone-resource, and Markdown companion checks.
- Ran `npm run test:models`; all 15 bundle-policy regression tests and the Day15 semantic verifier passed.
- Confirmed Day15 has seven tracks, 105 minutes total, one `2026-10-05` generation key, and review keys `Day6+7`, `Day10+3`, `Day12+3`, and `Day14+1`.
- Confirmed every lesson includes a plain-language example, rendered HTML visual, short code walkthrough, four recorded execution frames, interactive lab, explicit model limit, three scored questions, two written prompts, primary-source links, and a 2026-10-05 source-check date.
- Rechecked the cited official documentation and original Nature research article through web retrieval before authoring.

## Verification limit

The Node checks execute the page scripts against a simulated DOM. The Playwright package installed successfully, but the runtime had no Chromium executable. A bounded browser-install attempt returned truncated zero-byte archives, so native rendering, responsive layout, focus behavior, and real download behavior were not observed locally. The repository's browser-smoke workflow remains the native-browser gate after push. The pages contain no remote runtime dependencies and are designed to open from disk.
