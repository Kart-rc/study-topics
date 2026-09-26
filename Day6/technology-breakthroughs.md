# cfDNA methylation screening: the base rate still governs

Technology breakthroughs · Day6 · 15 minutes

Distinguish a blood-based multi-cancer signal from a diagnosis, and use base rates to explain why specificity and follow-up matter.

## Recall (2 minutes)

<p><a href="../Day3/technology-breakthroughs.html">Day3: TimesFM-3: one zero-shot model, related time series, future covariates</a></p><p>With a baseline of about 100 and two planned days adding 40 each, what is the approximate seven-day total?</p><details><summary>Recall first, then reveal the refresher</summary><p>780. Seven baseline days contribute about 700; two planned effects add 80.</p></details><p><a href="../Day5/technology-breakthroughs.html">Day5: Repeat-After-Me: visual injection reaches the tool boundary</a></p><p>Why is producing a parseable native tool call an important attack milestone?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness can convert model text into an executable action. Exact format compliance can bridge model influence into a tool invocation; authorization is still separate.</p></details>

## Understand (4 minutes)

Cell-free DNA circulates in blood. A next-generation sequencing test can look for methylation patterns associated with cancer and predict a likely tissue of origin. That is a notable diagnostic-platform direction: one blood draw can search for signals across multiple cancer types. It is still a screening signal, not a diagnosis.

On September 23, 2026, an FDA advisory panel reviewed the Galleri premarket approval application. FDA's 24-hour summary records votes of 10–0 on reasonable assurance of safety, 6–4 on effectiveness, and 7–2 with one abstention on benefit/risk. The panel's advice is non-binding and is not itself FDA approval. The panel emphasized that a positive result does not confirm cancer, a negative does not rule it out, established screening should continue, and long-term outcome impact has not been established.



Original synthetic cohort: Screen 10,000 people where 1% have the target condition. At 70% sensitivity and 99% specificity, the toy model finds 70 true positives and produces 99 false positives. The positive predictive value is about 41%: fewer than half of positive signals correspond to the modeled condition, even with 99% specificity.

true positives = population × prevalence × sensitivity
false positives = population × (1 − prevalence) × (1 − specificity)
PPV = true positives / (true positives + false positives)

The numbers are deliberately synthetic and are not Galleri performance estimates. Real multi-cancer evaluation is more complex: cancer-type and stage distributions, episode-based measures, tissue-origin prediction, diagnostic workups, competing risks, subgroup uncertainty, existing screening, harms, and long-term outcomes all matter.



## Explore (5 minutes)

Predict PPV before raising prevalence, then vary specificity by tenths of a percent. Explain why a screening program cannot summarize benefit with sensitivity alone.

Open technology-breakthroughs.html for the executable model.

Model limits: A single-condition Bayes calculator for 10,000 synthetic people with fixed sensitivity and specificity. It is not medical advice and does not model Galleri data, multiple cancer types, stage, interval cancers, tissue-of-origin accuracy, overdiagnosis, workup pathways, harms, mortality benefit, demographic subgroups, confidence intervals, or FDA's approval decision.

## Quiz (4 minutes)

1. Why can false positives rival true positives even at high specificity?
   - Screening populations can have a low base rate
   - Sensitivity and specificity are the same
   - Every positive is diagnostic

2. What did the September 23 panel vote establish?
   - Immediate FDA approval
   - Non-binding expert advice on the PMA evidence
   - A replacement for guideline-recommended screening

3. Which statement matches the FDA summary?
   - A positive result confirms cancer
   - A negative result rules cancer out
   - Long-term impact on patient outcomes has not been established

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Screening populations can have a low base rate. A small false-positive fraction applied to a large unaffected population can be substantial.

2. Non-binding expert advice on the PMA evidence. Advisory committees advise FDA; their votes are not the agency's legal decision.

3. Long-term impact on patient outcomes has not been established. The panel explicitly highlighted this uncertainty and the need for continued data collection.

</details>

## Sources

- [FDA: September 23, 2026 Molecular and Clinical Genetics Panel meeting](https://www.fda.gov/advisory-committees/advisory-committee-calendar/september-23-2026-molecular-and-clinical-genetics-panel-medical-devices-advisory-committee-meeting) — Meeting held 2026-09-23; checked 2026-09-26.
- [FDA: September 23, 2026 24 Hour Summary](https://www.fda.gov/media/195032/download) — Published after the 2026-09-23 advisory meeting; checked 2026-09-26.
