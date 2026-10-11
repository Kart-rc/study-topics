# Synthetic teaching example. No production services are contacted.
event="pull_request_target"
executes_fork=True
privileged=True
crosses_boundary=executes_fork and privileged
decision="BLOCK" if crosses_boundary else "ALLOW"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['event', 'executes_fork', 'privileged', 'crosses_boundary', 'decision']}, indent=2))
