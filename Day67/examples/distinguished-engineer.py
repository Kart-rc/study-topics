# Synthetic teaching example. No production services are contacted.
profile={'execution_cpu_share':92,'candidate_cpu_saving':41,'queries':100,'semantic_matches':96}
seam={'replace':'execution engine','preserve':['SQL','planner','connectors'],'fallback':'legacy engine'}
gate={'semantic_gaps':profile['queries']-profile['semantic_matches'],'canary_percent':0}
decision={'action':'hold canary','scope':'execution engine only','reason':'4 semantic gaps remain'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['profile', 'seam', 'gate', 'decision']}, indent=2))
