# MaD-RL: optimize the output distribution, not only the best-looking sample

Technology breakthroughs · Day4 · 15 minutes

A generated dataset contains excellent examples of one solution style but too few of the other styles you need..

## Recall (2 minutes)

<p><a href="../Day1/technology-breakthroughs.html">Day1: ToolGrad: build the answer path first</a></p><p>Why construct a valid chain before its request?</p><details><summary>Recall first, then reveal the refresher</summary><p>To ground the generated request in executable operations. It reduces request/solution mismatch, while coverage still needs independent evaluation.</p></details><p><a href="../Day3/technology-breakthroughs.html">Day3: TimesFM-3: one zero-shot model, related time series, future covariates</a></p><p>With a baseline of about 100 and two planned days adding 40 each, what is the approximate seven-day total?</p><details><summary>Recall first, then reveal the refresher</summary><p>780. Seven baseline days contribute about 700; two planned effects add 80.</p></details>

## Understand (4 minutes)

A generated dataset contains excellent examples of one solution style but too few of the other styles you need.

MaD-RL studies rewards for matching a desired mix of outputs. A high score for each individual answer does not guarantee the whole collection has the right balance. First define categories reliably, then compare the observed mix with the target.



The target is 50% straightforward, 30% memory-efficient, and 20% parallel solutions. The observed mix is 85/10/5. Our calculation measures the gap; replacing the mix with the target demonstrates the objective, not how learning achieves it.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
target = [0.50, 0.30, 0.20]
observed = [0.85, 0.10, 0.05]
gap = sum(abs(a - b) for a, b in zip(observed, target))
matched = target.copy()
matched_gap = sum(abs(a - b) for a, b in zip(matched, target))
```

1. The product needs three categories in this mix.

   Changed values: `{"target": [0.5, 0.3, 0.2]}`

2. The initial collection overuses the first category.

   Changed values: `{"observed": [0.85, 0.1, 0.05]}`

3. The L1 gap is 0.70.

   Changed values: `{"gap": 0.7}`

4. Use an ideal matched mix for comparison.

   Changed values: `{"matched": [0.5, 0.3, 0.2]}`

5. The ideal gap is zero, without proving a training method.

   Changed values: `{"matched_gap": 0.0}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This computes an objective only. It does not execute MaD-RL, model temperature, or reproduce research performance. Wrong category labels can make a matched distribution misleading.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Many post-training recipes reward each generated answer independently. If one answer mode scores slightly higher, optimization can concentrate probability there. That is useful when the objective is “return the single best answer,” but wrong when the product needs a controlled population: balanced synthetic data, policy exploration, or a fairness-related mixture.</p><p>Meta's MaD-RL paper, published September 24, 2026, proposes reinforcement-learning rewards that match the distribution of a latent categorical attribute to a chosen target. The authors report that GRPO can reduce output diversity by concentrating on one mode, and they formulate distribution-matching rewards using divergences including L2, KL, and Jensen–Shannon. Their experiments cover mathematical reasoning and programming.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A code-synthesis pipeline wants 50% straightforward solutions, 30% memory-efficient solutions, and 20% highly parallel solutions. A sample-level reward optimizer prefers straightforward answers and produces an 85/10/5 mix. Its expected reward is high, but the dataset misses the desired coverage.</p><p>The slider interpolates toward the target distribution. As matching intensity rises, L1 distance to the target falls while expected scalar reward declines. That is not a defect; it makes the multi-objective trade explicit.</p><p>Turning up sampling temperature is not equivalent. Temperature spreads token probabilities and tends toward a generic high-entropy distribution. It does not directly say “make 20% of completed programs belong to this semantic mode.” Distribution matching needs an attribute measurement, a target, and a reward tied to the aggregate distribution.</p><pre>sample reward objective: maximize E[r(output)]
distribution objective: minimize D(p(attribute), target)
combined system: choose the tradeoff deliberately</pre><p>For a platform pilot, first validate the attribute classifier and measure mode coverage on held-out prompts. A mislabeled latent category can produce a beautifully matched wrong distribution.</p>

</details>

## Explore (remaining exploration time)

Begin at zero matching intensity and predict which mode dominates. Move to 100%. Compare expected reward, distance to target, and entropy. Explain why the target should come from a product or data requirement rather than a desire for diversity by itself.

Open technology-breakthroughs.html for the executable model.

Model limits: A linear interpolation between two hand-authored distributions with fixed per-mode rewards. It does not implement RL, GRPO, KL/JS reward derivations, token generation, latent-attribute classification, or any MaD-RL experiment. L1 distance and entropy are teaching metrics, not the paper's reported results.

## Quiz (4 minutes)

1. A per-sample optimizer always favors the slightly highest-reward mode. What population failure can follow?
   - Mode concentration
   - Guaranteed calibration
   - Perfect fairness

2. Why is higher sampling temperature not the same as matching a 50/30/20 semantic target?
   - Temperature operates on token probabilities and does not directly enforce the latent output-category mix
   - Temperature always lowers entropy
   - It requires no model

3. What must be validated before trusting a matched output distribution?
   - Only average reward
   - The attribute classifier and target definition, plus held-out behavior
   - The color of the chart

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Mode concentration. Maximizing individual rewards can push probability toward one mode even when the desired output population is broader.

2. Temperature operates on token probabilities and does not directly enforce the latent output-category mix. Generic token-level spreading is not a direct constraint on aggregate semantic categories.

3. The attribute classifier and target definition, plus held-out behavior. Matching measured categories is useful only when the measurement and desired distribution are valid.

</details>

## Sources

- [Meta AI Research: MaD-RL—Matching Distributions for Calibrating LLMs with Reinforcement Learning](https://ai.meta.com/research/publications/mad-rl-matching-distributions-for-calibrating-llms-with-reinforcement-learning/) — Published 2026-09-24; research claims from authors; checked 2026-09-24.
