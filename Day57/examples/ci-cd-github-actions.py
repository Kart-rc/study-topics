# Synthetic teaching example. No production services are contacted.
run_created=0; job_started=8; job_completed=10
queue_minutes=job_started-run_created
execution_minutes=job_completed-job_started
result={'queue_minutes':queue_minutes,'execution_minutes':execution_minutes,'total_minutes':job_completed-run_created,'dominant':'queue'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['run_created', 'job_started', 'job_completed', 'queue_minutes', 'execution_minutes', 'result']}, indent=2))
