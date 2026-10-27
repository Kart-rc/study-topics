# Synthetic teaching example. No production services are contacted.
rollback_hours = 2
teams_affected = 2; old_path_kept = True
hard_to_reverse = rollback_hours > 24 or teams_affected > 5 or not old_path_kept
process = 'methodical review' if hard_to_reverse else 'local guarded experiment'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rollback_hours', 'teams_affected', 'old_path_kept', 'hard_to_reverse', 'process']}, indent=2))
