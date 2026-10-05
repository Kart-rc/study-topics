# Synthetic teaching example. No production services are contacted.
exposure = 0.01; canary_rate = 0.04; control_rate = 0.001
overall = exposure * canary_rate + (1 - exposure) * control_rate
overall_percent = round(100 * overall, 3)
global_alarm = overall > 0.002
canary_worse = canary_rate > control_rate

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['exposure', 'canary_rate', 'control_rate', 'overall', 'overall_percent', 'global_alarm', 'canary_worse']}, indent=2))
