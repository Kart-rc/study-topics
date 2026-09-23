# TimesFM-3: one zero-shot model, related time series, future covariates

Technology breakthroughs · Day3 · 15 minutes

Distinguish multivariate zero-shot forecasting from a univariate baseline and design a fair platform pilot without treating a teaching model as TimesFM.

## Recall (2 minutes)

<p><a href="../Day2/technology-breakthroughs.html">Day2: Retrieve-for-Train: optimize the set, then move work offline</a></p><p>With no novelty bonus, which three documents does the model select?</p><details><summary>Recall first, then reveal the refresher</summary><p>freshness-A, freshness-B, volume. Independent relevance ranking takes .95, .92 and .84, using two slots on freshness.</p></details>

## Understand (4 minutes)

Google Research introduced TimesFM-3 as a zero-shot foundation model for univariate, multivariate, and covariate-informed forecasting in a single forward pass. The August 31, 2026 write-up describes an alternating attention architecture, non-autoregressive horizon decoding, and quantile forecasts.

The new capability matters when related series and known future signals carry information that a target’s history alone cannot. Google reports leading or competitive results across its selected benchmark groups against named baselines. Those are research claims from the model team, not evidence for your workload. The post said BigQuery integration was coming “in the coming weeks”; as of the source date, that was a future plan, not a generally available feature claim.



Original teaching case: A streaming platform’s last seven daily ingestion volumes hover near 100 units. Two future days have planned backfills. A history-only baseline repeats the historical mean, so it forecasts about 100 each day. A covariate-aware toy rule adds 40 on scheduled backfill days, producing a seven-day total near 780 rather than 700.

That does not prove the covariate helps. If schedules are canceled or the relationship changes, the extra signal can make the forecast worse. Evaluate it against a seasonal naive baseline on rolling historical cutoffs, using only covariates that would actually have been known at each cutoff.

TimesFM-3 separates target history, past-only covariates, and covariates known into the forecast horizon. For a platform pilot, examples might be ingestion volume as target, observed lag as past-only, and a committed backfill calendar as past-and-future. Prevent leakage: “eventually corrected actual volume” is not a future-known input.



## Explore (5 minutes)

Predict the seven-day total with the schedule ignored, then enable known-future covariates. Change the planned effect. Explain how you would backtest a schedule field that is often canceled after the forecast is made.

Open technology-breakthroughs.html for the executable model.

Model limits: This is an original mean-plus-schedule calculator with a fixed illustrative ±15 interval. It does not execute TimesFM-3, learn cross-series dependence, produce calibrated quantiles, use attention, or reproduce any reported benchmark. The planned effect is chosen by you and can be wrong. No product availability is implied.

## Quiz (4 minutes)

1. With a baseline of about 100 and two planned days adding 40 each, what is the approximate seven-day total?
   - 620
   - 700
   - 780

2. Why must a future covariate be reconstructed as known at each backtest cutoff?
   - To prevent information that arrived later from leaking into evaluation
   - To increase the model size
   - To remove the target history

3. What is safe to conclude from Google’s reported benchmark results?
   - TimesFM-3 will win on every enterprise series
   - It performed strongly on the reported evaluation setup; your workload still needs a controlled backtest
   - BigQuery integration was already generally available

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. 780. Seven baseline days contribute about 700; two planned effects add 80.

2. To prevent information that arrived later from leaking into evaluation. A fair zero-shot or trained forecast can use only the information available when the forecast would have been made.

3. It performed strongly on the reported evaluation setup; your workload still needs a controlled backtest. Research benchmarks motivate evaluation. They do not establish workload-specific accuracy or announced product availability.

</details>

## Sources

- [Google Research: TimesFM-3, a zero-shot foundation model for multivariate forecasting](https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/) — Published 2026-08-31; checked 2026-09-23.
