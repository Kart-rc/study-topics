# Synthetic teaching example. No production services are contacted.
seen = []; effects = []
key = 'refund:O-42:v1'; amount = 25
seen.append(key); effects.append({'order': 'O-42', 'amount': amount})
retry_applied = False if key in seen else True; outcome = 'stored result, no second refund'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['seen', 'effects', 'key', 'amount', 'retry_applied', 'outcome']}, indent=2))
