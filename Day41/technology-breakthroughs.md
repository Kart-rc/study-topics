# A nearby indirect state can slow recombination without giving up strong absorption

Technology breakthroughs · Day41 · 15 minutes

Understand the reported pseudo-direct band structure in bismuth sulfide and why it is promising rather than a finished solar-cell result.

## Recall (2 minutes)

<p><a href="../Day24/technology-breakthroughs.html">Day24: A wider optical cone prints smaller features—but narrows focus</a></p><p>In the simplified model, increasing NA does what to printable size?</p><details><summary>Recall first, then reveal the refresher</summary><p>Decreases it. Resolution scales inversely with NA.</p></details><p><a href="../Day28/technology-breakthroughs.html">Day28: Two bandgaps split the sunlight</a></p><p>Why stack different absorber bandgaps?</p><details><summary>Recall first, then reveal the refresher</summary><p>To use different parts of the solar spectrum. The two absorbers can capture photon energies more effectively than one junction.</p></details>

## Understand (4 minutes)

A busy station has a bright entrance and a quieter waiting room one level below. Light brings carriers in efficiently through the bright direct transition; many carriers spend time in the nearby indirect reservoir before recombining.

The study reports that bismuth sulfide has a lower-energy indirect transition and a strong direct transition only tens of meV above it. At room temperature, thermal exchange between the states preserves strong absorption while delaying bimolecular electron–hole recombination. For a reported splitting near 40 meV, modelling and measurements support about 75% suppression relative to the direct-only expectation.



The teaching model starts with 100 carrier pairs. A reservoir-share control moves carriers into a slower indirect state. At 75% modeled suppression, a toy interval shows 25 recombination opportunities instead of 100. This is a proportional intuition, not the paper's kinetics.



## Read the visual

The direct entrance, indirect reservoir and proportional recombination bar answer the mechanism question without pretending to reproduce the paper's band calculations.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use the result to guide research on solar absorbers, photocatalysis, and screening for materials with closely spaced direct and indirect transitions.

**Practical example.** A materials team screens candidates for strong absorption plus longer carrier lifetime for multi-electron solar-fuel reactions.

**How to decide.** Treat Bi₂S₃ as a demonstrated pseudo-direct candidate, not a certified high-efficiency device. Device transport, traps, interfaces, stability, scalable films, extraction, toxicity and full-cell efficiency still need evidence.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
pairs=100; suppression_fraction=0.75
direct_only_opportunities=pairs
pseudo_direct_opportunities=round(pairs*(1-suppression_fraction))
delayed=direct_only_opportunities-pseudo_direct_opportunities
```

1. Start a proportional teaching comparison.

   Changed values: `{"pairs": 100, "suppression_fraction": 0.75}`

2. Use 100 as the direct-only reference.

   Changed values: `{"direct_only_opportunities": 100}`

3. Apply the reported-scale suppression only as a toy proportion.

   Changed values: `{"pseudo_direct_opportunities": 25}`

4. The model displays 75 fewer immediate opportunities.

   Changed values: `{"delayed": 75}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The proportional model does not implement van Roosbroeck–Shockley theory, temperature dependence, band populations, traps, diffusion, extraction, spectra, device efficiency, or the paper's fitted kinetics. The 75% claim is scoped to the reported room-temperature analysis near ΔE≈40 meV.

## Explore (remaining exploration time)

Move the suppression control and watch strong absorption remain while the toy recombination count falls. Compare that with an indirect material that sacrifices absorption.

Open technology-breakthroughs.html for the executable model.

Model limits: The proportional model does not implement van Roosbroeck–Shockley theory, temperature dependence, band populations, traps, diffusion, extraction, spectra, device efficiency, or the paper's fitted kinetics. The 75% claim is scoped to the reported room-temperature analysis near ΔE≈40 meV.

## Quiz (4 minutes)

1. What makes the material pseudo-direct in the paper?
   - A lower indirect transition sits close to a strong direct transition
   - It has no bandgap
   - Every transition is forbidden

2. What was reported near 40 meV at room temperature?
   - About 75% suppression of bimolecular recombination relative to the direct expectation
   - 75% device efficiency
   - No absorption

3. Why is this not a finished photovoltaic claim?
   - Transport, interfaces, traps, stability and full-device efficiency remain
   - The article lacks a title
   - Bismuth sulfide cannot absorb light

4. Which experiment separates intrinsic bimolecular recombination from trap-mediated loss?
5. What device-level evidence would show that delayed recombination improves extracted solar energy?

<details><summary>Answer key — attempt first</summary>

1. A lower indirect transition sits close to a strong direct transition. Closely spaced indirect and direct states split absorption and recombination roles.

2. About 75% suppression of bimolecular recombination relative to the direct expectation. The percentage concerns modeled/measured recombination behavior, not cell efficiency.

3. Transport, interfaces, traps, stability and full-device efficiency remain. A material mechanism is not a qualified device.

</details>

## Sources

- [Righetto et al., Delayed electron–hole recombination in a pseudo-direct semiconductor](https://www.nature.com/articles/s41586-026-11223-x) — Primary Nature article; published October 28, 2026; checked 2026-10-31.
