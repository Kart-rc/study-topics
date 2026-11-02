# An analogue FFT reuses small butterflies instead of building one giant transform

Technology breakthroughs · Day43 · 15 minutes

Understand the research claim that a fast Fourier transform can be mapped onto analogue in-memory hardware at useful transform sizes.

## Recall (2 minutes)

<p><a href="../Day25/technology-breakthroughs.html">Day25: FlashAttention: keep tiles, not the whole attention matrix</a></p><p>What does FlashAttention avoid materializing in HBM?</p><details><summary>Recall first, then reveal the refresher</summary><p>The entire attention score matrix. It computes score blocks and maintains online softmax summaries.</p></details><p><a href="../Day29/technology-breakthroughs.html">Day29: Fan out light, apply weights in place, read many sums at once</a></p><p>Where are weights applied in the described optical mechanism?</p><details><summary>Recall first, then reveal the refresher</summary><p>In a spatial light modulator in the optical path. The SLM supplies high-pixel-count in-memory weighting.</p></details>

## Understand (4 minutes)

Sorting 65,536 notes by comparing every note with every other note would explode the work. A fast Fourier transform (FFT) repeatedly combines small pairs—often called butterflies—so each stage reuses earlier results.

The reported work maps that staged FFT structure to analogue in-memory computing. The authors experimentally demonstrated one- and two-dimensional signals across up to 524,000 charge-trapping memory devices in one array and transforms up to 65,536 points. This is a research hardware result, not a drop-in CPU replacement.



An 8-point teaching FFT has three stages because log2(8)=3. Each stage has four butterfly pairs, for twelve pair-combines. A direct 8×8 transform view suggests 64 multiply-accumulate relationships. The research contribution is mapping the reusable staged structure to analogue arrays instead of requiring one impractically large direct matrix.



## Read the visual

The stage graph grows by one column when point count doubles, while the direct relationship counter grows quadratically.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this research when evaluating future edge signal-processing accelerators for audio, imaging, communications, or sensor pipelines.

**Practical example.** A low-power edge sensor needs spectral features before it transmits data to the cloud.

**How to decide.** Treat the paper as evidence that analogue arrays can execute large staged transforms. Production choice still needs accuracy, calibration, endurance, programmability, conversion overhead, latency, energy, yield, and workload evidence on the target hardware.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
import math; points=8; stages=int(math.log2(points))
pairs_per_stage=points//2; butterfly_combines=pairs_per_stage*stages
direct_relationships=points*points; reduction=direct_relationships/butterfly_combines
claim_boundary='operation graph only; not analogue accuracy or energy'
```

1. Start with an eight-point radix-2 transform.

   Changed values: `{"points": 8, "stages": 3}`

2. Count four pair-combines across each of three stages.

   Changed values: `{"pairs_per_stage": 4, "butterfly_combines": 12}`

3. Compare the toy direct graph with the staged graph.

   Changed values: `{"direct_relationships": 64, "reduction": 5.333333333333333}`

4. Keep the teaching count separate from the paper's device measurements.

   Changed values: `{"claim_boundary": "operation graph only; not analogue accuracy or energy"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The visual counts a radix-2 teaching graph; it does not simulate the paper's charge-trapping devices, analogue noise, precision, calibration, data converters, array mapping, measured energy, or image/audio accuracy.

## Explore (remaining exploration time)

Change the transform size. Compare direct relationships with staged butterfly combines and inspect how stages grow only logarithmically.

Open technology-breakthroughs.html for the executable model.

Model limits: The visual counts a radix-2 teaching graph; it does not simulate the paper's charge-trapping devices, analogue noise, precision, calibration, data converters, array mapping, measured energy, or image/audio accuracy.

## Quiz (4 minutes)

1. How many stages does a radix-2 16-point FFT have?
   - 4
   - 8
   - 16

2. Why does the staged mapping matter for analogue arrays?
   - It reuses smaller butterfly operations instead of one giant direct transform matrix
   - It removes every analogue error
   - It makes all signals sparse

3. What evidence is still needed before choosing this for an edge product?
   - System-level accuracy, conversion cost, energy, endurance, and target-workload results
   - Only the paper title
   - A larger cloud warehouse

4. Which conversion or calibration cost could erase an analogue compute advantage in a real system?
5. What target workload would you benchmark before changing an edge architecture?

<details><summary>Answer key — attempt first</summary>

1. 4. The number of stages is log2(16)=4.

2. It reuses smaller butterfly operations instead of one giant direct transform matrix. The decomposition changes the hardware scaling problem; it does not erase physical limitations.

3. System-level accuracy, conversion cost, energy, endurance, and target-workload results. A device demonstration is not a complete product qualification.

</details>

## Sources

- [Xiao et al., Analogue fast Fourier transforms for scalable and efficient signal processing](https://www.nature.com/articles/s41928-026-01725-x) — Primary Nature Electronics article; published October 19, 2026; checked November 2, 2026; checked 2026-11-02.
