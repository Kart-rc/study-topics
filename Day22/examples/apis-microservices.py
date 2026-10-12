# Synthetic teaching example. No production services are contacted.
store={}
effects=[]
key,payload="k-77",{"amount":25}
fingerprint=tuple(sorted(payload.items()))
store[key]={"fingerprint":fingerprint,"response":{"order_id":"o-900"}}
effects.append("create o-900")
retry=store[key]["response"] if store[key]["fingerprint"]==fingerprint else None
mismatch=tuple(sorted({"amount":40}.items()))!=store[key]["fingerprint"]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['store', 'effects', 'key', 'payload', 'fingerprint', 'retry', 'mismatch']}, indent=2))
