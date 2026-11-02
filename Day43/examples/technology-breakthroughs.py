# Synthetic teaching example. No production services are contacted.
import math; points=8; stages=int(math.log2(points))
pairs_per_stage=points//2; butterfly_combines=pairs_per_stage*stages
direct_relationships=points*points; reduction=direct_relationships/butterfly_combines
claim_boundary='operation graph only; not analogue accuracy or energy'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['points', 'stages', 'pairs_per_stage', 'butterfly_combines', 'direct_relationships', 'reduction', 'claim_boundary']}, indent=2))
