# A foundry metal film becomes a tiny quantum-sensor inductor

Technology breakthroughs · Day45 · 15 minutes

Understand how high kinetic inductance compresses a useful cryogenic circuit element into a commercial CMOS process.

## Recall (2 minutes)

<p><a href="../Day26/technology-breakthroughs.html">Day26: CXL memory pooling: lend capacity instead of stranding it</a></p><p>What problem does a memory pool mainly target?</p><details><summary>Recall first, then reveal the refresher</summary><p>Stranded capacity across hosts. A pool can shift capacity toward hosts that need it.</p></details><p><a href="../Day30/technology-breakthroughs.html">Day30: AEGIS separates deployability from danger in the released model</a></p><p>Why is ALARM independent of the candidate decision?</p><details><summary>Recall first, then reveal the refresher</summary><p>The released model can be at risk even when no candidate is deployable. Candidate readiness and current-release safety are different questions.</p></details>

## Understand (4 minutes)

A normal coil stores magnetic energy by winding a long conductor through space. At cryogenic temperature, the inertia of superconducting charge carriers can also resist changing current. That effect is called kinetic inductance.

The researchers used titanium nitride already present in a commercial 22-nm CMOS process. They report about 7 nH per square micrometre, compared with 200 nH per square millimetre for a conventional spiral in their figure. This enables a compact nonlinear superinductor integrated with a silicon quantum dot sensor.



A teaching target of 126 nH needs 18 μm² at 7 nH/μm². At 200 nH/mm², a conventional spiral would need 0.63 mm², or 630,000 μm²—about 35,000 times the area. The paper reports an 18 μm² sensor and power SNR 4,500 at 4 ns. These are cryogenic research results, not ordinary room-temperature logic.



## Read the visual

A logarithmic area comparison makes the unit conversion and 35,000-fold density advantage visible without pretending the two geometries are otherwise equivalent.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this research when evaluating dense cryogenic readout or sensing circuits that could benefit from foundry-integrated high impedance and nonlinearity.

**Practical example.** A semiconductor spin-qubit chip needs a radio-frequency single-electron transistor close to the quantum dot without a large bespoke off-chip inductor.

**How to decide.** Treat the article as evidence for one commercial-process prototype. Adoption needs independent evidence for operating temperature, process access, reproducibility, noise, control electronics, packaging, yield, and system-scale qubit readout.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
target_nh=126; tin_density_nh_per_um2=7
spiral_density_nh_per_mm2=200; spiral_density_nh_per_um2=spiral_density_nh_per_mm2/1_000_000
tin_area_um2=target_nh/tin_density_nh_per_um2; spiral_area_um2=target_nh/spiral_density_nh_per_um2
area_ratio=spiral_area_um2/tin_area_um2; claim='commercial-CMOS cryogenic prototype'; production_ready=False
```

1. Set the teaching target and reported TiN density.

   Changed values: `{"target_nh": 126, "tin_density_nh_per_um2": 7}`

2. Convert the spiral density to the same square-micrometre unit.

   Changed values: `{"spiral_density_nh_per_mm2": 200, "spiral_density_nh_per_um2": 0.0002}`

3. Calculate 18 μm² versus 630,000 μm² for the same teaching target.

   Changed values: `{"tin_area_um2": 18.0, "spiral_area_um2": 630000.0}`

4. Keep the area comparison and research claim separate from production readiness.

   Changed values: `{"area_ratio": 35000.0, "claim": "commercial-CMOS cryogenic prototype", "production_ready": false}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This calculator uses two reported inductance densities and linear area scaling. It does not model geometry, parasitics, frequency, nonlinearity, superconducting transition, process variation, quantum-dot physics, SNR, fabrication yield, temperature, or packaging.

## Explore (remaining exploration time)

Change the target inductance. Compare the required TiN and spiral areas on a logarithmic bar, where both remain visible despite a 35,000-fold ratio.

Open technology-breakthroughs.html for the executable model.

Model limits: This calculator uses two reported inductance densities and linear area scaling. It does not model geometry, parasitics, frequency, nonlinearity, superconducting transition, process variation, quantum-dot physics, SNR, fabrication yield, temperature, or packaging.

## Quiz (4 minutes)

1. Why can the TiN structure be much smaller in the density-only comparison?
   - Its kinetic inductance per area is far higher
   - It removes cryogenic requirements
   - It stores no energy

2. What is the area ratio from 7 nH/μm² versus 200 nH/mm²?
   - About 35,000×
   - 35×
   - 3.5×

3. What remains a research boundary?
   - System-scale yield, cryogenic operation, packaging, and reproducibility
   - The arithmetic definition of area
   - That CMOS exists

4. Which system bottleneck would justify integrating a cryogenic superinductor into the foundry stack?
5. What process, temperature, noise, and yield evidence would you need before scaling beyond the prototype?

<details><summary>Answer key — attempt first</summary>

1. Its kinetic inductance per area is far higher. Higher inductance density supplies the target value in less area.

2. About 35,000×. Convert one square millimetre to one million square micrometres before comparing.

3. System-scale yield, cryogenic operation, packaging, and reproducibility. One integrated prototype does not establish scalable product deployment.

</details>

## Sources

- [Swift et al., A nonlinear superinductor in a deep-submicrometre integrated circuit](https://www.nature.com/articles/s41928-026-01728-8) — Primary open-access Nature Electronics article; published November 4, 2026; checked 2026-11-04.
