# Synthetic teaching example. No production services are contacted.
requests = ["MUG", "MUG", "PLATE"]
leaders = []
for key in requests:
    if key not in leaders:
        leaders.append(key)
loader_calls = len(leaders)
results = [f"price:{key}" for key in requests]
shared = [requests.count(key) > 1 for key in requests]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requests', 'leaders', 'key', 'loader_calls', 'results', 'shared']}, indent=2))
