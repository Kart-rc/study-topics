# Synthetic teaching example. No production services are contacted.
change='docs'
workflow_path_filter=True
workflow_created=not (change=='docs' and workflow_path_filter)
required_check='SUCCESS' if workflow_created else 'PENDING'
fixed_check='SUCCESS'  # always-triggered gate; expensive job may skip

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['change', 'workflow_path_filter', 'workflow_created', 'required_check', 'fixed_check']}, indent=2))
