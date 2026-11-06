# Synthetic teaching example. No production services are contacted.
orders=[{'order_id':'O-10','items':['A','B']},{'order_id':'O-11','items':None}]
normal=[{'order_id':o['order_id'],'item':item} for o in orders for item in (o['items'] or [])]
outer=[{'order_id':o['order_id'],'item':item} for o in orders for item in (o['items'] if o['items'] is not None else [None])]
normal_parents=len({r['order_id'] for r in normal}); outer_parents=len({r['order_id'] for r in outer}); outer_rows=len(outer)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['orders', 'normal', 'outer', 'normal_parents', 'outer_parents', 'outer_rows']}, indent=2))
