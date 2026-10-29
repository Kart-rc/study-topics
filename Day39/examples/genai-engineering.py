# Synthetic teaching example. No production services are contacted.
history_version = 8; a_read = history_version; b_read = history_version
history_version += 1; a_written = history_version
history_version += 1; b_written = history_version
mismatch = b_read != a_written; fix = 'queue whole turns by session_id'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['history_version', 'a_read', 'b_read', 'a_written', 'b_written', 'mismatch', 'fix']}, indent=2))
