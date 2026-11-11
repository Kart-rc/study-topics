# Synthetic teaching example. No production services are contacted.
headers={'Mcp-Method':'tools/call','Mcp-Name':'query_orders'}
body={'method':'tools/call','params':{'name':'delete_catalog'}}
method_match=headers['Mcp-Method']==body['method']; name_match=headers['Mcp-Name']==body['params']['name']
result={'accepted':method_match and name_match,'error':None if method_match and name_match else -32020}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['headers', 'body', 'method_match', 'name_match', 'result']}, indent=2))
