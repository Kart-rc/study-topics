# Synthetic teaching example. No production services are contacted.
first={'method':'POST','key':'k-52','status':503,'retry_after_s':30,'effect_committed':True}
waited_s=first['retry_after_s']; retry={'method':'POST','key':first['key']}
store={'k-52':'order-52'}; response=store.get(retry['key'])
result={'waited_s':waited_s,'response':response,'new_order_created':False,'header_proved_safety':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['first', 'waited_s', 'retry', 'store', 'response', 'result']}, indent=2))
