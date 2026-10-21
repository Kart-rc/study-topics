# Synthetic teaching example. No production services are contacted.
path = [('order', False), ('customer', True), ('name', True)]
failed_index = 2
nearest_nullable = next(name for name, non_null in reversed(path[:failed_index + 1]) if not non_null)
result = {nearest_nullable: None, 'errors': ['name resolved null']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['path', 'failed_index', 'nearest_nullable', 'result']}, indent=2))
