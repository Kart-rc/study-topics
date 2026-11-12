# Synthetic teaching example. No production services are contacted.
store={}; create_node='A'; basket_id='b-51'; store[basket_id]=[]
add_node='B'; call={'basket_id':basket_id,'item':'schema-rule'}
resolved=store.get(call['basket_id']); resolved.append(call['item']) if resolved is not None else None
result={'created_on':create_node,'continued_on':add_node,'basket_id':basket_id,'items':store[basket_id]}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['store', 'create_node', 'basket_id', 'add_node', 'call', 'resolved', 'result']}, indent=2))
