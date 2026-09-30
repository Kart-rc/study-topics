# Synthetic teaching example. No production services are contacted.
allowed_files = {"/workspace/service/app.py"}; allowed_branch = "agent-fix"
requested_file = "/private/key"
read_allowed = requested_file in allowed_files
requested_branch = "main"
push_allowed = requested_branch == allowed_branch

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['allowed_branch', 'requested_file', 'read_allowed', 'requested_branch', 'push_allowed']}, indent=2))
