# Synthetic teaching example. No production services are contacted.
status = {"test": "pending", "package": "pending", "deploy": "pending"}
status["test"] = "failure"
status["package"] = "success" if status["test"] == "success" else "skipped"
status["deploy"] = "success" if status["package"] == "success" else "skipped"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['status']}, indent=2))
