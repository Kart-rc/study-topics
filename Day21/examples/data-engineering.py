# Synthetic teaching example. No production services are contacted.
tasks={"ingest":"success","validate":"failed"}
can_publish=tasks["ingest"]=="success" and tasks["validate"]=="success"
result={"publish":"success" if can_publish else "blocked","finalize":"failure" if "failed" in tasks.values() else "success"}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['tasks', 'can_publish', 'result']}, indent=2))
