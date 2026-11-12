# A cleaner dielectric lets a 2D transistor switch with less uncertainty

Technology breakthroughs · Day51 · 15 minutes

Understand a newly published 2D CFET result while separating measured devices from manufacturing readiness.

## Recall (2 minutes)

<p><a href="../Day29/technology-breakthroughs.html">Day29: Fan out light, apply weights in place, read many sums at once</a></p><p>Where are weights applied in the described optical mechanism?</p><details><summary>Recall first, then reveal the refresher</summary><p>In a spatial light modulator in the optical path. The SLM supplies high-pixel-count in-memory weighting.</p></details><p><a href="../Day33/technology-breakthroughs.html">Day33: A soft sheet reads its shape from bent light</a></p><p>Why use multiple waveguides in two layers?</p><details><summary>Recall first, then reveal the refresher</summary><p>Combined directional signals reduce shape ambiguity. Signal synergy supplies spatial and directional constraints.</p></details>

## Understand (4 minutes)

A light switch should change state at the same point every time. If dust inside the switch traps charge, the trip point wanders depending on which direction you moved it.

A Nature paper integrates transferable single-crystal anatase TiO₂ with atomically thin MoS₂ and WSe₂ channels. The cleaner high-κ interface reduces charge traps, enabling near-thermal-limit switching, very small hysteresis, and vertically stacked complementary FETs. The contribution is the dielectric/channel interface and integration method—not a claim that 2D CFETs are ready to replace production silicon.



The reported long-channel MoS₂ devices averaged 68 mV per decade, with a best device at 61 mV/dec. A 5.8 nm A-TiO₂ device showed about 1.5 mV hysteresis in the reported sweep. The toy below multiplies subthreshold swing by required current decades; it does not reproduce transistor physics.



## Read the visual

A proportional voltage bar turns mV-per-decade into an intuitive switching span while a separate evidence label prevents the metric from becoming a readiness claim.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Study this result when evaluating low-power 2D logic research, especially the gate-dielectric interface that often limits switching and stability.

**Practical example.** A device research team compares a crystalline transferred dielectric with amorphous HfO₂ for complementary 2D transistor stacks.

**How to decide.** Treat the paper as a device demonstration. Require yield, reliability, bias-temperature stability, contact resistance, process integration, contamination control, and independent replication before roadmap claims.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
reported={'best_mos2_mv_per_dec':61,'avg_mos2_mv_per_dec':68,'avg_wse2_mv_per_dec':79}
decades=6; swing=reported['best_mos2_mv_per_dec']
voltage_mv=decades*swing
result={'voltage_mv':voltage_mv,'paper_metric_reproduced':False,'manufacturing_ready':False}
```

1. Record selected values reported in the paper.

   Changed values: `{"reported": {"best_mos2_mv_per_dec": 61, "avg_mos2_mv_per_dec": 68, "avg_wse2_mv_per_dec": 79}}`

2. Choose a six-decade teaching comparison and the best reported MoS₂ swing.

   Changed values: `{"decades": 6, "swing": 61}`

3. Apply the simplified mV-per-decade relationship.

   Changed values: `{"voltage_mv": 366}`

4. Keep the calculation separate from reproduced device evidence and readiness.

   Changed values: `{"result": {"voltage_mv": 366, "paper_metric_reproduced": false, "manufacturing_ready": false}}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The calculator uses ΔV = subthreshold swing × decades as a teaching relationship. It does not simulate electrostatics, capacitance, leakage, contacts, variability, CFET interconnects, fabrication yield, temperature, lifetime, or production CMOS. Paper metrics are reported, not reproduced.

## Explore (remaining exploration time)

Choose a measured subthreshold swing and current range. Predict the approximate gate-voltage swing in the toy relationship.

Open technology-breakthroughs.html for the executable model.

Model limits: The calculator uses ΔV = subthreshold swing × decades as a teaching relationship. It does not simulate electrostatics, capacitance, leakage, contacts, variability, CFET interconnects, fabrication yield, temperature, lifetime, or production CMOS. Paper metrics are reported, not reproduced.

## Quiz (4 minutes)

1. What problem does the single-crystal A-TiO₂ interface address?
   - Charge traps and interface disorder that worsen switching and hysteresis
   - The need for a Kafka offset
   - GitHub secret propagation

2. Why compare n-type and p-type devices?
   - Complementary logic needs well-matched switching from both transistor types
   - Only p-type devices consume power
   - It eliminates fabrication

3. Why is 61 mV/dec not a production-readiness claim?
   - A device metric does not establish yield, integration, lifetime, or independent replication
   - It was not measured
   - Subthreshold swing has no physical meaning

4. Which reported device metric most strongly supports the interface claim?
5. What reliability and manufacturing evidence would you demand next?

<details><summary>Answer key — attempt first</summary>

1. Charge traps and interface disorder that worsen switching and hysteresis. The paper targets the dielectric/2D semiconductor interface.

2. Complementary logic needs well-matched switching from both transistor types. Balanced n/p behavior supports complementary inverters and CFETs.

3. A device metric does not establish yield, integration, lifetime, or independent replication. Research performance and manufacturing readiness are different evidence levels.

</details>

## Sources

- [Yang et al., Low-power 2D CFETs using single-crystal high-κ dielectrics](https://www.nature.com/articles/s41586-026-11272-2) — Nature; published online November 11, 2026; checked November 11, 2026; checked 2026-11-11.
- [Open-access article PDF](https://www.nature.com/articles/s41586-026-11272-2.pdf) — Primary paper and methods; received June 23, 2025; accepted October 7, 2026; checked 2026-11-11.
