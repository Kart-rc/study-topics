# Synthetic teaching example. No production services are contacted.
primary_at_failover=1000; recovery_writes=27
unsafe_cutback_visible=primary_at_failover
reconciled_primary=primary_at_failover+recovery_writes
unsafe_gap=reconciled_primary-unsafe_cutback_visible; safe_gap=reconciled_primary-reconciled_primary

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['primary_at_failover', 'recovery_writes', 'unsafe_cutback_visible', 'reconciled_primary', 'unsafe_gap', 'safe_gap']}, indent=2))
