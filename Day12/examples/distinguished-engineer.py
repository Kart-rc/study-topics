# Synthetic teaching example. No production services are contacted.
last_good = {"orders": "cell-a"}
control_plane_up = True
first_route = last_good["orders"]
control_plane_up = False
proposed = "cell-c"
publish_accepted = control_plane_up
route_during_outage = last_good["orders"]
request_succeeds = route_during_outage == "cell-a"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['last_good', 'control_plane_up', 'first_route', 'proposed', 'publish_accepted', 'route_during_outage', 'request_succeeds']}, indent=2))
