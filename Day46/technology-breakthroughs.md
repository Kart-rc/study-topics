# Grow the infrared detector directly on the read-out chip

Technology breakthroughs · Day46 · 15 minutes

Understand how monolithic in-situ PbS growth removes a bonding boundary while keeping the reported research limits visible.

## Recall (2 minutes)

<p><a href="../Day32/technology-breakthroughs.html">Day32: Concentrate phosphate where the reaction happens</a></p><p>What bottleneck does interface enrichment address?</p><details><summary>Recall first, then reveal the refresher</summary><p>Dilute ions rarely reach the reaction site. Local enrichment targets mass transport in dilute water.</p></details><p><a href="../Day4/technology-breakthroughs.html">Day4: MaD-RL: optimize the output distribution, not only the best-looking sample</a></p><p>A per-sample optimizer always favors the slightly highest-reward mode. What population failure can follow?</p><details><summary>Recall first, then reveal the refresher</summary><p>Mode concentration. Maximizing individual rewards can push probability toward one mode even when the desired output population is broader.</p></details>

## Understand (4 minutes)

A conventional infrared camera can be like placing a finished tile on top of a circuit and connecting every pixel through a separate bonding step. Misalignment, cost, and interface complexity grow with the array.

The reported method grows lead sulfide detector material directly on a CMOS read-out integrated circuit using a room-temperature aqueous process. The researchers controlled Pb–OH complexation and environmental disturbance to form quasi-single-crystalline films with pixel-level uniformity.



The paper reports a 640×512 array: 327,680 pixels. Its antimony-doped photodiodes reached specific detectivity of 4.4×1011 Jones at 2.5 µm and captured infrared images. Those are paper results for a demonstrated platform, not a guarantee of manufacturing yield or field reliability.



## Read the visual

A vertical material stack shows whether the detector arrives as a separately bonded layer or grows directly on the read-out circuit, which is the central integration claim.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this research when evaluating lower-complexity integration of infrared detector material with read-out electronics, including flexible substrates.

**Practical example.** A sensor team wants a high-resolution infrared focal-plane array without separately fabricating and bonding a detector wafer onto the ROIC.

**How to decide.** Treat monolithic aqueous growth as promising research evidence. Product adoption still needs independent data on yield, pixel defects, long-term stability, packaging, toxicity controls, calibration, environmental robustness, and process compatibility.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
width=640; height=512; pixels=width*height
process='room-temperature aqueous growth on CMOS ROIC'; bonding_boundary=False
detectivity_jones=4.4e11; wavelength_um=2.5
evidence='research demonstration'; production_ready=False
```

1. Calculate the exact array size reported in the paper.

   Changed values: `{"width": 640, "height": 512, "pixels": 327680}`

2. Record the structural change without claiming that every manufacturing boundary disappears.

   Changed values: `{"process": "room-temperature aqueous growth on CMOS ROIC", "bonding_boundary": false}`

3. Keep the reported performance metric tied to its wavelength.

   Changed values: `{"detectivity_jones": 440000000000.0, "wavelength_um": 2.5}`

4. Separate the peer-reviewed result from product readiness.

   Changed values: `{"evidence": "research demonstration", "production_ready": false}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The visual is a structural comparison, not a fabrication simulator. It does not model crystal growth, transport, detectivity, noise, defects, spectral response, toxicity, encapsulation, yield, or commercial cost.

## Explore (remaining exploration time)

Switch between bonded and in-situ integration. Watch the detector/read-out boundary change, then calculate the exact pixel count for the reported array.

Open technology-breakthroughs.html for the executable model.

Model limits: The visual is a structural comparison, not a fabrication simulator. It does not model crystal growth, transport, detectivity, noise, defects, spectral response, toxicity, encapsulation, yield, or commercial cost.

## Quiz (4 minutes)

1. What integration step changes in the reported method?
   - PbS detector material is grown directly on the ROIC
   - The ROIC is removed
   - Infrared light is converted to sound

2. How many pixels are in the reported 640×512 array?
   - 327,680
   - 32,768
   - 1,152

3. What remains unproven by one paper?
   - Manufacturing yield and long-term field reliability
   - That 640×512 has pixels
   - That PbS is a material

4. Which packaging or integration boundary in your sensor roadmap dominates cost or yield?
5. What reliability, toxicity, calibration, and yield evidence would be required before a field trial?

<details><summary>Answer key — attempt first</summary>

1. PbS detector material is grown directly on the ROIC. Monolithic in-situ integration combines material growth and electronic integration on the read-out chip.

2. 327,680. Multiply the two array dimensions.

3. Manufacturing yield and long-term field reliability. A research demonstration does not establish scalable product qualification.

</details>

## Sources

- [Li et al., Monolithically and in situ integrated PbS infrared imagers](https://www.nature.com/articles/s41586-026-11222-y) — Primary Nature article; published October 28, 2026; checked November 5, 2026; checked 2026-11-05.
