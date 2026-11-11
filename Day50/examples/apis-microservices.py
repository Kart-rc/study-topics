# Synthetic teaching example. No production services are contacted.
events=[{'ms':0,'status':'request'},{'ms':20,'status':103,'link':'/app.css'},{'ms':180,'status':401}]
preload_started=any(e.get('status')==103 for e in events)
final=next(e for e in events if isinstance(e.get('status'),int) and e['status']>=200)
result={'preload_started':preload_started,'application_status':final['status'],'success':200<=final['status']<300}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['events', 'preload_started', 'final', 'result']}, indent=2))
