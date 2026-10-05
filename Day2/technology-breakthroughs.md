# Retrieve-for-Train: optimize the set, then move work offline

Technology breakthroughs · Day2 · 15 minutes

An assistant retrieves three documents, but two repeat the same freshness evidence.

## Recall (2 minutes)

<p><a href="../Day1/technology-breakthroughs.html">Day1: ToolGrad: build the answer path first</a></p><p>Why construct a valid chain before its request?</p><details><summary>Recall first, then reveal the refresher</summary><p>To ground the generated request in executable operations. It reduces request/solution mismatch, while coverage still needs independent evaluation.</p></details>

## Understand (4 minutes)

An assistant retrieves three documents, but two repeat the same freshness evidence. The result looks relevant while missing lineage information needed to explain the incident.

Retrieve-for-Train studies learning retrieval sets that work well together. Our small example uses a simpler rule: reward relevant items, then add a bonus for a kind of evidence not selected yet. This makes the difference between ranking one item and choosing a useful set visible.



After choosing freshness A, freshness B has relevance 0.89 and lineage has 0.75. A new-facet bonus of 0.20 raises lineage to 0.95. The second choice changes because freshness is already represented.




## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
selected_facets = ["freshness"]; bonus = 0.20
candidates = [("freshness B", "freshness", 0.89), ("lineage", "lineage", 0.75)]
scores = {name: relevance + (bonus if facet not in selected_facets else 0) for name, facet, relevance in candidates}
winner = max(scores, key=scores.get)
without_bonus = max(candidates, key=lambda item: item[2])[0]
```

1. The first result already covers freshness.

   Changed values: `{"selected_facets": ["freshness"], "bonus": 0.2}`

2. Compare a repeated facet with a new one.

   Changed values: `{"candidates": [["freshness B", "freshness", 0.89], ["lineage", "lineage", 0.75]]}`

3. Only new facets receive the bonus.

   Changed values: `{"scores": {"freshness B": 0.89, "lineage": 0.95}}`

4. Lineage wins at 0.95 over 0.89.

   Changed values: `{"winner": "lineage"}`

5. Without the bonus, freshness B wins.

   Changed values: `{"without_bonus": "freshness B"}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This two-candidate illustration is not the paper’s training algorithm. Diversity can select irrelevant evidence unless relevance and permission constraints also hold. A facet label is not proof of factual support.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>Some retrieval tasks need a complementary set rather than several near-duplicates. Retrieve-for-Train (R4T) uses offline reinforcement learning to train a fan-out language model against set-level rewards, synthesizes training pairs, then trains a compact diffusion retriever. The serving model generates target embeddings without repeating the same language-model fan-out reasoning at query time. <a href="https://research.google/blog/bypassing-inference-bottlenecks-accelerating-complex-ai-search-with-retrieve-for-train/">Google Research's September 15, 2026 write-up</a>.</p><p>The underlying paper was submitted March 6, 2026. It reports retrieval-quality improvements and lower query-time fan-out latency on fashion and music benchmarks. This is research evidence about those settings, not proof of faster or safer enterprise incident diagnosis. <a href="https://arxiv.org/abs/2603.06397">Read the original paper</a>.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> Ask a data-platform assistant for evidence explaining a late dataset. Its candidate list contains two highly relevant freshness reports, followed by volume, lineage, and contract evidence. Selecting only the highest independent relevance scores can spend the entire result budget on the same facet.</p><p>Our six-item toy collection is visible below. A greedy selector gives each new facet a bonus. At bonus 0, the three selected items are freshness A, freshness B, and volume. At bonus 0.2, the set becomes freshness A, volume, and lineage. You traded a little average item relevance for broader evidence coverage.</p><p>The teaching algorithm is deliberately simple:</p><pre>candidateScore = relevance
               + noveltyBonus × isNewFacet
choose highest scoring eligible candidate
repeat until three results are selected</pre><p>This is <em>not</em> R4T's learning algorithm. It exposes the objective that makes set-level training interesting. A relevance floor prevents an unrelated item from winning merely because its category is novel. Yet even a diverse set is not necessarily sufficient: the correct explanation might require two complementary freshness documents, and a single “lineage” label says nothing about edge quality.</p><p>For a proposed offline pilot, freeze a permission-filtered corpus snapshot and an expert-written task set. Compare plain top-k retrieval, a simple diversified baseline like this one, and the learned method at equal result counts. Evaluate factual support, needed-facet coverage, unnecessary duplication, latency, and update cost. Hold out new incident types rather than only paraphrasing training queries.</p><p>Moving reasoning offline trades repeated serving work for training, refresh, and monitoring responsibilities. A changing catalog or tenant permission can invalidate yesterday's targets. Authorization still needs enforcement at serving time. My inference is that this technique merits a bounded retrieval experiment, not an immediate replacement for a live, permission-aware evidence pipeline.</p>

</details>

## Explore (remaining exploration time)

Predict the selected facets with novelty bonus 0, then 0.2. Explain why an unrelated but novel item should remain excluded. Write a case where two documents from the same facet are both necessary, and identify the evaluation signal that would catch over-diversification.

Open technology-breakthroughs.html for the executable model.

Model limits: Six hand-labeled synthetic documents, fixed relevance scores, greedy selection and a relevance floor. No embeddings, diffusion model, reinforcement learning, vector database, permissions or real search are executed. The example teaches set-level tradeoffs; its scores and speed are not R4T results.

## Quiz (4 minutes)

1. With no novelty bonus, which three documents does the model select?
   - freshness-A, volume, lineage
   - freshness-A, freshness-B, volume
   - Three random facets

2. What does R4T move away from the serving path?
   - All database lookups and authorization
   - All model computation
   - Repeated language-model fan-out reasoning, via offline supervision and a trained retriever

3. A permission changes after offline training. What should serve-time retrieval do?
   - Enforce current access rules on returned evidence
   - Trust every training target
   - Disable all corpus updates

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. freshness-A, freshness-B, volume. Independent relevance ranking takes .95, .92 and .84, using two slots on freshness.

2. Repeated language-model fan-out reasoning, via offline supervision and a trained retriever. Serving still needs the trained model and retrieval infrastructure; moving work offline does not remove all computation.

3. Enforce current access rules on returned evidence. Training-time validity is not current authorization. Permission-aware serving remains necessary.

</details>

## Sources

- [Google Research: Retrieve-for-Train](https://research.google/blog/bypassing-inference-bottlenecks-accelerating-complex-ai-search-with-retrieve-for-train/) — 2026-09-15 research write-up; checked 2026-09-22.
- [Efficient, Property-Aligned Fan-Out Retrieval via RL-Compiled Diffusion](https://arxiv.org/abs/2603.06397) — Submitted 2026-03-06; checked 2026-09-22.
