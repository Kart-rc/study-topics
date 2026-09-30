# Synthetic teaching example. No production services are contacted.
intent = {"order_id": "A100", "amount_cents": 2500}
proposal = {"order_id": "A100", "amount_cents": 25}
shape_ok = isinstance(proposal["amount_cents"], int) and proposal["amount_cents"] > 0
intent_ok = proposal == intent
proposal = {"order_id": "A100", "amount_cents": 2500}
shape_ok = type(proposal["amount_cents"]) is int and proposal["amount_cents"] > 0; intent_ok = proposal == intent
permission_ok = proposal["order_id"] == "A100" and proposal["amount_cents"] <= 5000
execute_allowed = shape_ok and intent_ok and permission_ok

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['intent', 'proposal', 'shape_ok', 'intent_ok', 'permission_ok', 'execute_allowed']}, indent=2))
