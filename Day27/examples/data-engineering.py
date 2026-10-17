# Synthetic teaching example. No production services are contacted.
events=[{'status':'PACKED','minute':2,'seq':7},{'status':'SHIPPED','minute':5,'seq':9}]
ranked=sorted(events,key=lambda e:(e['minute'],e['seq']),reverse=True)
winner=ranked[0]
target={'order_id':42,'status':winner['status']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['events', 'ranked', 'winner', 'target']}, indent=2))
