# Reset the world between trials: isolate agent evaluations

GenAI engineering · Day18 · 15 minutes

Prevent a previous trial from making the next agent look better than it is.

## Recall (2 minutes)

<p><a href="../Day9/genai-engineering.html">Day9: Eval leakage: keep a set the prompt never studied</a></p><p>Why can a dev-set score rise without deployment quality improving?</p><details><summary>Recall first, then reveal the refresher</summary><p>The harness may have memorized visible cases through targeted prompt and tool changes. Repeatedly fixing known cases optimizes the test surface as well as the underlying behavior.</p></details><p><a href="../Day3/genai-engineering.html">Day3: MCP OAuth: bind the token to the server, then mint a new upstream credential</a></p><p>A client presents aud=storage.api to catalog.example. What should strict validation do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject because the token was not issued for the MCP server. The MCP server validates that it is the intended audience; a downstream audience is not interchangeable.</p></details>

## Understand (4 minutes)

A cooking test is unfair if one candidate finds the previous candidate’s finished meal in the oven. Agent evaluations have the same problem: files, database rows or cached results can survive from an earlier run. Starting a new chat does not necessarily clear the tools’ environment.

An evaluation harness should give each trial a known starting state. Here the task is “create report.csv from orders.csv.” The grader checks whether the correct report exists. Trial A creates it. Trial B is a no-op agent: it does nothing. Reusing A’s directory lets B pass without doing the task.



Our fixture contains only orders.csv with values 20 and 30. A writes report.csv with 50. B writes nothing. A clean copy before B means the report is absent and B fails. A reused directory means the correct report remains and the naive outcome grader passes B.

The failure is in the experiment, not in the arithmetic. Reset both visible files and hidden tool state that can affect outcomes. A separate output directory per trial is a start; also consider database namespaces, caches, environment variables and external side effects.



## Read the visual

The trial matrix keeps the task and no-op action fixed while changing only the initial files. The inherited report explains the false pass.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this whenever agent trials can read or modify a filesystem, database or service fixture.

**Practical example.** Compare two report-writing harness versions on identical synthetic order files, with separate workspace IDs and a reset manifest.

**How to decide.** Use fresh fixtures and verify the starting state. If a shared external service cannot be reset, namespace resources and record that remaining limitation.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
fixture = {"orders.csv": [20, 30]}
workspace_a = dict(fixture)
workspace_a["report.csv"] = sum(workspace_a["orders.csv"])
reused_b = dict(workspace_a)
reused_pass = reused_b.get("report.csv") == 50
fresh_b = dict(fixture)
fresh_pass = fresh_b.get("report.csv") == 50
```

1. A receives the baseline fixture; no report exists.

   Changed values: `{"fixture": {"orders.csv": [20, 30]}, "workspace_a": {"orders.csv": [20, 30]}}`

2. A writes the answer. A no-op B passes if it inherits this state.

   Changed values: `{"workspace_a": {"orders.csv": [20, 30], "report.csv": 50}, "reused_b": {"orders.csv": [20, 30], "report.csv": 50}, "reused_pass": true}`

3. A fresh B has no report and correctly fails this outcome check.

   Changed values: `{"fresh_b": {"orders.csv": [20, 30]}, "fresh_pass": false}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executed Python dictionaries model file names and values; no model calls or actual filesystem sandbox. Nested fixture data is never mutated in this example.

## Explore (remaining exploration time)

Predict the no-op agent’s result after A. Switch from a reused workspace to a fresh copy and inspect which file survives.

Open genai-engineering.html for the executable model.

Model limits: The browser executes a two-dictionary JavaScript fixture model. The Python replay is also synthetic. No LLM runs, no actual sandbox is provisioned, and the example does not measure real agent capability.

## Quiz (4 minutes)

1. B does nothing but inherits A’s correct report. What does the naive grader say?
   - Pass
   - Fail because it knows who wrote it
   - No trial ran

2. Which fixes this specific contamination?
   - Start a new chat only
   - Create a verified fresh tool workspace for B
   - Raise the score threshold

3. Fresh local directories alone prove what?
   - All remote side effects are isolated
   - The model is production-ready
   - Only that local directory reuse is addressed

4. Name three stateful tool surfaces your harness must reset or namespace.
5. How would you detect a contaminated starting fixture before invoking the agent?

<details><summary>Answer key — attempt first</summary>

1. Pass. An existence/content-only grader sees the old correct file and passes. It has no provenance information.

2. Create a verified fresh tool workspace for B. The contaminated state is in the tool workspace. A new conversation or threshold does not remove the file.

3. Only that local directory reuse is addressed. Remote services, shared caches and databases may still leak state. Validate each stateful boundary.

</details>

## Sources

- [Anthropic: demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — 2026-01-09; checked 2026-10-08.
