# Synthetic teaching example. No production services are contacted.
durable = {"files": 5, "status": "written", "checks": []}
session = {"last_thought": "test next"}
session = {}
next_action = "verify" if durable["status"] == "written" else "inspect"
durable["checks"] = ["synthetic check passed"]; durable["status"] = "verified"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['durable', 'session', 'next_action']}, indent=2))
