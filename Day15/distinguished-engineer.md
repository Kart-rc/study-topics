# Two windows, one page: alert on sustained budget burn

Distinguished Engineer · Day15 · 15 minutes

Use a short and a long error-rate window together so a brief spike does not page, while sustained customer harm does.

## Recall (2 minutes)

<p><a href="../Day6/distinguished-engineer.html">Day6: Decision velocity: match governance to reversibility</a></p><p>Why is a deployment rollback button insufficient evidence of reversibility?</p><details><summary>Recall first, then reveal the refresher</summary><p>Data and external contracts may remain changed. True reversal must account for state and commitments beyond the binary.</p></details><p><a href="../Day10/distinguished-engineer.html">Day10: Replace one route at a time</a></p><p>Only /tracking moves. Who handles /orders in this example?</p><details><summary>Recall first, then reveal the refresher</summary><p>The old system. The routing decision is per capability. Moving tracking does not transfer order-write ownership or require two writers.</p></details>

## Understand (4 minutes)

A smoke alarm should react quickly to a real fire, but not page the fire department for one burnt piece of toast.


An error-budget burn rate compares the current bad-event rate with the rate your SLO allows. For a 99.9% SLO, the allowed bad-event rate is 0.1%. A 1% error rate burns budget at 10×.


Visual question: Why does a short spike differ from sustained budget burn?



Use an illustrative 10× threshold on both a five-minute and a sixty-minute window.


Brief spike: 2% short, 0.2% long → 20× and 2× → do not page.Sustained outage: 2% short, 1.2% long → 20× and 12× → page.
page = short_burn >= 10 and long_burn >= 10


The threshold and windows are policy choices. The useful leadership move is to tie them to a defined budget spend, test them against past incidents, and give every page an owner and action.



## Read the visual

Why does a short spike differ from sustained budget burn? Both bars use the same burn-rate scale. The dashed threshold applies to both windows, and paging requires BOTH bars to reach it. A tall five-minute bar alone is not this sustained-burn page.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use two-window burn-rate alerts when a service has a meaningful user-facing SLO but brief error spikes produce noisy pages. The question is whether failures are spending the error budget fast enough to need action now.

**Practical example.** Your data-quality API targets 99.9% successful requests. In this lesson, 2% errors over five minutes and 1.2% over an hour exceed the illustrative 10× threshold together. Page the owner; a short spike with only 0.2% over the hour does not meet this paging rule.

**How to decide.** Backtest thresholds against real incidents and define the response. Use slower tickets for chronic harm. For sparse traffic, consider synthetic checks or longer aggregation because one failed request can distort the rate.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
slo = 0.999
allowed_error_percent = (1 - slo) * 100
short_error_percent = 2.0
long_error_percent = 1.2
short_burn = short_error_percent / allowed_error_percent
long_burn = long_error_percent / allowed_error_percent
threshold = 10
page = short_burn >= threshold and long_burn >= threshold
```

1. A 99.9% SLO allows 0.1% bad requests.

   Changed values: `{"slo": 0.999, "allowed_error_percent": 0.10000000000000009}`

2. Use the sustained-failure case: both recent and longer views are bad.

   Changed values: `{"short_error_percent": 2.0, "long_error_percent": 1.2}`

3. Normalize each error rate by the same SLO allowance.

   Changed values: `{"short_burn": 19.999999999999982, "long_burn": 11.99999999999999}`

4. Both windows cross 10×, so the incident is fast and sustained enough to page.

   Changed values: `{"threshold": 10, "page": true}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executes fixed arithmetic for one request SLO. It does not query Prometheus or choose production thresholds.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Google's recommended approach uses multiple burn-rate pairs for different severities. Treat alert design as a portfolio: fast paging for acute spend, slower ticketing for chronic spend, and explicit handling for low traffic. Review precision, recall, detection time, and reset time after incidents.</p>

</details>

## Explore (remaining exploration time)

Choose a brief spike, sustained failure, or slow burn. Compare the two burn rates and the resulting response.

Open distinguished-engineer.html for the executable model.

Model limits: This calculator uses fixed aggregate error rates, a 99.9% request SLO, and one illustrative threshold. Production alerting needs low-traffic handling, missing-data policy, multiple severities, reset behavior, request weighting, and backtesting. A non-page result can still create a ticket.

## Quiz (4 minutes)

1. Why does the brief spike not page at the default threshold?
   - The short window is high but the long window is only 2×
   - The SLO ignores all five-minute failures
   - The service had zero errors

2. What does a 10× burn rate mean for a 99.9% SLO?
   - The current error rate is 1%, ten times the allowed 0.1%
   - Availability is 10%
   - The monthly budget has already reset

3. What is the senior-engineering boundary?
   - Copy one threshold everywhere
   - Backtest windows and thresholds against traffic and budget policy
   - Page on every individual error

4. Explain why the sustained scenario pages while the spike does not.
5. Which low-traffic or missing-data condition could make this alert misleading, and how would you test it?

<details><summary>Answer key — attempt first</summary>

1. The short window is high but the long window is only 2×. Both windows must cross the threshold; the long window rejects a short-lived burst.

2. The current error rate is 1%, ten times the allowed 0.1%. Burn rate is current bad-event rate divided by the SLO's allowed rate.

3. Backtest windows and thresholds against traffic and budget policy. The mechanism is general; the numbers must reflect the service's traffic, SLO, and response model.

</details>

## Sources

- [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) — Published 2018; burn-rate and multi-window alerting foundation; checked 2026-10-05.
- [Prometheus alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) — Living documentation; rule evaluation and alert states; checked 2026-10-05.
