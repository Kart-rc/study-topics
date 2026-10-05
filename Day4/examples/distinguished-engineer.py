# Synthetic teaching example. No production services are contacted.
zones = 3; demand = 100
capacity_per_zone = 50
surviving = (zones - 1) * capacity_per_zone
stable = surviving >= demand
underprovisioned = (zones - 1) * 35
shortfall = demand - underprovisioned

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['zones', 'demand', 'capacity_per_zone', 'surviving', 'stable', 'underprovisioned', 'shortfall']}, indent=2))
