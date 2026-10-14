# Synthetic teaching example. No production services are contacted.
old_traffic_pct=0
unknown_dependencies=0
stable_days=14
data_reconciled=True
owner_approved=True
eligible=(old_traffic_pct==0 and unknown_dependencies==0 and stable_days>=14 and data_reconciled and owner_approved)
decision='RETIRE' if eligible else 'KEEP'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['old_traffic_pct', 'unknown_dependencies', 'stable_days', 'data_reconciled', 'owner_approved', 'eligible', 'decision']}, indent=2))
