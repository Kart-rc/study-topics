# Compare candidates on the same cases

GenAI engineering · Day25 · 15 minutes

Build a paired agent evaluation so case difficulty cannot masquerade as a model improvement.

## Recall (2 minutes)

<p><a href="../Day21/genai-engineering.html">Day21: Freeze the tool catalog: schema drift can impersonate model drift</a></p><p>Same prompt/model, different tool hash, lower score. First conclusion?</p><details><summary>Recall first, then reveal the refresher</summary><p>Comparison is confounded. The harness changed with the measured outcome.</p></details><p><a href="../Day9/genai-engineering.html">Day9: Eval leakage: keep a set the prompt never studied</a></p><p>Why can a dev-set score rise without deployment quality improving?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness may have memorized visible cases through targeted prompt and tool changes. Repeatedly fixing known cases optimizes the test surface as well as the underlying behavior.</p></details>

## Understand (4 minutes)

If two runners use different tracks, the faster time may come from the track. Agent candidates have the same problem: a new prompt tested on easier cases can look better by accident.

A paired eval runs baseline A and candidate B on the same case, reset from the same starting state. Record A win, B win, tie, or both fail. Inspect disagreements; the average alone hides which behavior changed.



On five support cases, A passes 3 and B passes 4. The paired table reveals B wins two cases, A wins one, and two tie. The net is +1 case—not “B is 33% better.” Re-run with more representative cases and stable graders.



## Read the visual

Each column is one frozen case. Read down the case before comparing totals: green is a candidate-only success, red is a baseline-only success, and neutral is a tie.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use paired evaluations before changing a model, prompt, tool schema, retrieval policy or harness limit.

**Practical example.** Compare an existing support agent with a new tool-routing prompt on the same frozen tickets and sandbox snapshots.

**How to decide.** Pair cases and initial state when the question is “did this change help?” Use separate holdouts to detect overfitting and human review for consequential disagreements.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
A=[1,1,0,0,1]
B=[1,0,1,1,1]
b_wins=sum(a==0 and b==1 for a,b in zip(A,B))
a_wins=sum(a==1 and b==0 for a,b in zip(A,B))
net=b_wins-a_wins
```

1. Store outcomes for the same five cases in the same order.

   Changed values: `{"A": [1, 1, 0, 0, 1], "B": [1, 0, 1, 1, 1]}`

2. Count cases improved by B.

   Changed values: `{"b_wins": 2}`

3. Count regressions where A wins.

   Changed values: `{"a_wins": 1}`

4. Net paired wins summarizes direction without claiming significance.

   Changed values: `{"net": 1}`

[Full runnable example](examples/genai-engineering.py).

Limits: The browser counts binary synthetic outcomes. It does not call a model, run tools, estimate statistical significance, validate grader quality, or prevent contamination. Paired results are evidence, not automatic shipping authority.

## Explore (remaining exploration time)

Toggle baseline and candidate outcomes for five cases. Watch wins, losses, ties and net change update.

Open genai-engineering.html for the executable model.

Model limits: The browser counts binary synthetic outcomes. It does not call a model, run tools, estimate statistical significance, validate grader quality, or prevent contamination. Paired results are evidence, not automatic shipping authority.

## Quiz (4 minutes)

1. Why run A and B on the same cases?
   - To remove case-mix difficulty as an explanation
   - To guarantee significance
   - To eliminate grader errors

2. A passes 3/5 and B passes 4/5. What is still essential?
   - Inspect the paired disagreements
   - Declare a 33% improvement
   - Delete the baseline

3. What must reset between candidate runs?
   - Only the UI color
   - Tool/data state that could leak prior effects
   - The case ID

4. Which mutable tools or stores must your harness reset for a fair pair?
5. What disagreement would block deployment even if B wins overall?

<details><summary>Answer key — attempt first</summary>

1. To remove case-mix difficulty as an explanation. Pairing controls which scenario each candidate sees.

2. Inspect the paired disagreements. The same aggregate can hide very different wins and regressions.

3. Tool/data state that could leak prior effects. Shared mutable state can give the second candidate an unfair advantage.

</details>

## Sources

- [OpenAI evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices) — Living documentation; checked 2026-10-15.
- [OpenAI Evals guide](https://platform.openai.com/docs/guides/evals) — Living documentation; checked 2026-10-15.
- [OpenAI Graders API](https://platform.openai.com/docs/api-reference/graders) — Living API reference; checked 2026-10-15.
