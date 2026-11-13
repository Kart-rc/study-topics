# Synthetic teaching example. No production services are contacted.
scheduled_end=60; scheduled_start=0; actual_start=67
events=[55,60,62,67]
selected=[t for t in events if scheduled_start <= t < scheduled_end]
result={'window':[scheduled_start,scheduled_end],'actual_start':actual_start,'selected':selected,'retry_reuses_window':True}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['scheduled_end', 'scheduled_start', 'actual_start', 'events', 'selected', 'result']}, indent=2))
