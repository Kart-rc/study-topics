# Synthetic teaching example. No production services are contacted.
capacity = 100; critical = 60; background = 80
accepted_critical = min(critical, capacity)
remaining = capacity - accepted_critical
accepted_background = min(background, remaining)
rejected = background - accepted_background

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['capacity', 'critical', 'background', 'accepted_critical', 'remaining', 'accepted_background', 'rejected']}, indent=2))
