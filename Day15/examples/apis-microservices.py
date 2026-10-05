# Synthetic teaching example. No production services are contacted.
client_deadline_ms = 500
profile_elapsed_ms = 120
remaining_ms = client_deadline_ms - profile_elapsed_ms
inventory_needed_ms = 450
inventory_ran_ms = min(inventory_needed_ms, remaining_ms)
status = 'OK' if inventory_needed_ms <= remaining_ms else 'DEADLINE_EXCEEDED'
wasted_after_deadline_ms = 0

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['client_deadline_ms', 'profile_elapsed_ms', 'remaining_ms', 'inventory_needed_ms', 'inventory_ran_ms', 'status', 'wasted_after_deadline_ms']}, indent=2))
