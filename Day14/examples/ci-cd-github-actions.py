# Synthetic teaching example. No production services are contacted.
contract = {'environment_type': 'string', 'secret_required': True}
caller = {'environment': 'staging', 'deploy_token': 'present'}
input_ok = isinstance(caller['environment'], str)
secret_ok = caller.get('deploy_token') == 'present'
call_status = 'accepted' if input_ok and secret_ok else 'rejected'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['contract', 'caller', 'input_ok', 'secret_ok', 'call_status']}, indent=2))
