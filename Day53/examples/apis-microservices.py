# Synthetic teaching example. No production services are contacted.
server={'id':'o52','version':8}; request={'version':7,'quantity':2}
status=409 if request['version']!=server['version'] else 200
if status==200 and request['quantity']<0: status=422
action='refresh-and-reconcile' if status==409 else ('repair-content' if status==422 else 'accept'); result={'status':status,'action':action}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['server', 'request', 'status', 'action', 'result']}, indent=2))
