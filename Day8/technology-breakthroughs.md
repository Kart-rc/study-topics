# Bioresorbable ingestible batteries: power the therapy, then remove the battery

Technology breakthroughs · Day8 · 15 minutes

A swallowed electronic device needs power while it works, then a safe end of life.

## Recall (2 minutes)

<p><a href="../Day1/technology-breakthroughs.html">Day1: ToolGrad: build the answer path first</a></p><p>Why construct a valid chain before its request?</p><details><summary>Recall first, then reveal the refresher</summary><p>To ground the generated request in executable operations. It reduces request/solution mismatch, while coverage still needs independent evaluation.</p></details><p><a href="../Day5/technology-breakthroughs.html">Day5: Repeat-After-Me: visual injection reaches the tool boundary</a></p><p>Why is producing a parseable native tool call an important attack milestone?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness can convert model text into an executable action. Exact format compliance can bridge model influence into a tool invocation; authorization is still separate.</p></details>

## Understand (4 minutes)

A swallowed electronic device needs power while it works, then a safe end of life. The battery’s lifecycle matters as much as its initial output.

The research in this lesson studies a battery designed to operate and later resorb. Reported laboratory and animal demonstrations are evidence at those stages, not evidence of a ready human treatment. For engineering, start with load, usable capacity, and voltage under load.



With a synthetic 100-microamp load, 3.5 mAh nominal capacity, and 80% usable capacity, the estimate is 28 hours. Doubling the load to 200 microamps halves that estimate to 14 hours under the same assumptions.



## Read the visual

A charge-versus-time line begins at the usable fraction of nominal capacity and drains at the chosen constant current. The capacity margin is excluded before discharge begins. The crossing at zero is an idealized runtime, while resorption and clinical safety belong to separate evidence questions.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
capacity_mah = 3.5; usable_fraction = 0.8
usable_mah = round(capacity_mah * usable_fraction, 3)
load_ma = 0.1
runtime_hours = round(usable_mah / load_ma, 2)
double_load_hours = round(usable_mah / (2 * load_ma), 2)
```

1. Capacity and a synthetic allowance define usable charge.

   Changed values: `{"capacity_mah": 3.5, "usable_fraction": 0.8}`

2. The budget has 2.8 mAh available.

   Changed values: `{"usable_mah": 2.8}`

3. 100 microamps equals 0.1 milliamps.

   Changed values: `{"load_ma": 0.1}`

4. The first-order estimate is 28 hours.

   Changed values: `{"runtime_hours": 28.0}`

5. Twice the load gives 14 hours in this ideal estimate.

   Changed values: `{"double_load_hours": 14.0}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This is a charge budget, not an in-vivo runtime claim or medical guidance. Voltage cutoff, environment, pulses, losses, packaging, and safety affect real operation.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Ingestible electronics usually face an awkward lifecycle: a device needs enough energy to sense, communicate, or stimulate tissue, but persistent batteries add retrieval, obstruction, toxicity, and electronic-waste concerns. The reported platform uses a magnesium–molybdenum trioxide paper battery with a bio-ionic-liquid electrolyte so the power source can operate in the gastrointestinal environment and later resorb.</p><p>The peer-reviewed paper reports a peak open-circuit voltage of 1.84 V. Its large-area design reached 3.5 mAh at a stated current density and maintained about 1.6 V for a day under continuous discharge in the reported test. The team integrated the battery into RFID medication-tracking and gastric electrical-stimulation capsules and demonstrated operation in swine.</p><p>This is a platform result, not a human treatment. The gastric-stimulation study reported four independent animals for the ghrelin measurement and two for tissue histology. Translation still depends on dose, retention time, degradation products, manufacturing consistency, complete system materials, human anatomy, safety, and clinical benefit.</p><h3>Original detailed example</h3><p><strong>Worked example:</strong> Treat 3.5 mAh as a nominal capacity and assume an electronics load of 100 μA with 80% usable capacity after conversion and margins. A first-order runtime estimate is:</p><pre>runtime = 3.5 mAh × 0.80 ÷ 0.10 mA = 28 hours</pre><p>This is an engineering budget, not a reproduction of the paper's in-vivo runtime. Capacity depends on current density and environment; pulsed stimulation, voltage thresholds, self-discharge, packaging, and converter efficiency make a real load profile more complicated. Open-circuit voltage is not the voltage delivered under load.</p>

</details>

## Explore (remaining exploration time)

Vary nominal capacity, average current, and usable fraction. Predict runtime before moving the controls. Then explain why a 1.84 V open-circuit measurement and a swine demonstration do not establish a human therapy.

Open technology-breakthroughs.html for the executable model.

Model limits: A constant-current energy-budget calculator using one reported capacity point as a default. It ignores current-density dependence, voltage curve, pulse load, internal resistance, conversion losses beyond the chosen margin, temperature, gastric chemistry, packaging, manufacturing variation, degradation kinetics, and biological outcomes. It is not a medical-device design, safety assessment, or clinical prediction.

## Quiz (4 minutes)

1. If average load doubles while usable capacity stays fixed, what does the first-order model predict?
   - Runtime doubles
   - Runtime halves
   - Open-circuit voltage doubles

2. Why is 1.84 V not enough to size the electronics?
   - It is a peak open-circuit value; delivered voltage and capacity depend on load and time
   - Voltage is irrelevant to electronics
   - All batteries deliver exactly their open-circuit voltage under load

3. What is the strongest justified claim from the reported evidence?
   - The system is proven safe and effective in humans
   - A bioresorbable battery powered two ingestible prototype applications demonstrated in swine
   - Every component of any ingestible device will dissolve harmlessly

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Runtime halves. Runtime in the constant-current budget is capacity divided by load.

2. It is a peak open-circuit value; delivered voltage and capacity depend on load and time. A useful power budget needs the discharge curve, load behavior, thresholds, and conversion losses.

3. A bioresorbable battery powered two ingestible prototype applications demonstrated in swine. The paper demonstrates an animal-stage platform; it does not establish human clinical benefit or universal system resorption.

</details>

## Sources

- [Nature Chemical Engineering: Bioresorbable batteries for transient ingestible bioelectronics](https://www.nature.com/articles/s44286-026-00443-7) — Published 2026-09-21; received 2025-11-23; accepted 2026-08-12; checked 2026-09-28.
- [Nature News: Edible batteries power medical devices in the body](https://www.nature.com/articles/d41586-026-02987-3) — Published 2026-09-21; checked 2026-09-28.
