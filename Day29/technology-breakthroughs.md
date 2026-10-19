# Fan out light, apply weights in place, read many sums at once

Technology breakthroughs · Day29 · 15 minutes

Understand the FAST-ONN research mechanism without treating a lab benchmark as a shipped processor.

## Recall (2 minutes)

<p><a href="../Day18/technology-breakthroughs.html">Day18: Speculative decoding: keep the speed, correct the guesses</a></p><p>Draft A probability is 0.8; target A is 0.6. What is A’s acceptance probability?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.75. 0.6/0.8 = 0.75. Multiplying by proposal probability 0.8 gives accepted A mass 0.6.</p></details><p><a href="../Day22/technology-breakthroughs.html">Day22: Round where the optimizer feels the error, not where the state is stored</a></p><p>At v=.01 between 0 and .04, state-space P(round to 0)?</p><details><summary>Recall first, then reveal the refresher</summary><p>.75. Linear interpolation leaves 75% weight on the lower level.</p></details>

## Understand (4 minutes)

Imagine projecting one stencil onto many tiles at once instead of carrying each tile to one calculator. FAST-ONN fans out light from a dense laser array. A spatial light modulator stores many weights in the optical path. Detectors read many weighted sums in parallel.

“In-memory” here means weights are applied where the optical signal travels, reducing repeated movement between a separate weight store and arithmetic unit. Differential readout represents signed weights with paired positive and negative channels.



A tiny teaching kernel has four inputs [1,0,1,1] and weights [+1,-1,+1,0]. The optical paths contribute [1,0,1,0]; the detector sum is 2. The paper reports a 5×5 VCSEL array and 3×3 parallel kernels at 100 mega-subimages/s, corresponding to 0.9 billion convolutions/s in its experiment.



## Read the visual

The light paths show parallel multiplication before one detector sum. The changing contribution vector ties the familiar dot product to the optical layout without pretending the browser models the device physics.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this concept when evaluating research hardware for extremely high-throughput, low-latency convolution near sensors.

**Practical example.** An edge vision system must extract simple features from a very fast optical stream before sending a smaller representation onward.

**How to decide.** Ask whether the demonstrated workload, accuracy, reprogramming, calibration, precision, size, power accounting, and system I/O match the intended product. Treat the published device as research evidence, not a drop-in GPU replacement.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
inputs=[1,0,1,1]
weights=[1,-1,1,0]
contributions=[x*w for x,w in zip(inputs,weights)]
detector_sum=sum(contributions)
claim_scope='teaching dot product, not optical hardware'
```

1. Create one tiny binary input and signed optical weight vector.

   Changed values: `{"inputs": [1, 0, 1, 1], "weights": [1, -1, 1, 0]}`

2. Each fan-out path applies its local weight in parallel conceptually.

   Changed values: `{"contributions": [1, 0, 1, 0]}`

3. The detector combines the weighted contributions.

   Changed values: `{"detector_sum": 2}`

4. Keep the model boundary explicit.

   Changed values: `{"claim_scope": "teaching dot product, not optical hardware"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This exact integer dot product is a teaching model, not a simulation of diffraction, VCSEL noise, signed differential circuits, calibration, nonlinear layers, training, energy, or throughput. The paper’s 2026 benchmark is a specific experimental system and does not establish general production superiority.

## Explore (remaining exploration time)

Change one input bit. The parallel path contributions and detector sum update together.

Open technology-breakthroughs.html for the executable model.

Model limits: This exact integer dot product is a teaching model, not a simulation of diffraction, VCSEL noise, signed differential circuits, calibration, nonlinear layers, training, energy, or throughput. The paper’s 2026 benchmark is a specific experimental system and does not establish general production superiority.

## Quiz (4 minutes)

1. Where are weights applied in the described optical mechanism?
   - In a spatial light modulator in the optical path
   - Only after cloud upload
   - In the quiz browser

2. Why use differential readout?
   - To represent signed weights
   - To double every answer
   - To remove calibration

3. What does the reported 100 MFPS benchmark prove?
   - Performance of the reported experiment under its setup
   - Universal production readiness
   - That every neural network runs faster

4. Which system-level measurement would you require before comparing FAST-ONN with a GPU at the edge?
5. Which part of a full neural network pipeline is not represented by this convolution-only visual?

<details><summary>Answer key — attempt first</summary>

1. In a spatial light modulator in the optical path. The SLM supplies high-pixel-count in-memory weighting.

2. To represent signed weights. Paired channels let the optical system express positive and negative contributions.

3. Performance of the reported experiment under its setup. A lab benchmark is bounded by the demonstrated architecture, workload, and measurements.

</details>

## Sources

- [Liang et al., High-clockrate free-space optical in-memory computing](https://www.nature.com/articles/s41377-026-02206-8) — Published February 13, 2026; checked 2026-10-19.
- [Open-access paper PDF](https://www.nature.com/articles/s41377-026-02206-8.pdf) — Version of record, February 13, 2026; checked 2026-10-19.
