# Synthetic teaching example. No production services are contacted.
owners = {"/orders": "old", "/tracking": "old", "/returns": "old"}
owners["/tracking"] = "new"
order_owner = owners["/orders"]; tracking_owner = owners["/tracking"]
new_healthy = False; old_data_compatible = True
owners["/tracking"] = "old" if old_data_compatible else "recovery required"
fallback_owner = owners["/tracking"]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['owners', 'order_owner', 'tracking_owner', 'new_healthy', 'old_data_compatible', 'fallback_owner']}, indent=2))
