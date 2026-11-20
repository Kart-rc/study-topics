# Pair a 2D n-transistor with a 1D p-transistor to build complementary logic

Technology breakthroughs · Day59 · 15 minutes

Understand what mixed-dimensional CMOS demonstrated and keep device results separate from manufacturing readiness.

## Recall (2 minutes)

<p><a href="../Day33/technology-breakthroughs.html">Day33: A soft sheet reads its shape from bent light</a></p><p>Why use multiple waveguides in two layers?</p><details><summary>Recall first, then reveal the refresher</summary><p>Combined directional signals reduce shape ambiguity. Signal synergy supplies spatial and directional constraints.</p></details><p><a href="../Day37/technology-breakthroughs.html">Day37: A helical molecule can turn current into one-way rotation</a></p><p>Voltage polarity reverses while magnitude stays above threshold. Toy prediction?</p><details><summary>Recall first, then reveal the refresher</summary><p>Rotation direction reverses and the enhanced state remains available. The reported direction follows polarity; the toy threshold uses magnitude.</p></details>

## Understand (4 minutes)

A two-person saw works because one person pulls each direction. Complementary logic similarly pairs an n-type path that pulls output low with a p-type path that pulls output high.

A Nature Electronics paper combines two-dimensional single-crystal MoS₂ n-type transistors with one-dimensional aligned carbon-nanotube p-type transistors. The reported inverters show rail-to-rail operation, peak static power below 1 pW, and 19 ps single-stage delay. The team also reports logic gates, a 4-bit adder, and SRAM-like cells. These are device and circuit demonstrations, not a production process.



For an inverter, input 0 turns the p-side path on and output rises to 1. Input 1 turns the n-side path on and output falls to 0. The material pairing supplies opposite carrier types in one complementary circuit.



## Read the visual

The inverter shows two opposing material paths around one output; only one path is active for each binary input.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Study this work when evaluating post-silicon complementary device integration and ultra-low-power logic research.

**Practical example.** A research roadmap compares low-dimensional transistor stacks for edge logic or dense experimental memory.

**How to decide.** Use the paper as evidence for integrated circuit function. Before product comparison, require yield, variability, contacts, endurance, thermal behavior, interconnect, area, fabrication throughput, and standardized workload data.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
inputs=[0,1]
outputs=[1-i for i in inputs]
active_paths=['CNT-p pull-up','MoS2-n pull-down']
result={'truth_table':list(zip(inputs,outputs)),'paths':active_paths,'paper_reproduction':False}
```

1. Evaluate both ideal inverter inputs.

   Changed values: `{"inputs": [0, 1]}`

2. Apply complementary inversion.

   Changed values: `{"outputs": [1, 0]}`

3. Name the active material path for each input.

   Changed values: `{"active_paths": ["CNT-p pull-up", "MoS2-n pull-down"]}`

4. Keep the Boolean model separate from reported device measurements.

   Changed values: `{"result": {"truth_table": [[0, 1], [1, 0]], "paths": ["CNT-p pull-up", "MoS2-n pull-down"], "paper_reproduction": false}}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The model is an ideal Boolean inverter. It does not reproduce device physics, voltage transfer curves, the reported 19 ps measurement, static power, SRAM margins, variability, fabrication, or scaling.

## Explore (remaining exploration time)

Toggle the inverter input and watch the active pull-up or pull-down path. Then identify what the binary toy omits.

Open technology-breakthroughs.html for the executable model.

Model limits: The model is an ideal Boolean inverter. It does not reproduce device physics, voltage transfer curves, the reported 19 ps measurement, static power, SRAM margins, variability, fabrication, or scaling.

## Quiz (4 minutes)

1. Which pairing is reported?
   - 2D MoS₂ n-type plus aligned 1D CNT p-type
   - Two identical resistors
   - Silicon only

2. Input is 1 in the ideal inverter. Which path pulls output low?
   - The n-type MoS₂ path
   - The p-type CNT path
   - Neither

3. What blocks a manufacturing-readiness claim?
   - Yield, variability, contacts, interconnect, endurance, and process scale remain to be established
   - The paper includes a 4-bit adder
   - The output is rail-to-rail

4. Which reported metric matters most for a target edge workload?
5. Which manufacturing evidence would you request before a platform bet?

<details><summary>Answer key — attempt first</summary>

1. 2D MoS₂ n-type plus aligned 1D CNT p-type. Opposite carrier types form the complementary pair.

2. The n-type MoS₂ path. The n-side conducts for high input.

3. Yield, variability, contacts, interconnect, endurance, and process scale remain to be established. A lab circuit is not a qualified fabrication platform.

</details>

## Sources

- [Mixed-dimensional CMOS technology for high-performance integrated circuits](https://www.nature.com/articles/s41928-026-01737-7) — Primary Nature Electronics paper; published November 16, 2026; checked November 19, 2026; checked 2026-11-19.
