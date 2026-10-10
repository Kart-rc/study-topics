# Synthetic teaching example. No production services are contacted.
schema={"required":["dataset","rule_type","threshold"],"allow_extra":False}
proposal={"dataset":"orders","rule_type":"freshness","threshold":0.95,"approve":True}
missing=[k for k in schema["required"] if k not in proposal]
extra=[k for k in proposal if k not in schema["required"]]
handler_called=not missing and (schema["allow_extra"] or not extra)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['schema', 'proposal', 'missing', 'extra', 'handler_called']}, indent=2))
