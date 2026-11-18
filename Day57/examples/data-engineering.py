# Synthetic teaching example. No production services are contacted.
window=(0,60); events=[{'id':'c57','tier':'pro','minute':20,'event_id':'e57'}]
selected=[e for e in events if window[0] <= e['minute'] < window[1]]
history=[('basic',-60,20,False),('pro',20,None,True)] if selected else [('basic',-60,None,True)]
current_count=sum(r[3] for r in history); published=(len(selected)==1 and current_count==1); result={'selected':len(selected),'rows':len(history),'current_count':current_count,'published':published}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['window', 'events', 'selected', 'history', 'current_count', 'published', 'result']}, indent=2))
