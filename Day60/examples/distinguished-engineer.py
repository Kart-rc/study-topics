# Synthetic teaching example. No production services are contacted.
rollback_deadline=48; now=24; old_path_retained=True
reversible=(now<=rollback_deadline and old_path_retained)
trigger='count_mismatch_over_0.1_percent'; owner='migration_lead'
result={'reversible':reversible,'hours_left':rollback_deadline-now,'trigger':trigger,'owner':owner}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rollback_deadline', 'now', 'old_path_retained', 'reversible', 'trigger', 'owner', 'result']}, indent=2))
