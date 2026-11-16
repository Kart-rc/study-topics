# Synthetic teaching example. No production services are contacted.
requested=[10,17,24]; spacing=10
fixed=[round(x/spacing)*spacing for x in requested]
shifted=requested.copy()
result={'fixed':fixed,'shifted':shifted,'fixed_error':sum(abs(a-b) for a,b in zip(requested,fixed)),'reported_measurement':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requested', 'spacing', 'fixed', 'shifted', 'result']}, indent=2))
