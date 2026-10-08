# Synthetic teaching example. No production services are contacted.
grants = {"container": False, "orders_select": True}
result = None
allowed = all(grants.values())
grants["container"] = True
allowed = all(grants.values())
result = 20 + 30 if allowed else None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['grants', 'result', 'allowed']}, indent=2))
