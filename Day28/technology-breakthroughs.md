# Two bandgaps split the sunlight

Technology breakthroughs · Day28 · 15 minutes

Understand why a perovskite top cell and silicon bottom cell can use more of the solar spectrum—and why current matching matters.

## Recall (2 minutes)

<p><a href="../Day23/technology-breakthroughs.html">Day23: Scan the room, train in its twin, then try the real pickup</a></p><p>What human input starts the pipeline?</p><details><summary>Recall first, then reveal the refresher</summary><p>Phone scene scan and object images. The method automates demonstration generation after capture.</p></details><p><a href="../Day11/technology-breakthroughs.html">Day11: Check agreement across quantum modules: detection is not correction</a></p><p>Starting at 00, both bits flip. What does the toy detector say?</p><details><summary>Recall first, then reveal the refresher</summary><p>No alarm, despite changed information. 11 has even parity just like 00. The detector sees agreement and accepts. There is no repair operation or knowledge of the original in the detector.</p></details>

## Understand (4 minutes)

A single fishing net has one mesh size: some fish pass through and some waste energy fighting the net. A tandem solar cell stacks two absorbers with different bandgaps. The wide-bandgap perovskite top cell captures higher-energy photons; lower-energy light reaches silicon below.

In a two-terminal monolithic tandem, the same current passes through both subcells. The weaker current limits the pair, so optical and electrical current matching matters.



The top cell could supply 21 mA/cm² and the bottom 19. The series tandem produces about 19, not 40. Tuning the perovskite thickness raises bottom-cell light but may lower top-cell current. The engineering target is a balanced pair, plus durability and scalable fabrication.



## Read the visual

The spectrum strip explains the division of labor; the two current bars explain the separate electrical constraint. Moving one bar makes the bottleneck visible instead of merely naming “current matching.”

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use the tandem concept when evaluating research that claims efficiency beyond a single-junction silicon architecture.

**Practical example.** A 2026 paper reported ambient-air, blade-coated perovskite devices and a certified 33.0% monolithic perovskite–silicon tandem cell.

**How to decide.** Separate cell efficiency from module efficiency, certified from in-house results, and laboratory stability from bankable field lifetime. Check area, architecture, test conditions, and third-party validation.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
top_current=21
bottom_current=19
tandem_current=min(top_current,bottom_current)
limiter='top' if top_current<bottom_current else 'bottom'
```

1. Represent the top-cell current under one spectrum.

   Changed values: `{"top_current": 21}`

2. Represent the silicon bottom-cell current.

   Changed values: `{"bottom_current": 19}`

3. Series current is limited by the weaker subcell.

   Changed values: `{"tandem_current": 19}`

4. Identify the current-matching bottleneck.

   Changed values: `{"limiter": "bottom"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This current-minimum model omits voltage addition, fill factor, spectral variation, optical losses, recombination, temperature, degradation, area, encapsulation, manufacturing yield, and module/system economics. The 2026 result is a research-cell claim, not evidence of commercial readiness.

## Explore (remaining exploration time)

Tune top-cell current. The spectrum split remains, but the series current follows the weaker subcell.

Open technology-breakthroughs.html for the executable model.

Model limits: This current-minimum model omits voltage addition, fill factor, spectral variation, optical losses, recombination, temperature, degradation, area, encapsulation, manufacturing yield, and module/system economics. The 2026 result is a research-cell claim, not evidence of commercial readiness.

## Quiz (4 minutes)

1. Why stack different absorber bandgaps?
   - To use different parts of the solar spectrum
   - To add currents directly in series
   - To remove durability needs

2. Top current 21 and bottom current 19 in a simple series model. Output current?
   - 40
   - 21
   - 19

3. What does a certified research-cell efficiency prove?
   - Commercial bankability
   - Performance under stated test conditions, not lifetime or mass production
   - Twenty-five-year field life

4. Which reported measurement would you require before comparing two tandem-cell claims?
5. What commercialization risk is invisible in this current-matching model?

<details><summary>Answer key — attempt first</summary>

1. To use different parts of the solar spectrum. The two absorbers can capture photon energies more effectively than one junction.

2. 19. The lower subcell current limits the series pair.

3. Performance under stated test conditions, not lifetime or mass production. Scale, durability, validation, and bankability remain separate evidence.

</details>

## Sources

- [Scalable ambient fabrication of single-junction and perovskite–silicon tandem solar cells](https://www.nature.com/articles/s41893-026-01916-6) — Nature Sustainability, August 13, 2026; checked 2026-10-18.
- [US DOE perovskite research directions](https://www.energy.gov/cmei/systems/perovskite-research-directions) — Living research overview; checked 2026-10-18.
- [NREL photovoltaic data tools](https://www.nrel.gov/pv/data-tools.html) — Living record-chart resource; checked 2026-10-18.
