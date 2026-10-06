# Synthetic teaching example. No production services are contacted.
zones = 3
total_rps = 120
capacity_per_zone = 60
operating_target = 0.80
normal_rps_per_zone = total_rps / zones
normal_utilization = normal_rps_per_zone / capacity_per_zone
survivors = zones - 1
evacuated_rps_per_zone = total_rps / survivors
evacuated_utilization = evacuated_rps_per_zone / capacity_per_zone
minimum_capacity = evacuated_rps_per_zone / operating_target
passes_target = capacity_per_zone >= minimum_capacity

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['zones', 'total_rps', 'capacity_per_zone', 'operating_target', 'normal_rps_per_zone', 'normal_utilization', 'survivors', 'evacuated_rps_per_zone', 'evacuated_utilization', 'minimum_capacity', 'passes_target']}, indent=2))
