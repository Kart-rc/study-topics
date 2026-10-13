# Scan the room, train in its twin, then try the real pickup

Technology breakthroughs · Day23 · 15 minutes

Understand the evidence and transfer boundary in Splat2Act scene-personalized robot manipulation.

## Recall (2 minutes)

<p><a href="../Day18/technology-breakthroughs.html">Day18: Speculative decoding: keep the speed, correct the guesses</a></p><p>Draft A probability is 0.8; target A is 0.6. What is A’s acceptance probability?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.75. 0.6/0.8 = 0.75. Multiplying by proposal probability 0.8 gives accepted A mass 0.6.</p></details><p><a href="../Day20/technology-breakthroughs.html">Day20: One telescope, two science programs: commensal signal capture</a></p><p>What makes capture commensal?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reuses primary stream. The side backend receives a copy.</p></details>

## Understand (4 minutes)

A driving student can practice in a model of the exact neighborhood before touching the real car. Splat2Act applies that idea to robot manipulation.

A phone scan builds a photorealistic scene and collision geometry. A simulation oracle generates successful demonstrations. A VLA policy is adapted in two stages, then deployed back into the captured environment.



The paper reports 0% pickup success for an unadapted generalist policy in captured deployment scenes. Its strongest personalized policy reached 62.5% aggregate pickup success. On a 12-task subset, reported real-robot success was 63.9% versus 66.7% in simulation.



## Read the visual

The stage slider follows the causal production of artifacts—from capture to real evaluation—and ends by exposing the transfer boundary rather than celebrating one metric.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Potentially useful when a robot must adapt to a specific building and object set, while collecting many real demonstrations is expensive.

**Practical example.** Personalize a mobile manipulator for shelves and counters in one office using phone scans and object images.

**How to decide.** Treat this as recent research. Require safety review, new-scene replication, failure analysis, and real-world evaluation before operational use.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
reported={"generalist_captured":0.0,"personalized_target":62.5,"subset_sim":66.7,"subset_real":63.9}
sim_to_real_gap=reported["subset_sim"]-reported["subset_real"]
claim="close_tracking_in_reported_subset" if abs(sim_to_real_gap)<5 else "large_gap"
```

1. Record the paper’s reported aggregate percentages.

   Changed values: `{"reported": {"generalist_captured": 0.0, "personalized_target": 62.5, "subset_sim": 66.7, "subset_real": 63.9}}`

2. Compute the reported subset percentage-point gap.

   Changed values: `{"sim_to_real_gap": 2.8000000000000043}`

3. Apply a transparent toy label to the reported values.

   Changed values: `{"claim": "close_tracking_in_reported_subset"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executed local arithmetic on reported percentages. It did not reproduce the policy, tasks, trials, or statistical uncertainty.

## Explore (remaining exploration time)

Move through capture, synthetic demonstrations, personalization, and real deployment. Notice which stages generate evidence versus assumptions.

Open technology-breakthroughs.html for the executable model.

Model limits: The browser replays reported aggregate metrics and pipeline stages. It does not reconstruct a scene, simulate physics, train a VLA, measure safety, or reproduce the paper.

## Quiz (4 minutes)

1. What human input starts the pipeline?
   - Real demonstrations for every task
   - Phone scene scan and object images
   - A production guarantee

2. Why compare simulation and real results?
   - To inspect transfer, not assume it
   - To prove all scenes work
   - To remove collision geometry

3. What does 62.5% aggregate success justify?
   - Unsupervised deployment
   - Further reproduction and failure study
   - Perfect personalization

4. Which new scene would most stress the reported method?
5. What real-robot failure category matters more than aggregate pickup success?

<details><summary>Answer key — attempt first</summary>

1. Phone scene scan and object images. The method automates demonstration generation after capture.

2. To inspect transfer, not assume it. The sim-to-real gap is an empirical boundary.

3. Further reproduction and failure study. The reported research result is promising but incomplete.

</details>

## Sources

- [Splat2Act: From Captured Scenes to Personalized VLA Manipulation](https://arxiv.org/abs/2610.13945) — Submitted 2026-10-09; checked 2026-10-13.
- [Splat2Act HTML paper](https://arxiv.org/html/2610.13945v1) — Version 1; checked 2026-10-13.
