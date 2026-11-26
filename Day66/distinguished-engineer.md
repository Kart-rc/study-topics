# A standard earns its place by beating the current baseline—not its last version

Distinguished Engineer · Day66 · 15 minutes

Use paired ablation evidence to keep, slim, canary, or retire a reusable platform standard as the surrounding system changes.

## Recall (2 minutes)

<p><a href="../Day29/distinguished-engineer.html">Day29: Stop starting six migrations; finish two</a></p><p>What is the primary purpose of a WIP limit?</p><details><summary>Recall first, then reveal the refresher</summary><p>Improve flow and finish evidence. Finishing creates feedback and frees the bottleneck.</p></details><p><a href="../Day36/distinguished-engineer.html">Day36: An owner needs a decision right, not just a name</a></p><p>A platform catalog names an owner but lists no authority. What is missing?</p><details><summary>Recall first, then reveal the refresher</summary><p>The decisions that owner may take. Ownership must connect to action.</p></details>

## Understand (4 minutes)

Your company gives every traveler an airport map. Thousands use it. Then the terminal changes. The map's popularity does not prove it still helps; compare today's trip with the map to the same trip without it.

A reusable standard—an agent skill, golden path, runbook, or pipeline template—can survive because it already exists. Comparing version 3 only with version 2 preserves that assumption. An ablation asks the harder question: on the same representative work, does the current system perform better with the standard than without it? Measure outcome quality, errors, time, and cost. Then keep, slim, canary, or retire it. Repeat when a model, tool, platform, or risk profile changes.



A synthetic warehouse-query skill is replayed on 100 current troubleshooting prompts. With the skill, its answer wins 62 blind comparisons; without it, the baseline wins 23; 15 tie. Tool errors fall from 34 to 9 and median task time falls from 130 to 110 seconds, but the skill adds 12,000 context tokens. The decision is keep and slim, not “keep forever.” After a model upgrade, the paired replay flips: the skill wins 33, the no-skill baseline wins 49, and errors are slightly worse with the skill. High historical usage cannot rescue it; canary its removal and retire it if protected cases remain safe.



## Read the visual

The paired visual holds the task set constant and puts WITH STANDARD beside WITHOUT STANDARD. Usage-only mode deliberately withholds a quality verdict; later modes change the surrounding model or reveal a protected risk slice so the lifecycle decision can change without contradiction.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use paired ablation when a default platform capability is costly, widely installed, or sensitive to changes in models, tools, APIs, runtimes, or organizational constraints.

**Practical example.** Your data platform mandates one Spark troubleshooting helper in every repository, but the runtime and observability APIs have changed twice since its last evidence review.

**How to decide.** Replay the same representative tasks with and without the standard, segment protected high-risk cases, and compare quality, errors, time, and cost. Keep a hard control when its risk boundary requires it; do not retire it from an average score alone.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
enabled={'wins':62,'errors':9,'seconds':110,'extra_tokens':12000}
baseline={'wins':23,'errors':34,'seconds':130,'extra_tokens':0}
delta={'quality_wins':enabled['wins']-baseline['wins'],'errors_avoided':baseline['errors']-enabled['errors'],'seconds_saved':baseline['seconds']-enabled['seconds'],'extra_tokens':enabled['extra_tokens']}
decision={'action':'keep and slim','reason':'quality and reliability beat the current baseline','next_test':'canary after model or harness change'}
```

1. Record the outcomes and cost when the reusable standard is enabled.

   Changed values: `{"enabled": {"wins": 62, "errors": 9, "seconds": 110, "extra_tokens": 12000}}`

2. Run the same representative work against today's system without the standard.

   Changed values: `{"baseline": {"wins": 23, "errors": 34, "seconds": 130, "extra_tokens": 0}}`

3. Make the added value and added cost visible instead of using adoption as a proxy.

   Changed values: `{"delta": {"quality_wins": 39, "errors_avoided": 25, "seconds_saved": 20, "extra_tokens": 12000}}`

4. Choose a time-bounded lifecycle action and name the event that must reopen the decision.

   Changed values: `{"decision": {"action": "keep and slim", "reason": "quality and reliability beat the current baseline", "next_test": "canary after model or harness change"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is an original local teaching model, not an Uber, Spotify, or production evaluation. The prompts, wins, errors, times, and token costs are synthetic. Blind judges can be wrong; paired samples can be unrepresentative; non-deterministic runs need uncertainty estimates; and rare safety, security, privacy, or regulatory failures require protected slices and human review rather than an average score.

## Explore (remaining exploration time)

Switch from usage-only evidence to paired current-model, upgraded-model, and rare regulated-task evidence. Predict which lifecycle decision the same popular standard now earns.

Open distinguished-engineer.html for the executable model.

Model limits: This is an original local teaching model, not an Uber, Spotify, or production evaluation. The prompts, wins, errors, times, and token costs are synthetic. Blind judges can be wrong; paired samples can be unrepresentative; non-deterministic runs need uncertainty estimates; and rare safety, security, privacy, or regulatory failures require protected slices and human review rather than an average score.

## Quiz (4 minutes)

1. A default helper has 12,000 monthly calls, but no with-versus-without comparison. What can you conclude?
   - It has reach, but its incremental value is still unknown
   - It must remain mandatory
   - It should be retired immediately

2. After a model upgrade, no-helper wins 49 comparisons and the helper wins 33, with fewer errors without it. What is the best next move?
   - Canary removal on representative and protected cases, then retire if safe
   - Compare the helper only with its previous version
   - Keep it because historical usage is high

3. Average results favor removing a long helper, but two regulated tasks fail only without one validation step. What should you do?
   - Keep the mandatory validation control and test slimming the advisory instructions
   - Remove everything because the average improved
   - Ignore all ablation evidence forever

4. Choose one internal standard you own. Define the same-task with/without comparison, its quality signal, operational cost, and protected risk slices.
5. Write its retirement trigger and canary boundary. Which result keeps it, slims it, splits out a hard control, or removes it?

<details><summary>Answer key — attempt first</summary>

1. It has reach, but its incremental value is still unknown. Usage shows exposure and adoption; only a representative comparison can estimate what the helper adds.

2. Canary removal on representative and protected cases, then retire if safe. The current baseline now wins; a bounded removal canary tests the lifecycle decision without assuming the result.

3. Keep the mandatory validation control and test slimming the advisory instructions. Protected high-risk slices can justify a narrow hard control even when optional guidance no longer adds value.

</details>

## Sources

- [Uber Engineering: How Uber Evals 1 Million Agent Skill Invocations a Month](https://www.uber.com/gb/en/blog/optimizing-ubers-agent-skills/) — Recent primary engineering case; published November 23, 2026. Describes skill lifecycle, paired with/without ablation on real prompts, blind comparison, cost measurement, change-triggered evaluation, and retirement as models improve.; checked 2026-11-26.
- [Spotify Engineering: Coding Is No Longer the Constraint](https://engineering.atspotify.com/2026/06/code-with-claude-coding-is-no-longer-the-constraint) — Primary engineering case; published June 3, 2026. Shows standardization as an active feedback system for people and agents while faster code generation shifts the bottleneck toward human decisions.; checked 2026-11-26.
- [Amazon Builders' Library FAQs](https://aws.amazon.com/builders-library/faqs/) — Maintained practitioner foundation. States that Amazon's practices are contextual, that there is no single right way, and that a best practice can cease to be best as technology and constraints change.; checked 2026-11-26.
