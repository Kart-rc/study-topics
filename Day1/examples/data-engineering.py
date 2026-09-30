# Synthetic teaching example. No production services are contacted.
files = ["A", "B"]; version = 0
amber_base = version; amber_plan = files + ["D"]
files = files + ["C"]; version += 1
amber_can_commit = amber_base == version
amber_plan = files + ["D"]; amber_base = version
files = amber_plan; version += 1

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['files', 'version', 'amber_base', 'amber_plan', 'amber_can_commit']}, indent=2))
