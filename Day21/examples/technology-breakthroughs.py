# Synthetic teaching example. No production services are contacted.
probabilities=[0.90,0.80,0.20]
mean_road=sum(probabilities)/len(probabilities)
threshold=0.50
label="road" if mean_road>=threshold else "not-road"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['probabilities', 'mean_road', 'threshold', 'label']}, indent=2))
