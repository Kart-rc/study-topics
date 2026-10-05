# Report changes, not every frame: amplitude-tunable event photosensing

Technology breakthroughs · Day12 · 15 minutes

Understand the paper's reported combination of temporal-contrast events and tunable signal amplitude, without treating a toy model as device physics.

## Recall (2 minutes)

<p><a href="../Day9/technology-breakthroughs.html">Day9: Closing the terahertz gap with an ultrathin frequency mixer</a></p><p>Two mid-infrared pumps differ by 7 THz. What output frequency does ideal difference-frequency generation target?</p><details><summary>Recall first, then reveal the refresher</summary><p>7 THz. The nonlinear mixing product includes the absolute frequency difference.</p></details><p><a href="../Day4/technology-breakthroughs.html">Day4: MaD-RL: optimize the output distribution, not only the best-looking sample</a></p><p>A per-sample optimizer always favors the slightly highest-reward mode. What population failure can follow?</p><details><summary>Recall first, then reveal the refresher</summary><p>Mode concentration. Maximizing individual rewards can push probability toward one mode even when the desired output population is broader.</p></details>

## Understand (4 minutes)

A normal camera repeatedly sends the whole scene, even when nothing changes. An event sensor is more like a motion-sensitive doorbell: it speaks when brightness changes. The new research asks for one more capability—make the event louder or quieter using a programmable gain.

The paper reports an organic mixed ionic–electronic photosensor that combines temporal-contrast detection and analogue amplitude control in one active layer. Fast electronic response produces a spike; ionic-mediated inhibition adjusts the spike amplitude.

Light stays at 10No changeNo event

Light jumps 10 → 40Change = 30Event produced

Inhibition = 50%Toy amplitude30 → 15

That last arithmetic is our analogy, not the paper’s device equation. It makes “change detection plus adjustable amplitude” visible without pretending to reproduce ionic and electronic transport.



Our toy sensor remembers the previous brightness. A new sample at the same value produces zero. A jump from 10 to 40 produces a raw contrast of 30. With 50% inhibition, the displayed amplitude is 15.

contrast = abs(current - previous)
event = max(0, contrast - threshold)
amplitude = event * (1 - inhibition)

The research article reports device measurements and device-informed simulations for neuromorphic vision. It does not establish a commercial camera, production energy guarantee, or general-purpose vision accuracy. Read the primary paper for materials, protocol, and benchmark details.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
samples = [10, 10, 40, 40, 15]
threshold = 0
inhibition = 0.5
changes = [abs(b - a) for a, b in zip(samples, samples[1:])]
events = [max(0, change - threshold) for change in changes]
amplitudes = [round(event * (1 - inhibition), 1) for event in events]
```

1. Use a small synthetic brightness stream and a 50% gain reduction.

   Changed values: `{"samples": [10, 10, 40, 40, 15], "threshold": 0, "inhibition": 0.5}`

2. Only differences between consecutive samples matter.

   Changed values: `{"changes": [0, 30, 0, 25]}`

3. Small or absent changes are removed by the toy threshold.

   Changed values: `{"events": [0, 30, 0, 25]}`

4. The remaining event amplitudes are reduced by the toy inhibition control.

   Changed values: `{"amplitudes": [0.0, 15.0, 0.0, 12.5]}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executes an original arithmetic analogy. Values are not measurements and equations are not the paper's device model.

## Explore (remaining exploration time)

Sample a stable light level, then create a jump. Change inhibition and explain why event timing stays the same while this toy amplitude changes.

Open technology-breakthroughs.html for the executable model.

Model limits: An original difference-and-gain analogy. It does not model the organic material, ions, charge transport, device time constants, noise, polarity, energy, arrays, or the paper's experimental curves. Numeric outputs are synthetic, not reproduced measurements.

## Quiz (4 minutes)

1. Brightness remains 40 on the next sample. What does the toy produce?
   - A new 40-unit event
   - No change event
   - A guaranteed negative spike

2. What does increasing inhibition change in this lesson's analogy?
   - The event amplitude
   - The publication date
   - The previous brightness

3. Which claim is justified?
   - The lab reproduces the material physics
   - The paper reports a single-active-layer organic sensor with temporal contrast and adjustable amplitude
   - The device is already a production camera

4. Explain why an event sensor can avoid sending repeated unchanged frames.
5. Which device evidence would you inspect before comparing this research with a commercial event camera?

<details><summary>Answer key — attempt first</summary>

1. No change event. The toy compares current with previous. Equal values have zero contrast, so no event crosses the threshold.

2. The event amplitude. Inhibition scales the synthetic amplitude after change detection. It does not change the stored previous sample.

3. The paper reports a single-active-layer organic sensor with temporal contrast and adjustable amplitude. That is the bounded research claim from the primary article. The browser model is explicitly only an analogy.

</details>

## Sources

- [Zhao et al.: Amplitude-controllable event-driven organic photosensors based on ionic-mediated inhibition](https://www.nature.com/articles/s41563-026-02747-8) — Nature Materials; published 2026-09-30; open-access research article; checked 2026-10-02.
