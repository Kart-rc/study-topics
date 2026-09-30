# Synthetic teaching example. No production services are contacted.
server = "catalog.example"; client_audience = "storage.api"
accepted = client_audience == server
client_audience = "catalog.example"
accepted = client_audience == server
upstream = {"aud": "storage.api", "scope": "read"}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['server', 'client_audience', 'accepted', 'upstream']}, indent=2))
