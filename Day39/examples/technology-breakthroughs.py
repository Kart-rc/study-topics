# Synthetic teaching example. No production services are contacted.
domains = [8, 4, 2, 1]
period_scale = [1, 2, 4, 8]
requested_step = 3; friction_arrest_step = 2
actual_step = min(requested_step, friction_arrest_step); outcome = {'domains': domains[actual_step], 'period_scale': period_scale[actual_step]}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['domains', 'period_scale', 'requested_step', 'friction_arrest_step', 'actual_step', 'outcome']}, indent=2))
