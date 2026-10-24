# Synthetic teaching example. No production services are contacted.
origin_allowed = True
token_valid = True
order_permission = False
browser_may_share = origin_allowed; api_returns = 200 if token_valid and order_permission else 403

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['origin_allowed', 'token_valid', 'order_permission', 'browser_may_share', 'api_returns']}, indent=2))
