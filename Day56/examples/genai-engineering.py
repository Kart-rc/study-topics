# Synthetic teaching example. No production services are contacted.
task={'id':'t56','owner':'red','status':'working'}
caller='blue'; exists=task['id']=='t56'
authorized=exists and caller==task['owner']
result={'exists':exists,'authorized':authorized,'response':'denied' if not authorized else task['status']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['task', 'caller', 'exists', 'authorized', 'result']}, indent=2))
