# Synthetic teaching example. No production services are contacted.
slo = 0.999
allowed_error_percent = (1 - slo) * 100
short_error_percent = 2.0
long_error_percent = 1.2
short_burn = short_error_percent / allowed_error_percent
long_burn = long_error_percent / allowed_error_percent
threshold = 10
page = short_burn >= threshold and long_burn >= threshold

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['slo', 'allowed_error_percent', 'short_error_percent', 'long_error_percent', 'short_burn', 'long_burn', 'threshold', 'page']}, indent=2))
