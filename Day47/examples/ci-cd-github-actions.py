# Synthetic teaching example. No production services are contacted.
workflow={'run':812,'sha':'a1b2','state':'success','meaning':'dispatch accepted'}
deployment={'sha':'a1b2','statuses':['queued','in_progress']} 
cluster_health='failed'; deployment['statuses'].append('failure')
current=deployment['statuses'][-1]; release_green=current=='success'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['workflow', 'deployment', 'cluster_health', 'current', 'release_green']}, indent=2))
