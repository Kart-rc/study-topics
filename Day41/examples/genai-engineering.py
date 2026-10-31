# Synthetic teaching example. No production services are contacted.
events=[('triage','start'),('triage','tool'),('run','handoff'),('refund','start'),('refund','tool'),('refund','end')]
run_hook=[event for event in events]
refund_hook=[event for event in events if event[0]=='refund']
counts={'run':len(run_hook),'refund':len(refund_hook)}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['events', 'run_hook', 'refund_hook', 'counts']}, indent=2))
