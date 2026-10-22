# Synthetic teaching example. No production services are contacted.
weekly_capacity = 240
toil_hours = 108
budget_hours = int(weekly_capacity * 0.30)
overflow = max(0, toil_hours - budget_hours)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['weekly_capacity', 'toil_hours', 'budget_hours', 'overflow']}, indent=2))
