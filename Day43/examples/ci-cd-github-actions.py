# Synthetic teaching example. No production services are contacted.
timeout_minute=10; traffic_switch_minute=4; smoke_hangs=True
traffic_switched=traffic_switch_minute < timeout_minute; production='v42' if traffic_switched else 'v41'
job='cancelled' if smoke_hangs else 'success'; rollback_ran=False
reconciler_detects=(job=='cancelled' and production=='v42'); desired='v41' if reconciler_detects else production

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['timeout_minute', 'traffic_switch_minute', 'smoke_hangs', 'traffic_switched', 'production', 'job', 'rollback_ran', 'reconciler_detects', 'desired']}, indent=2))
