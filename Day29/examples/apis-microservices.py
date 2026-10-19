# Synthetic teaching example. No production services are contacted.
failure_point='before_headers'
retryable_status='UNAVAILABLE'
headers_received=failure_point=='after_headers'
policy={'UNAVAILABLE':True,'max_attempts':3}
retry=policy.get(retryable_status,False) and not headers_received

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['failure_point', 'retryable_status', 'headers_received', 'policy', 'retry']}, indent=2))
