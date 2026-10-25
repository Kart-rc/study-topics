# Synthetic teaching example. No production services are contacted.
failure = {'kind': 'timeout', 'retryable': True}
policy = 'model_visible' if failure['retryable'] else 'fail_fast'
model_message = {'code': 'TEMPORARY', 'retry_after_s': 5} if policy == 'model_visible' else None
run_continues = model_message is not None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['failure', 'policy', 'model_message', 'run_continues']}, indent=2))
