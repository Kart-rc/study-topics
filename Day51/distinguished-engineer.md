# Start another initiative only when one leaves the system

Distinguished Engineer · Day51 · 15 minutes

Use a portfolio WIP control to expose priority conflicts and finish cross-team platform work.

## Recall (2 minutes)

<p><a href="../Day29/distinguished-engineer.html">Day29: Stop starting six migrations; finish two</a></p><p>What is the primary purpose of a WIP limit?</p><details><summary>Recall first, then reveal the refresher</summary><p>Improve flow and finish evidence. Finishing creates feedback and frees the bottleneck.</p></details><p><a href="../Day33/distinguished-engineer.html">Day33: A shared quota is a shared failure domain</a></p><p>Finance stays at 350 while ML rises to 750 under a 1,000 quota. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Combined demand exceeds the shared ceiling by 100. Shared limits couple otherwise unrelated demand.</p></details>

## Understand (4 minutes)

Opening ten restaurant orders at once does not make ten meals arrive sooner. It fills every counter with half-finished plates.

Work in progress (WIP) is work that has started but is not finished. An explicit WIP control creates a pull rule: start another initiative only when capacity becomes visible. At Distinguished Engineer scope, this makes executive priority trade-offs concrete across teams instead of hiding them inside multitasking.



Your platform portfolio has four active slots: lineage, schema contracts, Airflow migration, and cost controls. A fifth request—real-time quality—arrives. Starting it immediately would split specialists across five partially delivered outcomes. The pull rule asks leaders to finish, stop, or explicitly expedite one item first.



## Read the visual

A capacity gate subtracts finished initiatives from active WIP and opens a new slot only when the portfolio falls below its explicit control.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a portfolio WIP control when critical engineers are spread across many initiatives and cycle time grows while everything remains 'in progress.'

**Practical example.** Limit cross-team data-platform initiatives to four active outcomes, with one explicit expedite policy for regulatory work.

**How to decide.** Choose a control that reflects the actual shared bottleneck, not an arbitrary team count. Make exceptions visible and review item age; a WIP number without finish policies or leadership trade-offs becomes theater.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
active=['lineage','contracts','airflow','cost']
wip_control=4; incoming='realtime-quality'
can_pull=len(active)<wip_control
result={'active':len(active),'incoming':incoming,'can_pull':can_pull,'decision':'finish-or-stop-one-first' if not can_pull else 'start'}
```

1. List four started but unfinished platform outcomes.

   Changed values: `{"active": ["lineage", "contracts", "airflow", "cost"]}`

2. Set the portfolio control and receive another request.

   Changed values: `{"wip_control": 4, "incoming": "realtime-quality"}`

3. Apply the normal pull rule before starting new work.

   Changed values: `{"can_pull": false}`

4. Make the priority trade-off visible rather than silently multitask.

   Changed values: `{"result": {"active": 4, "incoming": "realtime-quality", "can_pull": false, "decision": "finish-or-stop-one-first"}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: The arithmetic model treats initiatives as equal slots. It omits skill mix, dependencies, uncertainty, urgency, item size, service-level expectations, funding, morale, and probabilistic throughput. WIP control informs a decision; it does not choose strategy.

## Explore (remaining exploration time)

Change active work, the WIP control, and completions. Predict whether a new initiative can be pulled.

Open distinguished-engineer.html for the executable model.

Model limits: The arithmetic model treats initiatives as equal slots. It omits skill mix, dependencies, uncertainty, urgency, item size, service-level expectations, funding, morale, and probabilistic throughput. WIP control informs a decision; it does not choose strategy.

## Quiz (4 minutes)

1. Four initiatives occupy a four-item control. A fifth request arrives. What is the default?
   - Do not start it until capacity is freed or an explicit exception changes the system
   - Start it but hide it from the board
   - Split every engineer equally

2. Why use portfolio-level WIP rather than only team boards?
   - The shared specialist and decision bottlenecks cross team boundaries
   - It guarantees every initiative is the same size
   - It removes executive prioritization

3. What makes the control misleading?
   - Ignoring item age, skill bottlenecks, and explicit exception policy
   - Showing finished work
   - Reducing active work

4. Which shared specialist is the real portfolio bottleneck today?
5. What exception can bypass the WIP control, and who must make that trade-off visible?

<details><summary>Answer key — attempt first</summary>

1. Do not start it until capacity is freed or an explicit exception changes the system. A pull system starts work only when capacity is visible.

2. The shared specialist and decision bottlenecks cross team boundaries. The control exposes cross-team contention.

3. Ignoring item age, skill bottlenecks, and explicit exception policy. A slot count alone cannot model the full delivery system.

</details>

## Sources

- [The Kanban Guide — May 2025](https://kanbanguides.org/the-kanban-guide/) — Official minimal Kanban reference; checked November 11, 2026; checked 2026-11-11.
- [Open Guide to Kanban — July 2025](https://kanbanguides.org/open-guide-to-kanban/2025.7/) — Official expanded guide; checked November 11, 2026; checked 2026-11-11.
