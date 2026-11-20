# Synthetic teaching example. No production services are contacted.
requests=[('region','non_sensitive'),('api_key','sensitive')]
routes={'non_sensitive':'form','sensitive':'url'}
decisions={name:routes[kind] for name,kind in requests}
result={'region':decisions['region'],'api_key':decisions['api_key'],'secret_in_form':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requests', 'routes', 'decisions', 'result']}, indent=2))
