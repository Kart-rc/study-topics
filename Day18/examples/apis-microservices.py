# Synthetic teaching example. No production services are contacted.
job = {"id": "J42", "state": "queued"}
post_status = 202
job["state"] = "running"
get_status = 200
job["state"] = "failed"
job["error"] = "source_unavailable"
get_status = 200

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['job', 'post_status', 'get_status']}, indent=2))
