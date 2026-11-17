# Synthetic teaching example. No production services are contacted.
gaps_nm=[1.39,140,140000]; reported_max=152000
import math; lo=math.log10(1.39); hi=math.log10(reported_max)
positions=[round((math.log10(x)-lo)/(hi-lo)*100) for x in gaps_nm]
result={'gaps_nm':gaps_nm,'log_positions_pct':positions,'predicts_performance':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['gaps_nm', 'reported_max', 'lo', 'hi', 'positions', 'result']}, indent=2))
