# Synthetic teaching example. No production services are contacted.
flows=[1,3,6]; state=0.0
rates=[round(f/10,1) for f in flows]
for rate in rates: state=round(min(1.0,state+0.2*rate),2)
result={'flows':flows,'rates':rates,'state':state}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['flows', 'state', 'rates', 'rate', 'result']}, indent=2))
