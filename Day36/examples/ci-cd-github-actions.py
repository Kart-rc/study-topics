# Synthetic teaching example. No production services are contacted.
review = 'pending'
runner_assigned = review == 'approved'
secret_available = runner_assigned
state = 'waiting for approval' if not runner_assigned else 'deploying'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['review', 'runner_assigned', 'secret_available', 'state']}, indent=2))
