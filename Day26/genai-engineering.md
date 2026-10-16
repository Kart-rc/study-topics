# Slice the eval before the average hides a dangerous failure

GenAI engineering · Day26 · 15 minutes

Stratify agent evaluations so rare, high-risk tool cases cannot disappear inside an overall pass rate.

## Recall (2 minutes)

<p><a href="../Day20/genai-engineering.html">Day20: A tool call is a proposal: validate before the handler</a></p><p>dataset missing. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Validation error before handler. The effect target is ambiguous.</p></details><p><a href="../Day22/genai-engineering.html">Day22: A valid tool call can still return the wrong shape</a></p><p>Tool promises {order_id,status} but returns {id,state}. What should the client do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject/mark the result invalid. A schema mismatch is contract evidence, not a prompt for guessing.</p></details>

## Understand (4 minutes)

An average hospital wait time can look good while emergency patients wait dangerously long. Agent pass rates have the same trap. If 95 read-only cases pass and 5 payment cases fail, the overall score is still 95%.

Define important slices before running the eval: tool risk, customer tier, language, document length, or failure mode. Keep the total, but gate the release on critical slices too.



Candidate B passes 95/100 cases. The table reveals read-only tasks at 100% and payment tasks at 0%. A “≥90% overall” gate would ship it; a “≥90% overall and ≥80% payment” gate blocks it.



## Read the visual

The two bars share the same 0–100% scale. The release box combines them with AND, making it visually impossible for the large safe slice to erase the small risky slice.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use sliced evaluation whenever failures have unequal consequences or the production mix contains important minority cases.

**Practical example.** Evaluate a support agent separately on read-only account lookup and money-moving refund tools.

**How to decide.** Predefine operationally meaningful slices and minimum sample sizes. Use the overall score for trend, but make high-risk slice thresholds independent release gates.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
read_only={"pass":95,"total":95}
payments={"pass":0,"total":5}
overall=(read_only["pass"]+payments["pass"])/(read_only["total"]+payments["total"])
payment_rate=payments["pass"]/payments["total"]
release=(overall>=0.90 and payment_rate>=0.80)
```

1. Separate the common and high-risk slices.

   Changed values: `{"read_only": {"pass": 95, "total": 95}, "payments": {"pass": 0, "total": 5}}`

2. The aggregate looks strong because read-only cases dominate.

   Changed values: `{"overall": 0.95}`

3. The critical slice reveals total failure.

   Changed values: `{"payment_rate": 0.0}`

4. Require both an overall and a risk-slice gate.

   Changed values: `{"release": false}`

[Full runnable example](examples/genai-engineering.py).

Limits: This model uses deterministic binary labels and tiny synthetic slices. Real evals need representative sampling, grader validation, uncertainty, contamination checks, and manual review of consequential failures.

## Explore (remaining exploration time)

Change the number of payment successes. Compare the overall bar with the payment slice gate.

Open genai-engineering.html for the executable model.

Model limits: This model uses deterministic binary labels and tiny synthetic slices. Real evals need representative sampling, grader validation, uncertainty, contamination checks, and manual review of consequential failures.

## Quiz (4 minutes)

1. Why can a 95% overall rate still be unsafe?
   - Rare critical cases may all fail
   - Percentages are never useful
   - All tools are identical

2. When should slice thresholds be chosen?
   - Before inspecting candidate results
   - After finding the best-looking score
   - Never

3. What if a critical slice has only two cases?
   - Claim certainty
   - Treat it as weak evidence and add representative cases
   - Delete the slice

4. Which production slice would block your agent despite a strong overall score?
5. How would you detect that a grader is systematically lenient on one slice?

<details><summary>Answer key — attempt first</summary>

1. Rare critical cases may all fail. A majority slice can dominate the aggregate.

2. Before inspecting candidate results. Predefinition reduces post-hoc metric shopping.

3. Treat it as weak evidence and add representative cases. Small samples cannot support a strong readiness claim.

</details>

## Sources

- [OpenAI evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices) — Living documentation; checked 2026-10-16.
- [OpenAI Evals guide](https://platform.openai.com/docs/guides/evals) — Living documentation; checked 2026-10-16.
- [OpenAI Graders API](https://platform.openai.com/docs/api-reference/graders) — Living API reference; checked 2026-10-16.
