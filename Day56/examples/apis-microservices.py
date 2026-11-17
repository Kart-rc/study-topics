# Synthetic teaching example. No production services are contacted.
health={'':'SERVING','catalog.v1.Catalog':'SERVING','orders.v1.Orders':'NOT_SERVING'}
watched=''
send_orders=health[watched]=='SERVING'
result={'broad_watch_sends':send_orders,'orders_watch_sends':health['orders.v1.Orders']=='SERVING'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['health', 'watched', 'send_orders', 'result']}, indent=2))
