# Synthetic teaching example. No production services are contacted.
datasets = ["demo-orders", "demo-payments"]
selected = datasets[0]
freshness = {"demo-orders": {"delay_minutes": 18}}
measurement = freshness[selected]
answer = selected + " is " + str(measurement["delay_minutes"]) + " minutes late"
supported_request = "Explain the late dataset"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['datasets', 'selected', 'freshness', 'measurement', 'answer', 'supported_request']}, indent=2))
