# Synthetic teaching example. No production services are contacted.
yaml_ref='vendor/scan@v3'; tag_now='bad99'
lock={'vendor/scan@v3':'abc56'}
enforced=True; executed=lock[yaml_ref] if enforced else tag_now
result={'yaml_ref':yaml_ref,'tag_now':tag_now,'executed':executed,'safety_proven':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['yaml_ref', 'tag_now', 'lock', 'enforced', 'executed', 'result']}, indent=2))
