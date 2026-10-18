# Synthetic teaching example. No production services are contacted.
signals={'tests':'pass','error_budget':8}
threshold=20
decision='DEPLOY' if signals['tests']=='pass' and signals['error_budget']>=threshold else 'BLOCKED'
summary={'decision':decision,'evidence':signals,'next':'review SLO'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['signals', 'threshold', 'decision', 'summary']}, indent=2))
