# Synthetic teaching example. No production services are contacted.
selected_facets = ["freshness"]; bonus = 0.20
candidates = [("freshness B", "freshness", 0.89), ("lineage", "lineage", 0.75)]
scores = {name: relevance + (bonus if facet not in selected_facets else 0) for name, facet, relevance in candidates}
winner = max(scores, key=scores.get)
without_bonus = max(candidates, key=lambda item: item[2])[0]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['selected_facets', 'bonus', 'candidates', 'scores', 'winner', 'without_bonus']}, indent=2))
