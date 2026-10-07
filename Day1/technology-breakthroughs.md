# ToolGrad: build the answer path first

Technology breakthroughs · Day1 · 15 minutes

A training example asks an assistant to repair a pipeline, but its tools can only read data.

## Recall (2 minutes)

<p>No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.</p>

## Understand (4 minutes)

A training example asks an assistant to repair a pipeline, but its tools can only read data. That example cannot be completed, however fluent its wording.

ToolGrad explores building tool-use examples from an executable path first. Start with what the tools can actually do, connect their inputs and outputs, then write a matching request. A valid path is useful training material, but it may overrepresent easy tasks.



Our incident assistant can list datasets, fetch freshness for one returned ID, and explain the result. It cannot repair a job. Watch the dataset ID move through this small chain before deciding which user request the chain supports.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Consider this research approach when building synthetic tool-use training examples and many generated requests cannot be completed with the tools available. Start with a small offline experiment using sandbox tools.

**Practical example.** A data-incident assistant can list datasets, fetch freshness for a returned ID, and explain the measurement. Build and check that chain first, then write a matching request about the demo dataset’s 18-minute delay. A request to repair the pipeline would require a tool the assistant does not have.

**How to decide.** Compare generated examples against independent, human-written tasks. For a few fixed workflows, manually authored examples may be simpler. Successful chains do not establish coverage or production readiness; include unsupported requests and failure cases in evaluation.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
datasets = ["demo-orders", "demo-payments"]
selected = datasets[0]
freshness = {"demo-orders": {"delay_minutes": 18}}
measurement = freshness[selected]
answer = selected + " is " + str(measurement["delay_minutes"]) + " minutes late"
supported_request = "Explain the late dataset"
```

1. The first tool returns available identifiers.

   Changed values: `{"datasets": ["demo-orders", "demo-payments"]}`

2. Choose an ID that actually exists.

   Changed values: `{"selected": "demo-orders"}`

3. A synthetic tool fixture contains a measured delay.

   Changed values: `{"freshness": {"demo-orders": {"delay_minutes": 18}}}`

4. The next tool receives the returned ID.

   Changed values: `{"measurement": {"delay_minutes": 18}}`

5. The explanation uses the returned measurement.

   Changed values: `{"answer": "demo-orders is 18 minutes late"}`

6. This request matches the available read-only chain.

   Changed values: `{"supported_request": "Explain the late dataset"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This executes fixture lookups, not ToolGrad training or live tools. It demonstrates input/output dependency, not the paper’s quality gains or task coverage.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Tool-use training needs pairs: a user request and a valid sequence of tool operations. ToolGrad reverses a common generation order. It develops a working tool chain, then creates the matching request. Its loop proposes candidate APIs, executes them, selects a useful extension based on feedback, and updates the example. Here “textual gradients” refers to descriptive feedback guiding refinement, not ordinary numerical backpropagation through API calls. <a href="https://research.google/blog/toolgrad-efficient-tool-use-dataset-generation-with-textual-gradients/">Google’s September 10, 2026 report</a>.</p><p>The paper was initially submitted in August 2025 and revised in June 2026; the September article is a later research write-up. The authors report efficient generation and benchmark gains. These results motivate an experiment, not a conclusion that arbitrary enterprise agent tasks are solved. <a href="https://arxiv.org/abs/2508.04086">Versioned paper and artifacts</a>.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> Build synthetic examples for a data-incident assistant. Available functions are listDatasets, fetchFreshness(datasetId), and explainDelay(measurement). A valid chain lists datasets, uses a returned identifier to fetch freshness, then explains the returned measurement. A corresponding request could ask which monitored dataset is late and why.</p><p>Starting with “repair every broken pipeline” may create an impossible example when no repair tool exists. Starting with an executable chain reduces that mismatch. But it introduces another risk: the generated requests may cluster around what is easy to execute. A dataset can be perfectly valid and still omit difficult, frequent user needs.</p><p>For a pilot, compare two equally funded generation approaches. Hold out a human-written set of realistic incident tasks before generating either dataset. Measure correct task outcomes, tool-argument validity, unsupported-action refusal, and coverage across tool families. Separate training and evaluation cases by underlying workflow, not just paraphrased request text.</p><p>My recommendation for the fictional incident assistant is a small offline experiment with sandbox tools. Do not train on production identifiers, incident secrets, or unreviewed generated “repairs.” This model teaches dependency validity; it does not reproduce ToolGrad’s reported performance.</p>

</details>

## Explore (remaining exploration time)

Try explainDelay first, then build the valid chain. Predict which state field each call consumes and produces. Write one task that these three tools cannot satisfy, and explain how a training set of only successful chains could hide that limitation.

Open technology-breakthroughs.html for the executable model.

Model limits: The local JavaScript uses deterministic mock tools and synthetic values to enforce dependencies. It has no proposer model, training loop, real APIs, or learned selector. It illustrates the answer-first idea without claiming to implement or benchmark ToolGrad.

## Quiz (4 minutes)

1. Why construct a valid chain before its request?
   - To guarantee all user needs are covered
   - To ground the generated request in executable operations
   - To avoid execution checks

2. Every generated chain runs. Is the dataset sufficient?
   - Yes
   - Only if it is large
   - No; task coverage and outcome correctness remain open

3. Which evaluation split better tests transfer?
   - Hold out underlying workflows and realistic tasks
   - Paraphrase training requests
   - Evaluate only successful training chains

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. To ground the generated request in executable operations. It reduces request/solution mismatch, while coverage still needs independent evaluation.

2. No; task coverage and outcome correctness remain open. Execution validity does not establish representative user intent or correct outcomes.

3. Hold out underlying workflows and realistic tasks. Paraphrases can leak workflow structure. Independent tasks reveal coverage and generalization gaps.

</details>

## Sources

- [Google Research: ToolGrad](https://research.google/blog/toolgrad-efficient-tool-use-dataset-generation-with-textual-gradients/) — 2026-09-10; checked 2026-09-21.
- [ToolGrad paper](https://arxiv.org/abs/2508.04086) — Initial 2025-08-06; revised 2026-06-17; checked 2026-09-21.
