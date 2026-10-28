# A risk acceptance needs an owner, a trigger, and an expiry

Distinguished Engineer · Day38 · 15 minutes

Turn a permanent exception into a time-bounded decision that is re-evaluated when evidence or exposure changes.

## Recall (2 minutes)

<p><a href="../Day28/distinguished-engineer.html">Day28: Measure the journey, not the sign-ups</a></p><p>Which metric best represents platform activation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Teams completing the valuable production journey. A platform earns value when users complete a useful outcome.</p></details><p><a href="../Day16/distinguished-engineer.html">Day16: Green before failure, red after: capacity for one-zone loss</a></p><p>At 120 requests/s and 60 capacity per AZ, what happens after one AZ is lost?</p><details><summary>Recall first, then reveal the refresher</summary><p>Each survivor reaches 100%. Two survivors each receive 60 requests/s, exactly their hard capacity.</p></details>

## Understand (4 minutes)

A temporary road detour needs a sign saying who owns it and when it will be removed. Otherwise temporary becomes permanent.

Accepting risk is an informed response, not the absence of work. Record the residual risk, accountable approver, compensating controls, review date, and evidence that forces an earlier review. AWS Managed Services documents one-year validity for its risk acceptances; your policy can be shorter.



Platform waiver R-42 permits an unsigned internal image for 90 days while a legacy builder is replaced. The owner is the platform director. A public exposure, a critical CVE, or loss of runtime isolation reopens the decision immediately—even on day 20.



## Read the visual

The decision has two independent clocks: elapsed time and changed evidence. Either path can turn a still-documented acceptance into a required reassessment.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a formal acceptance when a known residual risk cannot be removed before a justified delivery deadline and an accountable authority can decide within stated tolerance.

**Practical example.** A regulated data platform temporarily accepts a legacy deployment path while enforcing network isolation, image scanning and a dated migration plan.

**How to decide.** Mitigate or avoid when impact exceeds tolerance, controls are weak, ownership is unclear, or the exception has no credible retirement path. Acceptance is not a substitute for backlog neglect.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
risk = {'id': 'R-42', 'owner': 'platform-director', 'expires_day': 90}
age_days = 95; evidence_changed = False
must_reassess = age_days >= risk['expires_day'] or evidence_changed
action = 'reassess and choose accept, mitigate, transfer, or avoid' if must_reassess else 'continue controls'
```

1. Record identity, authority, and a hard review date.

   Changed values: `{"risk": {"id": "R-42", "owner": "platform-director", "expires_day": 90}}`

2. The waiver has crossed its date even without new evidence.

   Changed values: `{"age_days": 95, "evidence_changed": false}`

3. Time or changed exposure can reopen the decision.

   Changed values: `{"must_reassess": true}`

4. A review leads to an explicit risk response.

   Changed values: `{"action": "reassess and choose accept, mitigate, transfer, or avoid"}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model is a governance teaching aid, not a quantitative risk assessment, legal opinion, compliance authorization, threat model, or substitute for the organization's risk authority.

## Explore (remaining exploration time)

Move the waiver age and toggle changed exposure. Watch the decision reopen from either time or evidence.

Open distinguished-engineer.html for the executable model.

Model limits: The model is a governance teaching aid, not a quantitative risk assessment, legal opinion, compliance authorization, threat model, or substitute for the organization's risk authority.

## Quiz (4 minutes)

1. R-42 is only 20 days old, but the service becomes public. What happens?
   - Reassess immediately because the evidence trigger changed
   - Wait until day 90
   - Delete the risk record

2. Why name an accountable approver?
   - Risk acceptance is a decision within authority, not an ownerless technical note
   - It guarantees no incident
   - It replaces compensating controls

3. When is acceptance invalid as a strategy?
   - Impact exceeds tolerance and no credible controls or retirement path exist
   - A migration needs two sprints
   - The record has an ID

4. Which current architecture exception has no expiry or evidence trigger?
5. Who has authority to accept its residual risk, and what compensating control is observable?

<details><summary>Answer key — attempt first</summary>

1. Reassess immediately because the evidence trigger changed. Expiry is the latest review, not protection from material change.

2. Risk acceptance is a decision within authority, not an ownerless technical note. Someone must own the residual-risk decision.

3. Impact exceeds tolerance and no credible controls or retirement path exist. Acceptance cannot manufacture tolerability.

</details>

## Sources

- [AWS Managed Services Advanced User Guide: risk acceptance validity and review](https://docs.aws.amazon.com/pdfs/managedservices/latest/userguide/ams-ug.pdf) — Version May 12, 2026; checked 2026-10-28.
- [NIST RMF Authorize step](https://csrc.nist.gov/Projects/risk-management/about-rmf/authorize-step) — Updated July 24, 2026; checked 2026-10-28.
