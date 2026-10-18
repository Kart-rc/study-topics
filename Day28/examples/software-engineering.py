# Synthetic teaching example. No production services are contacted.
pool_size=2
parents_running=2
children_queued=parents_running
free_workers=pool_size-parents_running
progress=children_queued>0 and free_workers>0

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['pool_size', 'parents_running', 'children_queued', 'free_workers', 'progress']}, indent=2))
