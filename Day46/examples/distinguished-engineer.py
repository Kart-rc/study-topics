# Synthetic teaching example. No production services are contacted.
capacity_rps=1000; current_rps=750; growth_rps_per_min=70; ready_minutes=4
growth_during_lead=growth_rps_per_min*ready_minutes
demand_at_ready=current_rps+growth_during_lead; latest_trigger=capacity_rps-growth_during_lead
survives=demand_at_ready<=capacity_rps; required_headroom_fraction=growth_during_lead/capacity_rps

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['capacity_rps', 'current_rps', 'growth_rps_per_min', 'ready_minutes', 'growth_during_lead', 'demand_at_ready', 'latest_trigger', 'survives', 'required_headroom_fraction']}, indent=2))
