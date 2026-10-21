# Synthetic teaching example. No production services are contacted.
trace = {'run_ms': 820, 'tool_ms': 120, 'model_ms': 650, 'prompt': 'customer email'}
sensitive_fields = {'prompt'}
exported = {k: v for k, v in trace.items() if k not in sensitive_fields}
topology_kept = all(k in exported for k in ['run_ms', 'tool_ms', 'model_ms'])

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['trace', 'exported', 'topology_kept']}, indent=2))
