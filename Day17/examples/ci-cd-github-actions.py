# Synthetic teaching example. No production services are contacted.
running = "R1"
single_pending = []
max_pending = []
canceled = []
single_pending.append("R2")
max_pending.append("R2")
canceled.extend(single_pending)
single_pending = ["R3"]
max_pending.append("R3")
next_single = single_pending.pop(0)
next_max = max_pending.pop(0)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['running', 'single_pending', 'max_pending', 'canceled', 'next_single', 'next_max']}, indent=2))
