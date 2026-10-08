# Speculative decoding: keep the speed, correct the guesses

Technology breakthroughs · Day18 · 15 minutes

See why accepting every draft token changes a model’s output distribution.

## Recall (2 minutes)

<p><a href="../Day9/technology-breakthroughs.html">Day9: Closing the terahertz gap with an ultrathin frequency mixer</a></p><p>Two mid-infrared pumps differ by 7 THz. What output frequency does ideal difference-frequency generation target?</p><details><summary>Recall first, then reveal the refresher</summary><p>7 THz. The nonlinear mixing product includes the absolute frequency difference.</p></details><p><a href="../Day3/technology-breakthroughs.html">Day3: TimesFM-3: one zero-shot model, related time series, future covariates</a></p><p>With a baseline of about 100 and two planned days adding 40 each, what is the approximate seven-day total?</p><details><summary>Recall first, then reveal the refresher</summary><p>780. Seven baseline days contribute about 700; two planned effects add 80.</p></details>

## Understand (4 minutes)

A junior editor drafts quickly; a senior editor checks. Faster drafting helps only if the checking process preserves the senior editor’s standards. Speculative decoding uses a cheaper model to propose tokens and a target model to verify them.

This is a foundational research deep dive into the 2023 paper, not a newly announced October breakthrough. We isolate one probability correction rather than simulate a full language model. In the paper’s method, accepting or correcting draft tokens preserves the target distribution under its algorithmic assumptions.



Use a tiny vocabulary: A or B. The target wants A 60% of the time and B 40%. The draft proposes A 80% and B 20%. Accept a proposed A with probability 0.6/0.8 = 0.75; always accept a proposed B. Accepted probability mass is A: 0.6, B: 0.2. The remaining 0.2 comes from rejected A proposals and is reassigned to B by the residual distribution.

Final output is A: 0.6, B: 0.4. Accepting every guess would produce 0.8/0.2 instead. These are exact probability masses for the toy, not observed benchmark frequencies. Drafting and verification overhead can erase the speed benefit.



## Read the visual

Three aligned probability bars use the same 0–100% scale. Correction makes final output match the target even when the draft favors the opposite token.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this when studying inference acceleration and asking which optimizations preserve output probabilities.

**Practical example.** A serving team evaluating a speculative decoder should measure end-to-end latency and acceptance rates on its own target/draft pair.

**How to decide.** This lesson explains a correctness mechanism. Use an implemented, validated decoder for production; the two-token toy gives no latency or quality benchmark.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
target = {"A": 0.6, "B": 0.4}
draft = {"A": 0.8, "B": 0.2}
accepted = {k: min(target[k], draft[k]) for k in target}
rejected = round(1 - sum(accepted.values()), 10)
residual = {k: max(0, target[k] - draft[k]) for k in target}
normalizer = sum(residual.values())
output = {k: round(accepted[k] + rejected * residual[k] / normalizer, 10) for k in target}
```

1. Define the desired and proposal distributions.

   Changed values: `{"target": {"A": 0.6, "B": 0.4}, "draft": {"A": 0.8, "B": 0.2}}`

2. Accept the overlapping probability mass; 0.2 remains.

   Changed values: `{"accepted": {"A": 0.6, "B": 0.2}, "rejected": 0.2}`

3. Normalize the positive deficit. Here all rejected mass becomes B.

   Changed values: `{"residual": {"A": 0, "B": 0.2}, "normalizer": 0.2, "output": {"A": 0.6, "B": 0.4}}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executed arithmetic for a two-token vocabulary and unequal distributions. A full implementation must handle zero residual when all mass is accepted.

## Explore (remaining exploration time)

Compare draft and target bars. Switch on the correction, then make the draft underpredict A. Explain where rejected probability mass goes.

Open technology-breakthroughs.html for the executable model.

Model limits: JavaScript calculates one-step categorical probability masses exactly. It has no transformer, KV cache, parallel verification, sampling implementation or timing. Distribution preservation is not identical token-by-token output for every random seed.

## Quiz (4 minutes)

1. Draft A probability is 0.8; target A is 0.6. What is A’s acceptance probability?
   - 0.6
   - 0.75
   - 1.0

2. Where does the rejected 0.2 probability mass go in this example?
   - To B, which the draft underrepresents
   - It disappears
   - Back to A unconditionally

3. The toy matches target probabilities. Does that establish speedup?
   - Yes, always 3×
   - Yes, on every GPU
   - No; measure draft and verification overhead

4. Explain why blind acceptance would change the target distribution.
5. What end-to-end measurements would you collect before enabling this in serving?

<details><summary>Answer key — attempt first</summary>

1. 0.75. 0.6/0.8 = 0.75. Multiplying by proposal probability 0.8 gives accepted A mass 0.6.

2. To B, which the draft underrepresents. The residual favors the target’s deficit: B. Discarding mass or restoring it to A would not yield 0.6/0.4.

3. No; measure draft and verification overhead. The model proves a small probability calculation. Actual latency depends on architecture, hardware, acceptance and workload.

</details>

## Sources

- [Leviathan et al.: Fast Inference from Transformers via Speculative Decoding](https://proceedings.mlr.press/v202/leviathan23a.html) — ICML 2023; 2023-07-23–29; checked 2026-10-08.
- [Google Research: looking back at speculative decoding](https://research.google/blog/looking-back-at-speculative-decoding/) — 2024-12-06 retrospective; original preprint 2022, ICML paper 2023; checked 2026-10-08.
