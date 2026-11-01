# Freeze electron motion one lightwave slice at a time

Technology breakthroughs · Day42 · 15 minutes

Understand how attosecond band-structure videography revealed driven carrier motion and tunnelling across graphene's momentum space.

## Recall (2 minutes)

<p><a href="../Day30/technology-breakthroughs.html">Day30: AEGIS separates deployability from danger in the released model</a></p><p>Why is ALARM independent of the candidate decision?</p><details><summary>Recall first, then reveal the refresher</summary><p>The released model can be at risk even when no candidate is deployable. Candidate readiness and current-release safety are different questions.</p></details><p><a href="../Day2/technology-breakthroughs.html">Day2: Retrieve-for-Train: optimize the set, then move work offline</a></p><p>With no novelty bonus, which three documents does the model select?</p><details><summary>Recall first, then reveal the refresher</summary><p>freshness-A, freshness-B, volume. Independent relevance ranking takes .95, .92 and .84, using two slots on freshness.</p></details>

## Understand (4 minutes)

A normal camera blurs a hummingbird's wing across the whole flap. A strobe freezes one tiny slice, then many slices reconstruct the motion.

The reported experiment used few-cycle mid-infrared fields and attosecond-precision timing to image electron distributions across graphene's first Brillouin zone. It observed displacement from intraband acceleration and distortion associated with Landau–Zener–Majorana tunnelling between bands near an avoided crossing.



In the teaching view, the lightwave phase moves the distribution left and right. Near the crossing, the cloud stretches into an ellipse as population tunnels into the conduction band. Later scattering makes the distribution more circular again. This is a visual analogy, not the measured dataset.



## Read the visual

A momentum-space cloud moves and changes shape over one field cycle, separating simple displacement from the tunnelling-associated distortion the paper reports.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use the method as research evidence for strong-field quantum materials, lightwave electronics, and separating coherent motion from scattering.

**Practical example.** A materials lab wants to see whether a driven carrier cloud crosses bands during one optical cycle rather than only measuring the cycle-averaged population.

**How to decide.** Treat this as a measurement-platform advance and microscopic observation, not a production transistor or commercial logic claim. Device control, stability, integration, energy, repeatability, and useful computation remain separate evidence needs.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
import math; phases=[0,90,180,270]
centers=[round(50+26*math.sin(math.radians(p)),1) for p in phases]
stretch=[round(18+18*max(0,math.sin(math.radians(p))),1) for p in phases]
frames=list(zip(phases,centers,stretch))
```

1. Sample four slices of one toy lightwave.

   Changed values: `{"phases": [0, 90, 180, 270]}`

2. Move the carrier center with field phase.

   Changed values: `{"centers": [50.0, 76.0, 50.0, 24.0]}`

3. Add distortion near the positive-field crossing in the analogy.

   Changed values: `{"stretch": [18, 36.0, 18.0, 18]}`

4. Build the recorded sequence of phase, position, and shape.

   Changed values: `{"frames": [[0, 50.0, 18], [90, 76.0, 36.0], [180, 50.0, 18.0], [270, 24.0, 18]]}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The SVG is an original qualitative teaching model. It does not reproduce the article's photoelectron momentum microscopy, fields, attosecond delays, distributions, Brillouin-zone geometry, scattering fits, or tunnelling probabilities.

## Explore (remaining exploration time)

Move the lightwave phase and watch displacement and distortion change. Predict when the carrier cloud approaches the band crossing.

Open technology-breakthroughs.html for the executable model.

Model limits: The SVG is an original qualitative teaching model. It does not reproduce the article's photoelectron momentum microscopy, fields, attosecond delays, distributions, Brillouin-zone geometry, scattering fits, or tunnelling probabilities.

## Quiz (4 minutes)

1. What did subcycle timing add beyond a cycle-averaged image?
   - A time-resolved view of carrier motion within the lightwave
   - A finished graphene computer
   - A measurement with no momentum information

2. What does the observed distortion help identify?
   - Interband Landau–Zener–Majorana tunnelling alongside acceleration
   - Warehouse query spill
   - A static crystal defect only

3. Why is this not yet a production logic claim?
   - Observation of microscopic motion does not establish integrated, stable, efficient devices
   - Graphene has no electrons
   - Attosecond timing is ordinary video

4. Which measured signature distinguishes band-to-band tunnelling from simple acceleration?
5. What device-level result would be needed before calling this useful lightwave logic?

<details><summary>Answer key — attempt first</summary>

1. A time-resolved view of carrier motion within the lightwave. The method reconstructs how the distribution moves during the optical cycle.

2. Interband Landau–Zener–Majorana tunnelling alongside acceleration. Displacement and shape change separate parts of the driven dynamics.

3. Observation of microscopic motion does not establish integrated, stable, efficient devices. A measurement platform and mechanism demonstration precede device qualification.

</details>

## Sources

- [Eggers et al., Subcycle videography of Landau–Zener–Majorana transitions in graphene](https://www.nature.com/articles/s41586-026-11214-y) — Primary Nature article; published October 28, 2026; checked November 1, 2026; checked 2026-11-01.
