# Synthetic teaching example. No production services are contacted.
statuses = ['success', 'failure', 'cancelled']
default_runs = {s: s == 'success' for s in statuses}
failure_runs = {s: s == 'failure' for s in statuses}
not_cancelled_runs = {s: s != 'cancelled' for s in statuses}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['statuses', 'default_runs', 'failure_runs', 'not_cancelled_runs']}, indent=2))
