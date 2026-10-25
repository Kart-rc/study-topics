# Squeeze one uncertainty to protect a cat qubit from bit flips

Technology breakthroughs · Day35 · 15 minutes

Understand the reported 160× bit-flip-time improvement, why squeezing helps, and why this is not a complete fault-tolerant computer.

## Recall (2 minutes)

<p><a href="../Day21/technology-breakthroughs.html">Day21: Three probability maps, one mask: ensemble confidence is not independent evidence</a></p><p>Mean of 0.90, 0.80 and 0.20?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.63. The ensemble averages probabilities before thresholding.</p></details><p><a href="../Day25/technology-breakthroughs.html">Day25: FlashAttention: keep tiles, not the whole attention matrix</a></p><p>What does FlashAttention avoid materializing in HBM?</p><details><summary>Recall first, then reveal the refresher</summary><p>The entire attention score matrix. It computes score blocks and maintains online softmax summaries.</p></details>

## Understand (4 minutes)

Squeezing a balloon makes it narrower in one direction and wider in another. Quantum squeezing similarly redistributes uncertainty between paired variables; it does not remove uncertainty.

A cat qubit stores logical information in separated oscillator states. The environment can effectively “measure” a noise-sensitive direction and cause errors. The paper deforms the cat state with squeezing so that environmental measurement is weaker along that direction.



The researchers report a squeezed cat qubit with a 22-second bit-flip time at a 1.3-microsecond phase-flip time and mean photon number 4.1—160× the standard cat comparison. The key claim is selective protection: much longer bit-flip time with minimal phase-flip penalty.



## Read the visual

The circle-to-ellipse change depicts the central mechanism—uncertainty is redistributed—while the separate numbers keep bit-flip and phase-flip performance from being conflated.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this research when assessing hardware-biased quantum error correction and whether physical encoding can reduce one dominant error before higher-level codes handle the rest.

**Practical example.** A quantum architecture team compares how many physical resources a multi-cat logical qubit needs when bit flips are suppressed at the device level.

**How to decide.** Treat 160× as a reported experimental comparison under stated conditions, not a universal constant. Examine phase flips, gates, fabrication, calibration, scaling, correlated errors, and full logical performance.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
standard_bit_flip_time_s = 22 / 160
squeezed_bit_flip_time_s = 22
phase_flip_time_us = 1.3
improvement = squeezed_bit_flip_time_s / standard_bit_flip_time_s
```

1. Recover the comparison baseline from the reported ratio.

   Changed values: `{"standard_bit_flip_time_s": 0.1375}`

2. Record the reported squeezed-cat bit-flip time.

   Changed values: `{"squeezed_bit_flip_time_s": 22}`

3. Keep the other error channel visible.

   Changed values: `{"phase_flip_time_us": 1.3}`

4. Confirm the reported 160-fold comparison.

   Changed values: `{"improvement": 160.0}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The ellipse and values are a qualitative teaching model except for the paper's reported 22 s, 1.3 μs, mean photon number 4.1, and 160× comparison. It does not simulate a harmonic oscillator, Wigner function, decoherence, gates, tomography, error correction thresholds, uncertainty relations, or a quantum processor.

## Explore (remaining exploration time)

Increase the synthetic squeeze factor. Watch the protected axis narrow and the teaching bit-flip time grow while the phase-flip boundary remains visible.

Open technology-breakthroughs.html for the executable model.

Model limits: The ellipse and values are a qualitative teaching model except for the paper's reported 22 s, 1.3 μs, mean photon number 4.1, and 160× comparison. It does not simulate a harmonic oscillator, Wigner function, decoherence, gates, tomography, error correction thresholds, uncertainty relations, or a quantum processor.

## Quiz (4 minutes)

1. What does squeezing do?
   - Redistributes uncertainty between conjugate directions
   - Removes all uncertainty
   - Clones a qubit

2. What did the paper report?
   - A 160× bit-flip-time improvement over a standard cat comparison
   - A complete universal computer
   - Zero phase flips

3. What remains necessary?
   - Gate, phase-flip, scaling, correlated-error, and logical-code evidence
   - Only a prettier ellipse
   - No further testing

4. Which system-level metric would you demand before choosing a squeezed-cat architecture?
5. How could a 160× physical improvement fail to produce a 160× logical improvement?

<details><summary>Answer key — attempt first</summary>

1. Redistributes uncertainty between conjugate directions. Protection in one direction comes from reshaping, not deleting, uncertainty.

2. A 160× bit-flip-time improvement over a standard cat comparison. The result is a scoped hardware experiment.

3. Gate, phase-flip, scaling, correlated-error, and logical-code evidence. One error channel is not the whole fault-tolerance problem.

</details>

## Sources

- [Rousseau et al., Enhancing bosonic qubit protection by squeezing](https://www.nature.com/articles/s41467-026-78025-7) — Nature Communications; published October 22, 2026; checked 2026-10-25.
- [Nature Communications research highlights](https://www.nature.com/ncomms/research-articles/editorials-picks) — Journal research collection; checked October 25, 2026; checked 2026-10-25.
