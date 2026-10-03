# Same logic, new surface: metamorphic tests for an LLM

GenAI engineering · Day13 · 15 minutes

Catch brittle reasoning by transforming a case without changing its logic, then checking whether the model's judgment stays the same.

## Recall (2 minutes)

<p><a href="../Day8/genai-engineering.html">Day8: MCP tool annotations: risk vocabulary, not a security boundary</a></p><p>An unknown MCP server marks a tool readOnlyHint=true. What may a secure client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The hint is untrusted; enforce permissions and use the cautious path. The specification requires clients to treat annotations from untrusted servers as untrusted.</p></details><p><a href="../Day10/genai-engineering.html">Day10: Valid tool input can still be the wrong action</a></p><p>A100 / 25 cents passes the schema. Why is it blocked?</p><details><summary>Recall first, then reveal the refresher</summary><p>The amount does not match the requested $25. 25 is a valid positive integer, but it means $0.25. The trusted request is 2500 cents; schema validity does not establish intent.</p></details>

## Understand (4 minutes)

A calculator should still return 4 if you rename a local variable from x to total. An LLM reasoning system should also survive a change that preserves meaning.

Start with: “Every gold order needs review. O42 is gold. Therefore O42 needs review.” Now rename O42 to O77 everywhere. The wording changes, but the logic does not. The expected judgment should remain ENTAILS.

Source caseGold(O42) → Review(O42)

Safe transformRename O42 → O77 everywhere

Required relationsame judgment

This is a metamorphic test. Instead of needing a fresh answer label for every generated case, the harness checks a relation between outputs.



The source receives ENTAILS. The renamed case receives CONTRADICTS. The harness raises a violation because the outputs should match.

violation = outputs["source"] != outputs["renamed"]

The important work is proving the transform preserves meaning. Replacing “gold” with “valuable” may sound similar but is not a formal equivalence. A failure after a drifting transform is a bad test, not evidence of a bad model.

The 2026 LGMT paper derives transformations from first-order-logic equivalences and reports experiments across six LLMs. Treat its measured findings as research claims from that evaluation, not universal production rates.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
source = "Gold(O42); Gold(x) -> Review(x); query Review(O42)"
source_label = "ENTAILS"
renamed = source.replace("O42", "O77")
expected_relation = "same label"
candidate_outputs = {"source": source_label, "renamed": "CONTRADICTS"}
violation = candidate_outputs["source"] != candidate_outputs["renamed"]
```

1. Record one source case and its candidate judgment.

   Changed values: `{"source": "Gold(O42); Gold(x) -> Review(x); query Review(O42)", "source_label": "ENTAILS"}`

2. Rename the symbol everywhere; the logical structure stays the same.

   Changed values: `{"renamed": "Gold(O77); Gold(x) -> Review(x); query Review(O77)", "expected_relation": "same label"}`

3. Use synthetic candidate outputs so the lesson can demonstrate a failure without calling an LLM.

   Changed values: `{"candidate_outputs": {"source": "ENTAILS", "renamed": "CONTRADICTS"}}`

4. The labels differ, so the harness reports an invariant violation.

   Changed values: `{"violation": true}`

[Full runnable example](examples/genai-engineering.py).

Limits: Executes string replacement and compares synthetic recorded labels. It does not run an LLM or prove that arbitrary natural-language rewrites preserve semantics.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>The useful unit in an agent harness is <em>source case + transformation + expected relation + evidence</em>. Version all four. Relations can require equality, monotonicity, or bounded change, but each needs a task-specific reason.</p>

</details>

## Explore (remaining exploration time)

Choose a semantics-preserving transformation and decide whether the synthetic candidate stays consistent. This lab does not call a model.

Open genai-engineering.html for the executable model.

Model limits: A deterministic harness over recorded labels, not live LLM inference and not an implementation of LGMT. It demonstrates output-relation checking. Production use needs validated transformations, repeated sampling where applicable, model/version capture, and human review of suspected semantic drift.

## Quiz (4 minutes)

1. The identifier is renamed consistently everywhere. What should happen to the entailment label?
   - It should stay the same
   - It must flip
   - The case must be deleted

2. Why can a metamorphic test work without a new answer key for every follow-up?
   - It checks a required relation between outputs
   - It assumes every model answer is correct
   - It disables evaluation

3. What is the largest testing risk in this toy?
   - The transform may accidentally change the meaning
   - The output strings are too short
   - The source uses an order ID

4. Design one meaning-preserving transform for a production agent task and state the expected output relation.
5. How would you distinguish a model defect from a transform that changed task semantics?

<details><summary>Answer key — attempt first</summary>

1. It should stay the same. A consistent symbol rename preserves the logical structure, so the relation requires the same judgment.

2. It checks a required relation between outputs. The oracle is the relation—such as equality—not a separately labeled answer for every generated case.

3. The transform may accidentally change the meaning. If semantics drift, an output change may be correct. Transform validation is part of the harness contract.

</details>

## Sources

- [LGMT: Logic-Grounded Metamorphic Testing for evaluating the reasoning reliability of LLMs](https://www.sciencedirect.com/science/article/pii/S0950705126010506) — Knowledge-Based Systems 348, article 116324; 2026-08-03; checked 2026-10-03.
- [LGMT preprint](https://arxiv.org/abs/2605.23965) — Submitted 2026-05-12; checked 2026-10-03.
