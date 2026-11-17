# Synthetic teaching example. No production services are contacted.
a={'requests':999000,'failures':0}; b={'requests':1000,'failures':500}
global_success=1-(a['failures']+b['failures'])/(a['requests']+b['requests'])
b_success=1-b['failures']/b['requests']
result={'global_pct':round(global_success*100,2),'tenant_b_pct':round(b_success*100,2),'needs_tenant_view':True}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['a', 'b', 'global_success', 'b_success', 'result']}, indent=2))
