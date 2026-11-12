# Synthetic teaching example. No production services are contacted.
messages=[3,4,5]; received=[]
received.extend(messages[:2]); subtotal=sum(received)
received.append(messages[2]); half_closed=True
result={'received':received,'half_closed':half_closed,'response_total':sum(received),'rpc_cancelled':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['messages', 'received', 'subtotal', 'half_closed', 'result']}, indent=2))
