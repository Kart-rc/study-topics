# Three probability maps, one mask: ensemble confidence is not independent evidence

Technology breakthroughs · Day21 · 15 minutes

Understand probability averaging, its reported benefit, and the correlated-error boundary in a recent vision study.

## Recall (2 minutes)

<p><a href="../Day6/technology-breakthroughs.html">Day6: cfDNA methylation screening: the base rate still governs</a></p><p>Why can false positives rival true positives even at high specificity?</p><details><summary>Recall first, then reveal the refresher</summary><p>Screening populations can have a low base rate. A small false-positive fraction applied to a large unaffected population can be substantial.</p></details><p><a href="../Day13/technology-breakthroughs.html">Day13: Look from two directions: orbital maps at one atomic column</a></p><p>Why measure the same atomic column along two orthogonal momentum-transfer directions?</p><details><summary>Recall first, then reveal the refresher</summary><p>To expose directional differences in the electronic signal. Linear dichroism comes from comparing direction-dependent signals at the same location.</p></details>

## Understand (4 minutes)

Three weather forecasters can average their rain probabilities. That often steadies a noisy forecast—but not when all three rely on the same broken sensor.

A recent panoramic street-segmentation study averaged class probabilities across independently seeded models and multiple views. Averaging changes confidence before the final class choice.



For one pixel, three models assign “road” probabilities 0.90, 0.80, and 0.20. The mean is 0.63, so a 0.50 threshold labels road. If all three share the same blind spot and output 0.10, agreement is confidently wrong.

The paper reports 60.95% mean IoU on an 84-image public validation split and 57.08% on the hidden test leaderboard. Those are study results, not a universal production guarantee.



## Read the visual

The bar lengths are the three probabilities on one consistent 0–1 scale; the mean and threshold determine the label while the red state exposes correlated error.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Potentially useful when prediction quality justifies extra inference cost and independently trained models make meaningfully different errors.

**Practical example.** Average per-class probabilities from three segmentation seeds before producing a street-scene mask.

**How to decide.** Measure hidden-set gain, latency, memory, calibration, and error correlation. Prefer one model when ensemble cost exceeds the verified benefit.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
probabilities=[0.90,0.80,0.20]
mean_road=sum(probabilities)/len(probabilities)
threshold=0.50
label="road" if mean_road>=threshold else "not-road"
```

1. Record three seed probabilities for one pixel.

   Changed values: `{"probabilities": [0.9, 0.8, 0.2]}`

2. Average probabilities.

   Changed values: `{"mean_road": 0.6333333333333334}`

3. Apply one decision threshold.

   Changed values: `{"threshold": 0.5, "label": "road"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executed local arithmetic for one synthetic pixel. It did not run a vision model or reproduce the paper’s datasets.

## Explore (remaining exploration time)

Choose diverse or correlated model outputs and move the decision threshold. Predict the pixel label and confidence.

Open technology-breakthroughs.html for the executable model.

Model limits: This one-pixel model omits spatial structure, class imbalance, calibration, multi-scale transforms, mIoU aggregation, and the paper’s full implementation. It does not reproduce the study.

## Quiz (4 minutes)

1. Mean of 0.90, 0.80 and 0.20?
   - 0.20
   - 0.63
   - 0.90

2. All seeds share one training blind spot. What can happen?
   - Averaging guarantees correction
   - Confident correlated error
   - Zero inference cost

3. What limits the paper’s reported metrics?
   - They guarantee every deployment
   - They come from specified validation/hidden challenge data and workflow
   - mIoU is latency

4. What evidence would show your ensemble members add complementary signal?
5. Which cost metric would stop you deploying the ensemble despite accuracy gain?

<details><summary>Answer key — attempt first</summary>

1. 0.63. The ensemble averages probabilities before thresholding.

2. Confident correlated error. Diversity of seeds is not proof of independent errors.

3. They come from specified validation/hidden challenge data and workflow. Research claims transfer only with matching evidence.

</details>

## Sources

- [Vision Transformer Ensembles for Panoramic Street Segmentation](https://arxiv.org/abs/2610.06063) — Submitted 2026-10-05; checked 2026-10-11.
- [HTML paper version](https://arxiv.org/html/2610.06063v1) — Version 1 · 2026-10-05; checked 2026-10-11.
