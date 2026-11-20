# Route routine changes automatically; reserve approval meetings for real risk

Distinguished Engineer · Day59 · 15 minutes

Reduce decision delay by matching approval depth to evidence-based change risk.

## Recall (2 minutes)

<p><a href="../Day33/distinguished-engineer.html">Day33: A shared quota is a shared failure domain</a></p><p>Finance stays at 350 while ML rises to 750 under a 1,000 quota. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Combined demand exceeds the shared ceiling by 100. Shared limits couple otherwise unrelated demand.</p></details><p><a href="../Day37/distinguished-engineer.html">Day37: Match decision process to reversal cost</a></p><p>A change is flag-protected and rolls back in five minutes for one team. Default process?</p><details><summary>Recall first, then reveal the refresher</summary><p>A local guarded experiment with evidence. Reversible choices should not inherit one-way-door ceremony.</p></details>

## Understand (4 minutes)

An airport does not send every traveler to the same inspection room. Known low-risk cases follow a fast standard path; unusual risk gets deeper review.

A single architecture board for every change creates a queue even when automated tests and team ownership already control routine work. The senior-leadership move is not “remove governance.” It is to define risk classes, automate evidence for normal changes, name the exceptional decider, and measure approval wait separately from implementation time.



Ten weekly changes reach a board. Eight are routine and wait three days; two change regulated data boundaries and deserve review. Risk routing removes 24 routine queue-days while retaining the two high-risk decisions.



## Read the visual

A ten-change queue splits into an automated eight-change lane and a two-change expert-review lane while both counts stay visible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use risk-tiered approval when teams repeatedly wait for an external board on changes with known controls.

**Practical example.** Data-product schema additions with passing compatibility tests take the fast path; cross-account PII sharing requires security and data-owner review.

**How to decide.** Define observable risk signals, required evidence, escalation owners, and audit sampling. Do not let teams self-label high-risk work as routine without controls.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
changes=10; routine=8; high_risk=2; board_wait_days=3
all_board_queue_days=routine*board_wait_days
risk_routed_queue_days=0; retained_reviews=high_risk
result={'routine_queue_days_removed':all_board_queue_days-risk_routed_queue_days,'high_risk_reviews_retained':retained_reviews}
```

1. State the weekly demand and current wait.

   Changed values: `{"changes": 10, "routine": 8, "high_risk": 2, "board_wait_days": 3}`

2. Calculate delay imposed on routine work.

   Changed values: `{"all_board_queue_days": 24}`

3. Route controlled routine work automatically and retain exceptional review.

   Changed values: `{"risk_routed_queue_days": 0, "retained_reviews": 2}`

4. Measure speed and retained governance together.

   Changed values: `{"result": {"routine_queue_days_removed": 24, "high_risk_reviews_retained": 2}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The calculator assumes fixed three-day waits and perfect classification. It omits false negatives, correlated risk, audit cost, regulatory mandates, meeting capacity, and the value of expert review.

## Explore (remaining exploration time)

Switch between one board for all ten changes and a risk-routed path. Predict routine queue-days.

Open distinguished-engineer.html for the executable model.

Model limits: The calculator assumes fixed three-day waits and perfect classification. It omits false negatives, correlated risk, audit cost, regulatory mandates, meeting capacity, and the value of expert review.

## Quiz (4 minutes)

1. Eight routine changes each wait three days. What queue delay is exposed?
   - 24 change-days
   - 3 minutes
   - Zero

2. What makes a fast path governable?
   - Explicit risk signals, automated evidence, ownership, and audit
   - Calling every change low risk
   - Removing logs

3. Which change still deserves deeper review?
   - A new cross-account PII sharing boundary
   - A tested typo fix
   - A documentation link

4. Which approval queue has the largest routine share?
5. What evidence would safely qualify its fast path?

<details><summary>Answer key — attempt first</summary>

1. 24 change-days. Eight times three is 24.

2. Explicit risk signals, automated evidence, ownership, and audit. Controls make delegation inspectable.

3. A new cross-account PII sharing boundary. Material security and compliance boundaries need appropriate authority.

</details>

## Sources

- [DORA: Streamlining change approval](https://dora.dev/capabilities/streamlining-change-approval/) — Official DORA research-derived guidance; checked November 19, 2026; checked 2026-11-19.
- [DORA: Loosely coupled teams](https://dora.dev/capabilities/loosely-coupled-teams/) — Official DORA guidance; checked November 19, 2026; checked 2026-11-19.
