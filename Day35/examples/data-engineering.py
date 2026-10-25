# Synthetic teaching example. No production services are contacted.
expected = ['order_id', 'amount', 'event_time']
incoming = expected + ['coupon_code']
unexpected = [c for c in incoming if c not in expected]
rescued = {'coupon_code': 'FALL10'} if unexpected else {}; published = list(expected)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['expected', 'incoming', 'unexpected', 'rescued', 'published']}, indent=2))
