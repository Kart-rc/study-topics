# Bias-correct the probability, not the weather physics

Technology breakthroughs · Day31 · 15 minutes

Understand how a 2026 study recalibrates subseasonal forecast probabilities.

## Recall (2 minutes)

<p><a href="../Day19/technology-breakthroughs.html">Day19: A key only for approved code: verifiable federated learning with TEEs</a></p><p>Attestation reports X9 but policy allows P7. What should KMS do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Deny the key. The mismatch means the workload is not within the pre-authorized policy.</p></details><p><a href="../Day23/technology-breakthroughs.html">Day23: Scan the room, train in its twin, then try the real pickup</a></p><p>What human input starts the pipeline?</p><details><summary>Recall first, then reveal the refresher</summary><p>Phone scene scan and object images. The method automates demonstration generation after capture.</p></details>

## Understand (4 minutes)

A weather model says “70% chance of above-normal rain.” Across similar past cases, rain happened only 50% of the time. The forecast may rank risky weeks well but still be overconfident. Calibration learns a correction from past forecasts and observations.

A 2026 Nature paper reports machine-learning probabilistic bias correction for weeks 3–5 weather forecasts. It combines dynamical/AI forecast information with hindcasts, climatology, and recent observations. The correction changes the probability, not the underlying atmospheric simulation.



In a synthetic bin of ten historical 0.7 forecasts, rain occurred five times. A simple calibration map changes the new probability from 0.70 to 0.50. For an event that occurs, Brier loss falls from (0.70-1)^2=0.09 to (0.50-1)^2=0.25—worse for that one event. Across many cases, calibration is judged by the average, not by a single lucky outcome.



## Read the visual

The probability bins focus attention on what calibration changes: the stated confidence. They avoid implying that the browser reproduces a global weather model.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Consider probability calibration when users act on forecast likelihoods and hindcast/reforecast data shows systematic bias by variable, location, or lead time.

**Practical example.** An energy planner buys reserves from week-4 heat probabilities and needs 70% forecasts to occur roughly 70% of the time.

**How to decide.** Measure out-of-sample reliability and decision value. Do not deploy a correction merely because it improves one event or one metric; check drift, extremes, regions, lead times, and operational baselines.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
raw_probability = 0.70
historical_frequency = 0.50
calibrated_probability = historical_frequency
reliability_gap = abs(raw_probability - calibrated_probability)
```

1. Start with a model probability.

   Changed values: `{"raw_probability": 0.7}`

2. Use a synthetic observed frequency for comparable past forecasts.

   Changed values: `{"historical_frequency": 0.5}`

3. Apply a deliberately simple calibration map.

   Changed values: `{"calibrated_probability": 0.5}`

4. Measure how far the raw bin is from the empirical frequency.

   Changed values: `{"reliability_gap": 0.19999999999999996}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This is an original one-bin calibration model, not the paper’s system, code, datasets, or reported evaluation. It ignores spatial structure, multiple variables, lead times, ensembles, climatology drift, extreme-event rarity, and uncertainty in the calibration map.

## Explore (remaining exploration time)

Change the raw probability and observed historical frequency. Watch the reliability gap and Brier score rather than a decorative forecast map.

Open technology-breakthroughs.html for the executable model.

Model limits: This is an original one-bin calibration model, not the paper’s system, code, datasets, or reported evaluation. It ignores spatial structure, multiple variables, lead times, ensembles, climatology drift, extreme-event rarity, and uncertainty in the calibration map.

## Quiz (4 minutes)

1. What does probabilistic bias correction change?
   - The forecast probability mapping
   - The past weather observations
   - The laws in the dynamical model

2. Why is one event insufficient to validate calibration?
   - Reliability is a repeated-case property
   - Probabilities are always exact
   - Brier scores cannot be averaged

3. How should the paper’s reported gains be described?
   - Research claims on the evaluated datasets and setup
   - A universal operational guarantee
   - A certified weather service

4. Which operational decision needs calibrated probabilities rather than only rank ordering?
5. What temporal or regional drift would make yesterday’s calibration map unsafe?

<details><summary>Answer key — attempt first</summary>

1. The forecast probability mapping. The correction recalibrates probabilities produced from forecast information.

2. Reliability is a repeated-case property. Calibration compares forecast frequencies with outcomes over many comparable cases.

3. Research claims on the evaluated datasets and setup. Publication results do not automatically transfer to every region or decision.

</details>

## Sources

- [Advancing subseasonal forecasting with machine learning](https://www.nature.com/articles/s41586-026-11126-x) — Published October 14, 2026; checked 2026-10-21.
