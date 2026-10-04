# Synthetic teaching example. No production services are contacted.
result = {'done': True, 'isError': False, 'structuredContent': {'shipment_id': 'S7', 'eta_days': 2}}
deadline_ok = result['done']
execution_ok = not result['isError']
data = result['structuredContent']
schema_ok = isinstance(data.get('shipment_id'), str) and isinstance(data.get('eta_days'), int)
decision = 'use result' if deadline_ok and execution_ok and schema_ok else 'safe failure'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['result', 'deadline_ok', 'execution_ok', 'data', 'schema_ok', 'decision']}, indent=2))
