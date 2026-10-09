# Synthetic teaching example. No production services are contacted.
decision = {"blast": "small", "destructive": False, "rollback_tested": True}
risk = 0
decision["rollback_tested"] = False
risk += 2
decision["destructive"] = True
risk += 3
classification = "deep_review" if risk > 1 else "experiment"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['decision', 'risk', 'classification']}, indent=2))
