# Synthetic teaching example. No production services are contacted.
rows=[{'id':'c56','tier':'basic','from':0,'to':None,'current':True}]
event={'id':'c56','tier':'pro','ts':20}
rows[0].update({'to':event['ts'],'current':False})
rows.append({'id':'c56','tier':'pro','from':20,'to':None,'current':True}); result={'ranges':[(r['tier'],r['from'],r['to']) for r in rows],'current_count':sum(r['current'] for r in rows)}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rows', 'event', 'result']}, indent=2))
