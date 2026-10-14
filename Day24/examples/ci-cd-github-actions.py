# Synthetic teaching example. No production services are contacted.
events={'pull_request'}
merge_group_sha='mg-A-B'
required_reported='merge_group' in events
events.add('merge_group')
required_reported='merge_group' in events
tested_sha=merge_group_sha if required_reported else None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['merge_group_sha', 'required_reported', 'tested_sha']}, indent=2))
