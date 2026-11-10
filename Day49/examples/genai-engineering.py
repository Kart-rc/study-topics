# Synthetic teaching example. No production services are contacted.
request={'id':9,'progress_token':'p-9'}; stream=[]
stream.append({'method':'notifications/progress','token':'p-9','progress':20,'total':100})
stream.append({'method':'notifications/progress','token':'p-9','progress':70,'total':100}); connected=False
durable_task_handle=None; result={'seen':[e['progress'] for e in stream],'connected':connected,'resumable':durable_task_handle is not None}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['request', 'stream', 'connected', 'durable_task_handle', 'result']}, indent=2))
