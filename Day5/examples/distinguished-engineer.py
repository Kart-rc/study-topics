# Synthetic teaching example. No production services are contacted.
policy_demand = 4 * 0.2
enrichment_demand = 6 * 2
shared_slots = 10
policy_slots = 4; enrichment_slots = 6
policy_headroom = policy_slots - policy_demand
excess_bulk_demand = enrichment_demand - enrichment_slots

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['policy_demand', 'enrichment_demand', 'shared_slots', 'policy_slots', 'enrichment_slots', 'policy_headroom', 'excess_bulk_demand']}, indent=2))
