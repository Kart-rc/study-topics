# Synthetic teaching example. No production services are contacted.
local_context = {'tenant': 'east', 'db_dsn': 'db.internal'}
tool_arguments = {'order_id': 42}
database_row = {'order_id': 42, 'status': 'shipped'}
model_visible_result = {'status': database_row['status']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['local_context', 'tool_arguments', 'database_row', 'model_visible_result']}, indent=2))
