# Steer common work, block catastrophic work, and recover the rest

Distinguished Engineer · Day43 · 15 minutes

Choose a golden path, guardrail, safety net, or manual checkpoint based on the decision—not by calling every platform control a guardrail.

## Recall (2 minutes)

<p><a href="../Day25/distinguished-engineer.html">Day25: A 99.9% service cannot make a 99.9% chain</a></p><p>Three independent required services are each 99.95% available. Is the path exactly 99.95%?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; required probabilities compound. All required steps must succeed, so the path estimate is the product.</p></details><p><a href="../Day29/distinguished-engineer.html">Day29: Stop starting six migrations; finish two</a></p><p>What is the primary purpose of a WIP limit?</p><details><summary>Recall first, then reveal the refresher</summary><p>Improve flow and finish evidence. Finishing creates feedback and frees the bottleneck.</p></details>

## Understand (4 minutes)

Road signs, crash barriers, airbags, and a human traffic officer all improve safety, but they do different jobs.

A golden path makes the common safe choice easy. A guardrail is a hard stop for a catastrophic action. A safety net detects or reduces harm after failure. A manual checkpoint supplies judgment when the rule cannot be encoded safely. Naming the control clarifies the user experience and the evidence it must produce.



For a data-product platform: a template creates encrypted buckets by default; policy blocks public access; monitoring detects policy drift and rolls back; a review board decides an unusual cross-region data-sharing exception. Replacing every step with approval queues would be slow, while replacing judgment with a brittle hard rule would reject legitimate exceptions.



## Read the visual

A four-way control map makes the intended user experience visible: steer, prevent, recover, or ask for judgment.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this taxonomy when platform teams design controls for self-service infrastructure, data publication, deployment, or access.

**Practical example.** Forty producer teams need a standard S3-to-lakehouse path, but a few regulated transfers require explicit exception review.

**How to decide.** Steer repeatable low-risk work with a golden path; hard-block deterministic catastrophic conditions; detect and recover from residual failures; reserve manual review for high-context decisions. Measure friction and bypasses for every type.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
risk='catastrophic'; deterministic=True; failure_already_happened=False
control='guardrail' if risk=='catastrophic' and deterministic else 'golden path'
evidence={'control':control,'outcome':'public access denied','owner':'platform security'}
exception={'allowed':False,'review_required':True,'expires':None}
```

1. Describe the decision, not the tool name.

   Changed values: `{"risk": "catastrophic", "deterministic": true, "failure_already_happened": false}`

2. A deterministic catastrophic condition gets a hard stop.

   Changed values: `{"control": "guardrail"}`

3. Record both the mechanism and the observed result.

   Changed values: `{"evidence": {"control": "guardrail", "outcome": "public access denied", "owner": "platform security"}}`

4. A hard stop still has an explicit governed exception route, not a silent bypass.

   Changed values: `{"exception": {"allowed": false, "review_required": true, "expires": null}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The decision matrix is a teaching heuristic, not a compliance framework. Real controls can overlap, fail, or create new hazards. Legal, security, risk, and product owners still define non-negotiable requirements and exceptions.

## Explore (remaining exploration time)

Choose a platform scenario and watch the decision move between steering, prevention, recovery, and judgment.

Open distinguished-engineer.html for the executable model.

Model limits: The decision matrix is a teaching heuristic, not a compliance framework. Real controls can overlap, fail, or create new hazards. Legal, security, risk, and product owners still define non-negotiable requirements and exceptions.

## Quiz (4 minutes)

1. A public bucket is always forbidden and machine-detectable. Best primary control?
   - A hard guardrail
   - A voluntary template only
   - A post-incident meeting

2. Why is an encrypted-bucket template a golden path rather than a guardrail?
   - It steers the common choice without defining the final hard stop
   - It only works after an incident
   - It requires a review board

3. A novel regulated transfer needs context the platform cannot encode. Best fit?
   - A scoped manual checkpoint with owner and expiry
   - Silently bypass every control
   - A permanent block with no exception path

4. Which current control is mislabeled as a guardrail and what behavior does it actually provide?
5. Where is a manual checkpoint adding judgment, and where is it merely compensating for missing automation?

<details><summary>Answer key — attempt first</summary>

1. A hard guardrail. A deterministic catastrophic condition should be blocked before it crosses the boundary.

2. It steers the common choice without defining the final hard stop. The template makes safe work fast; a separate policy can still enforce the non-negotiable boundary.

3. A scoped manual checkpoint with owner and expiry. Human judgment is appropriate when the decision is high stakes and not safely reducible to a rule.

</details>

## Sources

- [Google Cloud: What is platform engineering?](https://cloud.google.com/solutions/platform-engineering) — Official foundation; checked November 2, 2026; checked 2026-11-02.
- [Google Cloud: Beyond guardrails—platform control mechanisms](https://cloud.google.com/blog/products/application-modernization/platform-engineering-control-mechanisms) — Official engineering guidance; published August 15, 2025; checked November 2, 2026; checked 2026-11-02.
