# Synthetic teaching example. No production services are contacted.
zones=4; matched_delivery=True
uniform_zones=zones if matched_delivery else zones//2
reported_devices=224; growth_batches=3
result={'uniform_zones_toy':uniform_zones,'reported_devices':reported_devices,'growth_batches':growth_batches,'paper_reproduced':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['zones', 'matched_delivery', 'uniform_zones', 'reported_devices', 'growth_batches', 'result']}, indent=2))
