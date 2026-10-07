# Seven clocks, one fibre network: compare time across borders

Technology breakthroughs · Day16 · 15 minutes

Understand what an international optical-clock comparison measures, what “agreement within uncertainty” means, and what the 2026 experiment did not yet prove.

## Recall (2 minutes)

<p><a href="../Day7/technology-breakthroughs.html">Day7: The arm qubit: separate memory from communication</a></p><p>What architectural job does the arm mode perform?</p><details><summary>Recall first, then reveal the refresher</summary><p>Strong interaction and readout while the data mode stores information. The design separates the storage and coupling roles into two connected modes.</p></details><p><a href="../Day1/technology-breakthroughs.html">Day1: ToolGrad: build the answer path first</a></p><p>Why construct a valid chain before its request?</p><details><summary>Recall first, then reveal the refresher</summary><p>To ground the generated request in executable operations. It reduces request/solution mismatch, while coverage still needs independent evaluation.</p></details>

## Understand (4 minutes)

Imagine four laboratories building their own ultra-precise rulers. Comparing each ruler only with itself cannot reveal whether the laboratories agree. They must compare them through a shared measurement link.

Optical clocks count extremely high-frequency atomic transitions. A 2026 experiment connected seven clocks at four national metrology institutes through Europe’s optical-fibre network for a two-month comparison campaign.


INRIM · Italyclock ratios

LNE-OP · Franceclock ratios

NPL · UKYb⁺ E3

PTB · GermanyYb⁺ E3

Stabilized fibre links carry frequency comparisons—not a normal internet timestamp.



The paper reports ratio uncertainties from 7.7 × 10⁻¹⁸ to 6.1 × 10⁻¹⁷. The independently developed NPL and PTB ytterbium-ion clocks agreed within an uncertainty of 7.7 × 10⁻¹⁸—the paper describes this as the first international verification of two independently developed optical clocks below one part in 10¹⁷.

Our toy uses synthetic normalized deviations. If clock A reads +2 units, clock B reads −1, and their comparison uncertainty is 7.7, their 3-unit difference is inside the uncertainty band.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** This is relevant to national measurement laboratories comparing independently built optical clocks and researchers assessing evidence for a future definition of the second. It requires specialized clocks and stabilized fibre links.

**Practical example.** Two laboratories report extremely precise clocks. An independent comparison asks whether they agree within the stated measurement uncertainty. In this lesson’s synthetic example, readings of +2 and −1 differ by 3 units, inside a 7.7-unit band; the published campaign performs a much richer real comparison.

**How to decide.** Treat this as research to understand and monitor. An ordinary Kafka timestamp or API-latency problem does not by itself justify an optical-clock network. Agreement within uncertainty is also not proof of perfect time.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
clock_a = 2.0
clock_b = -1.0
combined_uncertainty = 7.7
difference = abs(clock_a - clock_b)
agrees_within_uncertainty = difference <= combined_uncertainty
claim = 'agreement' if agrees_within_uncertainty else 'investigate discrepancy'
```

1. Use synthetic normalized deviations; retain the paper’s 7.7 value only as a teaching scale.

   Changed values: `{"clock_a": 2, "clock_b": -1, "combined_uncertainty": 7.7}`

2. The toy clocks differ by three units.

   Changed values: `{"difference": 3}`

3. A difference inside the declared band counts as agreement in this simple model.

   Changed values: `{"agrees_within_uncertainty": true}`

4. State only the supported comparison claim.

   Changed values: `{"claim": "agreement"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The runnable example uses synthetic normalized readings and a simple threshold. It does not reproduce the article’s frequency-ratio analysis or uncertainty propagation.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>The peer-reviewed paper was published September 1, 2026 in <em>Physical Review Research</em>. It reports seven optical clocks across INRIM, LNE-OP, NPL, and PTB, with ratio uncertainties spanning 7.7 × 10⁻¹⁸ to 6.1 × 10⁻¹⁷. Treat performance numbers as the authors’ experimental results, not a general guarantee for optical-clock networks.</p>

</details>

## Explore (remaining exploration time)

Move two synthetic clock readings and their uncertainty. Predict when the comparison changes from agreement to a discrepancy worth investigating.

Open technology-breakthroughs.html for the executable model.

Model limits: The slider is a one-dimensional uncertainty check using synthetic values. It is not the paper’s estimator, fibre-noise cancellation, systematic uncertainty budget, clock operation schedule, or ratio network. Agreement within an uncertainty interval does not prove either clock is perfectly correct, nor does one campaign redefine the SI second.

## Quiz (4 minutes)

1. In the default toy, the readings differ by 3 and uncertainty is 7.7. What is the conclusion?
   - They agree within the stated uncertainty
   - The clocks are identical
   - The SI second is redefined

2. Why link independently built clocks?
   - To test consistency across laboratories and implementations
   - To make ordinary network packets faster
   - To eliminate every systematic uncertainty

3. What must not be inferred from the study?
   - One campaign alone proves perfect clocks or completes SI redefinition
   - Fibre links can compare frequency ratios
   - The campaign involved seven clocks

4. Why is international agreement a harder claim than excellent uncertainty reported by one laboratory?
5. What additional evidence would you want before using an optical-clock network operationally?

<details><summary>Answer key — attempt first</summary>

1. They agree within the stated uncertainty. The difference is inside the toy uncertainty band; that is a bounded claim.

2. To test consistency across laboratories and implementations. Independent implementations make agreement more meaningful than one clock comparing with itself.

3. One campaign alone proves perfect clocks or completes SI redefinition. The paper provides important evidence, not the entire institutional redefinition process.

</details>

## Sources

- [Pizzocaro et al., Physical Review Research: International optical clock comparison](https://journals.aps.org/prresearch/abstract/10.1103/l4bh-ryxs) — Original research; published 2026-09-01; checked 2026-10-06.
- [NIST: Optical Clocks—The Future of Time](https://www.nist.gov/atomic-clocks/how-atomic-clocks-work/optical-clocks-future-time) — Foundation; published 2024-08-22; checked 2026-10-06.
