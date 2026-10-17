# Synthetic teaching example. No production services are contacted.
orders={42:'Alice',43:'Bob'}
user='Alice'
requested_id=43
owner=orders[requested_id]
authenticated=True
authorized=authenticated and owner==user

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['orders', 'user', 'requested_id', 'owner', 'authenticated', 'authorized']}, indent=2))
