# Synthetic teaching example. No production services are contacted.
response = {'status': 202, 'job_id': 'exp-42', 'monitor': '/exports/exp-42'}
job_state = 'queued'
job_state = 'running'
job_state = 'succeeded'; client_action = 'download result'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['response', 'job_state', 'client_action']}, indent=2))
