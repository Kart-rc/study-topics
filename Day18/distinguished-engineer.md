# Keep the reason, not just the verdict: architecture decision records

Distinguished Engineer · Day18 · 15 minutes

Make an architectural choice reviewable when its assumptions change.

## Recall (2 minutes)

<p><a href="../Day9/distinguished-engineer.html">Day9: Rollback safety: old code must survive new state</a></p><p>Why can a successful binary rollback still fail?</p><details><summary>Recall first, then reveal the refresher</summary><p>New code may already have written durable state the old code cannot read. Deployment state and durable data evolve on different timelines.</p></details><p><a href="../Day3/distinguished-engineer.html">Day3: Cell-based architecture: make failure scope a product decision</a></p><p>With 1,000 evenly assigned tenants and 10 cells, what is the modeled one-cell impact?</p><details><summary>Recall first, then reveal the refresher</summary><p>100 tenants. The simplified upper bound is ceil(1,000 / 10) = 100.</p></details>

## Understand (4 minutes)

A team once chose a small van because deliveries fit in it. A year later, someone remembers only “we always use the van.” An architecture decision record (ADR) keeps the reason, alternatives and consequences beside the choice. A new engineer can understand what was true when the team decided.

Today’s original decision is to run a nightly report in one region because the business accepts a 24-hour delay. A new contract later requires results within 15 minutes. That is evidence to revisit the decision, not proof that any particular replacement is correct.



ADR-7 records the 24-hour assumption, a single-region batch design, lower operating cost, and slower freshness. We add an explicit review trigger: a freshness requirement below 24 hours. This trigger is a teaching convention, not a universal ADR standard.

When a new design is evaluated and accepted, ADR-8 can replace ADR-7. Keep ADR-7 and mark it superseded; deleting it erases why the original design was reasonable. A proposed replacement does not become accepted merely because the old assumption changed.



## Read the visual

The diagram separates evidence of a changed assumption from acceptance of a replacement. The old record remains visible after its status changes.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this for consequential choices with alternatives, tradeoffs or constraints that another team will need to understand later.

**Practical example.** Record why a platform selected nightly batch rather than continuous ingestion, including the freshness promise and cost evidence.

**How to decide.** Write one short record per significant decision. For a local reversible refactor, a code comment may suffice. Revisit records on evidence, not just on a calendar ritual.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
adr7 = "accepted"
required_hours = 24
adr8 = "absent"
required_hours = 0.25
review_needed = required_hours < 24
adr8 = "proposed"
review_approved = True
adr8 = "accepted" if review_approved else "proposed"
adr7 = "superseded" if review_approved else "accepted"
history = ["ADR-7", "ADR-8"]
```

1. The original assumption supports the recorded choice.

   Changed values: `{"adr7": "accepted", "required_hours": 24, "adr8": "absent"}`

2. The changed requirement triggers review, not acceptance.

   Changed values: `{"required_hours": 0.25, "adr8": "proposed", "review_needed": true}`

3. Only an explicit reviewed acceptance replaces the decision. Both records remain.

   Changed values: `{"adr7": "superseded", "adr8": "accepted", "review_approved": true, "history": ["ADR-7", "ADR-8"]}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Python decision trace with synthetic review approval, not an architecture recommendation.

## Explore (remaining exploration time)

Change the freshness requirement from 24 hours to 15 minutes. Does that immediately supersede ADR-7? Then accept the proposed replacement and inspect the history.

Open distinguished-engineer.html for the executable model.

Model limits: This JavaScript decision-state model uses an invented review threshold. It does not evaluate architecture quality, prescribe streaming as the solution or automatically authorize a migration.

## Quiz (4 minutes)

1. The requirement changes to 15 minutes. What follows immediately?
   - Delete ADR-7
   - Start a review; ADR-8 is not accepted yet
   - Streaming is automatically approved

2. Why keep superseded ADR-7?
   - To preserve the original context and tradeoff
   - To require its design forever
   - To hide the new choice

3. Which belongs in this decision record?
   - Every source-code line
   - A guarantee the system never fails
   - Freshness assumption, alternatives, decision and consequences

4. Write one assumption and a measurable review trigger for a platform decision.
5. What evidence would you require before accepting ADR-8?

<details><summary>Answer key — attempt first</summary>

1. Start a review; ADR-8 is not accepted yet. An assumption change is evidence for review. It neither evaluates alternatives nor accepts a replacement.

2. To preserve the original context and tradeoff. The old record explains what was reasonable then. Superseded means a newer accepted decision replaces it.

3. Freshness assumption, alternatives, decision and consequences. The record preserves decision reasoning at architectural scope. Code listings and blanket guarantees do not supply that reasoning.

</details>

## Sources

- [AWS: ADR process](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html) — Living guidance; publication date not stated; checked 2026-10-08.
- [AWS: ADR best practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/best-practices.html) — Living guidance; publication date not stated; checked 2026-10-08.
