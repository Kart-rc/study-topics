# Light energy and measurement information can flow in different directions

Technology breakthroughs · Day57 · 15 minutes

Read a new optical-metrology framework as information-flow engineering without confusing a Fisher-information model with a finished sensor.

## Recall (2 minutes)

<p><a href="../Day32/technology-breakthroughs.html">Day32: Concentrate phosphate where the reaction happens</a></p><p>What bottleneck does interface enrichment address?</p><details><summary>Recall first, then reveal the refresher</summary><p>Dilute ions rarely reach the reaction site. Local enrichment targets mass transport in dilute water.</p></details><p><a href="../Day36/technology-breakthroughs.html">Day36: A metal-free magnet can monitor an organ, then resorb</a></p><p>What makes the reported device unusual?</p><details><summary>Recall first, then reveal the refresher</summary><p>A metal-free, bioresorbable magnet supports untethered sensing. The material combines magnetic function with planned disappearance.</p></details>

## Understand (4 minutes)

A flashlight can make a wall bright while still hiding the tiny scratch you want to measure. Brightness and useful measurement information are not the same map.

A Nature Materials paper published November 16, 2026 treats Fisher information (FI) carried by optical sensitivity fields as a locally conserved wave quantity. The authors show that FI flow can resonate, diffract, interfere, and form vortices, and it need not follow optical energy flow. This separates three design questions: where information about a parameter is generated, how it travels, and how a detector captures it.



For lateral displacement of a gold nanowire, the paper models opposing-phase information sources at the two edges. Normal illumination can make their sensitivity fields cancel along the centerline. At an oblique angle, the added phase can align them and direct more information toward a detector—even though this is not simply “more light.”



## Read the visual

Two phase-controlled sensitivity arrows produce different central information bars while an equal energy proxy stays fixed, exposing the paper’s core distinction.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Study FI-flow design when an optical measurement is limited by where sensitivity is generated or captured, not merely by total illumination power.

**Practical example.** A nanometrology team chooses illumination angle and detector placement for measuring a wire’s lateral displacement.

**How to decide.** Treat the work as a theoretical and numerical design framework supported by the paper’s case studies. Reproduce the target geometry, noise model, detector efficiency, readout noise, calibration, fabrication tolerance, and estimator behavior before claiming a precision gain in a real instrument.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
left=1; right_opposed=-1
energy_proxy=left*left+right_opposed*right_opposed
normal_information=(left+right_opposed)**2; right_aligned=1; aligned_information=(left+right_aligned)**2
result={'energy_proxy':energy_proxy,'normal_information_proxy':normal_information,'aligned_information_proxy':aligned_information,'paper_solver':False}
```

1. Represent two opposing sensitivity contributions at one detector direction.

   Changed values: `{"left": 1, "right_opposed": -1}`

2. Keep the simple energy proxy positive.

   Changed values: `{"energy_proxy": 2}`

3. Compare destructive and constructive sensitivity interference.

   Changed values: `{"normal_information": 0, "right_aligned": 1, "aligned_information": 4}`

4. Separate the intuition from a real FI-flow calculation.

   Changed values: `{"result": {"energy_proxy": 2, "normal_information_proxy": 0, "aligned_information_proxy": 4, "paper_solver": false}}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The local world is a two-number interference analogy. It does not solve Maxwell’s equations, compute Fisher-information flux, reproduce the paper’s nanowire geometry, model polarization, wavelength, detector area, shot noise, readout noise, Cramér–Rao efficiency, fabrication, or experimental validation.

## Explore (remaining exploration time)

Switch two toy sensitivity sources between opposing and aligned phase. Compare the energy proxy with the central information proxy.

Open technology-breakthroughs.html for the executable model.

Model limits: The local world is a two-number interference analogy. It does not solve Maxwell’s equations, compute Fisher-information flux, reproduce the paper’s nanowire geometry, model polarization, wavelength, detector area, shot noise, readout noise, Cramér–Rao efficiency, fabrication, or experimental validation.

## Quiz (4 minutes)

1. Why can a bright detector location still be poor for estimating displacement?
   - Energy flow and parameter-sensitive FI flow can have different patterns
   - Fisher information is always zero
   - Detectors cannot measure light

2. What can illumination angle change in the nanowire example?
   - Relative phase of spatial information sources and FI directed toward the detector
   - The definition of authorization
   - Whether the paper is experimental production hardware

3. What is required before a product claim?
   - Geometry-specific simulation or experiment with detector and noise constraints
   - Only the toy value 4
   - Only total optical power

4. Which sensing problem is limited by parameter sensitivity rather than raw signal power?
5. Which detector, noise, or fabrication constraint could erase a simulated FI improvement?

<details><summary>Answer key — attempt first</summary>

1. Energy flow and parameter-sensitive FI flow can have different patterns. Useful sensitivity depends on how fields change with the measured parameter.

2. Relative phase of spatial information sources and FI directed toward the detector. Phase control changes information interference.

3. Geometry-specific simulation or experiment with detector and noise constraints. The paper’s framework and cases do not certify every instrument design.

</details>

## Sources

- [Controlling the flow of information in optical metrology](https://www.nature.com/articles/s41563-026-02789-y) — Primary open-access Nature Materials paper; published November 16, 2026; checked November 17, 2026; checked 2026-11-17.
- [Continuity equation for the flow of Fisher information in wave scattering](https://www.nature.com/articles/s41567-024-02519-8) — Primary Nature Physics foundation paper; published June 10, 2024; checked November 17, 2026; checked 2026-11-17.
