# Synthetic teaching example. No production services are contacted.
hint_read_only = True; trusted_server = False
capabilities = {"read"}
proposed_action = "write"
allowed = proposed_action in capabilities
hint_is_authority = False

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['hint_read_only', 'trusted_server', 'proposed_action', 'allowed', 'hint_is_authority']}, indent=2))
