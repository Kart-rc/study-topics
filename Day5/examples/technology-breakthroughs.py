# Synthetic teaching example. No production services are contacted.
allowed_directory = "/workspace/reports/"
proposal = {"path": "/config/policy.json", "content": "unapproved change"}
allowed = proposal["path"].startswith(allowed_directory)
files = {}
files.update({proposal["path"]: proposal["content"]}) if allowed else None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['allowed_directory', 'proposal', 'allowed', 'files']}, indent=2))
