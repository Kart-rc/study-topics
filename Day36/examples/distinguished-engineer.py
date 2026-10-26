# Synthetic teaching example. No production services are contacted.
bad_row_rate = 0.03
pause_threshold = 0.02
owner_can_pause = True
action = 'pause ingestion' if owner_can_pause and bad_row_rate > pause_threshold else 'escalate'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['bad_row_rate', 'pause_threshold', 'owner_can_pause', 'action']}, indent=2))
