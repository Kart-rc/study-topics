# Synthetic teaching example. No production services are contacted.
task={'taskId':'T-42','status':'working','pollIntervalMs':5000}; durable_store={'taskId':task['taskId']} 
task['status']='input_required'; task['inputRequests']={'approval':'approve production?'}
approval=True; task.pop('inputRequests'); task['status']='working'
task['status']='completed'; task['result']={'deployment':'green','state':'ready'}; final=task['result']

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['task', 'durable_store', 'approval', 'final']}, indent=2))
