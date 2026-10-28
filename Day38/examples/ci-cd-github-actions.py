# Synthetic teaching example. No production services are contacted.
created_minute = 0; started_minute = 7; completed_minute = 12
queue_time = started_minute - created_minute
run_time = completed_minute - started_minute
bottleneck = 'runner capacity or scheduling' if queue_time > run_time else 'job execution'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['created_minute', 'started_minute', 'completed_minute', 'queue_time', 'run_time', 'bottleneck']}, indent=2))
