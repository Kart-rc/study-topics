# Round where the optimizer feels the error, not where the state is stored

Technology breakthroughs · Day22 · 15 minutes

See why changing the coordinate used for stochastic rounding can reduce update error in 4-bit optimizer-state quantization.

## Recall (2 minutes)

<p><a href="../Day19/technology-breakthroughs.html">Day19: A key only for approved code: verifiable federated learning with TEEs</a></p><p>Attestation reports X9 but policy allows P7. What should KMS do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Deny the key. The mismatch means the workload is not within the pre-authorized policy.</p></details><p><a href="../Day7/technology-breakthroughs.html">Day7: The arm qubit: separate memory from communication</a></p><p>What architectural job does the arm mode perform?</p><details><summary>Recall first, then reveal the refresher</summary><p>Strong interaction and readout while the data mode stores information. The design separates the storage and coupling roles into two connected modes.</p></details>

## Understand (4 minutes)

Suppose a thermostat stores temperature, but your real concern is heating cost. Equal temperature errors do not create equal cost errors. You may want rounding probabilities to reflect the quantity the system actually uses.

A new paper studies 4-bit AdamW state. It proposes rounding in preconditioner space—closer to the optimizer update—rather than only in stored second-moment space.



A toy value v=0.01 lies between stored levels 0 and 0.04. State-space stochastic rounding chooses zero with probability 0.75. With h(v)=1/(sqrt(v)+0.01), matching the expected preconditioner chooses zero with probability about 0.045. The coordinate changes the probability dramatically.

The authors report reduced mean validation-loss gaps versus TorchAO 4-bit AdamW at every evaluated model size from 130M to 2.7B, with the largest reported reduction 70%. This is a research claim, not a production guarantee.



## Read the visual

Both cards share the same scalar and endpoints; only the coordinate of expectation changes, making the probability shift the concept rather than decoration.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Potentially useful when optimizer state memory limits training scale and 4-bit quantization error materially changes learning.

**Practical example.** Pretraining a billion-parameter transformer where AdamW state consumes scarce accelerator memory.

**How to decide.** Reproduce quality, throughput, memory, kernels, and numerical stability on your exact stack before adoption. Use mature 8/32-bit state when reliability matters more than the extra memory saving.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
import math
v,lo,hi,eps=0.01,0.0,0.04,0.01
p_zero_state=(hi-v)/(hi-lo)
h=lambda x:1/(math.sqrt(x)+eps)
p_zero_update=(h(v)-h(hi))/(h(lo)-h(hi))
```

1. Set one synthetic second-moment value and two quantization levels.

   Changed values: `{"v": 0.01, "lo": 0.0, "hi": 0.04, "eps": 0.01}`

2. Match the expected stored value.

   Changed values: `{"p_zero_state": 0.75}`

3. Match the expected nonlinear preconditioner instead.

   Changed values: `{"p_zero_update": 0.04545454545454546}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executed local Python for one scalar. It did not implement the paper, run AdamW, or train a model.

## Explore (remaining exploration time)

Move v between 0 and 0.04 and compare the zero probability under the two coordinate systems.

Open technology-breakthroughs.html for the executable model.

Model limits: The browser performs one-cell arithmetic. It omits tensor blocks, exponent selection, ZE-EDEN calibration, first moments, kernels, training dynamics, and every benchmark in the paper.

## Quiz (4 minutes)

1. At v=.01 between 0 and .04, state-space P(round to 0)?
   - .25
   - .75
   - 1.0

2. Why use preconditioner space?
   - It targets the transformed quantity used in the update
   - It guarantees all training improves
   - It removes AdamW

3. What is the strongest safe conclusion today?
   - All 4-bit training should switch
   - The reported experiments support further reproduction
   - The toy proves 70% improvement

4. Which memory bottleneck would 4-bit optimizer state relieve in your training setup?
5. What reproduction result would be a stop signal despite lower memory use?

<details><summary>Answer key — attempt first</summary>

1. .75. Linear interpolation leaves 75% weight on the lower level.

2. It targets the transformed quantity used in the update. The optimizer feels the nonlinear preconditioner, not raw v directly.

3. The reported experiments support further reproduction. A recent study plus toy arithmetic is evidence to test, not a universal result.

</details>

## Sources

- [Rounding in Preconditioner Space: Redesigning 4-bit AdamW Optimizer-State Quantization](https://arxiv.org/abs/2610.12444) — Submitted 2026-10-08; checked 2026-10-12.
- [HTML paper version](https://arxiv.org/html/2610.12444v1) — Version 1 · 2026-10-08; checked 2026-10-12.
