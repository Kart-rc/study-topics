# TimesFM-3: one zero-shot model, related time series, future covariates

Technology breakthroughs · Day3 · 15 minutes

A volume forecast based only on yesterday’s traffic misses tomorrow’s planned backfill.

## Recall (2 minutes)

<p><a href="../Day2/technology-breakthroughs.html">Day2: Retrieve-for-Train: optimize the set, then move work offline</a></p><p>With no novelty bonus, which three documents does the model select?</p><details><summary>Recall first, then reveal the refresher</summary><p>freshness-A, freshness-B, volume. Independent relevance ranking takes .95, .92 and .84, using two slots on freshness.</p></details>

## Understand (4 minutes)

A volume forecast based only on yesterday’s traffic misses tomorrow’s planned backfill. Some future information is available before the future arrives.

A covariate is an extra input that may help explain the value being forecast. TimesFM-3 research describes using related series and such inputs. A future-known input must really have been available when the forecast was made; using later measurements would leak the answer.

Watch the visual: What changes when tomorrow’s backfill is already known today?



Our synthetic baseline predicts 100 units on each of seven days. Two known backfill days add 40 each, taking the total from 700 to 780. This is a teaching rule, not a TimesFM implementation.



## Read the visual

Seven forecast columns align with seven known future backfill flags. Every column starts at the same historical mean; only flagged days gain the selected effect. Outlined baseline and filled forecast share a fixed 0–200 scale. This is an arithmetic illustration, not TimesFM-3 inference or calibrated uncertainty.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
baseline = [100] * 7
planned_backfill = [False, True, False, False, True, False, False]
forecast = [value + (40 if planned else 0) for value, planned in zip(baseline, planned_backfill)]
baseline_total = sum(baseline)
forecast_total = sum(forecast)
```

1. History-only prediction repeats the same value.

   Changed values: `{"baseline": [100, 100, 100, 100, 100, 100, 100]}`

2. The schedule is known at the forecast cutoff.

   Changed values: `{"planned_backfill": [false, true, false, false, true, false, false]}`

3. Add the synthetic backfill effect only on scheduled days.

   Changed values: `{"forecast": [100, 140, 100, 100, 140, 100, 100]}`

4. The original weekly total is 700.

   Changed values: `{"baseline_total": 700}`

5. The adjusted weekly total is 780.

   Changed values: `{"forecast_total": 780}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: The 40-unit effect is invented for teaching, not learned or reported performance. Canceled schedules or changed relationships can make the extra input harmful. Test with historical cutoffs and no future leakage.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Google Research introduced TimesFM-3 as a zero-shot foundation model for univariate, multivariate, and covariate-informed forecasting in a single forward pass. The August 31, 2026 write-up describes an alternating attention architecture, non-autoregressive horizon decoding, and quantile forecasts.</p><p>The new capability matters when related series and known future signals carry information that a target’s history alone cannot. Google reports leading or competitive results across its selected benchmark groups against named baselines. Those are research claims from the model team, not evidence for your workload. The post said BigQuery integration was coming “in the coming weeks”; as of the source date, that was a future plan, not a generally available feature claim.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> A streaming platform’s last seven daily ingestion volumes hover near 100 units. Two future days have planned backfills. A history-only baseline repeats the historical mean, so it forecasts about 100 each day. A covariate-aware toy rule adds 40 on scheduled backfill days, producing a seven-day total near 780 rather than 700.</p><p>That does not prove the covariate helps. If schedules are canceled or the relationship changes, the extra signal can make the forecast worse. Evaluate it against a seasonal naive baseline on rolling historical cutoffs, using only covariates that would actually have been known at each cutoff.</p><p>TimesFM-3 separates target history, past-only covariates, and covariates known into the forecast horizon. For a platform pilot, examples might be ingestion volume as target, observed lag as past-only, and a committed backfill calendar as past-and-future. Prevent leakage: “eventually corrected actual volume” is not a future-known input.</p>

</details>

## Explore (remaining exploration time)

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
