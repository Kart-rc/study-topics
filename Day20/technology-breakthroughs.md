# One telescope, two science programs: commensal signal capture

Technology breakthroughs · Day20 · 15 minutes

Explain how a sidecar digital backend reuses observations without taking telescope time.

## Recall (2 minutes)

<p><a href="../Day5/technology-breakthroughs.html">Day5: Repeat-After-Me: visual injection reaches the tool boundary</a></p><p>Why is producing a parseable native tool call an important attack milestone?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness can convert model text into an executable action. Exact format compliance can bridge model influence into a tool invocation; authorization is still separate.</p></details><p><a href="../Day16/technology-breakthroughs.html">Day16: Seven clocks, one fibre network: compare time across borders</a></p><p>In the default toy, the readings differ by 3 and uncertainty is 7.7. What is the conclusion?</p><details><summary>Recall first, then reveal the refresher</summary><p>They agree within the stated uncertainty. The difference is inside the toy uncertainty band; that is a bounded claim.</p></details>

## Understand (4 minutes)

A passenger can photograph the view while a train follows its normal route. A commensal astronomy backend receives a copy of telescope signals while the primary program continues.

The advance is architectural and operational—not a claim of detected extraterrestrial life: packetized backends, commodity GPUs, pipelines, archives, and verification workflows let another search piggyback at scale.



The October 5, 2026 Breakthrough Listen decade review describes commensal systems including COSMIC at the VLA and BLUSE at MeerKAT. It reports more than 1.2 million BLUSE pointings since mid-2022 and about 42 PB storage capacity, 31 PB in use, by March 2026.

Our synthetic 4 Gb/s tap for one hour receives 1.8 TB before reduction. Retaining 2% keeps 36 GB. These are teaching inputs, not named-instrument performance.



## Read the visual

The stream forks without giving scheduling control to the sidecar; quantity labels separate raw ingress from archive.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Relevant to specialist observatories and to architects designing sidecar analytics that must not disturb a primary workload.

**Practical example.** Mirror a read-only signal stream to a GPU pipeline while the primary telescope schedule remains authoritative.

**How to decide.** Use only with explicit isolation, bandwidth, backpressure, provenance, and archive budgets. A side tap can harm primary work if shared paths saturate.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
rate_gbps=4
hours=1
retain_fraction=0.02
raw_tb=rate_gbps*hours*3600/8/1000
retained_tb=raw_tb*retain_fraction
```

1. Set synthetic inputs.

   Changed values: `{"rate_gbps": 4, "hours": 1, "retain_fraction": 0.02}`

2. Convert to decimal TB.

   Changed values: `{"raw_tb": 1.8}`

3. Apply a teaching reduction fraction.

   Changed values: `{"retained_tb": 0.036000000000000004}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executed Python conversion with synthetic inputs; no instrument is reproduced.

## Explore (remaining exploration time)

Change tap rate and retention. Predict raw and retained volume while observing time stays fixed.

Open technology-breakthroughs.html for the executable model.

Model limits: This is unit conversion, not telescope sensitivity, spectra, compression quality, candidate verification, packet loss, or detection evidence.

## Quiz (4 minutes)

1. What makes capture commensal?
   - Reuses primary stream
   - Owns all telescope time
   - Stores nothing

2. 4 Gb/s for one hour equals?
   - 1.8 TB
   - 18 TB
   - 0.018 TB

3. What does the review establish?
   - Alien detection
   - Engineering history and reported scale
   - Every sidecar is free

4. Which shared resource risks primary work?
5. What provenance belongs with reduced candidates?

<details><summary>Answer key — attempt first</summary>

1. Reuses primary stream. The side backend receives a copy.

2. 1.8 TB. 4×3600/8/1000.

3. Engineering history and reported scale. It is an instrumentation and operations review.

</details>

## Sources

- [The First Decade of Breakthrough Listen](https://arxiv.org/abs/2610.07482) — Research review submitted 2026-10-05; checked 2026-10-10.
- [Breakthrough Listen public data and archiving](https://arxiv.org/abs/1906.07391) — Foundation submitted 2019-06-18; checked 2026-10-10.
