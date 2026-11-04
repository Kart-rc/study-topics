# Page for action now; ticket work that can wait

Distinguished Engineer · Day44 · 15 minutes

Separate urgent actionable symptoms from useful but non-pageable operational evidence.

## Recall (2 minutes)

<p><a href="../Day31/distinguished-engineer.html">Day31: The failover button must survive the outage</a></p><p>Why pre-provision routing controls before an outage?</p><details><summary>Recall first, then reveal the refresher</summary><p>Incident-time switching should not depend on resource creation. Configuration is a control-plane activity that may be unavailable during disruption.</p></details><p><a href="../Day3/distinguished-engineer.html">Day3: Cell-based architecture: make failure scope a product decision</a></p><p>With 1,000 evenly assigned tenants and 10 cells, what is the modeled one-cell impact?</p><details><summary>Recall first, then reveal the refresher</summary><p>100 tenants. The simplified upper bound is ceil(1,000 / 10) = 100.</p></details>

## Understand (4 minutes)

A smoke alarm wakes you because you must act now. A note that its battery will expire next month belongs on a maintenance list.

A page interrupts a human. It should represent a user-visible symptom or an imminent hard failure, and the on-call must have an action. A cause metric such as high CPU can help diagnosis without being the page itself. If something matters but can wait, track it as planned work instead of teaching people to ignore alerts.



Checkout errors exceed the SLO and traffic can be shifted: page. CPU is 85% but users are healthy: record and investigate, not a page. A storage quota is 99% and crossing it will instantly stop writes: page because immediate preventive action exists.



## Read the visual

The decision path makes a signal earn a page through urgency and actionability, while preserving non-page evidence in tickets or dashboards.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this decision when an organization has noisy alerts, missed incidents, or on-call fatigue despite extensive monitoring.

**Practical example.** A Spark platform pages on every executor-memory spike while missing a sustained data-freshness breach that customers actually experience.

**How to decide.** Page on urgent symptoms with a tested action. Allow cause-based preventive pages only for an imminent cliff with action now. Put non-urgent defects into a tracked queue; keep diagnostic metrics on dashboards.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
signal={'user_errors':0.12,'cpu':0.85,'quota':0.72}; action='shift traffic'
urgent=signal['user_errors']>0.05; actionable=bool(action)
route='page' if urgent and actionable else 'ticket'
cpu_route='dashboard'; quota_route='ticket' if signal['quota']<0.95 else 'page'
```

1. Start with user errors above the toy threshold and a known mitigation.

   Changed values: `{"signal": {"user_errors": 0.12, "cpu": 0.85, "quota": 0.72}, "action": "shift traffic"}`

2. Evaluate urgency and whether the on-call can act now.

   Changed values: `{"urgent": true, "actionable": true}`

3. The customer symptom with a mitigation becomes a page.

   Changed values: `{"route": "page"}`

4. Diagnostic CPU stays on the dashboard; a non-imminent quota remains planned work.

   Changed values: `{"cpu_route": "dashboard", "quota_route": "ticket"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model uses fixed classifications. Real paging needs SLOs, burn windows, deduplication, severity, ownership, dependencies, maintenance handling, notification delivery, human factors, and periodic review of false positives and misses.

## Explore (remaining exploration time)

Classify four signals by urgency, user impact, and actionability. Watch the route change when one of those conditions is missing.

Open distinguished-engineer.html for the executable model.

Model limits: The model uses fixed classifications. Real paging needs SLOs, burn windows, deduplication, severity, ownership, dependencies, maintenance handling, notification delivery, human factors, and periodic review of false positives and misses.

## Quiz (4 minutes)

1. Users are healthy but CPU is 85%. What is the default route?
   - Track and investigate without paging
   - Page every team immediately
   - Ignore the metric forever

2. Why may a 99% hard quota justify a preventive page?
   - An immediate action can prevent a sudden total failure
   - Every threshold is a page
   - Quotas prove customer impact already happened

3. What makes an alert fundamentally broken?
   - No owner can take a useful action
   - It has a dashboard link
   - It is derived from an SLO

4. Which current page reports a cause without a user symptom or imminent cliff?
5. What action must the on-call be able to take within the first five minutes?

<details><summary>Answer key — attempt first</summary>

1. Track and investigate without paging. A cause metric is useful evidence but not automatically an urgent user symptom.

2. An immediate action can prevent a sudden total failure. An imminent cliff with a tested action is a bounded exception to symptom-only alerting.

3. No owner can take a useful action. Interrupting a human without an action creates noise rather than reliability.

</details>

## Sources

- [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) — Primary Google SRE guidance; checked November 3, 2026; checked 2026-11-03.
- [Google SRE incident-management guide](https://sre.google/resources/practices-and-processes/incident-management-guide/) — Official Google SRE guidance; checked November 3, 2026; checked 2026-11-03.
