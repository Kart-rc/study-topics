# Flow batteries: charge returned is not energy returned

Technology breakthroughs · Day17 · 15 minutes

Read a new battery result by separating charge efficiency from useful energy.

## Recall (2 minutes)

<p><a href="../Day8/technology-breakthroughs.html">Day8: Bioresorbable ingestible batteries: power the therapy, then remove the battery</a></p><p>If average load doubles while usable capacity stays fixed, what does the first-order model predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Runtime halves. Runtime in the constant-current budget is capacity divided by load.</p></details><p><a href="../Day2/technology-breakthroughs.html">Day2: Retrieve-for-Train: optimize the set, then move work offline</a></p><p>With no novelty bonus, which three documents does the model select?</p><details><summary>Recall first, then reveal the refresher</summary><p>freshness-A, freshness-B, volume. Independent relevance ranking takes .95, .92 and .84, using two slots on freshness.</p></details>

## Understand (4 minutes)

Returning almost every bucket of water does not mean returning the same useful energy if the water comes back at a lower height. A battery can return nearly all the charge but less energy.

Charge is measured here in ampere-hours (Ah). Energy in watt-hours (Wh) depends on charge and voltage. Coulombic efficiency compares charge out with charge in. Energy efficiency compares energy out with energy in.

A September 30 Nature Communications paper reports an alkaline iron-chromium flow cell using a ligand: a molecule that binds metal ions and changes their chemical behavior. The authors report 99.0% coulombic efficiency but 75.8% energy efficiency at 100 mA/cm² and 80% state of charge, with stability over 500 cycles. These efficiencies answer different questions.

1. How much charge comes back?In: 10 AhOut: 9.9 Ah9.9 / 10 = 99% of charge returned2. How much energy comes back?In: 10 Ah × 1.4 V = 14 WhReturned: 9.9 × 1.1 = 10.89 WhNot returned: 3.11 WhSynthetic teaching example—not paper measurements. The top two bars compare charge on a 10 Ah scale. The bottom bar divides 14 Wh of input energy into useful output (green) and energy not returned (amber). Lower discharge voltage means less energy per Ah, even when almost all charge comes back.

Our numbers are invented for teaching, not a reconstruction of that experiment. Put in 10 Ah at an average 1.4 V. Get back 9.9 Ah at an average 1.1 V. Charge efficiency is 99%. Energy efficiency is 10.89/14 ≈ 77.8%. The remaining 3.11 Wh is not useful output.

The paper changes metal chemistry to improve reaction behavior. It is a laboratory result, not evidence that a whole storage plant delivers the same efficiency or cost.



## Read the visual

Two separate ledgers prevent confusing charge with energy. The charge bars compare 10 Ah in with 9.9 Ah out and remain fixed as voltage changes. The energy bar partitions total input into useful output, cell input not returned, and extra auxiliary input, all on one fixed 0–18 Wh scale. Lower discharge voltage shortens useful output and enlarges the cell-loss segment. Extra auxiliary input extends the total bar without changing useful output or the cell score: system efficiency has the larger denominator. All values in this diagram are synthetic, not measurements from the paper.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** You compare emerging storage claims for long-duration supply or need to understand an efficiency headline.

**Practical example.** For a possible data-center storage study, ask whether the number describes charge, cell energy, or the whole system including pumps and power conversion. This paper is a research lead, not a deployment recommendation.

**How to decide.** Compare the same measurement boundaries. Procurement would also need system-level duty-cycle, durability, safety, serviceability, and full-cost evidence. A cell result alone is insufficient.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
charge_in_ah = 10
charge_out_ah = 9.9
voltage_in = 1.4
voltage_out = 1.1
energy_in_wh = charge_in_ah * voltage_in
energy_out_wh = charge_out_ah * voltage_out
charge_efficiency = charge_out_ah / charge_in_ah
energy_efficiency = energy_out_wh / energy_in_wh
not_returned_wh = energy_in_wh - energy_out_wh
```

1. Set invented cycle measurements, not the paper’s raw data.

   Changed values: `{"charge_in_ah": 10, "charge_out_ah": 9.9, "voltage_in": 1.4, "voltage_out": 1.1}`

2. 14 Wh enters; 10.89 Wh returns.

   Changed values: `{"energy_in_wh": 14.0, "energy_out_wh": 10.89}`

3. Compute different quantities with different denominators.

   Changed values: `{"charge_efficiency": 0.99, "energy_efficiency": 0.7778571428571429}`

4. 3.11 Wh is outside useful output.

   Changed values: `{"not_returned_wh": 3.1099999999999994}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executed Python arithmetic, not chemistry. Average voltages stand in for integrating voltage and current over time.

## Explore (remaining exploration time)

Predict which bars change when you lower discharge voltage from 1.1 to 0.7 V. Charge stays 9.9 Ah; useful energy shrinks. Then add 2 Wh of auxiliary input: does cell efficiency change, or only the system denominator?

Open technology-breakthroughs.html for the executable model.

Model limits: JavaScript executes a constant-average-voltage ledger with synthetic inputs. Auxiliary consumption is extra input energy per cycle. This is not electrochemistry, a reconstruction of the paper, or a validated plant estimate. Real voltage varies over a cycle.

## Quiz (4 minutes)

1. 10 Ah in, 9.9 Ah out: what does 99% describe?
   - Plant energy efficiency
   - Battery lifetime
   - Charge efficiency

2. Why is our energy efficiency about 77.8%?
   - Discharge voltage is lower than charge voltage
   - The paper must be wrong
   - 99% was rounded

3. Do 500 reported cell cycles prove data-center readiness?
   - Yes, automatically
   - No; system and duty-cycle evidence is still needed
   - Only if charge efficiency exceeds 95%

4. What measurement boundary must match before comparing two efficiency claims?
5. Which numbers came from the paper and which are synthetic?

<details><summary>Answer key — attempt first</summary>

1. Charge efficiency. Ah measures charge; energy also depends on voltage and measurement boundary.

2. Discharge voltage is lower than charge voltage. 10.89 Wh comes out after 14 Wh goes in.

3. No; system and duty-cycle evidence is still needed. A cell experiment does not validate a whole plant’s losses, durability, safety, or cost.

</details>

## Sources

- [Yang and colleagues: ligand engineering enables an alkaline iron-chromium redox flow battery](https://www.nature.com/articles/s41467-026-77810-8) — Published 2026-09-30; accepted 2026-09-03; early accepted manuscript; publisher abstract verified; checked 2026-10-07.
- [US Department of Energy: DOE Explains… Batteries](https://www.energy.gov/science/doe-explainsbatteries) — Foundational page; publication date not displayed in retrieved page; checked 2026-10-07.
