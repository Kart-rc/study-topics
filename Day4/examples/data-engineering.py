# Synthetic teaching example. No production services are contacted.
visible = []; next_offset = 10
pending = ["edge from record 10"]
pending = []
pending = ["edge from record 10"]; staged_offset = 11
visible, next_offset = pending.copy(), staged_offset

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['visible', 'next_offset', 'pending', 'staged_offset']}, indent=2))
