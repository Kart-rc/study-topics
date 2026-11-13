# An exception without an owner and review date is a second standard

Distinguished Engineer · Day53 · 15 minutes

Let teams deviate deliberately while making the risk, compensating control, owner, and exit decision visible.

## Recall (2 minutes)

<p><a href="../Day30/distinguished-engineer.html">Day30: An operational-readiness review is evidence, residual risk, and owners</a></p><p>The restore checkbox is empty. What should the ORR record?</p><details><summary>Recall first, then reveal the refresher</summary><p>Residual risk, owner, due date, and launch decision. A backup is not restore evidence; unresolved risk must stay visible.</p></details><p><a href="../Day34/distinguished-engineer.html">Day34: Let the data plane keep working when the control plane is sick</a></p><p>The control plane is down but data nodes have valid version 17. Desired behavior?</p><details><summary>Recall first, then reveal the refresher</summary><p>Continue existing traffic on version 17 and block management changes. Static stability preserves known-good service while management is impaired.</p></details>

## Understand (4 minutes)

A building code can allow a temporary alternate fire exit during renovation. It must name who owns the risk, what keeps people safe today, and when the arrangement is reviewed. A handwritten note saying “special case” is not governance.

Architecture standards need an exception path because real constraints differ. But an exception without evidence becomes permanent divergence. Record the requirement, business reason, risk, compensating control, accountable owner, review date, and explicit outcome: renew, remediate, or retire.



Team orders-52 cannot adopt the standard workload-identity library before a vendor deadline. It requests 60 days using a rotated secret plus restricted network access. The platform security owner reviews evidence on day 30 and the exception expires on day 60 unless renewed.



## Read the visual

Four linked evidence tiles turn a deviation into a decision record; removing any tile visibly converts it into an unmanaged parallel standard.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use an exception process when a mandatory platform standard conflicts with a time-bound business, vendor, regulatory, or technical constraint.

**Practical example.** A legacy batch agent cannot yet use OIDC but must continue a regulated month-end process.

**How to decide.** Approve only when the deviation is explicit, bounded, owned, monitored, and safer than stopping the outcome. Reject open-ended convenience exceptions; change the standard itself when many teams need the same deviation.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
exception={'owner':'orders-platform','days':60,'control':'rotate secret weekly'}
exception['review_day']=30; exception['evidence']=['secret age','denied network attempts']
today=31; evidence_current=True; decision='continue-to-expiry' if evidence_current else 'revoke'
result={'owned':bool(exception['owner']),'bounded':exception['days']<90,'reviewed':today>=exception['review_day'],'decision':decision}
```

1. Create a bounded exception with ownership and a compensating control.

   Changed values: `{"exception": {"owner": "orders-platform", "days": 60, "control": "rotate secret weekly"}}`

2. Define when and how risk will be reviewed.

   Changed values: `{"exception": {"owner": "orders-platform", "days": 60, "control": "rotate secret weekly", "review_day": 30, "evidence": ["secret age", "denied network attempts"]}}`

3. Make an explicit review decision from current evidence.

   Changed values: `{"today": 31, "evidence_current": true, "decision": "continue-to-expiry"}`

4. Expose the conditions that keep the deviation governable.

   Changed values: `{"result": {"owned": true, "bounded": true, "reviewed": true, "decision": "continue-to-expiry"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model is an original governance checklist. It does not approve security risk, calculate regulatory exposure, replace counsel or risk officers, enforce cloud controls, or prove that all required evidence is present.

## Explore (remaining exploration time)

Add or remove an owner, compensating control, and review date. Predict whether the exception is governable or merely hidden divergence.

Open distinguished-engineer.html for the executable model.

Model limits: The model is an original governance checklist. It does not approve security risk, calculate regulatory exposure, replace counsel or risk officers, enforce cloud controls, or prove that all required evidence is present.

## Quiz (4 minutes)

1. orders-52 has a business reason but no owner. What is missing?
   - Someone accountable for evidence, review, and closure
   - A longer exception period
   - A second undocumented secret

2. Why add an expiry date?
   - It forces a new decision with current evidence
   - It guarantees remediation by itself
   - It removes the need for compensating controls

3. When should leaders reconsider the standard itself?
   - When many independent teams need the same justified exception
   - Whenever one team dislikes it
   - Only after an incident

4. Which current platform exception lacks a named closure decision?
5. At what repeat rate would you change the standard or paved road instead of renewing exceptions?

<details><summary>Answer key — attempt first</summary>

1. Someone accountable for evidence, review, and closure. Unowned risk tends to survive because nobody must decide its outcome.

2. It forces a new decision with current evidence. Expiry does not solve the risk; it prevents silent indefinite acceptance.

3. When many independent teams need the same justified exception. Repeated exceptions can reveal that the standard or paved road no longer fits reality.

</details>

## Sources

- [AWS Well-Architected OPS02-BP05: requests for changes and exceptions](https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/ops_ops_model_req_add_chg_exception.html) — Official AWS guidance; checked November 13, 2026; checked 2026-11-13.
- [AWS Well-Architected: manage responsibilities and ownership](https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/ops_ops_model_def_responsibilities_ownership.html) — Official AWS guidance; checked November 13, 2026; checked 2026-11-13.
- [AWS Well-Architected Tool: improving your workload](https://docs.aws.amazon.com/wellarchitected/latest/userguide/improving-your-workload.html) — Official AWS guidance; checked November 13, 2026; checked 2026-11-13.
