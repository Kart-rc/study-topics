# Synthetic teaching example. No production services are contacted.
primary_healthy = False
control_plane_available = False
routing_control_prepared = True
traffic_target = 'standby' if routing_control_prepared else 'primary'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['primary_healthy', 'control_plane_available', 'routing_control_prepared', 'traffic_target']}, indent=2))
