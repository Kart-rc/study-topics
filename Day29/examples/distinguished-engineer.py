# Synthetic teaching example. No production services are contacted.
items=6
capacity_per_box=2
wip_limit=2
completed=min(items,capacity_per_box)
evidence_ready=completed
remaining=items-completed

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['items', 'capacity_per_box', 'wip_limit', 'completed', 'evidence_ready', 'remaining']}, indent=2))
