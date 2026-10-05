# Synthetic teaching example. No production services are contacted.
session_log = ["checkpoint 1 complete", "checkpoint 2 complete"]
sandbox = {"temporary_files": 4}
sandbox = None
sandbox = {"temporary_files": 0}
last_verified = session_log[-1]
next_action = "reconcile, then checkpoint 3"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['session_log', 'sandbox', 'last_verified', 'next_action']}, indent=2))
