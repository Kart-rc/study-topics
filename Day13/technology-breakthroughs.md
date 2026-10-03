# Look from two directions: orbital maps at one atomic column

Technology breakthroughs · Day13 · 15 minutes

Build intuition for electron linear dichroism by comparing two directional signals at the same atomic column.

## Recall (2 minutes)

<p><a href="../Day8/technology-breakthroughs.html">Day8: Bioresorbable ingestible batteries: power the therapy, then remove the battery</a></p><p>If average load doubles while usable capacity stays fixed, what does the first-order model predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Runtime halves. Runtime in the constant-current budget is capacity divided by load.</p></details><p><a href="../Day10/technology-breakthroughs.html">Day10: A light-based memory that remembers its setting</a></p><p>After programming level 10, what does removing programming power do in the model?</p><details><summary>Recall first, then reveal the refresher</summary><p>It keeps level 10. Nonvolatile storage retains the programmed state. Reading still needs the modeled light and detector; retention is not the same as free operation.</p></details>

## Understand (4 minutes)

Polarized sunglasses reveal that light can behave differently by direction. In a crystal, electron orbitals can also prefer one direction. That directional imbalance is electronic anisotropy.

The reported method uses an atomic-sized electron probe and electron energy-loss spectroscopy. It selects momentum transfer along two orthogonal directions. Comparing those signals produces electron linear dichroism at individual atomic columns.

Direction Hsignal 62

Same Mn columnatomic-sized probe

Direction Vsignal 38

directional difference: 62 − 38 = +24

The difference is not “an image of an orbital” by itself. Geometry, scattering calculations, calibration, and the material model connect the measured signal to orbital occupation.



In the original Nature Materials study, the researchers used strained La0.7Sr0.3MnO3 films. They report resolving Mn 3d eg orbital polarization with sub-ångström precision: compressive strain favored 3z²−r² occupation, while tensile strain favored x²−y².

dichroism = horizontal_signal - vertical_signal

Our numbers +24 and −18 only teach the sign flip. They do not reproduce the experiment. A News & Views article published on September 29 highlighted the May 12 research; the research date and the later coverage date are different.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
signals = {
    "compressed": {"H": 62, "V": 38},
    "tensile": {"H": 41, "V": 59},
}
dichroism = {sample: pair["H"] - pair["V"]
              for sample, pair in signals.items()}
sign = {sample: "positive" if value > 0 else "negative" if value < 0 else "zero"
        for sample, value in dichroism.items()}
sign_flip = sign["compressed"] != sign["tensile"]
```

1. Use two synthetic directional signals for each strained sample.

   Changed values: `{"signals": {"compressed": {"H": 62, "V": 38}, "tensile": {"H": 41, "V": 59}}}`

2. Subtract the orthogonal signals at each sample.

   Changed values: `{"dichroism": {"compressed": 24, "tensile": -18}}`

3. The toy signals have opposite signs.

   Changed values: `{"sign": {"compressed": "positive", "tensile": "negative"}}`

4. Record the visible sign flip without pretending the toy performs orbital reconstruction.

   Changed values: `{"sign_flip": true}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executes subtraction on synthetic intensities. It does not model electron scattering or reproduce the paper's data analysis.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>The paper reports two optimized signal-extraction protocols and validation against established X-ray measurements. Those steps matter because spatial resolution alone does not guarantee a trustworthy electronic-structure interpretation.</p>

</details>

## Explore (remaining exploration time)

Move the two directional signals. Predict the sign before the display updates, then explain what additional physics is needed to infer an orbital.

Open technology-breakthroughs.html for the executable model.

Model limits: A two-number subtraction, not microscopy, EELS processing, dynamical diffraction, orbital reconstruction, or the authors' extraction protocols. Signal sign alone cannot be mapped to an orbital without experimental geometry, calibration, material context, and theory.

## Quiz (4 minutes)

1. Why measure the same atomic column along two orthogonal momentum-transfer directions?
   - To expose directional differences in the electronic signal
   - To double the atom count
   - To remove the need for calibration

2. What did the May 2026 paper report for strained LSMO?
   - Compressive and tensile strain favored different Mn e_g occupations
   - All directions produced identical occupation
   - The method used only visible light

3. What can H − V = +24 prove in this lesson's toy?
   - Only that the two toy inputs differ by +24
   - The exact orbital in any material
   - That experimental noise is zero

4. Explain the sunglasses analogy, then state where it stops being accurate.
5. Which validation evidence would you demand before using an atomic-column orbital map to guide materials design?

<details><summary>Answer key — attempt first</summary>

1. To expose directional differences in the electronic signal. Linear dichroism comes from comparing direction-dependent signals at the same location.

2. Compressive and tensile strain favored different Mn e_g occupations. The reported sign and occupation preference changed with compressive versus tensile strain.

3. Only that the two toy inputs differ by +24. The arithmetic is real, but interpreting an orbital requires the full experimental and theoretical pipeline.

</details>

## Sources

- [Detecting linear dichroism with atomic resolution](https://www.nature.com/articles/s41563-026-02606-6) — Nature Materials; published 2026-05-12; checked 2026-10-03.
- [Probing orbital occupation at atomic resolution](https://www.nature.com/articles/s41563-026-02760-x) — News & Views; published 2026-09-29; checked 2026-10-03.
- [Original research preprint](https://arxiv.org/abs/2511.18796) — Submitted 2025-11-24; journal version 2026-05-12; checked 2026-10-03.
