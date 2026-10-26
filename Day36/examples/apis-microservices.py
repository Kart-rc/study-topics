# Synthetic teaching example. No production services are contacted.
schema = {'id': 'readOnly', 'name': 'both', 'password': 'writeOnly'}
request_fields = [k for k, v in schema.items() if v != 'readOnly']
response_fields = [k for k, v in schema.items() if v != 'writeOnly']
runtime_authorization_required = True

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['schema', 'request_fields', 'response_fields', 'runtime_authorization_required']}, indent=2))
