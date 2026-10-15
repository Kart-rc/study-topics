# Synthetic teaching example. No production services are contacted.
resource={'display_name':'Kai','timezone':'UTC','alerts':True}
payload={'timezone':'America/New_York','alerts':False}
mask=['timezone']
for field in mask: resource[field]=payload[field]
alerts_preserved=(resource['alerts'] is True)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['resource', 'payload', 'mask', 'field', 'alerts_preserved']}, indent=2))
