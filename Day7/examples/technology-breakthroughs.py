# Synthetic teaching example. No production services are contacted.
failure_per_gate = 0.000087; gate_count = 1000
success_per_gate = 1 - failure_per_gate
all_success = success_per_gate ** gate_count
time_ns = gate_count * 17
time_us = time_ns / 1000

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['failure_per_gate', 'gate_count', 'success_per_gate', 'all_success', 'time_ns', 'time_us']}, indent=2))
