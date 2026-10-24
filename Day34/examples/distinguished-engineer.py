# Synthetic teaching example. No production services are contacted.
control_plane_healthy = False
cached_config_version = 17
existing_traffic_served = cached_config_version == 17
new_changes_accepted = control_plane_healthy

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['control_plane_healthy', 'cached_config_version', 'existing_traffic_served', 'new_changes_accepted']}, indent=2))
