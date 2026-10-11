# An architecture rule that cannot fail the build is only advice

Distinguished Engineer · Day21 · 15 minutes

Turn one high-value architecture constraint into an executable fitness function with an owner and exception path.

## Recall (2 minutes)

<p><a href="../Day6/distinguished-engineer.html">Day6: Decision velocity: match governance to reversibility</a></p><p>Why is a deployment rollback button insufficient evidence of reversibility?</p><details><summary>Recall first, then reveal the refresher</summary><p>Data and external contracts may remain changed. True reversal must account for state and commitments beyond the binary.</p></details><p><a href="../Day13/distinguished-engineer.html">Day13: Deal each tenant a hand: shuffle-shard the fleet</a></p><p>Rainbow uses W1/W4 and Rose uses W1/W8. W1 and W4 fail. Why can Rose continue?</p><details><summary>Recall first, then reveal the refresher</summary><p>Rose has a non-overlapping healthy worker, W8. Rose overlaps at W1 but not completely; W8 remains a path if capacity and retry behavior are sound.</p></details>

## Understand (4 minutes)

Incident. A deployment was green, but a new customer-data bucket was public and unencrypted. The review checklist said “private and encrypted”; nobody executed the check.

A fitness function turns an architecture outcome into a repeatable test. It does not test everything. It makes one important boundary hard to cross accidentally.



The manifest says classification=PII, public=true, encrypted=false. The deployment job itself succeeds—our misleading green signal. The fitness function emits two violations and blocks promotion until both fields change or a time-bounded exception is approved.

Trigger: a new manifest. Mechanism: unenforced prose. Impact: exposed regulated data. Missing control: a pre-deployment policy test.



## Read the visual

The deployment box stays green while the architecture gate turns red, separating “code ran” from “the system still obeys the rule.”

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use fitness functions when a cross-team architecture rule is objective, important, and cheap enough to evaluate repeatedly.

**Practical example.** Block a PII data product unless storage is private, encrypted, and owned.

**How to decide.** Automate deterministic constraints. Keep nuanced tradeoffs in human review, and provide explicit, expiring exceptions instead of hidden bypasses.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
manifest={"classification":"PII","encrypted":False,"public":True}
violations=[]
if manifest["classification"]=="PII" and not manifest["encrypted"]: violations.append("PII must be encrypted")
if manifest["classification"]=="PII" and manifest["public"]: violations.append("PII must be private")
decision="BLOCK" if violations else "PASS"
```

1. Load the proposed data-product state.

   Changed values: `{"manifest": {"classification": "PII", "encrypted": false, "public": true}}`

2. Evaluate two explicit architectural constraints.

   Changed values: `{"violations": ["PII must be encrypted", "PII must be private"]}`

3. Make the promotion decision from evidence.

   Changed values: `{"decision": "BLOCK"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: Executed local Python against a synthetic manifest; no cloud policy engine or deployment was contacted.

## Explore (remaining exploration time)

Change classification, encryption, and exposure. Predict the exact rule failures and whether promotion is blocked.

Open distinguished-engineer.html for the executable model.

Model limits: This local rules engine checks three synthetic fields. Real controls need authoritative inventory, identity, policy versioning, exception expiry, and evidence that deployed state matches the manifest.

## Quiz (4 minutes)

1. Build is green but PII is public. Senior response?
   - Trust build success
   - Add an executable pre-deploy rule at the boundary
   - Email a reminder

2. Which is a good fitness function?
   - “Architecture should be good”
   - “PII storage must be private and encrypted”
   - “Review carefully”

3. When should the gate not decide alone?
   - A deterministic encryption rule
   - A nuanced tradeoff with incomplete evidence
   - A schema invariant

4. Which one architecture rule would prevent your most expensive recurring exception?
5. Who owns expiry and audit of an approved exception?

<details><summary>Answer key — attempt first</summary>

1. Add an executable pre-deploy rule at the boundary. The missing mechanism is enforcement, not awareness.

2. “PII storage must be private and encrypted”. It is objective and executable.

3. A nuanced tradeoff with incomplete evidence. Judgment-heavy decisions need accountable human review.

</details>

## Sources

- [AWS Well-Architected: on architecture](https://docs.aws.amazon.com/wellarchitected/2024-06-27/framework/on-architecture.html) — Framework 2024-06-27; checked 2026-10-11.
- [AWS OPS05-BP02: test and validate changes](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_dev_integ_test_val_chg.html) — Living guidance; checked 2026-10-11.
