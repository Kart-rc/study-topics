# Synthetic teaching example. No production services are contacted.
import math; phases=[0,90,180,270]
centers=[round(50+26*math.sin(math.radians(p)),1) for p in phases]
stretch=[round(18+18*max(0,math.sin(math.radians(p))),1) for p in phases]
frames=list(zip(phases,centers,stretch))

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['phases', 'centers', 'stretch', 'frames']}, indent=2))
