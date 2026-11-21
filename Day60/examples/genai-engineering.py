# Synthetic teaching example. No production services are contacted.
connections=[('legacy','sampling'),('modern','direct_provider')]
owners={'sampling':'client_host','direct_provider':'server'}
routes={era:{'path':path,'owner':owners[path]} for era,path in connections}
result={'legacy':routes['legacy'],'modern':routes['modern'],'new_default':'direct_provider'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['connections', 'owners', 'routes', 'result']}, indent=2))
