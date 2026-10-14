# A wider optical cone prints smaller features—but narrows focus

Technology breakthroughs · Day24 · 15 minutes

Use the Rayleigh relationships to understand the promise and trade-off of Hyper-NA EUV research.

## Recall (2 minutes)

<p><a href="../Day8/technology-breakthroughs.html">Day8: Bioresorbable ingestible batteries: power the therapy, then remove the battery</a></p><p>If average load doubles while usable capacity stays fixed, what does the first-order model predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Runtime halves. Runtime in the constant-current budget is capacity divided by load.</p></details><p><a href="../Day15/technology-breakthroughs.html">Day15: A tiny claw on a fibre: light-driven 3D micromanipulation</a></p><p>What is the device&#x27;s basic mechanism?</p><details><summary>Recall first, then reveal the refresher</summary><p>Light-driven material response moves rigid microclaws. The reported device couples optical delivery, photothermal actuation, soft muscle, and rigid claws.</p></details>

## Understand (4 minutes)

A camera with a wider lens opening gathers light from steeper angles and can reveal finer detail, but the region that stays sharply focused becomes thinner. EUV lithography has the same qualitative trade-off.

In the simplified Rayleigh relationships, printable size scales like k₁λ/NA, while depth of focus scales roughly like λ/NA². Raising numerical aperture improves resolution, but focus control becomes less forgiving.



Holding wavelength at 13.5 nm and using a teaching value k₁=0.28, NA 0.33 gives about 11.45 nm, NA 0.55 about 6.87 nm, and research-level NA 0.75 about 5.04 nm. The arithmetic is illustrative—not a scanner specification or production claim.



## Read the visual

Two bars move in opposite directions. The first gets shorter as printable size improves; the second collapses faster because focus tolerance scales with NA squared.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use these relationships to reason about why lithography roadmaps raise NA and why process integration becomes harder.

**Practical example.** Compare a hypothetical Hyper-NA concept with High-NA for a layer whose single-exposure resolution is limiting.

**How to decide.** Treat Hyper-NA as research until imaging, masks, resist, overlay, focus control, throughput and economics are demonstrated together.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
wavelength_nm=13.5
k1=0.28
na=0.75
resolution_nm=k1*wavelength_nm/na
dof_relative=(0.33/na)**2
```

1. Set illustrative EUV inputs.

   Changed values: `{"wavelength_nm": 13.5, "k1": 0.28, "na": 0.75}`

2. Compute the simplified critical-dimension estimate.

   Changed values: `{"resolution_nm": 5.04}`

3. Compare focus tolerance with NA 0.33.

   Changed values: `{"dof_relative": 0.1936}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executed local arithmetic only. The equations and chosen k₁ are simplified teaching inputs, not process qualification or vendor performance.

## Explore (remaining exploration time)

Move NA from 0.33 to 0.75. Watch resolution improve while relative focus tolerance shrinks.

Open technology-breakthroughs.html for the executable model.

Model limits: This is a two-equation teaching calculator with a fixed k₁. It omits resist chemistry, aberrations, mask 3D effects, stochastic defects, overlay, throughput and cost. Hyper-NA is research, not a production scanner claim.

## Quiz (4 minutes)

1. In the simplified model, increasing NA does what to printable size?
   - Increases it
   - Decreases it
   - No effect

2. Why is higher NA not a free win?
   - Depth of focus shrinks
   - Wavelength disappears
   - Masks are unnecessary

3. What is the status of Hyper-NA here?
   - Production guarantee
   - Research direction with system-level evidence still needed
   - Consumer camera feature

4. Which omitted process effect could erase the arithmetic advantage?
5. What evidence would move Hyper-NA from research claim to roadmap commitment?

<details><summary>Answer key — attempt first</summary>

1. Decreases it. Resolution scales inversely with NA.

2. Depth of focus shrinks. The focus window scales roughly with inverse NA squared.

3. Research direction with system-level evidence still needed. The cited work evaluates a potential extension, not a deployed production system.

</details>

## Sources

- [SPIE: Hyper-NA at 13.5 nm](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13735/1373502/Hyper-NA-at-135-nm-a-natural-next-step-to/10.1117/12.3063080.short) — Published April 22, 2026; checked 2026-10-14.
- [ASML: Rayleigh criterion and lithography](https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors) — Official technical explainer; checked 2026-10-14.
