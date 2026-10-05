# Synthetic teaching example. No production services are contacted.
rpo_target = 5
rto_target = 30
data_gap = 5
phases = {"detect": 3, "restore": 18, "validate": 7, "route": 2}
downtime = sum(phases.values())
timing_ok = data_gap <= rpo_target and downtime <= rto_target
integrity_ok = True
ready = timing_ok and integrity_ok
integrity_ok = False
ready = timing_ok and integrity_ok

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rpo_target', 'rto_target', 'data_gap', 'phases', 'downtime', 'timing_ok', 'integrity_ok', 'ready']}, indent=2))
