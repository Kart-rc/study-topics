# Synthetic teaching example. No production services are contacted.
raw=[{'id':'o-50','email':'ana@example.com','items':[{'sku':'A','qty':1},{'sku':'B','qty':2}]},{'id':None,'raw':'{bad'}]
good=[r for r in raw if r.get('id')]; errors=[r for r in raw if not r.get('id')]
items=[{'order_id':r['id'],'email':r['email'],'pos':i,'sku':x['sku'],'qty':x['qty']} for r in good for i,x in enumerate(r['items'])]
products={'A':'adapter','B':'battery'}; published=[{**x,'product':products[x['sku']],'email':'***@example.com'} for x in items]; result={'good':len(good),'errors':len(errors),'published':len(published),'positions':[x['pos'] for x in published]}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['raw', 'good', 'errors', 'items', 'products', 'published', 'result']}, indent=2))
