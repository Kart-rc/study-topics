# Synthetic teaching example. No production services are contacted.
gates = {'identity': True, 'schema': True, 'tenant_policy': True, 'cursor_current': True, 'qa_clone': True}
incoming = {'order_id': 'O-42', 'tenant': 'acme', 'coupon_code': 'SAVE10'}
checks = [name for name, passed in gates.items() if passed]
publish = len(checks) == len(gates); result = 'publish O-42' if publish else 'stop'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['gates', 'incoming', 'checks', 'publish', 'result']}, indent=2))
