# Synthetic teaching example. No production services are contacted.
branch = 'main'
approval = 'pending'
allowed_branches = {'main'}
prevent_self_review = True
branch_ok = branch in allowed_branches
approved = approval == 'approved_by_other'
job_state = 'DENIED' if not branch_ok else ('WAITING' if not approved else 'RUNNING')
environment_secret_available = job_state == 'RUNNING'
deployment_executed = environment_secret_available

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['branch', 'approval', 'prevent_self_review', 'branch_ok', 'approved', 'job_state', 'environment_secret_available', 'deployment_executed']}, indent=2))
