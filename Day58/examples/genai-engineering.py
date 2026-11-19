# Synthetic teaching example. No production services are contacted.
status='working'; cancel_requested=True
cancel_acknowledged=True
observations=['working','completed']
result={'cancel_requested':cancel_requested,'acknowledged':cancel_acknowledged,'observations':observations,'terminal':observations[-1],'claim':'request acknowledged; completed observed'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['status', 'cancel_requested', 'cancel_acknowledged', 'observations', 'result']}, indent=2))
