# Synthetic teaching example. No production services are contacted.
component=0.9995
count=3
path_success=component**count
path_failure=1-path_success
meets_999=path_success>=0.999

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['component', 'count', 'path_success', 'path_failure', 'meets_999']}, indent=2))
