# Synthetic teaching example. No production services are contacted.
schema=54; traffic='v54'; run='deploy-54'
schema=55
cancel_in_progress=True; cancelled=cancel_in_progress
result={'cancelled':cancelled,'schema':schema,'traffic':traffic,'rolled_back_by_github':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['schema', 'traffic', 'run', 'cancel_in_progress', 'cancelled', 'result']}, indent=2))
