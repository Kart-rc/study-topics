# Synthetic teaching example. No production services are contacted.
expected = ['lookup_order', 'refund_order', 'assistant_message']
actual = []
actual.append('lookup_order')
order = {'id': 'O42', 'paid': True}
if order['paid']:
    actual.append('refund_order')
    refund = {'order': 'O42', 'status': 'started'}
actual.append('assistant_message')
assert_complete = actual == expected

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['expected', 'actual', 'order', 'refund', 'assert_complete']}, indent=2))
