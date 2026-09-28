# Bioresorbable ingestible batteries: power the therapy, then remove the battery

Technology breakthroughs · Day8 · 15 minutes

Understand the power-versus-disappearance design and separate demonstrated swine prototypes from human therapeutic claims.

## Recall (2 minutes)

<p><a href="../Day1/technology-breakthroughs.html">Day1: ToolGrad: build the answer path first</a></p><p>Why construct a valid chain before its request?</p><details><summary>Recall first, then reveal the refresher</summary><p>To ground the generated request in executable operations. It reduces request/solution mismatch, while coverage still needs independent evaluation.</p></details><p><a href="../Day5/technology-breakthroughs.html">Day5: Repeat-After-Me: visual injection reaches the tool boundary</a></p><p>Why is producing a parseable native tool call an important attack milestone?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness can convert model text into an executable action. Exact format compliance can bridge model influence into a tool invocation; authorization is still separate.</p></details>

## Understand (4 minutes)

Ingestible electronics usually face an awkward lifecycle: a device needs enough energy to sense, communicate, or stimulate tissue, but persistent batteries add retrieval, obstruction, toxicity, and electronic-waste concerns. The reported platform uses a magnesium–molybdenum trioxide paper battery with a bio-ionic-liquid electrolyte so the power source can operate in the gastrointestinal environment and later resorb.

The peer-reviewed paper reports a peak open-circuit voltage of 1.84 V. Its large-area design reached 3.5 mAh at a stated current density and maintained about 1.6 V for a day under continuous discharge in the reported test. The team integrated the battery into RFID medication-tracking and gastric electrical-stimulation capsules and demonstrated operation in swine.

This is a platform result, not a human treatment. The gastric-stimulation study reported four independent animals for the ghrelin measurement and two for tissue histology. Translation still depends on dose, retention time, degradation products, manufacturing consistency, complete system materials, human anatomy, safety, and clinical benefit.



Worked example: Treat 3.5 mAh as a nominal capacity and assume an electronics load of 100 μA with 80% usable capacity after conversion and margins. A first-order runtime estimate is:

runtime = 3.5 mAh × 0.80 ÷ 0.10 mA = 28 hours

This is an engineering budget, not a reproduction of the paper's in-vivo runtime. Capacity depends on current density and environment; pulsed stimulation, voltage thresholds, self-discharge, packaging, and converter efficiency make a real load profile more complicated. Open-circuit voltage is not the voltage delivered under load.



## Explore (5 minutes)

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
