# Synthetic teaching example. No production services are contacted.
cache={'scope':'private','tenant':'A','value':['search'],'expires_at':60}
request={'tenant':'B','now':10}
fresh=request['now'] < cache['expires_at']
shareable=cache['scope']=='public' or cache['tenant']==request['tenant']; result={'fresh':fresh,'serve':fresh and shareable}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['cache', 'request', 'fresh', 'shareable', 'result']}, indent=2))
