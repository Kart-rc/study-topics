# Two timed precursors turn insulating boron nitride into a p-type monolayer

Technology breakthroughs · Day60 · 15 minutes

Understand the reported BCN growth mechanism and separate wafer-scale material evidence from complete CMOS readiness.

## Recall (2 minutes)

<p><a href="../Day39/technology-breakthroughs.html">Day39: Short waves merge until the whole material oscillates together</a></p><p>The toy trace moves from eight domains to one. What changed?</p><details><summary>Recall first, then reveal the refresher</summary><p>Wavelength and period grew as waves merged into a global mode. Coarsening reduces wave count while increasing scale.</p></details><p><a href="../Day11/technology-breakthroughs.html">Day11: Check agreement across quantum modules: detection is not correction</a></p><p>Starting at 00, both bits flip. What does the toy detector say?</p><details><summary>Recall first, then reveal the refresher</summary><p>No alarm, despite changed information. 11 has even parity just like 00. The detector sees agreement and accepts. There is no repair operation or knowledge of the original in the detector.</p></details>

## Understand (4 minutes)

Baking bread needs yeast, flour, and water to arrive in the right proportions at the right time. Dumping one ingredient early makes patches instead of a uniform loaf.

The reported boron carbon nitride process coordinates two molecular precursors so boron, carbon, and nitrogen reach the growth surface with better spatial and temporal balance. Carbon atoms and dimers mainly substitute at nitrogen sites in a continuous, locally distorted boron-nitride lattice. The paper reports a monolayer p-type semiconductor across a 2-inch wafer.



In the teaching model, matched precursor delivery produces four uniform wafer zones. A mismatched carbon pulse produces two carbon-rich zones. The real team characterized 224 transistors from three growth batches; the toy does not reproduce those measurements.



## Read the visual

Four wafer zones sit after a two-precursor delivery gate; mismatch visibly creates carbon-rich patches instead of uniform zones.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Study this work when assessing candidate p-type 2D materials for complementary or monolithic 3D electronics research.

**Practical example.** A device-research roadmap needs a scalable p-channel material to pair with stronger n-type 2D candidates.

**How to decide.** Treat the paper as material and transistor-array evidence. Require complementary circuits, integration temperature, contacts, yield, long-term stability, variability, and manufacturing throughput before a product bet.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
zones=4; matched_delivery=True
uniform_zones=zones if matched_delivery else zones//2
reported_devices=224; growth_batches=3
result={'uniform_zones_toy':uniform_zones,'reported_devices':reported_devices,'growth_batches':growth_batches,'paper_reproduced':False}
```

1. Represent four wafer zones and coordinated precursor arrival.

   Changed values: `{"zones": 4, "matched_delivery": true}`

2. The toy maps matching to uniformity without claiming physical prediction.

   Changed values: `{"uniform_zones": 4}`

3. Record the paper's device-array evidence separately from the toy.

   Changed values: `{"reported_devices": 224, "growth_batches": 3}`

4. Keep research evidence and local illustration distinct.

   Changed values: `{"result": {"uniform_zones_toy": 4, "reported_devices": 224, "growth_batches": 3, "paper_reproduced": false}}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This is a qualitative local model. It does not simulate CVD chemistry, dehydrogenation, crystal defects, band structure, the 1.90 eV gap, mobility, current, threshold voltage, yield, or manufacturing integration.

## Explore (remaining exploration time)

Toggle precursor timing and inspect how the toy changes wafer uniformity. Then name evidence the model cannot supply.

Open technology-breakthroughs.html for the executable model.

Model limits: This is a qualitative local model. It does not simulate CVD chemistry, dehydrogenation, crystal defects, band structure, the 1.90 eV gap, mobility, current, threshold voltage, yield, or manufacturing integration.

## Quiz (4 minutes)

1. What problem did dual-precursor control address?
   - Spatial and temporal mismatch in B, C, and N delivery
   - Kafka offset loss
   - Warehouse suspension

2. What material behavior was reported?
   - Wafer-scale monolayer p-type BCN
   - A production CPU
   - A superconducting wire

3. What remains before CMOS manufacturing readiness?
   - Complementary integration, yield, contacts, stability, thermal budget, and throughput
   - Only a new color palette
   - Nothing

4. Which reported metric is most relevant to complementary logic?
5. Which integration experiment would most reduce product-readiness uncertainty?

<details><summary>Answer key — attempt first</summary>

1. Spatial and temporal mismatch in B, C, and N delivery. Coordinated surface chemistry supports a more uniform lattice.

2. Wafer-scale monolayer p-type BCN. The claim is a p-type 2D semiconductor and transistor array.

3. Complementary integration, yield, contacts, stability, thermal budget, and throughput. Wafer-scale growth is important but not a complete process qualification.

</details>

## Sources

- [Wafer-scale epitaxy growth of high-mobility p-type boron carbon nitride](https://www.nature.com/articles/s41586-026-11047-9) — Primary Nature paper; published September 30, 2026; correction October 14, 2026; checked November 20, 2026; checked 2026-11-20.
- [University of Tokyo research summary](https://www.t.u-tokyo.ac.jp/en/press/pr2026-10-01-001) — Author-institution summary; updated November 11, 2026; checked November 20, 2026; checked 2026-11-20.
