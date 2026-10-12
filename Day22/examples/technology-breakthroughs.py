# Synthetic teaching example. No production services are contacted.
import math
v,lo,hi,eps=0.01,0.0,0.04,0.01
p_zero_state=(hi-v)/(hi-lo)
h=lambda x:1/(math.sqrt(x)+eps)
p_zero_update=(h(v)-h(hi))/(h(lo)-h(hi))

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['v', 'lo', 'hi', 'eps', 'p_zero_state', 'p_zero_update']}, indent=2))
