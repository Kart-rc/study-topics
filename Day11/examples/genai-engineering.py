# Synthetic teaching example. No production services are contacted.
cache = {}
prefix = "policy:v1"
suffix = "order:7"
hit = prefix in cache
cache[prefix] = "processed-prefix-placeholder"
suffix = "order:8"
hit = prefix in cache
prefix = "t3|policy:v1"
hit = prefix in cache

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['cache', 'prefix', 'suffix', 'hit']}, indent=2))
