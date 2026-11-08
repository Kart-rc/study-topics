# Measure decision wait separately from engineering work

Distinguished Engineer · Day48 · 15 minutes

Expose decision latency so adding engineers does not hide an authorization or governance queue.

## Recall (2 minutes)

<p><a href="../Day33/distinguished-engineer.html">Day33: A shared quota is a shared failure domain</a></p><p>Finance stays at 350 while ML rises to 750 under a 1,000 quota. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Combined demand exceeds the shared ceiling by 100. Shared limits couple otherwise unrelated demand.</p></details><p><a href="../Day5/distinguished-engineer.html">Day5: Dependency isolation: spend concurrency by failure domain</a></p><p>A dependency&#x27;s latency rises tenfold while arrival rate stays fixed. What happens to its concurrency demand?</p><details><summary>Recall first, then reveal the refresher</summary><p>It rises roughly tenfold. Little&#x27;s Law links in-flight work to rate times time.</p></details>

## Understand (4 minutes)

A mechanic needs two hours to repair a car but waits five days for the insurer's approval. Hiring a second mechanic does not shorten this repair.

Decision latency is elapsed time from a decision request to an authorized choice. Separate it from active analysis and implementation. Long wait often signals unclear decision rights, missing evidence, an oversized approval forum, or no escalation path.



A schema exception takes 30 minutes to analyze, 72 hours waiting for the architecture council, and two hours to implement. The lead time is 74.5 hours; 96% is decision wait. A pre-authorized rule for reversible changes can remove most of that wait without weakening governance for high-blast-radius decisions.



## Read the visual

A proportional timeline makes a 72-hour authorization queue dwarf 2.5 hours of work. Moving either slider shows which intervention actually changes lead time.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a decision-latency measure when cross-team delivery repeatedly waits for approvals, architecture calls, security exceptions, or ownership clarification.

**Practical example.** A data contract change is ready Tuesday but waits until the next weekly council despite being backward compatible and reversible.

**How to decide.** Classify by reversibility and blast radius, define the authorized decider and evidence needed, set an escalation timer, and preserve a slower path for irreversible or regulated decisions.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
analysis=.5; decision_wait=72; implementation=2
lead_time=analysis+decision_wait+implementation
wait_share=round(decision_wait/lead_time,3)
result={'lead_time_hours':lead_time,'decision_wait_share':wait_share}
```

1. Separate active work from waiting.

   Changed values: `{"analysis": 0.5, "decision_wait": 72, "implementation": 2}`

2. Calculate end-to-end elapsed time.

   Changed values: `{"lead_time": 74.5}`

3. Find the dominant component.

   Changed values: `{"wait_share": 0.966}`

4. Target the queue supported by evidence.

   Changed values: `{"result": {"lead_time_hours": 74.5, "decision_wait_share": 0.966}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The model uses three deterministic intervals. It does not measure decision quality, regulatory obligations, rework, parallel work, uncertainty, stakeholder discovery, or the value of deliberate review.

## Explore (remaining exploration time)

Move hours between analysis, decision wait, and implementation; see which improvement changes end-to-end lead time most.

Open distinguished-engineer.html for the executable model.

Model limits: The model uses three deterministic intervals. It does not measure decision quality, regulatory obligations, rework, parallel work, uncertainty, stakeholder discovery, or the value of deliberate review.

## Quiz (4 minutes)

1. Why measure decision wait separately?
   - It identifies a governance queue that more implementers may not change
   - It proves every review is waste
   - It replaces decision quality

2. Which decision can use a faster path?
   - A reversible, low-blast-radius change with predefined evidence
   - Every regulated irreversible change
   - A choice with no owner

3. What must a fast path retain?
   - Authorized decision rights, evidence, and escalation
   - Anonymous approval
   - No audit trail

4. Which recurring decision in your organization spends more time waiting than being analyzed?
5. What evidence and decision right would make a safe fast path possible?

<details><summary>Answer key — attempt first</summary>

1. It identifies a governance queue that more implementers may not change. Separate components make the actual delay visible.

2. A reversible, low-blast-radius change with predefined evidence. Decision process should match risk and reversibility.

3. Authorized decision rights, evidence, and escalation. Speed comes from predefinition, not from removing accountability.

</details>

## Sources

- [AWS Well-Architected: evaluate tradeoffs](https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/ops_priorities_eval_tradeoffs.html) — Official AWS guidance on decision governance and burdensome processes; checked November 8, 2026; checked 2026-11-08.
- [AWS architectural decision records guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/) — Official AWS Prescriptive Guidance; checked November 8, 2026; checked 2026-11-08.
- [AWS program governance](https://docs.aws.amazon.com/prescriptive-guidance/latest/oca-framework-mobilize-team/program-governance.html) — Official AWS guidance on decision rights and escalation; checked November 8, 2026; checked 2026-11-08.
