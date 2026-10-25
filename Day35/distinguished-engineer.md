# An ADR is evidence, not a forever rule

Distinguished Engineer · Day35 · 15 minutes

Record the assumption behind an architecture decision and supersede the ADR when that assumption stops being true.

## Recall (2 minutes)

<p><a href="../Day21/distinguished-engineer.html">Day21: An architecture rule that cannot fail the build is only advice</a></p><p>Build is green but PII is public. Senior response?</p><details><summary>Recall first, then reveal the refresher</summary><p>Add an executable pre-deploy rule at the boundary. The missing mechanism is enforcement, not awareness.</p></details><p><a href="../Day25/distinguished-engineer.html">Day25: A 99.9% service cannot make a 99.9% chain</a></p><p>Three independent required services are each 99.95% available. Is the path exactly 99.95%?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; required probabilities compound. All required steps must succeed, so the path estimate is the product.</p></details>

## Understand (4 minutes)

A bridge sign says “safe for 10-ton trucks.” If the fleet moves to 20-ton trucks, the sign did not become false because it was poorly written; its operating assumption expired.

An architecture decision record should preserve context, options, decision, consequences, status, owner, and change history. A later decision does not erase the old one; it marks it superseded and links the replacement.



ADR-042 chooses one shared Kafka cluster because peak load is under 50 MB/s and tenant isolation is logical. Six months later one tenant reaches 45 MB/s alone. The team does not silently edit history. ADR-087 records the changed assumption, chooses cells, and marks ADR-042 superseded.



## Read the visual

The two cards connect a measurable assumption to a status transition; they show why an old decision can be reasonable and still require replacement.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Create an ADR for choices that shape structure, non-functional requirements, dependencies, interfaces, or construction technique.

**Practical example.** Choose shared versus cell-based Kafka infrastructure, with an explicit revisit trigger when a tenant exceeds 30% of cluster capacity.

**How to decide.** Keep the original record immutable enough to explain history. Add measurable assumptions and triggers, assign an owner, and supersede rather than delete when the context changes.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
assumption_limit = 0.30
observed_share = 0.45
revisit_required = observed_share > assumption_limit
old_status = 'superseded'; replacement = 'ADR-087 cell-based Kafka' if revisit_required else None
```

1. Record the maximum safe tenant share.

   Changed values: `{"assumption_limit": 0.3}`

2. New evidence exceeds the assumption.

   Changed values: `{"observed_share": 0.45}`

3. Turn the trigger into an explicit decision signal.

   Changed values: `{"revisit_required": true}`

4. Preserve the old record and link the replacement.

   Changed values: `{"old_status": "superseded", "replacement": "ADR-087 cell-based Kafka"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The browser evaluates one numeric assumption. Real decisions have multiple uncertain assumptions, qualitative consequences, stakeholder tradeoffs, irreversible costs, and review cadence. It does not approve an architecture.

## Explore (remaining exploration time)

Move observed tenant load past the recorded assumption. Watch the decision change from valid to revisit to superseded.

Open distinguished-engineer.html for the executable model.

Model limits: The browser evaluates one numeric assumption. Real decisions have multiple uncertain assumptions, qualitative consequences, stakeholder tradeoffs, irreversible costs, and review cadence. It does not approve an architecture.

## Quiz (4 minutes)

1. A recorded capacity assumption becomes false. First response?
   - Reopen the decision with current evidence
   - Delete the ADR
   - Pretend the decision is permanent

2. Why keep the old ADR after replacement?
   - It preserves why the old system made sense and what changed
   - It enforces two designs
   - It proves the owner was wrong

3. Minimum useful ADR content includes what?
   - Context, decision, consequences, status, owner/change history
   - Only a diagram
   - Only the vendor name

4. Which current platform decision lacks a measurable revisit trigger?
5. How would you keep ADR ownership alive after the original author changes teams?

<details><summary>Answer key — attempt first</summary>

1. Reopen the decision with current evidence. The changed context is decision input.

2. It preserves why the old system made sense and what changed. Decision history prevents circular debate and supports learning.

3. Context, decision, consequences, status, owner/change history. A decision without context and consequences is hard to evaluate later.

</details>

## Sources

- [AWS Prescriptive Guidance: ADR process](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html) — Living AWS guidance; checked 2026-10-25.
- [AWS ADR FAQ](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/faq.html) — Living AWS guidance; checked 2026-10-25.
- [AWS ADR best practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/best-practices.html) — Living AWS guidance; checked 2026-10-25.
