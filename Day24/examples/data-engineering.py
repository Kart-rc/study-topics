# Synthetic teaching example. No production services are contacted.
seen=set()
path='orders/2026-10-14-18.json'
first_action='LOAD' if path not in seen else 'SKIP'
seen.add(path)
retry_action='SKIP' if path in seen else 'LOAD'
corrected='orders/2026-10-14-18-v2.json'
correction_action='LOAD' if corrected not in seen else 'SKIP'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['path', 'first_action', 'retry_action', 'corrected', 'correction_action']}, indent=2))
