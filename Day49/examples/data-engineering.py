# Synthetic teaching example. No production services are contacted.
token={'iss':'aws-issuer-7','aud':'databricks','sub':'role/orders-etl','ttl_seconds':300}
policy={'iss':'aws-issuer-7','aud':'databricks','sub':'role/orders-etl'}; identity_match=all(token[k]==v for k,v in policy.items())
grants={'select_orders':True,'drop_catalog':False}; requested='select_orders'
authorized=identity_match and grants.get(requested,False); result={'identity_match':identity_match,'requested':requested,'authorized':authorized}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['token', 'policy', 'identity_match', 'grants', 'requested', 'authorized', 'result']}, indent=2))
