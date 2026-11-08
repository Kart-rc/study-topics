# Synthetic teaching example. No production services are contacted.
analysis=.5; decision_wait=72; implementation=2
lead_time=analysis+decision_wait+implementation
wait_share=round(decision_wait/lead_time,3)
result={'lead_time_hours':lead_time,'decision_wait_share':wait_share}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['analysis', 'decision_wait', 'implementation', 'lead_time', 'wait_share', 'result']}, indent=2))
