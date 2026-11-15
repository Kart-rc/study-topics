# Synthetic teaching example. No production services are contacted.
schema={'properties':{'amount':{'type':'number'}},'additionalProperties':False}
request={'amount':10,'amuont':1000}
known=set(schema['properties']); extras=set(request)-known
result={'valid':not extras or schema['additionalProperties'] is not False,'extras':sorted(extras),'applied':None if extras else request['amount']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['schema', 'request', 'result']}, indent=2))
