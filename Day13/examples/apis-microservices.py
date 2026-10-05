# Synthetic teaching example. No production services are contacted.
server_v1 = {"name": "Mug"}
server_expand = {"name": "Mug", "display_name": "Coffee Mug"}
old_client_value = server_expand["name"]
new_client_value = server_expand.get("display_name", server_expand["name"])
server_break = {"display_name": "Coffee Mug"}
old_client_error = "missing name" if "name" not in server_break else "ok"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['server_v1', 'server_expand', 'old_client_value', 'new_client_value', 'server_break', 'old_client_error']}, indent=2))
