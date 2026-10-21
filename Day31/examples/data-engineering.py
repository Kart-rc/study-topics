# Synthetic teaching example. No production services are contacted.
changes = {101: ['A:update', 'C:insert'], 102: ['B:delete'], 103: ['D:insert']}
last_success = 100
pending = [op for version in sorted(changes) if version > last_success for op in changes[version]]
last_success = 103 if pending else last_success

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['changes', 'last_success', 'pending']}, indent=2))
