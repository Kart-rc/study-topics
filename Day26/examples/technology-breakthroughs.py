# Synthetic teaching example. No production services are contacted.
hosts_used=[64,80,120,40]
local_capacity=128
stranded=sum(local_capacity-x for x in hosts_used)
burst=64
pool=128
local_free=local_capacity-hosts_used[2]
fits_with_pool=(burst<=local_free+pool)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['hosts_used', 'local_capacity', 'stranded', 'burst', 'pool', 'local_free', 'fits_with_pool']}, indent=2))
