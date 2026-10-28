# Synthetic teaching example. No production services are contacted.
heat_load = 1200
comparison_limit = 1000; reported_prototype_limit = 1570
comparison_margin = comparison_limit - heat_load
prototype_margin = reported_prototype_limit - heat_load; within_reported_limit = prototype_margin >= 0

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['heat_load', 'comparison_limit', 'reported_prototype_limit', 'comparison_margin', 'prototype_margin', 'within_reported_limit']}, indent=2))
