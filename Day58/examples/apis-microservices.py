# Synthetic teaching example. No production services are contacted.
store={}; requests=[('A','If-None-Match: *'),('B','If-None-Match: *')]
store['/orders/o58']='A'; status_a=201
status_b=412 if '/orders/o58' in store else 201
result={'A':status_a,'B':status_b,'stored_owner':store['/orders/o58'],'overwritten':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['store', 'requests', 'status_a', 'status_b', 'result']}, indent=2))
