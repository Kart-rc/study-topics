# Synthetic teaching example. No production services are contacted.
cases=[{'required':True,'nullable':True,'state':'null'},{'required':False,'nullable':False,'state':'missing'},{'required':True,'nullable':False,'state':'null'}]
def valid(c): return (c['state']!='missing' or not c['required']) and (c['state']!='null' or c['nullable'])
results=[valid(c) for c in cases]
oas30={'type':'string','nullable':True}; oas31={'type':['string','null']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['cases', 'results', 'oas30', 'oas31']}, indent=2))
