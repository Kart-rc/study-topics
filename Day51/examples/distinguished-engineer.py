# Synthetic teaching example. No production services are contacted.
active=['lineage','contracts','airflow','cost']
wip_control=4; incoming='realtime-quality'
can_pull=len(active)<wip_control
result={'active':len(active),'incoming':incoming,'can_pull':can_pull,'decision':'finish-or-stop-one-first' if not can_pull else 'start'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['active', 'wip_control', 'incoming', 'can_pull', 'result']}, indent=2))
