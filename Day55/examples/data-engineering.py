# Synthetic teaching example. No production services are contacted.
source={'artifact':'sha-a55','tasks':['ingest','publish']} ; dev={'dest':'dev.orders','size':'small'}
prod={'dest':'prod.orders','size':'policy-prod'}
deployed={'artifact':source['artifact'],'tasks':source['tasks'],'target':prod.copy()}
result={'artifact_unchanged':deployed['artifact']=='sha-a55','graph_unchanged':deployed['tasks']==source['tasks'],'declared_destination':deployed['target']['dest']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['source', 'dev', 'prod', 'deployed', 'result']}, indent=2))
