# Synthetic teaching example. No production services are contacted.
candidate_score=72
released_alarm=True
decision='REJECT' if candidate_score<75 else 'REVIEW'
critical=decision=='REJECT' and released_alarm
action='ESCALATE' if critical else 'FOLLOW_PATH'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['candidate_score', 'released_alarm', 'decision', 'critical', 'action']}, indent=2))
