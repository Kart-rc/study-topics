# Synthetic teaching example. No production services are contacted.
target = {"A": 0.6, "B": 0.4}
draft = {"A": 0.8, "B": 0.2}
accepted = {k: min(target[k], draft[k]) for k in target}
rejected = round(1 - sum(accepted.values()), 10)
residual = {k: max(0, target[k] - draft[k]) for k in target}
normalizer = sum(residual.values())
output = {k: round(accepted[k] + rejected * residual[k] / normalizer, 10) for k in target}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['target', 'draft', 'accepted', 'rejected', 'residual', 'normalizer', 'output']}, indent=2))
