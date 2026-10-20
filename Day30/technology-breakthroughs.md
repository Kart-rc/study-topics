# AEGIS separates deployability from danger in the released model

Technology breakthroughs · Day30 · 15 minutes

Understand a 2026 research governance system with a four-way decision and an independent alarm.

## Recall (2 minutes)

<p><a href="../Day24/technology-breakthroughs.html">Day24: A wider optical cone prints smaller features—but narrows focus</a></p><p>In the simplified model, increasing NA does what to printable size?</p><details><summary>Recall first, then reveal the refresher</summary><p>Decreases it. Resolution scales inversely with NA.</p></details><p><a href="../Day12/technology-breakthroughs.html">Day12: Report changes, not every frame: amplitude-tunable event photosensing</a></p><p>Brightness remains 40 on the next sample. What does the toy produce?</p><details><summary>Recall first, then reveal the refresher</summary><p>No change event. The toy compares current with previous. Equal values have zero contrast, so no event crosses the threshold.</p></details>

## Understand (4 minutes)

A hospital tests a candidate model update. Two different questions matter: “May we deploy the candidate?” and “Is the model already serving patients now at risk?” One answer cannot safely stand in for both.

The AEGIS research prototype combines data assimilation/retraining, model monitoring, and conditional decisions. It uses four outcomes—APPROVE, CONDITIONAL APPROVAL, CLINICAL REVIEW, and REJECT—plus an independent ALARM for the released model.



Suppose the candidate misses the safety threshold, so it is REJECTED. At the same time, monitoring finds drift in the released model. The combined state is REJECT + ALARM: there is no deployable replacement and the current model may be unsafe. That state needs escalation, not a silent fallback.



## Read the visual

The two-axis matrix prevents a common collapse: candidate quality and released-model danger remain visible at the same time.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Consider this research when designing post-market governance for adaptive, regulated medical AI that changes after initial deployment.

**Practical example.** A sepsis model candidate fails validation while the released model’s input distribution is drifting at another hospital.

**How to decide.** Treat AEGIS as a proof-of-concept architecture, not a production medical-control system. Validate clinical endpoints, concept drift, false alarms, human authority, auditability, site transfer, and regulatory obligations independently.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
candidate_score=72
released_alarm=True
decision='REJECT' if candidate_score<75 else 'REVIEW'
critical=decision=='REJECT' and released_alarm
action='ESCALATE' if critical else 'FOLLOW_PATH'
```

1. Represent the candidate and current release as separate signals.

   Changed values: `{"candidate_score": 72, "released_alarm": true}`

2. The candidate fails the toy deployment threshold.

   Changed values: `{"decision": "REJECT"}`

3. Combine rejection with an independent alarm.

   Changed values: `{"critical": true}`

4. The critical state cannot silently fall back to the current model.

   Changed values: `{"action": "ESCALATE"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This browser is an original two-threshold teaching model. It is not the authors’ code, clinical validation, regulatory approval, a drift detector, or a medical device. The paper reports illustrative sepsis and brain-tumor cases; it leaves concept drift for future work.

## Explore (remaining exploration time)

Set candidate safety and released-model alarm independently. The outcome matrix shows why REJECT and ALARM are separate dimensions.

Open technology-breakthroughs.html for the executable model.

Model limits: This browser is an original two-threshold teaching model. It is not the authors’ code, clinical validation, regulatory approval, a drift detector, or a medical device. The paper reports illustrative sepsis and brain-tumor cases; it leaves concept drift for future work.

## Quiz (4 minutes)

1. Why is ALARM independent of the candidate decision?
   - The released model can be at risk even when no candidate is deployable
   - It makes every candidate pass
   - It measures only training speed

2. What does REJECT + ALARM mean in the example?
   - No deployable candidate while the released model is at risk
   - Automatic approval
   - The alarm may be ignored

3. What is a stated research boundary?
   - The proof-of-concept evaluates covariate shift and leaves concept drift for future work
   - It is a certified medical device
   - It removes clinical review

4. Which monitoring signal in your domain should be independent of candidate promotion?
5. What clinical or operational evidence is missing before this research architecture could govern a real deployment?

<details><summary>Answer key — attempt first</summary>

1. The released model can be at risk even when no candidate is deployable. Candidate readiness and current-release safety are different questions.

2. No deployable candidate while the released model is at risk. The combined state requires critical escalation.

3. The proof-of-concept evaluates covariate shift and leaves concept drift for future work. The paper explicitly limits what its drift scoring establishes.

</details>

## Sources

- [Afdideh et al., AEGIS](https://www.nature.com/articles/s41746-026-03290-1) — Published October 13, 2026; checked 2026-10-20.
- [AEGIS preprint](https://arxiv.org/abs/2603.22322) — Submitted March 20, 2026; checked 2026-10-20.
