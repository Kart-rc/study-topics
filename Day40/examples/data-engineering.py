# Synthetic teaching example. No production services are contacted.
old_rows = ['o1', 'o2', 'o3']; new_rows = ['o1', 'o2-fixed', 'o3', 'o4']
drop_create_views = {'before': len(old_rows), 'during': 0, 'after': len(new_rows)}
atomic_views = {'before': len(old_rows), 'during': len(old_rows), 'after': len(new_rows)}
gap_seen = drop_create_views['during'] == 0; gap_avoided = atomic_views['during'] > 0

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['old_rows', 'new_rows', 'drop_create_views', 'atomic_views', 'gap_seen', 'gap_avoided']}, indent=2))
